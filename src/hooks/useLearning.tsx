import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { LearningState } from "../types";
import {
  emptyState,
  loadState,
  saveState,
  stageState,
} from "../persistence/store";
import { uid } from "../utils/learning";
type Value = {
  state: LearningState;
  update: (fn: (s: LearningState) => LearningState) => void;
  replace: (s: LearningState) => void;
  notice: string;
  notify: (s: string) => void;
  flush: () => Promise<void>;
};
const Context = createContext<Value | null>(null);
export function LearningProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(emptyState);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [notice, notify] = useState("");
  const latest = useRef(state);
  const writes = useRef(Promise.resolve());
  useEffect(() => {
    loadState()
      .then((s) => {
        latest.current = s;
        setState(s);
        setReady(true);
      })
      .catch(() =>
        setError(
          "Não foi possível abrir o armazenamento local. Habilite IndexedDB e recarregue a página.",
        ),
      );
  }, []);
  function replace(s: LearningState) {
    try {
      stageState(s);
    } catch {
      notify(
        "A gravação imediata não está disponível. Aguarde a gravação no banco e exporte um backup antes de sair.",
      );
    }
    latest.current = s;
    setState(s);
    writes.current = writes.current
      .catch(() => {})
      .then(() => saveState(s))
      .catch(() => {
        notify(
          "Não foi possível salvar. Exporte um backup antes de fechar a página.",
        );
        throw new Error("Falha ao salvar dados.");
      });
    void writes.current.catch(() => {});
  }
  const update = (fn: (s: LearningState) => LearningState) =>
    replace({ ...fn(latest.current), updatedAt: new Date().toISOString() });
  useEffect(() => {
    if (!ready) return;
    let active = Date.now();
    let seconds = 0;
    const tick = () => {
      const now = Date.now();
      if (document.visibilityState === "visible")
        seconds += Math.min((now - active) / 1000, 35);
      active = now;
      if (seconds >= 30) {
        const amount = Math.floor(seconds);
        seconds = 0;
        update((s) => ({
          ...s,
          sessions: [
            ...s.sessions,
            { id: uid(), date: new Date().toISOString(), seconds: amount },
          ],
        }));
      }
    };
    const timer = setInterval(tick, 30000);
    const flush = () => {
      tick();
      if (seconds > 0) {
        const amount = Math.floor(seconds);
        seconds = 0;
        if (amount)
          update((s) => ({
            ...s,
            sessions: [
              ...s.sessions,
              { id: uid(), date: new Date().toISOString(), seconds: amount },
            ],
          }));
      }
    };
    document.addEventListener("visibilitychange", flush);
    window.addEventListener("pagehide", flush);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", flush);
      window.removeEventListener("pagehide", flush);
    };
  }, [ready]);
  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => notify(""), 6000);
    return () => clearTimeout(id);
  }, [notice]);
  useEffect(() => {
    const theme = state.profile.theme;
    document.documentElement.dataset.theme =
      theme === "system"
        ? matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;
  }, [state.profile.theme]);
  if (error)
    return (
      <main className="fatal">
        <h1>Precisamos do armazenamento local</h1>
        <p role="alert">{error}</p>
        <button onClick={() => location.reload()}>Tentar novamente</button>
      </main>
    );
  if (!ready)
    return (
      <main className="loading" role="status">
        Preparando seu caminho…
      </main>
    );
  return (
    <Context.Provider
      value={{
        state,
        update,
        replace,
        notice,
        notify,
        flush: () => writes.current,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useLearning() {
  const value = useContext(Context);
  if (!value) throw Error("Provider ausente");
  return value;
}
