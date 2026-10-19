import { test, expect, type Page } from "@playwright/test";
import { scenes } from "../src/content/scenes";
import { conversations } from "../src/content/communication";
import { projects } from "../src/content/curriculum";
import { questionBank } from "../src/assessments/engine";
async function academic(page: Page) {
  return page.evaluate(
    () =>
      new Promise<any>((resolve, reject) => {
        const r = indexedDB.open("english-path", 1);
        r.onerror = () => reject(r.error);
        r.onsuccess = () => {
          const db = r.result,
            q = db.transaction("state").objectStore("state").get("current");
          q.onsuccess = () => {
            resolve(q.result);
            db.close();
          };
          q.onerror = () => reject(q.error);
        };
      }),
  );
}
test("all six illustrated scenes support touching objects, translated examples and reusable flashcards", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const scene of scenes) {
    await page.goto("/explore/" + scene.id);
    await expect(
      page.getByRole("heading", { name: scene.title, level: 1 }),
    ).toBeVisible();
    const item = scene.items[0],
      board = page.locator(".scene-board"),
      box = await board.boundingBox();
    expect(box).not.toBeNull();
    await board.click({
      position: {
        x: (box!.width * item.x) / 100,
        y: (box!.height * item.y) / 100,
      },
    });
    await expect(
      page
        .getByRole("complementary", { name: "Palavra selecionada" })
        .getByRole("heading", { name: item.en, exact: true }),
    ).toBeVisible();
    await expect(page.locator(".scene-translation")).toHaveText(item.pt);
    await expect(page.locator(".scene-example")).toContainText(item.example);
    if (scene.id === "body") {
      await page
        .getByRole("button", { name: "Salvar nos flashcards", exact: true })
        .click();
      await page.reload();
      await expect(page.locator(".scene-instruction")).toContainText("1 de 20");
      await page
        .getByRole("button", { name: "Ponto 1: cabeça", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Salvar nos flashcards", exact: true })
        .click();
      await expect(
        page.getByText("Esta palavra já está nos seus flashcards.", {
          exact: true,
        }),
      ).toBeVisible();
    }
  }
  await page.goto("/flashcards");
  await expect(
    page.getByRole("heading", { name: "head", exact: true }),
  ).toBeVisible();
  expect(
    (await academic(page)).cards.filter((c: any) => c.front === "head"),
  ).toHaveLength(1);
  expect(errors).toEqual([]);
});
test("mobile scene selection stays visible and a complete challenge records actual answers", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/explore/body");
  await page
    .getByRole("button", { name: "Ponto 1: cabeça", exact: true })
    .click();
  await expect(page.locator(".scene-selection-caption")).toContainText("head");
  await expect(page.locator(".scene-selection-caption")).toBeInViewport();
  await page
    .getByRole("button", { name: "Desafio: encontre a palavra" })
    .click();
  for (let i = 0; i < 6; i++) {
    const term = await page
      .locator(".scene-challenge-prompt h2 span")
      .innerText();
    const item = scenes[0].items.find((w) => w.en === term)!;
    const index = scenes[0].items.indexOf(item);
    await page
      .getByRole("button", {
        name: "Ponto " + (index + 1) + ": " + item.pt,
        exact: true,
      })
      .click();
    await expect(
      page.getByRole("heading", { name: "Você encontrou!" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Continuar", exact: true }).click();
  }
  await expect(
    page.getByRole("heading", { name: "Você fez novas conexões." }),
  ).toBeVisible();
  await expect(page.locator(".scene-summary")).toContainText("6 de 6");
  const state = await academic(page);
  expect(
    state.attempts.filter((a: any) => a.topic === "scene-body" && a.correct),
  ).toHaveLength(6);
  expect(state.lessons).toHaveLength(0);
});
test("a guided conversation resumes drafts and finishes without inventing a speaking score", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "SpeechRecognition", { value: undefined });
    Object.defineProperty(window, "webkitSpeechRecognition", {
      value: undefined,
    });
  });
  const c = conversations.find((c) => c.id === "restaurant-order")!;
  await page.goto("/conversation/" + c.id);
  await expect(
    page.getByRole("button", { name: "Falar e transcrever", exact: true }),
  ).toBeDisabled();
  for (let i = 0; i < 4; i++) {
    await expect(page.locator(".current-turn h2")).toHaveText(
      c.turns[i].question,
    );
    await page
      .getByLabel("Sua resposta em inglês", { exact: true })
      .fill(c.turns[i].model);
    if (i === 1) {
      await page.reload();
      await expect(
        page.getByLabel("Sua resposta em inglês", { exact: true }),
      ).toHaveValue(c.turns[i].model);
    }
    await page
      .getByRole("button", { name: "Revisar minha resposta", exact: true })
      .click();
    for (const box of await page
      .locator(".conversation-review input[type=checkbox]")
      .all())
      await box.check();
    await page
      .getByRole("button", { name: "Registrar e continuar", exact: true })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "Você sustentou uma conversa." }),
  ).toBeVisible();
  const state = await academic(page),
    attempts = state.attempts.filter(
      (a: any) => a.topic === "conversation-" + c.id,
    );
  expect(attempts).toHaveLength(4);
  expect(
    attempts.every((a: any) => a.selfAssessed && a.skill === "speaking"),
  ).toBe(true);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Você sustentou uma conversa." }),
  ).toBeVisible();
});
test("writing gives specific grammar feedback and preserves the student's text", async ({
  page,
}) => {
  await page.goto("/writing");
  const text = "I did not went home. I can to drive. I want learn English.";
  await page.getByLabel("Seu texto em inglês").fill(text);
  await page
    .getByRole("button", { name: "Salvar e revisar meu texto", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Dicas automáticas para seu texto" }),
  ).toBeVisible();
  await expect(page.locator(".writing-review")).toContainText("did not go");
  await expect(page.locator(".writing-review")).toContainText("can drive");
  await expect(
    page.getByRole("button", { name: "Concluí minha revisão", exact: true }),
  ).toBeDisabled();
  await expect(page.getByLabel("Seu texto em inglês")).toHaveValue(text);
  await page.reload();
  await expect(page.getByLabel("Seu texto em inglês")).toHaveValue(text);
});
test("a project keeps criteria after reload and appears in the portfolio without an objective writing grade", async ({
  page,
}) => {
  const p = projects[0];
  await page.goto("/practice/projects/" + p.id);
  const save = page.getByRole("button", {
    name: "Guardar no meu portfólio",
    exact: true,
  });
  await expect(save).toBeDisabled();
  await page.getByLabel("Meu projeto em inglês").fill(p.model);
  await page.getByLabel(p.criteria[0], { exact: true }).check();
  await page.getByLabel(p.criteria[1], { exact: true }).check();
  await page.reload();
  await expect(page.getByLabel("Meu projeto em inglês")).toHaveValue(p.model);
  await expect(page.getByLabel(p.criteria[0], { exact: true })).toBeChecked();
  for (const item of p.criteria)
    await page.getByLabel(item, { exact: true }).check();
  await save.click();
  await page.goto("/progress");
  await expect(page.locator(".portfolio-summary")).toContainText(p.title);
  await expect(
    page.locator(".skill-row").filter({ hasText: "Writing" }),
  ).toContainText("Sem avaliação");
  const state = await academic(page);
  expect(
    state.attempts.find((a: any) => a.topic === "project-" + p.id).selfAssessed,
  ).toBe(true);
});
test("error review transfers a weakness to new material instead of exposing assessment questions", async ({
  page,
}) => {
  const q = questionBank.find((q) => q.id === "simple-past-0")!;
  await page.goto("/lesson/simple-past");
  await page.getByRole("button", { name: "Praticar o que aprendi" }).click();
  await page
    .locator(".choices>button")
    .nth(q.options!.findIndex((o) => o !== q.answers[0]))
    .click();
  await page.getByRole("button", { name: "Verificar resposta" }).click();
  await page.goto("/practice/errors");
  await page.getByRole("button", { name: "Praticar este tema" }).click();
  await expect(
    page.getByText("Uma frase nova para aplicar a estrutura", { exact: false }),
  ).toBeVisible();
  const id = await page
    .getByRole("textbox", { name: "Sua resposta" })
    .getAttribute("id");
  expect(id).toBe("answer-simple-past-1");
  await page.getByRole("textbox", { name: "Sua resposta" }).fill("visited");
  await page.getByRole("button", { name: "Verificar resposta" }).click();
  await expect(
    page.getByText("Muito bem! Você acertou.", { exact: true }),
  ).toBeVisible();
  const state = await academic(page);
  expect(
    state.attempts.some(
      (a: any) => a.exerciseId === "simple-past-1" && a.correct,
    ),
  ).toBe(true);
});
test("a short session covers four objective skills and supplies the reading and listening context", async ({
  page,
}) => {
  await page.goto("/session/5");
  await expect(
    page.getByText("1 de 4 atividades", { exact: true }),
  ).toBeVisible();
  const draft = (await academic(page)).activeSession;
  expect(
    new Set(
      draft.questionIds.map(
        (id: string) => questionBank.find((q) => q.id === id)!.skill,
      ),
    ).size,
  ).toBe(4);
  for (let i = 0; i < 4; i++) {
    const q = questionBank.find((q) => q.id === draft.questionIds[i])!;
    if (q.skill === "reading")
      await expect(page.locator(".practice-context .story-text")).toBeVisible();
    if (q.skill === "listening" && q.topic.includes("keys"))
      await expect(
        page.getByRole("button", { name: /Ouvir contexto/ }),
      ).toBeVisible();
    if (q.options)
      await page
        .locator(".choices>button")
        .nth(q.options.indexOf(q.answers[0]))
        .click();
    else
      await page
        .getByRole("textbox", { name: "Sua resposta" })
        .fill(q.answers[0]);
    await page.getByRole("button", { name: "Verificar resposta" }).click();
    await page.getByRole("button", { name: "Continuar", exact: true }).click();
  }
  await expect(
    page.getByRole("heading", { name: "Você abriu espaço para aprender." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Praticar uma conversa", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Escrever com propósito", exact: true }),
  ).toBeVisible();
});
test("a personal audio file and listening notes survive reload and stay out of objective scores", async ({
  page,
}) => {
  await page.goto("/listening");
  const header = Buffer.alloc(44 + 1600);
  header.write("RIFF", 0);
  header.writeUInt32LE(header.length - 8, 4);
  header.write("WAVEfmt ", 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(8000, 24);
  header.writeUInt32LE(16000, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(1600, 40);
  await page
    .getByLabel("Escolher gravação atual · até 20 MB")
    .setInputFiles({
      name: "minha-pratica.wav",
      mimeType: "audio/wav",
      buffer: header,
    });
  await expect(
    page.getByText("minha-pratica.wav", { exact: true }),
  ).toBeVisible();
  await page
    .getByLabel("O que entendi sem consultar o texto")
    .fill("The visitor needs directions to the station.");
  await page.reload();
  await expect(
    page.getByText("minha-pratica.wav", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByLabel("O que entendi sem consultar o texto"),
  ).toHaveValue("The visitor needs directions to the station.");
  await expect(page.getByLabel("Minha gravação de escuta")).toHaveAttribute(
    "src",
    /^blob:/,
  );
  await page
    .getByRole("button", { name: "Guardar reflexão de escuta" })
    .click();
  const state = await academic(page);
  expect(
    state.attempts.find((a: any) => a.topic === "human-listening").selfAssessed,
  ).toBe(true);
});
test("production diagnostics preserve drafts, save separate skill evidence and update the selected starting level", async ({
  page,
}) => {
  await page.goto("/practice/diagnostic");
  await page.getByLabel("Complexidade da tarefa").selectOption("A1");
  await page
    .getByLabel("Minha resposta oral ou roteiro", { exact: true })
    .fill("Hi, I am João. There is a small kitchen in my home.");
  await page
    .getByLabel("Minha produção escrita", { exact: true })
    .fill("My name is João. I study English every week.");
  await page
    .getByRole("button", { name: "Salvar diagnóstico de produção" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Você tem um ponto de comparação." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Usar A1 como ponto de partida" })
    .click();
  await page.reload();
  await expect(page.getByLabel("Complexidade da tarefa")).toHaveValue("A1");
  await expect(
    page.getByLabel("Minha produção escrita", { exact: true }),
  ).toHaveValue("My name is João. I study English every week.");
  const state = await academic(page);
  expect(
    state.attempts
      .filter((a: any) => a.topic === "diagnostic-A1")
      .map((a: any) => a.skill)
      .sort(),
  ).toEqual(["speaking", "writing"]);
});
test("new scenes and practice routes work offline on mobile with dark theme and no page errors", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/settings");
  await page.getByRole("button", { name: "Escuro", exact: true }).click();
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await expect
    .poll(() => page.evaluate(() => !!navigator.serviceWorker.controller))
    .toBe(true);
  await context.setOffline(true);
  for (const route of [
    "/explore/car",
    "/explore/traffic",
    "/explore/restaurant",
    "/explore/everyday",
    "/conversation/new-neighbour",
    "/practice/pronunciation",
    "/practice/projects",
    "/practice/diagnostic",
    "/practice/errors",
  ]) {
    await page.goto(route);
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route,
    ).toBe(true);
  }
  expect(errors).toEqual([]);
  await context.setOffline(false);
});
