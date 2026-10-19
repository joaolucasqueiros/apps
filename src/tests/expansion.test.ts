import { describe, expect, it } from "vitest";
import { scenes, sceneExercises } from "../content/scenes";
import { lessons } from "../content/lessons";
import { words } from "../content/vocabulary";
import { listeningStories, readingStories } from "../content/stories";
import { conversations, pronunciationLessons } from "../content/communication";
import { coursePaths, projects, levelOrder } from "../content/curriculum";
import { extraWritingTasks } from "../content/writingTasks";
import { questionBank } from "../assessments/engine";
import { analyseWriting } from "../practice/feedback";
import {
  errorTopics,
  selectPractice,
  transferQuestions,
} from "../practice/adaptive";
import { readConversationDraft } from "../practice/Conversation";
import { emptyState, validateBackup } from "../persistence/store";
import type { Attempt } from "../types";
function attempt(
  id: string,
  correct: boolean,
  extra: Partial<Attempt> = {},
): Attempt {
  return {
    id,
    exerciseId: "simple-past-0",
    topic: "simple-past",
    skill: "grammar",
    answer: "work",
    correct,
    date: "2026-10-19T12:00:00Z",
    seconds: 1,
    number: 1,
    ...extra,
  };
}
describe("expanded curriculum and illustrated vocabulary", () => {
  it("has six scenes and 92 unique, positioned elements with a real lesson and a training question", () => {
    expect(scenes).toHaveLength(6);
    const items = scenes.flatMap((s) => s.items);
    expect(items).toHaveLength(92);
    expect(new Set(items.map((w) => w.id)).size).toBe(92);
    for (const scene of scenes) {
      expect(lessons.some((l) => l.id === scene.lesson)).toBe(true);
      for (const item of scene.items) {
        expect(item.x).toBeGreaterThan(0);
        expect(item.x).toBeLessThan(100);
        expect(item.y).toBeGreaterThan(0);
        expect(item.y).toBeLessThan(100);
        expect(item.pt.length).toBeGreaterThan(1);
        expect(item.example.length).toBeGreaterThan(10);
        const question = sceneExercises.find(
          (q) => q.id === item.id + "-identify",
        )!;
        expect(question.topic).toBe("scene-" + scene.id);
        expect(question.assessment).toBe(false);
        expect(question.options).toContain(item.en);
      }
    }
  });
  it("keeps the legacy vocabulary IDs and adds 79 words without duplicate English terms", () => {
    expect(words).toHaveLength(171);
    expect(new Set(words.map((w) => w.id)).size).toBe(171);
    expect(new Set(words.map((w) => w.en.toLowerCase())).size).toBe(171);
    expect(words.find((w) => w.id === "word-1-0")?.en).toBe("sink");
  });
  it("places each of 48 lessons exactly once in a coherent path with preceding prerequisites", () => {
    const ids = levelOrder.flatMap((level) => coursePaths[level].lessons);
    expect(ids).toHaveLength(48);
    expect(new Set(ids).size).toBe(48);
    expect(new Set(ids)).toEqual(new Set(lessons.map((l) => l.id)));
    for (const level of levelOrder)
      for (const [index, id] of coursePaths[level].lessons.entries()) {
        const lesson = lessons.find((l) => l.id === id)!;
        expect(lesson.level).toBe(level);
        expect(lesson.prerequisites).toEqual(
          index ? [coursePaths[level].lessons[index - 1]] : [],
        );
      }
  });
  it("has 12 listening pieces and 10 readings spanning all levels with separate assessment items", () => {
    expect(listeningStories).toHaveLength(12);
    expect(readingStories).toHaveLength(10);
    for (const collection of [listeningStories, readingStories]) {
      expect(new Set(collection.map((s) => s.level))).toEqual(
        new Set(levelOrder),
      );
      for (const story of collection) {
        expect(story.questions).toHaveLength(3);
        expect(story.questions.filter((q) => q.assessment)).toHaveLength(1);
      }
    }
    expect(questionBank.filter((q) => q.assessment)).toHaveLength(160);
  });
  it("connects conversation, pronunciation and projects to usable content", () => {
    expect(conversations).toHaveLength(12);
    expect(pronunciationLessons).toHaveLength(8);
    expect(projects).toHaveLength(5);
    for (const c of conversations) {
      expect(c.turns).toHaveLength(4);
      expect(new Set(c.turns.map((t) => t.question)).size).toBe(4);
      expect(lessons.some((l) => l.id === c.lesson)).toBe(true);
      if (c.scene) expect(scenes.some((s) => s.id === c.scene)).toBe(true);
    }
    for (const p of projects) {
      expect(p.criteria).toHaveLength(4);
      expect(p.steps).toHaveLength(4);
      expect(conversations.some((c) => c.id === p.conversation)).toBe(true);
      expect(readingStories.some((s) => s.id === p.reading)).toBe(true);
      expect(extraWritingTasks.some((t) => t.id === p.writing)).toBe(true);
    }
  });
});
describe("actionable, bounded writing feedback", () => {
  it("identifies common errors and provides specific alternatives and related lessons", () => {
    const result = analyseWriting(
      "I did not went home. I can to drive. I want learn English. I am agree.",
    );
    expect(result.issues).toHaveLength(4);
    expect(result.issues.map((i) => i.suggestion)).toEqual(
      expect.arrayContaining([
        "did not go",
        "can drive",
        "I want to learn",
        "I agree",
      ]),
    );
    for (const issue of result.issues)
      expect(lessons.some((l) => l.id === issue.lesson)).toBe(true);
  });
  it("does not flag the corrected phrases and resets global matches between calls", () => {
    const text =
      "I did not go home. I can drive. I want to learn English. I agree.";
    expect(analyseWriting(text).issues).toHaveLength(0);
    for (let i = 0; i < 2; i++)
      expect(
        analyseWriting("She don't drive. She don't work.").issues,
      ).toHaveLength(2);
    expect(analyseWriting("")).toEqual({ issues: [], words: 0, sentences: 0 });
  });
});
describe("adaptive review and balanced sessions", () => {
  it("uses the latest dated independent answer, ignoring assisted and self-assessed production", () => {
    const early = attempt("old", false, { date: "2026-10-18T12:00:00Z" });
    const recent = attempt("new", true);
    expect(errorTopics([recent, early])).toHaveLength(0);
    expect(
      errorTopics([
        early,
        attempt("help", true, { assisted: true }),
        attempt("self", true, { selfAssessed: true }),
      ])[0].errors,
    ).toEqual([early]);
  });
  it("offers new practice in a weak topic before repetitions and never leaks assessments", () => {
    const attempts = [attempt("wrong", false)];
    const transfer = transferQuestions(attempts, "simple-past");
    expect(transfer).toHaveLength(5);
    expect(
      transfer.every((q) => !q.assessment && q.topic === "simple-past"),
    ).toBe(true);
    expect(transfer[0].id).not.toBe("simple-past-0");
  });
  it("balances four objective skills at all durations and prioritizes an observed weakness", () => {
    const state = emptyState();
    state.attempts = [attempt("wrong", false)];
    for (const [minutes, count] of [
      [5, 4],
      [15, 7],
      [30, 12],
    ]) {
      const chosen = selectPractice(state, minutes);
      expect(chosen).toHaveLength(count);
      expect(new Set(chosen.map((q) => q.id)).size).toBe(count);
      expect(new Set(chosen.map((q) => q.skill))).toEqual(
        new Set(["grammar", "vocabulary", "listening", "reading"]),
      );
      expect(chosen.every((q) => !q.assessment)).toBe(true);
      expect(chosen[0].topic).toBe("simple-past");
      expect(chosen[0].id).not.toBe("simple-past-0");
    }
  });
});
describe("resumable production", () => {
  it("restores bounded conversation drafts and rejects malformed imported content", () => {
    const c = conversations[0],
      valid = {
        answers: ["Hi, I'm João."],
        current: "I am from Brazil.",
        help: false,
      };
    expect(readConversationDraft(JSON.stringify(valid), c)).toEqual(valid);
    for (const bad of [
      "broken",
      JSON.stringify({ ...valid, answers: Array(8).fill("hello") }),
      JSON.stringify({ ...valid, current: 42 }),
      JSON.stringify({ ...valid, help: "yes" }),
    ])
      expect(readConversationDraft(bad, c).answers).toEqual([]);
  });
  it("keeps new drafts compatible with academic backup and preserves independent casual records", () => {
    const state = emptyState();
    state.drafts = {
      "conversation-new-neighbour": {
        text: JSON.stringify({
          answers: ["Hi!"],
          current: "Brazil",
          help: false,
        }),
        updatedAt: state.updatedAt,
      },
      "project-my-world": {
        text: "There is a sofa in my room.",
        updatedAt: state.updatedAt,
      },
    };
    expect(validateBackup(JSON.parse(JSON.stringify(state)))).toEqual(state);
  });
});
