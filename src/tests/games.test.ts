import { beforeEach, describe, expect, it } from "vitest";
import { words } from "../content/vocabulary";
import {
  advanceTyping,
  createMemoryRound,
  createSecretRound,
  createTypingRound,
  guessLetter,
  hideMemoryMismatch,
  isCasualRoute,
  turnMemoryCard,
  typeWord,
  typingGoal,
  typingPaces,
} from "../games/engine";
import {
  addGameResult,
  gameRecordsKey,
  readGameRecords,
} from "../games/useGameRecords";

const pool = words.filter((w) => /^[a-z]{3,10}$/.test(w.en));
describe("memory game", () => {
  it("creates exactly one English and one Portuguese card per word without changing the vocabulary", () => {
    const original = words.map((w) => w.id);
    const round = createMemoryRound(words, 6);
    expect(round.cards).toHaveLength(12);
    expect(new Set(round.cards.map((c) => c.id)).size).toBe(12);
    for (const id of new Set(round.cards.map((c) => c.pairId)))
      expect(
        round.cards
          .filter((c) => c.pairId === id)
          .map((c) => c.side)
          .sort(),
      ).toEqual(["en", "pt"]);
    expect(words.map((w) => w.id)).toEqual(original);
  });
  it("ignores repeated clicks and locks a mismatch until both cards are hidden", () => {
    let round = createMemoryRound(words, 4);
    const first = round.cards[0];
    const second = round.cards.find((c) => c.pairId !== first.pairId)!;
    round = turnMemoryCard(round, first.id);
    expect(turnMemoryCard(round, first.id)).toBe(round);
    expect(round.moves).toBe(0);
    round = turnMemoryCard(round, second.id);
    expect(round.moves).toBe(1);
    expect(round.flipped).toHaveLength(2);
    expect(
      turnMemoryCard(
        round,
        round.cards.find((c) => !round.flipped.includes(c.id))!.id,
      ),
    ).toBe(round);
    round = hideMemoryMismatch(round);
    expect(round.flipped).toHaveLength(0);
    expect(round.matched).toHaveLength(0);
    expect(round.moves).toBe(1);
  });
  it("wins only after all translation pairs are matched", () => {
    let round = createMemoryRound(words, 4);
    for (const word of new Set(round.cards.map((c) => c.pairId))) {
      for (const card of round.cards.filter((c) => c.pairId === word))
        round = turnMemoryCard(round, card.id);
    }
    expect(round.phase).toBe("won");
    expect(round.moves).toBe(4);
    expect(round.matched).toHaveLength(4);
    expect(turnMemoryCard(round, round.cards[0].id)).toBe(round);
  });
});
describe("falling word game", () => {
  it("accepts only visible words, ignores case, and does not remove a heart for a typo", () => {
    const round = createTypingRound(pool, "calm");
    const wrong = typeWord(round, "not-a-visible-word");
    expect(wrong.correct).toBe(0);
    expect(wrong.lives).toBe(3);
    expect(wrong.mistakes).toBe(1);
    const correct = typeWord(
      wrong,
      ` ${round.active[0].word.en.toUpperCase()} `,
    );
    expect(correct.correct).toBe(1);
    expect(correct.active).toHaveLength(1);
    expect(correct.active[0].id).not.toBe(round.active[0].id);
  });
  it("wins after ten distinct captures and stops all expiration afterwards", () => {
    let round = createTypingRound(pool, "steady");
    for (let i = 0; i < typingGoal; i++)
      round = typeWord(round, round.active[0].word.en);
    expect(round.correct).toBe(10);
    expect(round.phase).toBe("won");
    expect(advanceTyping(round, 100000)).toBe(round);
  });
  it("loses when three words expire and cannot accept a late answer", () => {
    let round = createTypingRound(pool, "fast");
    const expiredWord = round.active[0].word.en;
    round = advanceTyping(round, typingPaces.fast.lifetimeMs + 1);
    expect(round.lives).toBe(2);
    expect(typeWord(round, expiredWord).correct).toBe(0);
    round = advanceTyping(round, typingPaces.fast.lifetimeMs + 1);
    round = advanceTyping(round, typingPaces.fast.lifetimeMs + 1);
    expect(round.lives).toBe(0);
    expect(round.phase).toBe("lost");
    expect(typeWord(round, round.active[0]?.word.en || "sink")).toBe(round);
  });
  it("never puts more than three words in the arena or reuses an occupied lane", () => {
    let round = createTypingRound(pool, "calm");
    for (let i = 0; i < 8; i++) round = advanceTyping(round, 1000);
    expect(round.active).toHaveLength(3);
    expect(new Set(round.active.map((w) => w.lane)).size).toBe(3);
    expect(advanceTyping(round, -100)).toBe(round);
  });
});
describe("secret word", () => {
  const sink = words.find((w) => w.en === "sink")!;
  it("repeated and invalid letters do not spend chances; complete guesses win", () => {
    let round = createSecretRound(sink);
    round = guessLetter(round, "Z");
    expect(round.lives).toBe(5);
    expect(guessLetter(round, "z")).toBe(round);
    expect(guessLetter(round, "7")).toBe(round);
    for (const letter of "SINK") round = guessLetter(round, letter);
    expect(round.phase).toBe("won");
    expect(round.lives).toBe(5);
  });
  it("ends after six different missing letters", () => {
    let round = createSecretRound(sink);
    for (const letter of "abcdef") round = guessLetter(round, letter);
    expect(round.lives).toBe(0);
    expect(round.phase).toBe("lost");
    expect(guessLetter(round, "s")).toBe(round);
  });
});
describe("casual records and course boundaries", () => {
  beforeEach(() => localStorage.clear());
  it("keeps records by game and difficulty and improves only a winning record", () => {
    let records = addGameResult({}, "memory-4", true, 8);
    records = addGameResult(records, "memory-4", true, 5);
    records = addGameResult(records, "memory-4", false, 1);
    records = addGameResult(records, "typing-fast", true, 15000);
    expect(records["memory-4"]).toEqual({ played: 3, wins: 2, best: 5 });
    expect(records["typing-fast"]?.best).toBe(15000);
    expect(records["memory-6"]).toBeUndefined();
  });
  it("validates its own storage without reading or changing the academic journal", () => {
    localStorage.setItem(
      "english-path-write-ahead-v1",
      "academic-data-untouched",
    );
    localStorage.setItem(
      gameRecordsKey,
      JSON.stringify({
        version: 1,
        records: {
          secret: { played: 2, wins: 7, best: -1 },
          "memory-4": { played: 1, wins: 1, best: 4 },
        },
      }),
    );
    expect(readGameRecords()).toEqual({
      "memory-4": { played: 1, wins: 1, best: 4 },
    });
    expect(localStorage.getItem("english-path-write-ahead-v1")).toBe(
      "academic-data-untouched",
    );
    localStorage.setItem(gameRecordsKey, "broken json");
    expect(readGameRecords()).toEqual({});
  });
  it("excludes the game hub and all game routes from the study clock", () => {
    for (const path of [
      "/games",
      "/games/memory",
      "/games/typing",
      "/games/secret-word",
    ])
      expect(isCasualRoute(path)).toBe(true);
    for (const path of ["/course", "/lesson/simple-past", "/gamesmanship"])
      expect(isCasualRoute(path)).toBe(false);
  });
});
