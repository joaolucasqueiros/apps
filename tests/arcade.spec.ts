import { test, expect, type Page } from "@playwright/test";
import { words } from "../src/content/vocabulary";
import { lessons } from "../src/content/lessons";
test.use({ hasTouch: true });
const storageKey = "english-path-casual-games-v1";
async function history(page: Page) {
  return page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key) || '{"events":[]}'),
    storageKey,
  );
}
async function completeAnagram(page: Page) {
  await page.getByRole("button", { name: "Começar Remixa" }).click();
  for (let i = 0; i < 5; i++) {
    const clue = await page.locator(".puzzle-clue").innerText();
    const target = words.find(
      (w) => w.pt === clue && /^[a-z]{3,5}$/.test(w.en),
    )!;
    for (const char of target.en) {
      await page
        .locator(".letter-bank button:enabled")
        .filter({ hasText: new RegExp("^" + char + "$", "i") })
        .first()
        .click();
    }
    await page.getByRole("button", { name: "Conferir palavra" }).click();
    if (i < 4)
      await page.getByRole("button", { name: "Próxima palavra" }).click();
  }
  await expect(
    page.getByRole("heading", { name: "Você colocou as letras no lugar." }),
  ).toBeVisible();
}
test("anagrams award one persisted round, preserve legacy wins and export a mergeable game backup", async ({
  page,
}) => {
  await page.addInitScript((key) => {
    if (!localStorage.getItem(key))
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          records: { "memory-4": { played: 6, wins: 3, best: 5 } },
        }),
      );
  }, storageKey);
  await page.goto("/games/anagram");
  await completeAnagram(page);
  await expect(page.locator(".round-reward")).toContainText("+85 XP");
  expect((await history(page)).records["memory-4"]).toEqual({
    played: 6,
    wins: 3,
    best: 5,
  });
  expect((await history(page)).events).toHaveLength(1);
  await page.getByRole("link", { name: "Ver meu rank" }).click();
  await expect(page.locator(".profile-xp-track")).toContainText("205 XP");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar jogos e XP" }).click();
  expect((await download).suggestedFilename()).toMatch(
    /^vira-arcade-.*\.json$/,
  );
  const data = await history(page);
  await page.getByLabel("Backup de jogos e XP").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(data)),
  });
  await page
    .getByRole("button", { name: "Mesclar progresso dos jogos" })
    .click();
  await page.reload();
  await expect(page.locator(".profile-xp-track")).toContainText("205 XP");
  expect((await history(page)).events).toHaveLength(1);
  await page.getByLabel("Backup de jogos e XP").setInputFiles({
    name: "broken.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":2,"events":[{}],"legacy":{},"legacyXp":0}'),
  });
  await expect(page.getByRole("alert")).toContainText("inválido");
  expect((await history(page)).events).toHaveLength(1);
});
test("sentence blocks complete five real phrases on a small phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/games/sentence");
  await page.getByRole("button", { name: "Começar Frase na mão" }).click();
  for (let i = 0; i < 5; i++) {
    const clue = await page.locator(".puzzle-clue").innerText();
    const phrase = lessons.find(
      (l) => l.level === "A1" && l.examples[2].pt === clue,
    )!.examples[2].en;
    for (const token of phrase.split(" "))
      await page
        .locator(".sentence-bank button:enabled")
        .getByText(token, { exact: true })
        .first()
        .click();
    await page.getByRole("button", { name: "Conferir frase" }).click();
    if (i < 4)
      await page.getByRole("button", { name: "Próxima frase" }).click();
  }
  await expect(
    page.getByRole("heading", { name: "Cinco ideias viraram frases." }),
  ).toBeVisible();
  expect((await history(page)).records["sentence-1"].wins).toBe(1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("word search accepts drag, two-tap and keyboard selections and awards the completed board", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/games/word-search");
  await page.getByRole("button", { name: "Começar Caça-conexões" }).click();
  const targets = await page
    .locator(".search-word-list strong")
    .allTextContents();
  for (let n = 0; n < targets.length; n++) {
    const chars = await page.locator("[data-cell]").allTextContents(),
      word = targets[n].toUpperCase();
    let start = -1;
    for (let i = 0; i < 64; i++) {
      if (
        (i % 8) + word.length <= 8 &&
        chars.slice(i, i + word.length).join("") === word
      ) {
        start = i;
        break;
      }
    }
    expect(start).toBeGreaterThanOrEqual(0);
    const first = page.locator('[data-cell="' + start + '"]'),
      last = page.locator('[data-cell="' + (start + word.length - 1) + '"]');
    if (n === 0) {
      const a = (await first.boundingBox())!,
        b = (await last.boundingBox())!;
      await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
      await page.mouse.down();
      await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, {
        steps: 6,
      });
      await page.mouse.up();
    } else if (n === 1) {
      await first.focus();
      await first.press("Enter");
      for (let k = 1; k < word.length; k++)
        await page.keyboard.press("ArrowRight");
      await page.keyboard.press("Enter");
    } else {
      await first.tap();
      await last.tap();
    }
  }
  await expect(
    page.getByRole("heading", { name: "Você encontrou todas as conexões." }),
  ).toBeVisible();
  expect((await history(page)).records["search-1"].wins).toBe(1);
});
test("sprint plays through eight choices and shows actual accuracy and persisted XP", async ({
  page,
}) => {
  await page.goto("/games/sprint");
  await page.getByRole("button", { name: "Começar Bate-pronto" }).click();
  for (let i = 0; i < 8; i++) {
    const clue = await page.locator(".puzzle-clue").innerText(),
      word = words.find((w) => w.pt === clue && /^[a-z]{3,6}$/.test(w.en))!;
    await page
      .locator(".sprint-options")
      .getByRole("button", { name: word.en, exact: true })
      .click();
    if (i < 7)
      await page.getByRole("button", { name: "Próximo desafio" }).click();
  }
  await expect(page.locator(".round-reward")).toContainText(
    "100% de aproveitamento",
  );
  expect((await history(page)).records["sprint-1"].wins).toBe(1);
  await page.reload();
  await expect(page.locator(".arcade-family-wins")).toHaveText("1 vitória");
});
test("seven game filters, profile and public offer fit mobile and work offline", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/games");
  await expect(page.locator(".casual-game-card")).toHaveCount(7);
  await page.getByRole("button", { name: "Frases", exact: true }).click();
  await expect(page.locator(".casual-game-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Todos", exact: true }).click();
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await expect
    .poll(() => page.evaluate(() => !!navigator.serviceWorker.controller))
    .toBe(true);
  await context.setOffline(true);
  for (const route of [
    "/games/anagram",
    "/games/word-search",
    "/games/sentence",
    "/games/sprint",
    "/profile",
    "/comece",
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
  await context.setOffline(false);
});
test("the founder offer loads without a study database and links to the authorized WhatsApp", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, "indexedDB", {
      get() {
        throw Error("Unavailable");
      },
    }),
  );
  await page.goto("/comece");
  await expect(
    page.getByRole("heading", { name: /Seu inglês merece sair da cabeça/ }),
  ).toBeVisible();
  await expect(page.locator(".founder-price")).toContainText("19,90");
  const link = page.getByRole("link", { name: "Quero saber sobre a turma" }),
    url = new URL((await link.getAttribute("href")) || "");
  expect(url.origin + url.pathname).toBe("https://wa.me/5538998146695");
  expect(url.searchParams.get("text")).toContain(
    "duas aulas coletivas ao vivo por semana",
  );
  await expect(page.locator(".founder-price-card")).toContainText(
    "não realiza cobrança",
  );
});
test("the learning chart counts new independent evidence and a real next-step resumes the lesson", async ({
  page,
}) => {
  await page.goto("/lesson/simple-past");
  await page.getByRole("button", { name: "Praticar o que aprendi" }).click();
  await page.getByRole("button", { name: /^[A-D] worked$/ }).click();
  await page.getByRole("button", { name: "Verificar resposta" }).click();
  await page.goto("/");
  await expect(page.locator(".learning-point")).toHaveCount(1);
  await expect(
    page.locator(".chart-day-buttons button").last(),
  ).toHaveAccessibleName(/1 respostas, 1 acertos/);
  await page.locator(".chart-day-buttons button").last().click();
  await expect(page.locator(".chart-day-detail")).toContainText(
    "100% de aproveitamento",
  );
  await page.getByRole("link", { name: "Continuar estudando" }).click();
  await expect(page.getByText("Exercício 1 de 7")).toBeVisible();
});

test("phone typing keeps words, pause and input visible with a reduced keyboard viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 430 });
  await page.goto("/games/typing");
  await page.getByRole("button", { name: "Começar digitação" }).click();
  await expect(page.getByLabel("Digite uma palavra da tela")).toBeFocused();
  await expect
    .poll(async () => {
      const word = await page.locator(".typing-word").first().boundingBox(),
        input = await page
          .getByLabel("Digite uma palavra da tela")
          .boundingBox();
      return !!word && !!input && word.y >= 0 && input.y + input.height <= 430;
    })
    .toBe(true);
  await expect(
    page.getByRole("button", { name: "Pausar partida" }),
  ).toBeInViewport();
  await page.getByRole("button", { name: "Pausar partida" }).click();
  await expect(
    page.getByRole("heading", { name: "Partida pausada" }),
  ).toBeVisible();
});
