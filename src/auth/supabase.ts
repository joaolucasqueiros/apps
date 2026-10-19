import { createClient } from "@supabase/supabase-js";
import type { LearningState } from "../types";
import { validateBackup } from "../persistence/store";
import { mergeStates } from "../utils/learning";
const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
export const supabase =
  url && key && /^https:\/\//.test(url) ? createClient(url, key) : null;
export async function synchronize(
  local: LearningState,
): Promise<LearningState> {
  if (!supabase)
    throw Error(
      "Sincronização não configurada. O modo local continua funcionando.",
    );
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw Error("Entre na sua conta para sincronizar.");
  let merged = local;
  for (let i = 0; i < 3; i++) {
    const { data, error } = await supabase
      .from("learning_states")
      .select("payload,version")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error)
      throw Error(`Não foi possível ler os dados remotos: ${error.message}`);
    if (data) merged = mergeStates(merged, validateBackup(data.payload));
    const { error: writeError } = await supabase.rpc("sync_learning_state", {
      expected_version: data?.version || 0,
      in_payload: merged,
    });
    if (!writeError) return merged;
    if (writeError.message.includes("sync_conflict")) continue;
    throw Error(`Não foi possível sincronizar: ${writeError.message}`);
  }
  throw Error(
    "Outro dispositivo está atualizando os dados. Tente sincronizar novamente. Os dados locais continuam preservados.",
  );
}
