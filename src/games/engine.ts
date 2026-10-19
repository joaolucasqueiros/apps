import type { Word } from "../types";

export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export type GamePhase = "playing" | "won" | "lost";
export interface MemoryCard {
  id: string;
  pairId: string;
  side: "en" | "pt";
  text: string;
}
export interface MemoryRound {
  id: string;
  cards: MemoryCard[];
  flipped: string[];
  matched: string[];
  moves: number;
  phase: GamePhase;
}
export function createMemoryRound(
  pool: readonly Word[],
  pairs: number,
  random = Math.random,
): MemoryRound {
  const selected = shuffle(pool, random).slice(0, pairs);
  return {
    id: crypto.randomUUID(),
    cards: shuffle(
      selected.flatMap((w) => [
        { id: `${w.id}-en`, pairId: w.id, side: "en" as const, text: w.en },
        { id: `${w.id}-pt`, pairId: w.id, side: "pt" as const, text: w.pt },
      ]),
      random,
    ),
    flipped: [],
    matched: [],
    moves: 0,
    phase: "playing",
  };
}
export function turnMemoryCard(round: MemoryRound, id: string): MemoryRound {
  const card = round.cards.find((c) => c.id === id);
  if (
    !card ||
    round.phase !== "playing" ||
    round.flipped.length === 2 ||
    round.flipped.includes(id) ||
    round.matched.includes(card.pairId)
  )
    return round;
  if (!round.flipped.length) return { ...round, flipped: [id] };
  const other = round.cards.find((c) => c.id === round.flipped[0])!;
  if (other.pairId === card.pairId) {
    const matched = [...round.matched, card.pairId];
    return {
      ...round,
      matched,
      flipped: [],
      moves: round.moves + 1,
      phase: matched.length === round.cards.length / 2 ? "won" : "playing",
    };
  }
  return { ...round, flipped: [...round.flipped, id], moves: round.moves + 1 };
}
export function hideMemoryMismatch(round: MemoryRound): MemoryRound {
  return round.flipped.length === 2 ? { ...round, flipped: [] } : round;
}

export const typingPaces = {
  calm: { label: "Tranquilo", lifetimeMs: 16000, spawnMs: 3800 },
  steady: { label: "No ritmo", lifetimeMs: 11000, spawnMs: 2800 },
  fast: { label: "Turbo", lifetimeMs: 7500, spawnMs: 1800 },
} as const;
export type TypingPace = keyof typeof typingPaces;
export interface FallingWord {
  id: string;
  word: Word;
  remainingMs: number;
  lane: number;
}
export interface TypingRound {
  id: string;
  pace: TypingPace;
  queue: Word[];
  next: number;
  active: FallingWord[];
  lives: number;
  correct: number;
  mistakes: number;
  elapsedMs: number;
  untilSpawnMs: number;
  phase: GamePhase;
}
export const typingGoal = 10;
function spawnTypingWord(round: TypingRound): TypingRound {
  if (round.next >= round.queue.length || round.active.length >= 3)
    return round;
  const usedLanes = new Set(round.active.map((w) => w.lane));
  const lane = [0, 1, 2].find((n) => !usedLanes.has(n))!;
  return {
    ...round,
    next: round.next + 1,
    untilSpawnMs: typingPaces[round.pace].spawnMs,
    active: [
      ...round.active,
      {
        id: `falling-${round.next}`,
        word: round.queue[round.next],
        remainingMs: typingPaces[round.pace].lifetimeMs,
        lane,
      },
    ],
  };
}
export function createTypingRound(
  pool: readonly Word[],
  pace: TypingPace,
  random = Math.random,
): TypingRound {
  return spawnTypingWord({
    id: crypto.randomUUID(),
    pace,
    queue: shuffle(pool, random),
    next: 0,
    active: [],
    lives: 3,
    correct: 0,
    mistakes: 0,
    elapsedMs: 0,
    untilSpawnMs: 0,
    phase: "playing",
  });
}
export function advanceTyping(
  round: TypingRound,
  deltaMs: number,
): TypingRound {
  if (round.phase !== "playing" || !Number.isFinite(deltaMs) || deltaMs <= 0)
    return round;
  const words = round.active.map((w) => ({
    ...w,
    remainingMs: w.remainingMs - deltaMs,
  }));
  const expired = words.filter((w) => w.remainingMs <= 0).length;
  const lives = Math.max(0, round.lives - expired);
  const updated: TypingRound = {
    ...round,
    active: words.filter((w) => w.remainingMs > 0),
    lives,
    elapsedMs: round.elapsedMs + deltaMs,
    untilSpawnMs: round.untilSpawnMs - deltaMs,
    phase: lives === 0 ? "lost" : "playing",
  };
  if (updated.phase === "lost") return updated;
  return updated.untilSpawnMs <= 0 || !updated.active.length
    ? spawnTypingWord(updated)
    : updated;
}
export function typeWord(round: TypingRound, input: string): TypingRound {
  if (round.phase !== "playing" || !input.trim()) return round;
  const normalized = input.trim().toLocaleLowerCase("en");
  const match = round.active.find(
    (w) => w.word.en.toLocaleLowerCase("en") === normalized,
  );
  if (!match) return { ...round, mistakes: round.mistakes + 1 };
  const correct = round.correct + 1;
  const next: TypingRound = {
    ...round,
    correct,
    active: round.active.filter((w) => w.id !== match.id),
    phase: correct >= typingGoal ? "won" : "playing",
  };
  return !next.active.length && next.phase === "playing"
    ? spawnTypingWord(next)
    : next;
}

export interface SecretRound {
  id: string;
  word: Word;
  guesses: string[];
  lives: number;
  phase: GamePhase;
}
export function createSecretRound(word: Word): SecretRound {
  return {
    id: crypto.randomUUID(),
    word,
    guesses: [],
    lives: 6,
    phase: "playing",
  };
}
export function guessLetter(round: SecretRound, input: string): SecretRound {
  const letter = input.toLowerCase();
  if (
    round.phase !== "playing" ||
    !/^[a-z]$/.test(letter) ||
    round.guesses.includes(letter)
  )
    return round;
  const guesses = [...round.guesses, letter];
  const lives =
    round.lives - (round.word.en.toLowerCase().includes(letter) ? 0 : 1);
  const complete = [...round.word.en.toLowerCase()].every((c) =>
    guesses.includes(c),
  );
  return {
    ...round,
    guesses,
    lives,
    phase: complete ? "won" : lives === 0 ? "lost" : "playing",
  };
}

export const isCasualRoute = (path: string) =>
  path === "/games" || path.startsWith("/games/");
