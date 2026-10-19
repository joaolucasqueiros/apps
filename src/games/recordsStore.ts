export const gameRecordsKey = "english-path-casual-games-v1";
export const recordKeys = [
  "memory-4",
  "memory-6",
  "memory-8",
  "typing-calm",
  "typing-steady",
  "typing-fast",
  "secret",
  "anagram-1",
  "anagram-2",
  "anagram-3",
  "search-1",
  "search-2",
  "search-3",
  "sentence-1",
  "sentence-2",
  "sentence-3",
  "sprint-1",
  "sprint-2",
  "sprint-3",
] as const;
export type RecordKey = (typeof recordKeys)[number];
export interface GameRecord {
  played: number;
  wins: number;
  best: number | null;
}
export type GameRecords = Partial<Record<RecordKey, GameRecord>>;
export interface RoundStats {
  correct: number;
  total: number;
  score?: number;
}
export interface GameEvent {
  id: string;
  key: RecordKey;
  won: boolean;
  value: number;
  correct: number;
  total: number;
  xp: number;
  date: string;
  day: string;
}
export interface GameData {
  version: 2;
  legacy: GameRecords;
  legacyXp: number;
  events: GameEvent[];
}
export interface GameSnapshot {
  data: GameData;
  records: GameRecords;
  xp: number;
  storageError: string;
}
const empty = (): GameData => ({
  version: 2,
  legacy: {},
  legacyXp: 0,
  events: [],
});
const natural = (v: unknown): v is number =>
  typeof v === "number" && Number.isSafeInteger(v) && v >= 0;
const finite = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v) && v >= 0;
function parseRecords(raw: unknown): GameRecords {
  if (!raw || typeof raw !== "object") return {};
  const result: GameRecords = {};
  for (const key of recordKeys) {
    const r = (raw as GameRecords)[key];
    if (
      r &&
      natural(r.played) &&
      natural(r.wins) &&
      r.wins <= r.played &&
      (r.best === null || finite(r.best))
    )
      result[key] = { played: r.played, wins: r.wins, best: r.best };
  }
  return result;
}
export function parseGameData(raw: unknown): GameData {
  if (!raw || typeof raw !== "object") return empty();
  const r = raw as Record<string, unknown>;
  if (r.version === 1) {
    const legacy = parseRecords(r.records);
    return {
      version: 2,
      legacy,
      legacyXp: Object.values(legacy).reduce((n, r) => n + r.wins * 40, 0),
      events: [],
    };
  }
  if (
    r.version !== 2 ||
    !Array.isArray(r.events) ||
    r.events.length > 100000 ||
    !natural(r.legacyXp)
  )
    return empty();
  const events: GameEvent[] = [];
  const ids = new Set<string>();
  for (const value of r.events) {
    if (!value || typeof value !== "object") continue;
    const e = value as GameEvent;
    if (
      typeof e.id !== "string" ||
      !e.id.length ||
      e.id.length > 160 ||
      ids.has(e.id) ||
      !recordKeys.includes(e.key) ||
      typeof e.won !== "boolean" ||
      !finite(e.value) ||
      !natural(e.correct) ||
      !natural(e.total) ||
      e.correct > e.total ||
      !natural(e.xp) ||
      e.xp > 150 ||
      typeof e.date !== "string" ||
      !Number.isFinite(Date.parse(e.date)) ||
      typeof e.day !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(e.day)
    )
      continue;
    ids.add(e.id);
    events.push({ ...e });
  }
  return {
    version: 2,
    legacy: parseRecords(r.legacy),
    legacyXp: r.legacyXp,
    events,
  };
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
        won && finite(value)
          ? Math.min(previous.best ?? Infinity, value)
          : previous.best,
    },
  };
}
export function aggregateGames(data: GameData): GameRecords {
  return data.events.reduce(
    (records, e) => addGameResult(records, e.key, e.won, e.value),
    data.legacy,
  );
}
export function localDay(date = new Date()) {
  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0")
  );
}
export function roundXp(
  key: RecordKey,
  won: boolean,
  correct: number,
  total: number,
) {
  if (!won) return Math.min(10, correct * 2);
  const tier =
    key === "memory-8" || key === "typing-fast" || key.endsWith("-3")
      ? 3
      : key === "memory-6" || key === "typing-steady" || key.endsWith("-2")
        ? 2
        : 1;
  return (
    30 + tier * 10 + Math.round((total ? Math.min(1, correct / total) : 0) * 20)
  );
}
export function appendGameEvent(
  data: GameData,
  id: string,
  key: RecordKey,
  won: boolean,
  value: number,
  stats?: RoundStats,
  now = new Date(),
): GameData {
  if (
    data.events.some((e) => e.id === id) ||
    !id ||
    !recordKeys.includes(key) ||
    !finite(value)
  )
    return data;
  const correct = natural(stats?.correct) ? stats.correct : won ? 1 : 0;
  const total = natural(stats?.total)
    ? Math.max(correct, stats.total)
    : Math.max(1, correct);
  const day = localDay(now),
    daily = won && !data.events.some((e) => e.won && e.day === day) ? 25 : 0;
  const event: GameEvent = {
    id,
    key,
    won,
    value,
    correct,
    total,
    xp: roundXp(key, won, correct, total) + daily,
    date: now.toISOString(),
    day,
  };
  return { ...data, events: [...data.events, event] };
}
export function mergeGameData(a: GameData, b: GameData): GameData {
  const legacy: GameRecords = {};
  for (const key of recordKeys) {
    const x = a.legacy[key],
      y = b.legacy[key];
    if (x || y)
      legacy[key] = {
        played: Math.max(x?.played || 0, y?.played || 0),
        wins: Math.max(x?.wins || 0, y?.wins || 0),
        best:
          x?.best == null
            ? (y?.best ?? null)
            : y?.best == null
              ? x.best
              : Math.min(x.best, y.best),
      };
  }
  return {
    version: 2,
    legacy,
    legacyXp: Math.max(a.legacyXp, b.legacyXp),
    events: [
      ...new Map([...a.events, ...b.events].map((e) => [e.id, e])).values(),
    ].sort((x, y) => x.date.localeCompare(y.date)),
  };
}
let rawCache: string | null | undefined;
let snapshot: GameSnapshot = {
  data: empty(),
  records: {},
  xp: 0,
  storageError: "",
};
const listeners = new Set<() => void>();
function fromData(data: GameData, error = ""): GameSnapshot {
  return {
    data,
    records: aggregateGames(data),
    xp: data.legacyXp + data.events.reduce((n, e) => n + e.xp, 0),
    storageError: error,
  };
}
export function getGameSnapshot(): GameSnapshot {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(gameRecordsKey);
  } catch {
    return snapshot;
  }
  if (raw !== rawCache) {
    rawCache = raw;
    try {
      snapshot = fromData(parseGameData(JSON.parse(raw || "null")));
    } catch {
      snapshot = fromData(empty());
    }
  }
  return snapshot;
}
export function readGameRecords(): GameRecords {
  return getGameSnapshot().records;
}
function notify() {
  listeners.forEach((fn) => fn());
}
export function subscribeGames(fn: () => void) {
  listeners.add(fn);
  const changed = (e: StorageEvent) => {
    if (e.key === gameRecordsKey || e.key === null) {
      rawCache = undefined;
      notify();
    }
  };
  window.addEventListener("storage", changed);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", changed);
  };
}
function commit(data: GameData) {
  const records = aggregateGames(data);
  let error = "";
  try {
    const raw = JSON.stringify({ ...data, records });
    localStorage.setItem(gameRecordsKey, raw);
    rawCache = raw;
  } catch {
    error =
      "Você jogou e os pontos estão nesta sessão, mas o navegador não conseguiu guardá-los. Exporte um backup no perfil antes de sair.";
  }
  snapshot = fromData(data, error);
  notify();
}
export function finishGame(
  id: string,
  key: RecordKey,
  won: boolean,
  value: number,
  stats?: RoundStats,
) {
  const data = getGameSnapshot().data,
    next = appendGameEvent(data, id, key, won, value, stats);
  if (next !== data) commit(next);
}
export function validateGameBackup(raw: unknown): GameData {
  const r = raw as GameData;
  if (
    !r ||
    typeof r !== "object" ||
    r.version !== 2 ||
    !natural(r.legacyXp) ||
    !r.legacy ||
    typeof r.legacy !== "object" ||
    Array.isArray(r.legacy) ||
    !Array.isArray(r.events)
  )
    throw Error("Backup de jogos inválido.");
  const parsed = parseGameData(raw);
  if (
    parsed.events.length !== r.events.length ||
    Object.keys(parsed.legacy).length !== Object.keys(r.legacy).length
  )
    throw Error("Backup de jogos inválido.");
  return parsed;
}
export function restoreGameProgress(raw: unknown) {
  const data = validateGameBackup(raw);
  commit(mergeGameData(getGameSnapshot().data, data));
}
