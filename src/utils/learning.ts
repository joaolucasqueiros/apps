import type {
  Attempt,
  Exercise,
  Flashcard,
  LearningState,
  Skill,
} from "../types";
export const uid = () => crypto.randomUUID();
export const normalize = (s: string) =>
  s
    .normalize("NFKC")
    .toLocaleLowerCase("en")
    .replace(/[’‘]/g, "'")
    .replace(/\bcan't\b/g, "cannot")
    .replace(/\bdon't\b/g, "do not")
    .replace(/\bdoesn't\b/g, "does not")
    .replace(/\bdidn't\b/g, "did not")
    .replace(/\bisn't\b/g, "is not")
    .replace(/\baren't\b/g, "are not")
    .replace(/[.!?,;:]/g, "")
    .replace(/\s+/g, " ")
    .trim();
export function isCorrect(e: Exercise, answer: string) {
  return e.answers.some((a) => normalize(a) === normalize(answer));
}
export function mastery(attempts: Attempt[], topic?: string) {
  const all = attempts.filter((a) => !topic || a.topic === topic);
  // Only first attempts count toward mastery: retries remain in the history.
  const scored = all
    .filter((a) => a.number === 1 && !a.assisted && !a.selfAssessed)
    .slice(-20);
  const distinct = new Set(scored.map((a) => a.exerciseId)).size;
  const score = scored.length
    ? Math.round((scored.filter((a) => a.correct).length / scored.length) * 100)
    : 0;
  const errors = scored.filter((a) => !a.correct).length;
  const days = new Set(scored.map((a) => a.date.slice(0, 10))).size;
  const label = !scored.length
    ? "Não iniciado"
    : errors >= 2 && score < 70
      ? "Precisa de revisão"
      : distinct >= 8 && score >= 90 && days >= 2
        ? "Domínio consolidado"
        : distinct >= 4 && score >= 80
          ? "Bom domínio"
          : "Em aprendizagem";
  return { score, label, count: scored.length, errors };
}
export const skillNames: Record<Skill, string> = {
  grammar: "Gramática",
  vocabulary: "Vocabulário",
  listening: "Listening",
  speaking: "Speaking",
  reading: "Reading",
  writing: "Writing",
};
export function schedule(
  card: Flashcard,
  grade: number,
  now = new Date(),
): Flashcard {
  if (![0, 3, 4, 5].includes(grade))
    throw new Error("Avaliação de memória inválida.");
  let repetitions = grade < 3 ? 0 : card.repetitions + 1;
  const interval =
    grade < 3
      ? 1
      : repetitions === 1
        ? 1
        : repetitions === 2
          ? 6
          : Math.max(1, Math.round(card.interval * card.ease));
  const ease = Math.max(
    1.3,
    card.ease + 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02),
  );
  const due = new Date(now);
  due.setDate(due.getDate() + interval);
  return {
    ...card,
    repetitions,
    interval,
    ease,
    due: due.toISOString(),
    updatedAt: now.toISOString(),
    reviews: [...card.reviews, { date: now.toISOString(), grade, interval }],
  };
}
export function makeCard(
  front: string,
  back: string,
  category = "Pessoal",
  example = "",
  pronunciation = "",
): Flashcard {
  const now = new Date().toISOString();
  return {
    id: uid(),
    front,
    back,
    category,
    example,
    pronunciation,
    due: now,
    interval: 0,
    ease: 2.5,
    repetitions: 0,
    reviews: [],
    updatedAt: now,
  };
}
export function mergeStates(a: LearningState, b: LearningState): LearningState {
  const merge = <T extends { id: string }>(x: T[], y: T[]) =>
    Array.from(new Map([...x, ...y].map((v) => [v.id, v])).values());
  const dated = <T extends { id: string; updatedAt: string }>(x: T[], y: T[]) =>
    merge(x, y).map(
      (v) =>
        [...x, ...y]
          .filter((i) => i.id === v.id)
          .sort((m, n) => n.updatedAt.localeCompare(m.updatedAt))[0],
    );
  const latest = a.updatedAt >= b.updatedAt ? a : b;
  const drafts = { ...a.drafts, ...b.drafts };
  for (const key of Object.keys(drafts)) {
    const x = a.drafts?.[key],
      y = b.drafts?.[key];
    drafts[key] = x && y ? (x.updatedAt >= y.updatedAt ? x : y) : (x || y)!;
  }
  return {
    ...latest,
    drafts,
    profile: a.profile.updatedAt >= b.profile.updatedAt ? a.profile : b.profile,
    attempts: merge(a.attempts, b.attempts),
    cards: dated(a.cards, b.cards),
    lessons: dated(a.lessons, b.lessons),
    tests: merge(a.tests, b.tests),
    sessions: merge(a.sessions, b.sessions),
    updatedAt: new Date().toISOString(),
  };
}
export function transcriptionDiff(target: string, actual: string) {
  const heard = normalize(actual).split(" ");
  return normalize(target)
    .split(" ")
    .map((word) => {
      const i = heard.indexOf(word);
      if (i >= 0) heard.splice(i, 1);
      return { word, found: i >= 0 };
    });
}
