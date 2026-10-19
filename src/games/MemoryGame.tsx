import { useEffect, useState } from "react";
import { Brain, Check, RotateCcw, Sparkles } from "lucide-react";
import { words } from "../content/vocabulary";
import {
  createMemoryRound,
  hideMemoryMismatch,
  turnMemoryCard,
  type MemoryRound,
} from "./engine";
import { GameResult, GameShell } from "./GameShell";
import { useGameRecords } from "./useGameRecords";

export function MemoryGame() {
  const [pairs, setPairs] = useState<4 | 6 | 8>(4);
  const [round, setRound] = useState<MemoryRound | null>(null);
  const { records, finish, storageError } = useGameRecords();
  const start = () => setRound(createMemoryRound(words, pairs));
  useEffect(() => {
    if (!round || round.flipped.length !== 2) return;
    const id = setTimeout(
      () =>
        setRound((current) =>
          current && current.id === round.id
            ? hideMemoryMismatch(current)
            : current,
        ),
      900,
    );
    return () => clearTimeout(id);
  }, [round?.id, round?.flipped]);
  useEffect(() => {
    if (round?.phase === "won")
      finish(
        round.id,
        `memory-${round.cards.length / 2}` as
          | "memory-4"
          | "memory-6"
          | "memory-8",
        true,
        round.moves,
      );
  }, [round, finish]);
  const mismatch = round?.flipped.length === 2;
  return (
    <GameShell
      title="Memória em dois idiomas"
      description="Encontre a palavra em inglês e sua tradução. Sem relógio: só observe, lembre e combine."
    >
      <section className="panel game-settings">
        <label htmlFor="memory-pairs">
          {round?.phase === "playing"
            ? "Tamanho do próximo tabuleiro"
            : "Tamanho do tabuleiro"}
          <select
            id="memory-pairs"
            value={pairs}
            onChange={(e) => setPairs(Number(e.target.value) as 4 | 6 | 8)}
          >
            <option value={4}>4 pares · uma pausa rápida</option>
            <option value={6}>6 pares · um pouco mais de desafio</option>
            <option value={8}>8 pares · memória afiada</option>
          </select>
        </label>
        <button className="button" onClick={start}>
          {round ? <RotateCcw size={16} /> : <Brain size={17} />}{" "}
          {round ? "Novo tabuleiro" : "Começar memória"}
        </button>
        <p className="game-personal-best">
          Seu recorde com {pairs} pares:{" "}
          <strong>
            {records[`memory-${pairs}`]?.best == null
              ? "ainda por descobrir"
              : `${records[`memory-${pairs}`]!.best} jogadas`}
          </strong>
        </p>
      </section>
      {!round ? (
        <div className="game-welcome memory-welcome">
          <div className="memory-preview" aria-hidden="true">
            <span>
              hello<small>ENGLISH</small>
            </span>
            <span>
              olá<small>PORTUGUÊS</small>
            </span>
          </div>
          <h2>Duas cartas. Uma conexão.</h2>
          <p>
            Vire duas cartas por vez. Uma palavra e a tradução dela formam um
            par. Encontre todos os pares para vencer.
          </p>
          <small>
            Use o toque, o mouse ou Tab + Enter. Cada segunda carta conta como
            uma jogada.
          </small>
        </div>
      ) : (
        <>
          <div className="game-scoreboard">
            <div>
              <span>Pares encontrados</span>
              <strong>
                {round.matched.length} <small>/ {round.cards.length / 2}</small>
              </strong>
            </div>
            <div>
              <span>Jogadas</span>
              <strong>{round.moves}</strong>
            </div>
            <div>
              <span>Tempo</span>
              <strong className="game-no-clock">
                À vontade <Sparkles size={17} />
              </strong>
            </div>
          </div>
          <p className="game-live-message" aria-live="polite">
            {round.phase === "won"
              ? "Todos os pares encontrados!"
              : mismatch
                ? "Ainda não é esse par. Observe as cartas e tente outra combinação."
                : round.matched.length
                  ? "Boa conexão! Continue procurando os outros pares."
                  : "Vire uma carta para descobrir a primeira palavra."}
          </p>
          <div
            className="memory-board"
            role="group"
            aria-label="Tabuleiro de memória"
          >
            {round.cards.map((card, i) => {
              const matched = round.matched.includes(card.pairId);
              const visible = matched || round.flipped.includes(card.id);
              return (
                <button
                  key={card.id}
                  className={`memory-card ${visible ? "revealed" : ""} ${matched ? "matched" : ""} ${card.side === "pt" ? "portuguese-card" : ""}`}
                  aria-label={
                    visible
                      ? `${card.text} · ${card.side === "en" ? "inglês" : "português"}${matched ? " · par encontrado" : ""}`
                      : `Virar carta ${i + 1}`
                  }
                  aria-pressed={visible}
                  disabled={
                    matched || (mismatch && !visible) || round.phase === "won"
                  }
                  onClick={() =>
                    setRound((current) =>
                      current ? turnMemoryCard(current, card.id) : current,
                    )
                  }
                >
                  {visible ? (
                    <>
                      <small>
                        {card.side === "en" ? "ENGLISH" : "PORTUGUÊS"}
                      </small>
                      <strong lang={card.side === "en" ? "en" : "pt-BR"}>
                        {card.text}
                      </strong>
                      {matched && <Check size={17} aria-hidden="true" />}
                    </>
                  ) : (
                    <>
                      <Brain size={28} aria-hidden="true" />
                      <small>{String(i + 1).padStart(2, "0")}</small>
                    </>
                  )}
                </button>
              );
            })}
          </div>
          {round.phase === "won" && (
            <GameResult
              won
              title="Todas as conexões encontradas!"
              onRestart={start}
              storageError={storageError}
            >
              <p>
                Você combinou {round.matched.length} pares em {round.moves}{" "}
                jogadas. Que tal embaralhar tudo e jogar mais uma?
              </p>
            </GameResult>
          )}
        </>
      )}
    </GameShell>
  );
}
