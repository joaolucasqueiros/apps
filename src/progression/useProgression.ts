import { useMemo } from "react";
import { useLearning } from "../hooks/useLearning";
import { useGameRecords } from "../games/useGameRecords";
import { engagement } from "./engine";
export function useProgression() {
  const { state } = useLearning();
  const games = useGameRecords();
  return useMemo(() => engagement(state, games), [state, games.data]);
}
