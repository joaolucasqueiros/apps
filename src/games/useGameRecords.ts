import { useSyncExternalStore } from "react";
import { finishGame, getGameSnapshot, subscribeGames } from "./recordsStore";
export {
  gameRecordsKey,
  recordKeys,
  readGameRecords,
  addGameResult,
} from "./recordsStore";
export type {
  GameRecord,
  GameRecords,
  RecordKey,
  RoundStats,
  GameEvent,
} from "./recordsStore";
export function useGameRecords() {
  const snapshot = useSyncExternalStore(
    subscribeGames,
    getGameSnapshot,
    getGameSnapshot,
  );
  return { ...snapshot, finish: finishGame };
}
