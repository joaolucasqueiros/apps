import type { Attempt, Exercise, LearningState, Skill } from "../types";
import { questionBank } from "../assessments/engine";
import { levelOrder } from "../content/curriculum";
export function errorTopics(attempts: Attempt[]) {
  const latest = new Map<string, Attempt>();
  for (const a of attempts)
    if (
      !a.selfAssessed &&
      !a.assisted &&
      (!latest.has(a.exerciseId) || a.date >= latest.get(a.exerciseId)!.date)
    )
      latest.set(a.exerciseId, a);
  const map = new Map<string, { topic: string; errors: Attempt[] }>();
  for (const a of latest.values())
    if (!a.correct) {
      const row = map.get(a.topic) || { topic: a.topic, errors: [] };
      row.errors.push(a);
      map.set(a.topic, row);
    }
  return [...map.values()].sort((a, b) => b.errors.length - a.errors.length);
}
export function transferQuestions(
  attempts: Attempt[],
  topic: string,
  limit = 5,
): Exercise[] {
  const seen = new Set(attempts.map((a) => a.exerciseId));
  return questionBank
    .filter((q) => q.topic === topic && !q.assessment)
    .map((q, i) => ({ q, rank: (seen.has(q.id) ? 1000 : 0) + i }))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit)
    .map((x) => x.q);
}
export function selectPractice(
  state: LearningState,
  minutes: number,
): Exercise[] {
  const weak = new Set(errorTopics(state.attempts).map((x) => x.topic));
  const counts = new Map<string, number>();
  for (const a of state.attempts)
    counts.set(a.exerciseId, (counts.get(a.exerciseId) || 0) + 1);
  const level = levelOrder.indexOf(state.profile.initialLevel);
  const ranked = questionBank
    .filter((q) => !q.assessment)
    .map((q, i) => ({
      q,
      rank:
        (weak.has(q.topic) ? -200 : 0) +
        Math.abs(levelOrder.indexOf(q.level) - level) * 50 +
        (counts.get(q.id) || 0) * 20 +
        i / 10000,
    }))
    .sort((a, b) => a.rank - b.rank)
    .map((x) => x.q);
  const slots: Skill[] =
    minutes === 5
      ? ["grammar", "vocabulary", "listening", "reading"]
      : minutes === 15
        ? [
            "grammar",
            "vocabulary",
            "listening",
            "reading",
            "grammar",
            "vocabulary",
            "reading",
          ]
        : [
            "grammar",
            "vocabulary",
            "listening",
            "reading",
            "grammar",
            "vocabulary",
            "listening",
            "reading",
            "grammar",
            "vocabulary",
            "listening",
            "reading",
          ];
  const chosen: Exercise[] = [];
  for (const skill of slots) {
    const next = ranked.find((q) => q.skill === skill && !chosen.includes(q));
    if (next) chosen.push(next);
  }
  return chosen;
}
