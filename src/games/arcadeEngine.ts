import { shuffle, type GamePhase } from "./engine";
import type { Word } from "../types";
export type ArcadeStage = 1 | 2 | 3;
export interface AnagramRound {
  id: string;
  queue: Word[];
  index: number;
  tiles: { id: number; letter: string }[];
  selected: number[];
  correct: number;
  mistakes: number;
  checked: boolean;
  phase: GamePhase;
  stage: ArcadeStage;
}
const single = (words: readonly Word[], max: number) =>
  words.filter((w) => new RegExp("^[a-z]{3," + max + "}$").test(w.en));
function letterTiles(word: Word, random: () => number) {
  let chars = shuffle([...word.en], random);
  if (chars.join("") === word.en && new Set(chars).size > 1)
    chars = [...chars.slice(1), chars[0]];
  return chars.map((letter, id) => ({ letter, id }));
}
export function createAnagram(
  words: readonly Word[],
  stage: ArcadeStage,
  random = Math.random,
): AnagramRound {
  const queue = shuffle(
    single(words, stage === 1 ? 5 : stage === 2 ? 7 : 10),
    random,
  ).slice(0, 5);
  return {
    id: crypto.randomUUID(),
    queue,
    index: 0,
    tiles: letterTiles(queue[0], random),
    selected: [],
    correct: 0,
    mistakes: 0,
    checked: false,
    phase: "playing",
    stage,
  };
}
export function selectAnagram(round: AnagramRound, id: number): AnagramRound {
  if (
    round.phase !== "playing" ||
    round.checked ||
    round.selected.includes(id) ||
    !round.tiles.some((t) => t.id === id)
  )
    return round;
  return { ...round, selected: [...round.selected, id] };
}
export function checkAnagram(round: AnagramRound): AnagramRound {
  if (
    round.phase !== "playing" ||
    round.checked ||
    round.selected.length !== round.tiles.length
  )
    return round;
  const answer = round.selected
    .map((id) => round.tiles.find((t) => t.id === id)!.letter)
    .join("");
  if (answer !== round.queue[round.index].en)
    return { ...round, mistakes: round.mistakes + 1, selected: [] };
  return {
    ...round,
    correct: round.correct + 1,
    checked: true,
    phase: round.index === round.queue.length - 1 ? "won" : "playing",
  };
}
export function nextAnagram(round: AnagramRound): AnagramRound {
  if (!round.checked || round.phase !== "playing") return round;
  const index = round.index + 1;
  return {
    ...round,
    index,
    tiles: letterTiles(round.queue[index], Math.random),
    selected: [],
    checked: false,
  };
}
export interface Phrase {
  id: string;
  en: string;
  pt: string;
  level: string;
}
export interface SentenceRound {
  id: string;
  queue: Phrase[];
  index: number;
  tiles: { id: number; text: string }[];
  selected: number[];
  correct: number;
  mistakes: number;
  checked: boolean;
  phase: GamePhase;
  stage: ArcadeStage;
}
function phraseTiles(phrase: Phrase, random: () => number) {
  const items = phrase.en.split(" ").map((text, id) => ({ id, text }));
  let tiles = shuffle(items, random);
  if (tiles.every((t, i) => t.id === i)) tiles = [...tiles.slice(1), tiles[0]];
  return tiles;
}
export function createSentence(
  phrases: readonly Phrase[],
  stage: ArcadeStage,
  random = Math.random,
): SentenceRound {
  const available = phrases.filter((p) =>
    stage === 1
      ? p.level === "A1"
      : stage === 2
        ? p.level === "A2"
        : ["B1", "B2", "C1"].includes(p.level),
  );
  const queue = shuffle(available, random).slice(0, 5);
  return {
    id: crypto.randomUUID(),
    queue,
    index: 0,
    tiles: phraseTiles(queue[0], random),
    selected: [],
    correct: 0,
    mistakes: 0,
    checked: false,
    phase: "playing",
    stage,
  };
}
export function selectSentence(
  round: SentenceRound,
  id: number,
): SentenceRound {
  if (
    round.phase !== "playing" ||
    round.checked ||
    round.selected.includes(id) ||
    !round.tiles.some((t) => t.id === id)
  )
    return round;
  return { ...round, selected: [...round.selected, id] };
}
export function checkSentence(round: SentenceRound): SentenceRound {
  if (
    round.phase !== "playing" ||
    round.checked ||
    round.selected.length !== round.tiles.length
  )
    return round;
  const answer = round.selected
    .map((id) => round.tiles.find((t) => t.id === id)!.text)
    .join(" ");
  if (answer !== round.queue[round.index].en)
    return { ...round, mistakes: round.mistakes + 1 };
  return {
    ...round,
    correct: round.correct + 1,
    checked: true,
    phase: round.index === round.queue.length - 1 ? "won" : "playing",
  };
}
export function nextSentence(round: SentenceRound): SentenceRound {
  if (!round.checked || round.phase !== "playing") return round;
  const index = round.index + 1;
  return {
    ...round,
    index,
    tiles: phraseTiles(round.queue[index], Math.random),
    selected: [],
    checked: false,
  };
}
export interface SearchPlacement {
  word: Word;
  cells: number[];
}
export interface SearchRound {
  id: string;
  grid: string[];
  size: number;
  placements: SearchPlacement[];
  found: string[];
  misses: number;
  phase: GamePhase;
  stage: ArcadeStage;
}
export function createSearch(
  words: readonly Word[],
  stage: ArcadeStage,
  random = Math.random,
): SearchRound {
  const size = 8,
    grid = Array<string>(size * size).fill(""),
    placements: SearchPlacement[] = [];
  const directions =
    stage === 1
      ? [[1, 0]]
      : stage === 2
        ? [
            [1, 0],
            [0, 1],
          ]
        : [
            [1, 0],
            [0, 1],
            [1, 1],
            [-1, 1],
          ];
  const count = stage === 1 ? 4 : stage === 2 ? 5 : 6;
  const candidates = shuffle(single(words, stage === 1 ? 5 : 7), random);
  for (const word of candidates) {
    if (placements.length >= count) break;
    const possibilities: { cells: number[]; overlap: number }[] = [];
    for (const [dx, dy] of directions)
      for (let row = 0; row < size; row++)
        for (let col = 0; col < size; col++) {
          const endX = col + dx * (word.en.length - 1),
            endY = row + dy * (word.en.length - 1);
          if (endX < 0 || endX >= size || endY < 0 || endY >= size) continue;
          const cells = [...word.en].map(
            (_, i) => (row + dy * i) * size + col + dx * i,
          );
          if (
            cells.every(
              (cell, i) =>
                !grid[cell] || grid[cell] === word.en[i].toUpperCase(),
            )
          )
            possibilities.push({
              cells,
              overlap: cells.filter((c) => !!grid[c]).length,
            });
        }
    if (!possibilities.length) continue;
    const possible = possibilities[Math.floor(random() * possibilities.length)];
    possible.cells.forEach((cell, i) => {
      grid[cell] = word.en[i].toUpperCase();
    });
    placements.push({ word, cells: possible.cells });
  }
  return {
    id: crypto.randomUUID(),
    size,
    grid: grid.map(
      (letter) =>
        letter || "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(random() * 26)],
    ),
    placements,
    found: [],
    misses: 0,
    phase: "playing",
    stage,
  };
}
export function straightCells(
  first: number,
  last: number,
  size: number,
): number[] {
  if (
    !Number.isInteger(first) ||
    !Number.isInteger(last) ||
    first < 0 ||
    last < 0 ||
    first >= size * size ||
    last >= size * size
  )
    return [];
  const x1 = first % size,
    y1 = Math.floor(first / size),
    x2 = last % size,
    y2 = Math.floor(last / size),
    dx = x2 - x1,
    dy = y2 - y1;
  if (dx !== 0 && dy !== 0 && Math.abs(dx) !== Math.abs(dy)) return [];
  const length = Math.max(Math.abs(dx), Math.abs(dy)) + 1,
    sx = Math.sign(dx),
    sy = Math.sign(dy);
  return Array.from({ length }, (_, i) => (y1 + sy * i) * size + x1 + sx * i);
}
export function selectSearch(
  round: SearchRound,
  first: number,
  last: number,
): SearchRound {
  if (round.phase !== "playing") return round;
  const cells = straightCells(first, last, round.size);
  const selected = cells
    .map((cell) => round.grid[cell])
    .join("")
    .toLowerCase();
  const match = round.placements.find(
    (p) =>
      !round.found.includes(p.word.id) &&
      (selected === p.word.en ||
        [...selected].reverse().join("") === p.word.en),
  );
  if (!match) return { ...round, misses: round.misses + 1 };
  const found = [...round.found, match.word.id];
  return {
    ...round,
    found,
    placements: round.placements.map((p) =>
      p.word.id === match.word.id ? { ...p, cells } : p,
    ),
    phase: found.length === round.placements.length ? "won" : "playing",
  };
}
export interface SprintQuestion {
  word: Word;
  options: Word[];
}
export interface SprintRound {
  id: string;
  queue: SprintQuestion[];
  index: number;
  correct: number;
  lives: number;
  checked: string | null;
  phase: GamePhase;
  stage: ArcadeStage;
}
export function createSprint(
  words: readonly Word[],
  stage: ArcadeStage,
  random = Math.random,
): SprintRound {
  const pool = words.filter((w) =>
    stage === 1
      ? /^[a-z]{3,6}$/.test(w.en)
      : stage === 2
        ? w.en.split(" ").length <= 2
        : true,
  );
  const chosen = shuffle(pool, random).slice(0, 8);
  const queue = chosen.map((word) => ({
    word,
    options: shuffle(
      [
        word,
        ...shuffle(
          pool.filter((p) => p.id !== word.id && p.pt !== word.pt),
          random,
        ).slice(0, stage === 3 ? 3 : 2),
      ],
      random,
    ),
  }));
  return {
    id: crypto.randomUUID(),
    queue,
    index: 0,
    correct: 0,
    lives: 3,
    checked: null,
    phase: "playing",
    stage,
  };
}
export function answerSprint(round: SprintRound, wordId: string): SprintRound {
  if (
    round.phase !== "playing" ||
    round.checked ||
    !round.queue[round.index].options.some((w) => w.id === wordId)
  )
    return round;
  const hit = round.queue[round.index].word.id === wordId,
    lives = round.lives - (hit ? 0 : 1);
  return {
    ...round,
    checked: wordId,
    correct: round.correct + (hit ? 1 : 0),
    lives,
    phase:
      lives === 0
        ? "lost"
        : round.index === round.queue.length - 1
          ? round.correct + (hit ? 1 : 0) >= 6
            ? "won"
            : "lost"
          : "playing",
  };
}
export function nextSprint(round: SprintRound): SprintRound {
  return round.checked && round.phase === "playing"
    ? { ...round, index: round.index + 1, checked: null }
    : round;
}
