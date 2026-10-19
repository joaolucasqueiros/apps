import { useEffect, useState } from "react";
import { Check, Lightbulb, Puzzle, RotateCcw } from "lucide-react";
import { words } from "../content/vocabulary";
import { AudioButton } from "../components/ui";
import {
  createSecretRound,
  guessLetter,
  shuffle,
  type SecretRound,
} from "./engine";
import { GameResult, GameShell } from "./GameShell";
import { useGameRecords } from "./useGameRecords";

const pool = words.filter((w) => /^[a-z]{3,10}$/.test(w.en));
const keyboard = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
export function SecretWordGame() {
  const [round, setRound] = useState<SecretRound | null>(null);
  const { records, finish, storageError } = useGameRecords();
  const start = () =>
    setRound(
      createSecretRound(
        shuffle(pool.filter((w) => w.id !== round?.word.id))[0],
      ),
    );
  useEffect(() => {
    if (round?.phase !== "playing") return;
    const key = (e: KeyboardEvent) => {
      if (
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.repeat ||
        !/^[a-z]$/i.test(e.key) ||
        (e.target instanceof HTMLElement &&
          e.target.closest("input,textarea,select,[contenteditable='true']"))
      )
        return;
      e.preventDefault();
      setRound((current) => (current ? guessLetter(current, e.key) : current));
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [round?.phase]);
  useEffect(() => {
    if (round && round.phase !== "playing")
      finish(round.id, "secret", round.phase === "won", 6 - round.lives, {
        correct: round.guesses.filter((letter) =>
          round.word.en.includes(letter),
        ).length,
        total: round.guesses.length,
      });
  }, [round, finish]);
  return (
    <GameShell
      title="Palavra secreta"
      description="Uma dica em português e algumas letras escondidas. Descubra a palavra em inglês antes de gastar as 6 chances."
    >
      <section className="panel game-settings">
        <button className="button" onClick={start}>
          {round ? <RotateCcw size={16} /> : <Puzzle size={17} />}{" "}
          {round ? "Nova palavra" : "Começar palavra secreta"}
        </button>
        <p className="game-personal-best">
          Seu recorde:{" "}
          <strong>
            {records.secret?.best == null
              ? "ainda por descobrir"
              : `${records.secret.best} letras incorretas`}
          </strong>
        </p>
        <span className="game-unlimited">
          <Check size={15} />
          Sem limite de tempo
        </span>
      </section>
      {!round ? (
        <div className="game-welcome secret-welcome">
          <div className="secret-preview" aria-hidden="true">
            {"P L A Y".split(" ").map((l, i) => (
              <span key={i}>{i === 1 ? "?" : l}</span>
            ))}
          </div>
          <h2>Uma letra de cada vez.</h2>
          <p>
            Use a dica para pensar em inglês. Escolha letras no teclado da tela
            ou no seu teclado. Letras certas não gastam chances.
          </p>
          <small>
            Não precisa acertar de primeira. Você pode revelar a resposta quando
            quiser.
          </small>
        </div>
      ) : (
        <>
          <section className="secret-stage panel">
            <div className="secret-hint">
              <span className="stat-icon peach">
                <Lightbulb size={23} />
              </span>
              <div>
                <small>{round.word.category}</small>
                <p>
                  Dica: <strong>{round.word.pt}</strong>
                </p>
              </div>
              <span className="secret-chances" role="status">
                {round.lives} de 6 chances
              </span>
            </div>
            <div
              className="secret-letters"
              role="group"
              aria-label="Letras da palavra secreta"
            >
              {[...round.word.en].map((letter, i) => {
                const visible =
                  round.guesses.includes(letter) || round.phase !== "playing";
                return (
                  <span
                    key={i}
                    className={visible ? "known-letter" : ""}
                    aria-label={`Letra ${i + 1}: ${visible ? letter.toUpperCase() : "oculta"}`}
                  >
                    {visible ? letter.toUpperCase() : "_"}
                  </span>
                );
              })}
            </div>
            <p className="muted secret-length">
              {round.word.en.length} letras · pense na dica e escolha uma letra
            </p>
            <div className="letter-keyboard" aria-label="Teclado de letras">
              {keyboard.map((row) => (
                <div key={row}>
                  {[...row].map((letter) => {
                    const used = round.guesses.includes(letter);
                    const hit = round.word.en.includes(letter);
                    return (
                      <button
                        key={letter}
                        aria-label={`Letra ${letter.toUpperCase()}${used ? (hit ? ", encontrada" : ", ausente") : ""}`}
                        disabled={used || round.phase !== "playing"}
                        className={
                          used ? (hit ? "letter-hit" : "letter-miss") : ""
                        }
                        onClick={() =>
                          setRound((current) =>
                            current ? guessLetter(current, letter) : current,
                          )
                        }
                      >
                        {letter.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="game-live-message" aria-live="polite">
              {round.phase === "won"
                ? "Você encontrou todas as letras!"
                : round.phase === "lost"
                  ? "A palavra foi revelada. Experimente outra rodada."
                  : round.guesses.length
                    ? `Última letra: ${round.guesses.at(-1)?.toUpperCase()}. ${round.word.en.includes(round.guesses.at(-1)!) ? "Ela faz parte da palavra." : "Ela não aparece nesta palavra."}`
                    : "Qual será a primeira letra?"}
            </p>
            {round.phase === "playing" && (
              <button
                className="text-button"
                onClick={() =>
                  setRound((current) =>
                    current ? { ...current, phase: "lost" } : current,
                  )
                }
              >
                Revelar palavra e encerrar rodada
              </button>
            )}
          </section>
          {round.phase !== "playing" && (
            <GameResult
              roundId={round.id}
              won={round.phase === "won"}
              title={
                round.phase === "won"
                  ? "Mistério resolvido!"
                  : "Uma nova palavra para conhecer."
              }
              onRestart={start}
              storageError={storageError}
            >
              <p>
                <strong lang="en">{round.word.en}</strong> significa “
                {round.word.pt}”.
              </p>
              <AudioButton text={round.word.en} label="Ouvir a palavra" />
            </GameResult>
          )}
        </>
      )}
    </GameShell>
  );
}
