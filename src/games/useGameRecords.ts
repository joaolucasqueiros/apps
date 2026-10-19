import { useCallback, useRef, useState } from "react";

export const gameRecordsKey = "english-path-casual-games-v1";
export const recordKeys = [
  "memory-4",
  "memory-6",
  "memory-8",
  "typing-calm",
  "typing-steady",
  "typing-fast",
  "secret",
] as const;
export type RecordKey = (typeof recordKeys)[number];
export interface GameRecord {
  played: number;
  wins: number;
  best: number | null;
}
export type GameRecords = Partial<Record<RecordKey, GameRecord>>;
export function readGameRecords(): GameRecords {
  try {
    const raw = JSON.parse(localStorage.getItem(gameRecordsKey) || "null");
    if (
      !raw ||
      raw.version !== 1 ||
      !raw.records ||
      typeof raw.records !== "object"
    )
      return {};
    const result: GameRecords = {};
    for (const key of recordKeys) {
      const r = raw.records[key];
      if (
        r &&
        Number.isInteger(r.played) &&
        r.played >= 0 &&
        Number.isInteger(r.wins) &&
        r.wins >= 0 &&
        r.wins <= r.played &&
        (r.best === null ||
          (typeof r.best === "number" &&
            Number.isFinite(r.best) &&
            r.best >= 0))
      )
        result[key] = { played: r.played, wins: r.wins, best: r.best };
    }
    return result;
  } catch {
    return {};
  }
}
export function addGameResult(
  records: GameRecords,
  key: RecordKey,
  won: boolean,
  value: number,
): GameRecords {
  const previous = records[key] || { played: 0, wins: 0, best: null };
  return {
    ...records,
    [key]: {
      played: previous.played + 1,
      wins: previous.wins + (won ? 1 : 0),
      best:
        won && Number.isFinite(value) && value >= 0
          ? Math.min(previous.best ?? Infinity, value)
          : previous.best,
    },
  };
}
export function useGameRecords() {
  const [records, setRecords] = useState(readGameRecords);
  const [storageError, setStorageError] = useState("");
  const completed = useRef(new Set<string>());
  const finish = useCallback(
    (id: string, key: RecordKey, won: boolean, value: number) => {
      if (completed.current.has(id)) return;
      completed.current.add(id);
      const next = addGameResult(readGameRecords(), key, won, value);
      setRecords(next);
      try {
        localStorage.setItem(
          gameRecordsKey,
          JSON.stringify({ version: 1, records: next }),
        );
      } catch {
        setStorageError(
          "Você terminou a partida, mas o navegador não pôde guardar o recorde.",
        );
      }
    },
    [],
  );
  return { records, finish, storageError };
}
