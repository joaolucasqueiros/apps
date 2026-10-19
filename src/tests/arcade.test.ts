import { beforeEach, describe, expect, it, vi } from "vitest";
import { words } from "../content/vocabulary";
import { lessons } from "../content/lessons";
import { emptyState } from "../persistence/store";
import type { Attempt } from "../types";
import {
  answerSprint,
  checkAnagram,
  checkSentence,
  createAnagram,
  createSearch,
  createSentence,
  createSprint,
  nextAnagram,
  nextSentence,
  nextSprint,
  selectAnagram,
  selectSearch,
  selectSentence,
  straightCells,
} from "../games/arcadeEngine";
import {
  aggregateGames,
  appendGameEvent,
  finishGame,
  gameRecordsKey,
  getGameSnapshot,
  mergeGameData,
  parseGameData,
  restoreGameProgress,
  validateGameBackup,
} from "../games/recordsStore";
import {
  engagement,
  learningEvidence,
  levelFromXp,
  nextSteps,
  stageUnlocked,
} from "../progression/engine";
const clean = () => parseGameData(null);
const now = new Date("2026-10-19T12:00:00Z");
const attempt = (id: string, extra: Partial<Attempt> = {}): Attempt => ({
  id,
  exerciseId: id,
  topic: "articles",
  skill: "grammar",
  answer: "a",
  correct: true,
  date: now.toISOString(),
  seconds: 5,
  number: 1,
  ...extra,
});
const phrases = lessons.map((l) => ({
  id: l.id,
  en: l.examples[2].en,
  pt: l.examples[2].pt,
  level: l.level,
}));
beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  getGameSnapshot();
});
describe("game history and safe migration", () => {
  it("keeps old records and credits their wins once, including after a new round and reload", () => {
    localStorage.setItem(
      gameRecordsKey,
      JSON.stringify({
        version: 1,
        records: { "memory-4": { played: 8, wins: 5, best: 6 } },
      }),
    );
    expect(getGameSnapshot()).toMatchObject({
      xp: 200,
      records: { "memory-4": { played: 8, wins: 5, best: 6 } },
    });
    finishGame("new-round", "memory-4", true, 4, { correct: 4, total: 4 });
    const saved = JSON.parse(localStorage.getItem(gameRecordsKey)!);
    const restored = parseGameData(saved);
    expect(restored.legacyXp).toBe(200);
    expect(restored.events).toHaveLength(1);
    expect(aggregateGames(restored)["memory-4"]).toEqual({
      played: 9,
      wins: 6,
      best: 4,
    });
    expect(getGameSnapshot().xp).toBe(285);
  });
  it("ignores repeat result effects even across import and a subsequent completion", () => {
    finishGame("same-id", "anagram-1", true, 0, { correct: 5, total: 5 });
    const backup = getGameSnapshot().data;
    restoreGameProgress(backup);
    restoreGameProgress(backup);
    finishGame("same-id", "anagram-1", true, 0, { correct: 5, total: 5 });
    expect(getGameSnapshot().data.events).toHaveLength(1);
    expect(getGameSnapshot().xp).toBe(85);
  });
  it("awards the daily bonus once and rewards participation without granting a win for a loss", () => {
    let data = appendGameEvent(
      clean(),
      "1",
      "sprint-1",
      false,
      7,
      { correct: 1, total: 4 },
      now,
    );
    data = appendGameEvent(
      data,
      "2",
      "anagram-1",
      true,
      0,
      { correct: 5, total: 5 },
      now,
    );
    data = appendGameEvent(
      data,
      "3",
      "sentence-3",
      true,
      0,
      { correct: 5, total: 5 },
      now,
    );
    expect(data.events.map((e) => e.xp)).toEqual([2, 85, 80]);
    expect(aggregateGames(data)["sprint-1"]?.wins).toBe(0);
  });
  it("merges distinct histories without inflating imported legacy counts or duplicate rounds", () => {
    const old = parseGameData({
      version: 1,
      records: { secret: { played: 4, wins: 2, best: 1 } },
    });
    const a = appendGameEvent(old, "a", "secret", true, 0, undefined, now);
    const b = appendGameEvent(
      old,
      "b",
      "typing-calm",
      false,
      9,
      { correct: 2, total: 5 },
      now,
    );
    const merged = mergeGameData(mergeGameData(a, b), a);
    expect(merged.events).toHaveLength(2);
    expect(merged.legacyXp).toBe(80);
    expect(aggregateGames(merged).secret).toEqual({
      played: 5,
      wins: 3,
      best: 0,
    });
  });
  it("rejects corrupt and duplicate-ID backups without replacing current data", () => {
    finishGame("keep", "anagram-1", true, 0);
    const before = getGameSnapshot();
    expect(() =>
      restoreGameProgress({
        ...before.data,
        events: [...before.data.events, ...before.data.events],
      }),
    ).toThrow();
    expect(() =>
      validateGameBackup({
        ...before.data,
        events: [{ ...before.data.events[0], xp: Infinity }],
      }),
    ).toThrow();
    expect(() =>
      validateGameBackup({
        ...before.data,
        legacy: { secret: { played: 1, wins: 2, best: 0 } },
      }),
    ).toThrow();
    expect(getGameSnapshot()).toBe(before);
  });
  it("keeps a completed round and exportable XP in memory when storage is full", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Full", "QuotaExceededError");
    });
    finishGame("quota", "search-1", true, 0);
    expect(getGameSnapshot().storageError).toContain("Exporte um backup");
    expect(getGameSnapshot().data.events).toHaveLength(1);
    finishGame("quota", "search-1", true, 0);
    expect(getGameSnapshot().data.events).toHaveLength(1);
  });
});
describe("participation is distinct from language evidence", () => {
  it("crosses level and rank thresholds precisely and unlocks challenges", () => {
    expect(levelFromXp(99)).toMatchObject({ level: 1, remaining: 1 });
    expect(levelFromXp(100)).toMatchObject({ level: 2, percent: 0 });
    expect(levelFromXp(300)).toMatchObject({ level: 3, percent: 0 });
    expect(stageUnlocked(2, "anagram", {}, 399)).toBe(false);
    expect(stageUnlocked(2, "anagram", {}, 400)).toBe(true);
    expect(
      stageUnlocked(
        3,
        "anagram",
        { "anagram-1": { played: 8, wins: 8, best: 0 } },
        0,
      ),
    ).toBe(true);
    const state = emptyState(),
      copy = structuredClone(state);
    const games = { ...getGameSnapshot(), xp: 1500 };
    expect(engagement(state, games).rank.key).toBe("B");
    expect(state).toEqual(copy);
  });
  it("caps repeated exercise XP and separates assisted work, production and first independent answers", () => {
    const state = emptyState();
    state.attempts = [
      attempt("q", { correct: false }),
      attempt("retry", { exerciseId: "q", number: 2 }),
      attempt("repeat", { exerciseId: "q", number: 3 }),
      attempt("hint", { assisted: true }),
      attempt("own", { skill: "speaking", selfAssessed: true }),
    ];
    expect(engagement(state, getGameSnapshot()).studyXp).toBe(40);
    expect(learningEvidence(state)).toMatchObject({
      count: 1,
      correct: 0,
      accuracy: 0,
    });
    expect(
      learningEvidence(state).skills.find((s) => s.skill === "speaking"),
    ).toMatchObject({ score: null, production: 1 });
  });
  it("resumes assessment before study session and selects an unfinished lesson afterward", () => {
    const state = emptyState();
    state.activeAssessment = {
      id: "t",
      name: "Avaliação",
      questionIds: ["q"],
      index: 0,
      results: [],
    };
    state.activeSession = {
      id: "s",
      minutes: 15,
      questionIds: ["q"],
      index: 0,
      results: [],
      completed: false,
    };
    expect(nextSteps(state).primary.to).toBe("/tests");
    delete state.activeAssessment;
    expect(nextSteps(state).primary.to).toBe("/session/15");
    delete state.activeSession;
    const first = nextSteps(state).lesson.id;
    state.lessons = [
      { id: first, completed: true, index: 7, updatedAt: now.toISOString() },
    ];
    expect(nextSteps(state).lesson.id).not.toBe(first);
  });
});
describe("four new games", () => {
  it("uses unique letter tiles, permits correction and ends only after five correct anagrams", () => {
    let r = createAnagram(words, 1, () => 0.35);
    r.tiles.forEach((t) => {
      r = selectAnagram(r, t.id);
    });
    expect(checkAnagram(r).mistakes).toBe(1);
    r = checkAnagram(r);
    for (let n = 0; n < 5; n++) {
      for (const letter of r.queue[r.index].en) {
        const t = r.tiles.find(
          (t) => t.letter === letter && !r.selected.includes(t.id),
        )!;
        r = selectAnagram(r, t.id);
        expect(selectAnagram(r, t.id)).toBe(r);
      }
      r = checkAnagram(r);
      expect(r.correct).toBe(n + 1);
      if (n < 4) r = nextAnagram(r);
    }
    expect(r.phase).toBe("won");
    expect(checkAnagram(r)).toBe(r);
  });
  it("handles repeated words as separate phrase tiles and rejects a wrong order", () => {
    let r = createSentence(phrases, 1, () => 0.4);
    r = {
      ...r,
      queue: [
        {
          id: "repeated",
          en: "I think I can.",
          pt: "Eu acho que consigo.",
          level: "A1",
        },
        ...r.queue.slice(1),
      ],
      tiles: [
        { id: 0, text: "I" },
        { id: 1, text: "think" },
        { id: 2, text: "I" },
        { id: 3, text: "can." },
      ],
    };
    r = [3, 2, 1, 0].reduce(selectSentence, r);
    expect(checkSentence(r).mistakes).toBe(1);
    r = { ...checkSentence(r), selected: [] };
    for (let n = 0; n < 5; n++) {
      for (const text of r.queue[r.index].en.split(" "))
        r = selectSentence(
          r,
          r.tiles.find((t) => t.text === text && !r.selected.includes(t.id))!
            .id,
        );
      r = checkSentence(r);
      if (n < 4) r = nextSentence(r);
    }
    expect(r.phase).toBe("won");
  });
  it("builds solvable boards in all stages, accepts reverse selections and guards bounds", () => {
    for (const stage of [1, 2, 3] as const) {
      let r = createSearch(words, stage, () => 0.42);
      expect(r.placements).toHaveLength(stage + 3);
      for (const p of r.placements) {
        expect(p.cells.every((c) => c >= 0 && c < 64)).toBe(true);
        expect(
          p.cells
            .map((c) => r.grid[c])
            .join("")
            .toLowerCase(),
        ).toBe(p.word.en);
        r = selectSearch(r, p.cells.at(-1)!, p.cells[0]);
      }
      expect(r.phase).toBe("won");
      expect(r.misses).toBe(0);
    }
    expect(straightCells(-1, 5, 8)).toEqual([]);
    expect(straightCells(0, 10, 8)).toEqual([]);
  });
  it("accepts an accidental second occurrence of a target word and highlights that selection", () => {
    let r = createSearch(words, 1, () => 0.42);
    const p = r.placements[0],
      word = p.word.en;
    const cells = [...word].map((_, i) => 56 + i);
    r = {
      ...r,
      grid: r.grid.map((c, i) =>
        cells.includes(i) ? word[i - 56].toUpperCase() : c,
      ),
    };
    r = selectSearch(r, cells[0], cells.at(-1)!);
    expect(r.found).toContain(p.word.id);
    expect(r.placements[0].cells).toEqual(cells);
  });
  it("prevents repeated answers, wins with six of eight and ends on the third miss", () => {
    let r = createSprint(words, 1, () => 0.3);
    for (let n = 0; n < 8; n++) {
      const q = r.queue[r.index],
        id = n < 6 ? q.word.id : q.options.find((o) => o.id !== q.word.id)!.id;
      r = answerSprint(r, id);
      expect(answerSprint(r, id)).toBe(r);
      if (n < 7) r = nextSprint(r);
    }
    expect(r.phase).toBe("won");
    expect(r.correct).toBe(6);
    let loss = createSprint(words, 1, () => 0.3);
    for (let n = 0; n < 3; n++) {
      loss = answerSprint(
        loss,
        loss.queue[loss.index].options.find(
          (o) => o.id !== loss.queue[loss.index].word.id,
        )!.id,
      );
      if (n < 2) loss = nextSprint(loss);
    }
    expect(loss.phase).toBe("lost");
    expect(loss.lives).toBe(0);
  });
});
