import {
  useEffect,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Heart, Keyboard, Pause, Play, RotateCcw, Timer } from "lucide-react";
import { words } from "../content/vocabulary";
import {
  advanceTyping,
  createTypingRound,
  typeWord,
  typingGoal,
  typingPaces,
  type TypingPace,
  type TypingRound,
} from "./engine";
import { GameResult, GameShell } from "./GameShell";
import { useGameRecords } from "./useGameRecords";

const pool = words.filter((w) => /^[a-z]{3,10}$/.test(w.en));
type PlayState = { round: TypingRound | null; message: string };
type Action =
  | { type: "start"; round: TypingRound }
  | { type: "tick"; delta: number }
  | { type: "type"; input: string };
function reducer(state: PlayState, action: Action): PlayState {
  if (action.type === "start")
    return {
      round: action.round,
      message: "Digite uma palavra que aparece na tela e pressione Enter.",
    };
  if (!state.round) return state;
  if (action.type === "tick") {
    const round = advanceTyping(state.round, action.delta);
    return {
      round,
      message:
        round.lives < state.round.lives
          ? "Uma palavra escapou. Você pode continuar enquanto tiver corações."
          : state.message,
    };
  }
  const round = typeWord(state.round, action.input);
  return {
    round,
    message:
      round.correct > state.round.correct
        ? "Boa! Mais uma palavra capturada."
        : "Essa palavra não está na tela. Confira a escrita e tente de novo.",
  };
}

export function TypingGame() {
  const [pace, setPace] = useState<TypingPace>("calm");
  const [{ round, message }, dispatch] = useReducer(reducer, {
    round: null,
    message: "",
  });
  const [paused, setPaused] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const pauseRef = useRef<HTMLButtonElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const { records, finish, storageError } = useGameRecords();
  const playing = round?.phase === "playing";
  const start = () => {
    setPaused(false);
    setInput("");
    dispatch({ type: "start", round: createTypingRound(pool, pace) });
  };

  useEffect(() => {
    if (!playing || paused) return;
    let last = performance.now();
    const timer = setInterval(() => {
      const now = performance.now();
      dispatch({ type: "tick", delta: now - last });
      last = now;
    }, 100);
    return () => clearInterval(timer);
  }, [playing, paused, round?.id]);
  useEffect(() => {
    const visibility = () => {
      if (document.hidden) setPaused(true);
    };
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);
  useEffect(() => {
    if (!playing) return;
    if (paused) pauseRef.current?.focus();
    else inputRef.current?.focus();
  }, [playing, paused, round?.id]);
  useEffect(() => {
    if (!playing || paused) return;
    let frame = 0;
    const fitPhone = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const viewport = window.visualViewport;
        if (
          innerWidth > 700 ||
          (viewport?.height ?? innerHeight) >= 650 ||
          (viewport?.scale ?? 1) !== 1
        )
          return;
        const tools = toolsRef.current;
        if (tools)
          window.scrollTo({
            top: Math.max(
              0,
              tools.getBoundingClientRect().top + window.scrollY - 8,
            ),
            behavior: "instant",
          });
      });
    };
    fitPhone();
    window.visualViewport?.addEventListener("resize", fitPhone);
    window.addEventListener("resize", fitPhone);
    return () => {
      cancelAnimationFrame(frame);
      window.visualViewport?.removeEventListener("resize", fitPhone);
      window.removeEventListener("resize", fitPhone);
    };
  }, [playing, paused, round?.id]);
  useEffect(() => {
    if (round && round.phase !== "playing")
      finish(
        round.id,
        `typing-${round.pace}`,
        round.phase === "won",
        round.elapsedMs,
        {
          correct: round.correct,
          total: round.correct + round.mistakes + (3 - round.lives),
        },
      );
  }, [round, finish]);

  const best = records[`typing-${pace}`]?.best;
  return (
    <GameShell
      title="Chuva de palavras"
      description="As palavras aparecem, o relógio corre e seus dedos entram no jogo. Capture 10 para vencer."
    >
      <section className="panel game-settings">
        <label htmlFor="typing-pace">
          Velocidade
          <select
            id="typing-pace"
            value={pace}
            disabled={playing}
            onChange={(e) => setPace(e.target.value as TypingPace)}
          >
            {Object.entries(typingPaces).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label} · {value.lifetimeMs / 1000}s por palavra
              </option>
            ))}
          </select>
        </label>
        <button className="button" onClick={start}>
          {round ? <RotateCcw size={16} /> : <Keyboard size={17} />}{" "}
          {round ? "Recomeçar digitação" : "Começar digitação"}
        </button>
        <p className="game-personal-best">
          Seu melhor tempo ativo:{" "}
          <strong>
            {best == null
              ? "ainda por descobrir"
              : `${Math.max(1, Math.ceil(best / 1000))}s`}
          </strong>
        </p>
      </section>
      {!round ? (
        <div className="game-welcome typing-welcome">
          <div className="typing-preview" aria-hidden="true">
            <span>keyboard</span>
            <span>sunrise</span>
            <span>family</span>
            <Keyboard size={44} />
          </div>
          <h2>Olhos na tela. Dedos no inglês.</h2>
          <p>
            Digite qualquer palavra visível e pressione Enter ou Enviar. Cada
            palavra que sai da tela custa um coração; com 10 acertos, você
            vence. Uma digitação incorreta pode ser corrigida sem perder
            corações.
          </p>
          <small>
            Você pode pausar. A partida também pausa automaticamente ao trocar
            de aba.
          </small>
        </div>
      ) : (
        <>
          <div className="game-scoreboard">
            <div>
              <span>Palavras capturadas</span>
              <strong>
                {round.correct} <small>/ {typingGoal}</small>
              </strong>
            </div>
            <div>
              <span>Corações</span>
              <strong
                className="game-hearts"
                aria-label={`${round.lives} corações restantes`}
              >
                {[0, 1, 2].map((n) => (
                  <Heart
                    size={20}
                    key={n}
                    className={n < round.lives ? "alive" : "empty-heart"}
                    aria-hidden="true"
                  />
                ))}
              </strong>
            </div>
            <div>
              <span>Tempo ativo</span>
              <strong>
                <Timer size={17} />
                {Math.floor(round.elapsedMs / 1000)}s
              </strong>
            </div>
          </div>
          {playing && (
            <>
              <div className="typing-tools" ref={toolsRef}>
                <span>Digite uma palavra inteira e pressione Enter.</span>
                <button
                  ref={pauseRef}
                  className="button secondary"
                  onClick={() => setPaused((value) => !value)}
                >
                  {paused ? <Play size={16} /> : <Pause size={16} />}{" "}
                  {paused ? "Continuar partida" : "Pausar partida"}
                </button>
              </div>
              <div className={`typing-arena ${paused ? "paused" : ""}`}>
                <div className="typing-lanes" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <div
                  className="falling-words"
                  role="list"
                  aria-label="Palavras na tela"
                  aria-hidden={paused}
                  aria-live="polite"
                >
                  {round.active.map((token) => {
                    const lifetime = typingPaces[round.pace].lifetimeMs;
                    const percentage = Math.max(
                      0,
                      (token.remainingMs / lifetime) * 100,
                    );
                    return (
                      <div
                        key={token.id}
                        role="listitem"
                        className="typing-word"
                        style={
                          {
                            left: `${[18, 50, 82][token.lane]}%`,
                            top: `${8 + (1 - percentage / 100) * 50}%`,
                            "--lane-top": `${22 + token.lane * 66}px`,
                          } as CSSProperties
                        }
                      >
                        <strong lang="en">{token.word.en}</strong>
                        <small title={token.word.pt}>{token.word.pt}</small>
                        <div
                          className="word-lifetime"
                          role="progressbar"
                          aria-label={`Tempo restante para ${token.word.en}`}
                          aria-valuemin={0}
                          aria-valuemax={Math.ceil(lifetime / 1000)}
                          aria-valuenow={Math.max(
                            0,
                            Math.ceil(token.remainingMs / 1000),
                          )}
                        >
                          <span style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="typing-floor" aria-hidden="true" />
                {paused && (
                  <div className="game-pause-overlay" role="status">
                    <Pause size={30} />
                    <h2>Partida pausada</h2>
                    <p>
                      As palavras esperam por você.
                      <br />
                      Use “Continuar partida” para voltar.
                    </p>
                  </div>
                )}
              </div>
              <form
                className="typing-console"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!input.trim() || paused) return;
                  dispatch({ type: "type", input });
                  setInput("");
                  inputRef.current?.focus();
                }}
              >
                <label htmlFor="typing-answer">
                  Digite uma palavra da tela
                </label>
                <div>
                  <input
                    ref={inputRef}
                    id="typing-answer"
                    lang="en"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    maxLength={30}
                    placeholder="Sua palavra em inglês…"
                    value={input}
                    disabled={paused}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <button
                    className="button"
                    type="submit"
                    disabled={paused || !input.trim()}
                  >
                    Enviar
                  </button>
                </div>
              </form>
              <p className="game-live-message" role="status">
                {message}
              </p>
            </>
          )}
          {round.phase !== "playing" && (
            <GameResult
              roundId={round.id}
              won={round.phase === "won"}
              title={
                round.phase === "won"
                  ? "Dez palavras. Vitória sua!"
                  : "As palavras escaparam desta vez."
              }
              onRestart={start}
              storageError={storageError}
            >
              <p>
                Você capturou {round.correct} de {typingGoal} palavras em{" "}
                {Math.max(1, Math.ceil(round.elapsedMs / 1000))} segundos de
                jogo ativo.{" "}
                {round.phase === "won"
                  ? "Seu recorde ficou guardado aqui, só por diversão."
                  : "Que tal tentar novamente em um ritmo mais tranquilo?"}
              </p>
            </GameResult>
          )}
        </>
      )}
    </GameShell>
  );
}
