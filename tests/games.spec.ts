import { test, expect, type Page } from "@playwright/test";
import { words } from "../src/content/vocabulary";

async function academicState(page: Page) {
  return page.evaluate(
    () =>
      new Promise<unknown>((resolve, reject) => {
        const request = indexedDB.open("english-path", 1);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const database = request.result;
          const value = database
            .transaction("state", "readonly")
            .objectStore("state")
            .get("current");
          value.onsuccess = () => {
            resolve(value.result ?? null);
            database.close();
          };
          value.onerror = () => reject(value.error);
        };
      }),
  );
}
async function freezeClock(page: Page) {
  await page.clock.install({ time: new Date("2026-10-19T12:00:00Z") });
  await page.clock.pauseAt(new Date("2026-10-19T12:00:01Z"));
}
async function gameRecords(page: Page) {
  return page.evaluate(
    () =>
      JSON.parse(
        localStorage.getItem("english-path-casual-games-v1") ||
          '{"records":{}}',
      ).records,
  );
}

test("memory can be won, keeps a local record and does not change academic progress", async ({
  page,
}) => {
  await page.goto("/games/memory");
  await expect(
    page.getByRole("heading", { name: "Memória em dois idiomas", level: 1 }),
  ).toBeVisible();
  const before = await academicState(page);
  await page.getByRole("button", { name: "Começar memória" }).click();
  const cards = page.locator(".memory-card");
  await expect(cards).toHaveCount(8);
  const seen = new Map<string, number[]>();
  // Discover the board as a player does: flip cards, read each side, remember its position.
  for (let i = 0; i < 8; i++) {
    const card = cards.nth(i);
    if (await card.isDisabled()) continue;
    await card.click();
    const text = await card.locator("strong").innerText();
    const side = await card.locator("small").innerText();
    const word = words.find((w) =>
      side === "ENGLISH" ? w.en === text : w.pt === text,
    )!;
    seen.set(word.id, [...(seen.get(word.id) || []), i]);
    if (
      (await page.locator(".memory-card.revealed:not(.matched)").count()) === 2
    ) {
      await expect(
        page.locator(".memory-card.revealed:not(.matched)"),
      ).toHaveCount(0);
    }
  }
  for (const pair of seen.values()) {
    if (await cards.nth(pair[0]).isDisabled()) continue;
    expect(pair).toHaveLength(2);
    await cards.nth(pair[0]).click();
    await cards.nth(pair[1]).click();
  }
  await expect(
    page.getByRole("heading", { name: "Todas as conexões encontradas!" }),
  ).toBeVisible();
  await expect
    .poll(async () => (await gameRecords(page))["memory-4"]?.wins)
    .toBe(1);
  expect(await academicState(page)).toEqual(before);
  const best = (await gameRecords(page))["memory-4"].best;
  await page.reload();
  await expect(page.locator(".game-personal-best")).toContainText(
    `${best} jogadas`,
  );
});

test("typing pauses without losing time or lives and wins through the actual input", async ({
  page,
}) => {
  await page.goto("/games/typing");
  await expect(
    page.getByRole("button", { name: "Começar digitação" }),
  ).toBeVisible();
  await freezeClock(page);
  const before = await academicState(page);
  await page.getByRole("button", { name: "Começar digitação" }).click();
  await page.clock.runFor(4000);
  await page.getByRole("button", { name: "Pausar partida" }).click();
  const paused = await page.locator(".game-scoreboard").innerText();
  await page.clock.runFor(30000);
  await expect(
    page.getByRole("heading", { name: "Partida pausada" }),
  ).toBeVisible();
  expect(await page.locator(".game-scoreboard").innerText()).toBe(paused);
  await expect(page.getByLabel("Digite uma palavra da tela")).toBeDisabled();
  await page.getByRole("button", { name: "Continuar partida" }).click();
  for (let i = 0; i < 10; i++) {
    const target = await page
      .locator(".typing-word strong")
      .first()
      .innerText();
    await page.getByLabel("Digite uma palavra da tela").fill(target);
    await page.getByLabel("Digite uma palavra da tela").press("Enter");
  }
  await expect(
    page.getByRole("heading", { name: "Dez palavras. Vitória sua!" }),
  ).toBeVisible();
  await expect
    .poll(async () => (await gameRecords(page))["typing-calm"]?.wins)
    .toBe(1);
  expect(await academicState(page)).toEqual(before);
});

test("typing pauses automatically when the tab hides and losing three hearts ends a round", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/games/typing");
  await expect(
    page.getByRole("button", { name: "Começar digitação" }),
  ).toBeVisible();
  await freezeClock(page);
  await page.getByLabel("Velocidade").selectOption("fast");
  await page.getByRole("button", { name: "Começar digitação" }).click();
  const firstWord = page.locator(".typing-word").first();
  await expect(firstWord).toBeInViewport();
  await expect(page.getByLabel("Digite uma palavra da tela")).toBeInViewport();
  expect(
    await firstWord.evaluate((word) => {
      const box = word.getBoundingClientRect();
      return word.contains(
        document.elementFromPoint(
          box.x + box.width / 2,
          box.y + box.height / 2,
        ),
      );
    }),
  ).toBe(true);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(
    page.getByRole("heading", { name: "Partida pausada" }),
  ).toBeVisible();
  await page.clock.runFor(20000);
  await expect(page.getByLabel("3 corações restantes")).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(
    page.getByRole("heading", { name: "Partida pausada" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continuar partida" }).click();
  await page.clock.runFor(20000);
  await expect(
    page.getByRole("heading", { name: "As palavras escaparam desta vez." }),
  ).toBeVisible();
  await expect
    .poll(async () => (await gameRecords(page))["typing-fast"]?.played)
    .toBe(1);
  await page.getByRole("button", { name: "Jogar de novo" }).click();
  await expect(page.getByLabel("3 corações restantes")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("secret word supports physical and touch keyboards, victories and defeats", async ({
  page,
}) => {
  await page.goto("/games/secret-word");
  await page.getByRole("button", { name: "Começar palavra secreta" }).click();
  const translation = await page.locator(".secret-hint p strong").innerText();
  const word = words.find((w) => w.pt === translation)!;
  for (const letter of new Set(word.en)) await page.keyboard.press(letter);
  await expect(
    page.getByRole("heading", { name: "Mistério resolvido!" }),
  ).toBeVisible();
  await expect.poll(async () => (await gameRecords(page)).secret?.wins).toBe(1);
  await page.getByRole("button", { name: "Jogar de novo" }).click();
  const nextTranslation = await page
    .locator(".secret-hint p strong")
    .innerText();
  const next = words.find((w) => w.pt === nextTranslation)!;
  for (const letter of [..."abcdefghijklmnopqrstuvwxyz"]
    .filter((l) => !next.en.includes(l))
    .slice(0, 6)) {
    await page
      .getByRole("button", {
        name: `Letra ${letter.toUpperCase()}`,
        exact: true,
      })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "Uma nova palavra para conhecer." }),
  ).toBeVisible();
  expect(await academicState(page)).toBeNull();
});

test("games are accessible on mobile and cached for offline use before the first visit", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await expect
    .poll(() => page.evaluate(() => !!navigator.serviceWorker.controller))
    .toBe(true);
  await context.setOffline(true);
  await page.getByRole("button", { name: "Abrir navegação" }).click();
  await page.getByRole("link", { name: "Jogos livres", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Seu inglês também pode brincar." }),
  ).toBeVisible();
  for (const route of [
    "/games/memory",
    "/games/typing",
    "/games/secret-word",
  ]) {
    await page.goto(route);
    await expect(page.locator("main h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route,
    ).toBe(true);
  }
  await page.goto("/games/memory");
  await page.getByRole("button", { name: "Começar memória" }).click();
  await expect(page.locator(".memory-card")).toHaveCount(8);
  await context.setOffline(false);
});

test("the academic clock stays stopped in games and resumes only outside them", async ({
  page,
}) => {
  await page.goto("/games");
  await expect(page.locator("main h1")).toBeVisible();
  await freezeClock(page);
  const initial = await academicState(page);
  await page.clock.runFor(61000);
  expect(await academicState(page)).toEqual(initial);
  await page.getByRole("link", { name: "Meu curso", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Seu inglês tem um caminho." }),
  ).toBeVisible();
  await page.clock.runFor(31000);
  await expect
    .poll(async () => {
      const state = (await academicState(page)) as {
        sessions?: { seconds: number }[];
      } | null;
      return state?.sessions?.reduce((sum, s) => sum + s.seconds, 0) || 0;
    })
    .toBeGreaterThanOrEqual(30);
  await page.getByRole("link", { name: "Jogos livres", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Seu inglês também pode brincar." }),
  ).toBeVisible();
  // Wait for the course-to-game transition's final write, then leave the game clock running.
  await expect
    .poll(async () => {
      const state = (await academicState(page)) as {
        sessions?: { seconds: number }[];
      } | null;
      return state?.sessions?.reduce((sum, s) => sum + s.seconds, 0) || 0;
    })
    .toBeGreaterThanOrEqual(31);
  const afterCourse = await academicState(page);
  await page.clock.runFor(61000);
  expect(await academicState(page)).toEqual(afterCourse);
});
