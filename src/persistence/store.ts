import { openDB } from "idb";
import type { LearningState } from "../types";
export function emptyState(): LearningState {
  const now = new Date().toISOString();
  return {
    version: 1,
    profile: {
      name: "Estudante",
      goal: "B1",
      initialLevel: "A2",
      theme: "light",
      speechRate: 0.85,
      updatedAt: now,
    },
    attempts: [],
    cards: [],
    lessons: [],
    tests: [],
    sessions: [],
    lastLesson: "simple-past",
    updatedAt: now,
  };
}
const db = () =>
  openDB("english-path", 1, {
    upgrade(d) {
      d.createObjectStore("state");
    },
  });
const journalKey = "english-path-write-ahead-v1";
// Synchronous crash-recovery journal closes the gap before an IndexedDB transaction commits.
export function stageState(state: LearningState) {
  localStorage.setItem(journalKey, JSON.stringify(state));
}
export async function loadState() {
  const pending = localStorage.getItem(journalKey);
  const d = await db();
  const value = await d.get("state", "current");
  if (pending) {
    const restored = validateBackup(JSON.parse(pending));
    await saveState(restored);
    return restored;
  }
  return value ? validateBackup(value) : emptyState();
}
export async function saveState(state: LearningState) {
  const serialized = JSON.stringify(state);
  const d = await db();
  await d.put("state", state, "current");
  if (localStorage.getItem(journalKey) === serialized)
    localStorage.removeItem(journalKey);
}
export function validateBackup(raw: unknown): LearningState {
  const fail = () => {
    throw new Error(
      "Backup inválido ou incompatível. Seus dados atuais foram preservados.",
    );
  };
  if (!raw || typeof raw !== "object") return fail();
  const s = raw as LearningState;
  const str = (x: unknown) => typeof x === "string" && x.length <= 50000;
  const date = (x: unknown) =>
    str(x) && Number.isFinite(Date.parse(x as string));
  const finite = (x: unknown) =>
    typeof x === "number" && Number.isFinite(x) && x >= 0;
  const skill = (x: unknown) =>
    [
      "grammar",
      "vocabulary",
      "listening",
      "speaking",
      "reading",
      "writing",
    ].includes(x as string);
  const array = (x: unknown) => Array.isArray(x) && x.length <= 100000;
  const p = s.profile;
  if (
    s.version !== 1 ||
    !p ||
    !str(p.name) ||
    !["A1", "A2", "B1", "B2", "C1"].includes(p.goal) ||
    !["A1", "A2", "B1", "B2", "C1"].includes(p.initialLevel) ||
    !["light", "dark", "system"].includes(p.theme) ||
    !finite(p.speechRate) ||
    p.speechRate < 0.5 ||
    p.speechRate > 1.5 ||
    !date(p.updatedAt) ||
    !date(s.updatedAt) ||
    !str(s.lastLesson)
  )
    return fail();
  for (const k of [
    "attempts",
    "cards",
    "lessons",
    "tests",
    "sessions",
  ] as const)
    if (!array(s[k])) return fail();
  if (
    !s.attempts.every(
      (a) =>
        a &&
        [a.assisted, a.selfAssessed].every(
          (v) => v === undefined || typeof v === "boolean",
        ) &&
        str(a.id) &&
        str(a.exerciseId) &&
        str(a.topic) &&
        skill(a.skill) &&
        str(a.answer) &&
        typeof a.correct === "boolean" &&
        date(a.date) &&
        finite(a.seconds) &&
        Number.isInteger(a.number) &&
        a.number >= 1,
    )
  )
    return fail();
  if (
    !s.cards.every(
      (c) =>
        c &&
        str(c.id) &&
        str(c.front) &&
        str(c.back) &&
        str(c.example) &&
        str(c.pronunciation) &&
        str(c.category) &&
        date(c.due) &&
        date(c.updatedAt) &&
        finite(c.interval) &&
        finite(c.ease) &&
        c.ease >= 1.3 &&
        finite(c.repetitions) &&
        array(c.reviews) &&
        c.reviews.every(
          (r) =>
            r &&
            date(r.date) &&
            [0, 3, 4, 5].includes(r.grade) &&
            finite(r.interval),
        ) &&
        (c.deleted === undefined || typeof c.deleted === "boolean"),
    )
  )
    return fail();
  if (
    !s.lessons.every(
      (l) =>
        l &&
        str(l.id) &&
        Number.isInteger(l.index) &&
        l.index >= 0 &&
        typeof l.completed === "boolean" &&
        date(l.updatedAt),
    )
  )
    return fail();
  if (
    !s.tests.every(
      (t) =>
        t &&
        str(t.id) &&
        str(t.name) &&
        date(t.date) &&
        array(t.answers) &&
        t.answers.every(
          (a) =>
            a &&
            str(a.exerciseId) &&
            typeof a.correct === "boolean" &&
            skill(a.skill),
        ),
    )
  )
    return fail();
  if (
    !s.sessions.every(
      (t) => t && str(t.id) && date(t.date) && finite(t.seconds),
    )
  )
    return fail();
  for (const k of [
    "attempts",
    "cards",
    "lessons",
    "tests",
    "sessions",
  ] as const)
    if (new Set(s[k].map((x) => x.id)).size !== s[k].length) return fail();
  if (
    s.drafts !== undefined &&
    (!s.drafts ||
      typeof s.drafts !== "object" ||
      Array.isArray(s.drafts) ||
      Object.keys(s.drafts).length > 1000 ||
      !Object.values(s.drafts).every(
        (d) => d && str(d.text) && date(d.updatedAt),
      ))
  )
    return fail();
  if (s.activeAssessment !== undefined) {
    const a = s.activeAssessment;
    if (
      !a ||
      !str(a.id) ||
      !str(a.name) ||
      !array(a.questionIds) ||
      !a.questionIds.length ||
      !a.questionIds.every(str) ||
      new Set(a.questionIds).size !== a.questionIds.length ||
      !Number.isInteger(a.index) ||
      a.index < 0 ||
      a.index >= a.questionIds.length ||
      !array(a.results) ||
      !a.results.every(
        (r) =>
          r &&
          str(r.exerciseId) &&
          a.questionIds.includes(r.exerciseId) &&
          skill(r.skill) &&
          typeof r.correct === "boolean" &&
          str(r.answer),
      ) ||
      new Set(a.results.map((r) => r.exerciseId)).size !== a.results.length
    )
      return fail();
  }
  if (s.activeSession !== undefined) {
    const a = s.activeSession;
    if (
      !a ||
      !str(a.id) ||
      ![5, 15, 30].includes(a.minutes) ||
      !array(a.questionIds) ||
      !a.questionIds.length ||
      !a.questionIds.every(str) ||
      new Set(a.questionIds).size !== a.questionIds.length ||
      !Number.isInteger(a.index) ||
      a.index < 0 ||
      a.index >= a.questionIds.length ||
      typeof a.completed !== "boolean" ||
      !array(a.results) ||
      !a.results.every(
        (r) =>
          r &&
          str(r.exerciseId) &&
          a.questionIds.includes(r.exerciseId) &&
          typeof r.correct === "boolean" &&
          str(r.answer),
      ) ||
      new Set(a.results.map((r) => r.exerciseId)).size !== a.results.length
    )
      return fail();
  }
  return s;
}
