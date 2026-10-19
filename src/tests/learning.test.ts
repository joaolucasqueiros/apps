import { describe, it, expect } from "vitest";
import {
  normalize,
  isCorrect,
  makeCard,
  schedule,
  mastery,
  mergeStates,
} from "../utils/learning";
import {
  emptyState,
  loadState,
  saveState,
  stageState,
  validateBackup,
} from "../persistence/store";
import { lessons } from "../content/lessons";
import { questionBank, selectAssessment } from "../assessments/engine";
import type { Attempt } from "../types";
describe("answer evaluation", () => {
  it("accepts punctuation, whitespace and supported contractions without accepting the wrong tense", () => {
    expect(normalize("  I didn’t GO. ")).toBe("i did not go");
    const e = lessons.find((l) => l.id === "negatives")!.exercises[1];
    expect(isCorrect(e, "don't")).toBe(true);
    expect(isCorrect(e, "did not")).toBe(false);
  });
  it("accepts every authored answer and has unique meaningful choice options", () => {
    for (const e of questionBank) {
      expect(e.prompt.length).toBeGreaterThan(10);
      expect(e.explanation.trim(), e.id).not.toBe("");
      for (const a of e.answers) expect(isCorrect(e, a), e.id).toBe(true);
      if (e.options) {
        expect(
          e.options.some((o) => isCorrect(e, o)),
          e.id,
        ).toBe(true);
        expect(new Set(e.options.map(normalize)).size, e.id).toBe(
          e.options.length,
        );
      }
    }
  });
});
describe("curriculum and reserved assessments", () => {
  it("provides all 24 units with guided practice and dedicated assessments", () => {
    expect(lessons).toHaveLength(24);
    for (const l of lessons) {
      expect(l.exercises).toHaveLength(7);
      expect(l.assessment).toHaveLength(2);
      expect(l.examples).toHaveLength(3);
      expect(l.explanation).toHaveLength(2);
    }
  });
  it("contains 338 uniquely identified questions and keeps study questions out of tests", () => {
    expect(questionBank).toHaveLength(338);
    expect(new Set(questionBank.map((q) => q.id)).size).toBe(
      questionBank.length,
    );
    const selected = selectAssessment([]);
    expect(selected).toHaveLength(12);
    expect(new Set(selected.map((e) => e.skill)).size).toBe(4);
    expect(selected.every((q) => q.assessment)).toBe(true);
  });
  it("selects the requested level or module and excludes listening when unavailable", () => {
    expect(selectAssessment([], "C1").every((e) => e.level === "C1")).toBe(
      true,
    );
    expect(
      selectAssessment([], undefined, "articles").map((e) => e.topic),
    ).toEqual(["articles", "articles"]);
    expect(
      selectAssessment([], undefined, undefined, false).some(
        (e) => e.skill === "listening",
      ),
    ).toBe(false);
  });
});
describe("spaced repetition", () => {
  it("schedules 1 day, then 6 days, then a growing interval without mutating the card", () => {
    const base = makeCard("sink", "pia");
    const now = new Date("2026-10-19T12:00:00Z");
    const a = schedule(base, 4, now);
    const b = schedule(a, 4, now);
    const c = schedule(b, 4, now);
    expect(a.interval).toBe(1);
    expect(b.interval).toBe(6);
    expect(c.interval).toBe(15);
    expect(a.due).toBe("2026-10-20T12:00:00.000Z");
    expect(base.reviews).toHaveLength(0);
    expect(c.reviews).toHaveLength(3);
  });
  it("resets after forgetting and enforces the ease floor", () => {
    let c = makeCard("work", "trabalhar");
    for (let i = 0; i < 10; i++) c = schedule(c, 0);
    expect(c.repetitions).toBe(0);
    expect(c.interval).toBe(1);
    expect(c.ease).toBe(1.3);
    expect(() => schedule(c, 2)).toThrow();
  });
});
const attempt = (
  n: number,
  correct: boolean,
  extra: Partial<Attempt> = {},
): Attempt => ({
  id: String(n),
  exerciseId: `exercise-${n}`,
  topic: "articles",
  skill: "grammar",
  answer: "a",
  correct,
  date: `2026-10-${n % 2 ? 18 : 19}T12:00:00Z`,
  seconds: 5,
  number: 1,
  ...extra,
});
describe("honest mastery", () => {
  it("distinguishes insufficient evidence, recurring errors, mastery and consolidation", () => {
    expect(mastery([]).label).toBe("Não iniciado");
    expect(mastery([attempt(1, false), attempt(2, false)]).label).toBe(
      "Precisa de revisão",
    );
    expect(
      mastery(Array.from({ length: 4 }, (_, i) => attempt(i, true))).label,
    ).toBe("Bom domínio");
    expect(
      mastery(Array.from({ length: 8 }, (_, i) => attempt(i, true))).label,
    ).toBe("Domínio consolidado");
  });
  it("excludes retries, assisted answers and speaking self assessments", () => {
    expect(
      mastery([
        attempt(1, true, { number: 2 }),
        attempt(2, true, { assisted: true }),
        attempt(3, true, { selfAssessed: true }),
      ]).count,
    ).toBe(0);
  });
});
describe("persistence, backup and synchronization", () => {
  it("recovers the latest write if the page closes before IndexedDB commits", async () => {
    const old = emptyState();
    await saveState(old);
    const newest = { ...old, profile: { ...old.profile, name: "Recuperado" } };
    stageState(newest);
    expect((await loadState()).profile.name).toBe("Recuperado");
    expect(localStorage.getItem("english-path-write-ahead-v1")).toBeNull();
  });
  it("round trips real state through IndexedDB", async () => {
    const s = emptyState();
    s.profile.name = "João";
    s.attempts = [attempt(1, true)];
    await saveState(s);
    expect(await loadState()).toEqual(s);
  });
  it("rejects malformed, incompatible and duplicate-ID backups", () => {
    expect(() => validateBackup({})).toThrow();
    const s = emptyState();
    s.cards = [{ ...makeCard("car", "carro"), ease: -1 }];
    expect(() => validateBackup(s)).toThrow();
    const dup = emptyState();
    dup.attempts = [attempt(1, true), attempt(1, true)];
    expect(() => validateBackup(dup)).toThrow();
    expect(validateBackup(emptyState()).version).toBe(1);
  });
  it("merges unique history and preserves newer tombstones in conflicts", () => {
    const a = emptyState();
    const b = emptyState();
    a.attempts = [attempt(1, true)];
    b.attempts = [attempt(2, false)];
    const c = makeCard("sink", "pia");
    a.cards = [{ ...c, updatedAt: "2026-10-18T12:00:00Z" }];
    b.cards = [{ ...c, deleted: true, updatedAt: "2026-10-19T12:00:00Z" }];
    const merged = mergeStates(a, b);
    expect(merged.attempts).toHaveLength(2);
    expect(merged.cards).toHaveLength(1);
    expect(merged.cards[0].deleted).toBe(true);
    expect(mergeStates(merged, b).attempts).toHaveLength(2);
  });
});
