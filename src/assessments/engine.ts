import { allGrammarExercises } from "../content/lessons";
import { vocabularyExercises } from "../content/vocabulary";
import { storyExercises } from "../content/stories";
import { sceneExercises } from "../content/scenes";
import type { Exercise, Level, TestResult } from "../types";
export const questionBank: Exercise[] = [
  ...allGrammarExercises,
  ...vocabularyExercises,
  ...storyExercises,
  ...sceneExercises,
];
export function selectAssessment(
  history: TestResult[],
  level?: Level,
  topic?: string,
  withListening = true,
): Exercise[] {
  const counts = new Map<string, number>();
  history
    .flatMap((t) => t.answers)
    .forEach((a) =>
      counts.set(a.exerciseId, (counts.get(a.exerciseId) || 0) + 1),
    );
  const available = questionBank
    .filter(
      (q) =>
        q.assessment &&
        (!level || q.level === level) &&
        (!topic || q.topic === topic) &&
        (withListening || q.skill !== "listening"),
    )
    .map((q) => ({ q, rank: (counts.get(q.id) || 0) + Math.random() }))
    .sort((a, b) => a.rank - b.rank)
    .map((x) => x.q);
  if (topic) return available;
  const chosen: Exercise[] = [];
  for (const skill of [
    "grammar",
    "vocabulary",
    "reading",
    ...(withListening ? ["listening"] : []),
  ]) {
    const found = available.find((q) => q.skill === skill);
    if (found) chosen.push(found);
  }
  for (const q of available)
    if (chosen.length < 12 && !chosen.includes(q)) chosen.push(q);
  return chosen;
}
