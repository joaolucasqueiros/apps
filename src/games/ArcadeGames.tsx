import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  ArrowRight,
  Check,
  Delete,
  Heart,
  RotateCcw,
  Shuffle,
  Sparkles,
} from "lucide-react";
import { words } from "../content/vocabulary";
import { lessons } from "../content/lessons";
import { AudioButton, Progress } from "../components/ui";
import { GameResult, GameShell } from "./GameShell";
import { StagePicker } from "./ArcadeProgress";
import { useGameRecords } from "./useGameRecords";
import {
  answerSprint,
  checkAnagram,
  checkSentence,
  createAnagram,
  createSearch,
  createSentence,
  createSprint,
  nextAnagram,
  nextSentence,
  nextSprint,
  selectAnagram,
  selectSearch,
  selectSentence,
  straightCells,
  type AnagramRound,
  type ArcadeStage,
  type SearchRound,
  type SentenceRound,
  type SprintRound,
} from "./arcadeEngine";
const phraseBank = lessons.map((l) => ({
  id: l.id,
  en: l.examples[2].en,
  pt: l.examples[2].pt,
  level: l.level,
}));
function PuzzleScore({
  correct,
  total,
  mistakes,
}: {
  correct: number;
  total: number;
  mistakes: number;
}) {
  return (
    <div className="game-scoreboard">
      <div>
        <span>Etapas concluídas</span>
        <strong>
          {correct}
          <small>/ {total}</small>
        </strong>
      </div>
      <div>
        <span>Tentativas extras</span>
        <strong>{mistakes}</strong>
      </div>
      <div>
        <span>Seu ritmo</span>
        <strong className="game-no-clock">
          Sem relógio
          <Sparkles size={17} />
        </strong>
      </div>
    </div>
  );
}
export function AnagramGame() {
  const [stage, setStage] = useState<ArcadeStage>(1),
    [round, setRound] = useState<AnagramRound | null>(null),
    [message, setMessage] = useState("");
  const { finish, storageError } = useGameRecords();
  const start = () => {
    setRound(createAnagram(words, stage));
    setMessage("");
  };
  useEffect(() => {
    if (round?.phase === "won")
      finish(
        round.id,
        ("anagram-" + round.stage) as "anagram-1",
        true,
        round.mistakes,
        { correct: round.correct, total: round.correct + round.mistakes },
      );
  }, [round?.phase, round?.id, finish]);
  useEffect(() => {
    if (!round || round.phase !== "playing" || round.checked) return;
    const onKey = (e: KeyboardEvent) => {
      if (
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.repeat ||
        (e.target instanceof Element &&
          e.target.closest("input,textarea,select,[contenteditable=true]"))
      )
        return;
      if (
        e.key === "Enter" &&
        e.target instanceof Element &&
        e.target.closest("button,a,summary")
      )
        return;
      if (
        e.target instanceof Element &&
        e.target.closest("aside,header,nav,[role=dialog]")
      )
        return;
      if (e.key === "Backspace") {
        e.preventDefault();
        setRound((r) => (r ? { ...r, selected: r.selected.slice(0, -1) } : r));
      } else if (e.key === "Enter") {
        e.preventDefault();
        setMessage("Confira a ordem das letras e tente novamente se precisar.");
        setRound((r) => {
          if (!r) return r;
          const next = checkAnagram(r);
          return next;
        });
      } else if (/^[a-z]$/i.test(e.key)) {
        e.preventDefault();
        setRound((r) => {
          if (!r) return r;
          const tile = r.tiles.find(
            (t) =>
              t.letter === e.key.toLowerCase() && !r.selected.includes(t.id),
          );
          return tile ? selectAnagram(r, tile.id) : r;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [round?.id, round?.index, round?.checked, round?.phase]);
  const target = round?.queue[round.index];
  return (
    <GameShell
      title="Remixa"
      description="As letras estão soltas. Use a pista e monte cinco palavras em inglês."
    >
      <StagePicker
        family="anagram"
        stage={stage}
        onChange={setStage}
        playing={round?.phase === "playing"}
      />
      {!round ? (
        <div className="arcade-game-intro">
          <span className="arcade-intro-glyph" aria-hidden="true">
            m<span>i</span>x
          </span>
          <h2>Tá tudo aí. Só falta a virada.</h2>
          <p>
            Toque nas letras na ordem certa. A pista vem em português. Você
            também pode usar o teclado, Backspace e Enter.
          </p>
          <button className="button" onClick={start}>
            <Shuffle size={18} />
            Começar Remixa
          </button>
        </div>
      ) : (
        <>
          <PuzzleScore
            correct={round.correct}
            total={round.queue.length}
            mistakes={round.mistakes}
          />
          {round.phase === "won" ? (
            <GameResult
              roundId={round.id}
              won
              title="Você colocou as letras no lugar."
              onRestart={start}
              storageError={storageError}
            >
              <p>
                Cinco palavras reconstruídas. Seu melhor resultado melhora com
                menos tentativas extras.
              </p>
            </GameResult>
          ) : (
            <section className="panel puzzle-board">
              <span className="eyebrow">
                PALAVRA {round.index + 1} DE {round.queue.length}
              </span>
              <h2 className="puzzle-clue">{target?.pt}</h2>
              <p className="muted">
                Monte a palavra em inglês · {target?.en.length} letras
              </p>
              <div
                className="puzzle-answer letter-answer"
                role="group"
                aria-label="Sua palavra"
              >
                {target &&
                  [...target.en].map((_, i) => (
                    <span
                      key={i}
                      className={
                        round.selected[i] !== undefined ? "filled" : ""
                      }
                    >
                      {round.tiles.find((t) => t.id === round.selected[i])
                        ?.letter || ""}
                    </span>
                  ))}
              </div>
              <div
                className="letter-bank"
                role="group"
                aria-label="Letras disponíveis"
              >
                {round.tiles.map((tile) => (
                  <button
                    key={tile.id}
                    aria-label={
                      "Letra " +
                      tile.letter.toUpperCase() +
                      ", peça " +
                      (tile.id + 1)
                    }
                    disabled={round.checked || round.selected.includes(tile.id)}
                    onClick={() =>
                      setRound((r) => (r ? selectAnagram(r, tile.id) : r))
                    }
                  >
                    {tile.letter}
                  </button>
                ))}
              </div>
              <p className="puzzle-message" role="status">
                {round.checked
                  ? "Boa! Você montou " + target?.en + "."
                  : message || "Toque nas letras para montar a palavra."}
              </p>
              {round.checked ? (
                <div className="puzzle-confirmation">
                  <AudioButton text={target!.en} label="Ouvir a palavra" />
                  <button
                    className="button"
                    onClick={() => {
                      setRound((r) => (r ? nextAnagram(r) : r));
                      setMessage("");
                    }}
                  >
                    Próxima palavra
                    <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <div className="puzzle-actions">
                  <button
                    className="button secondary"
                    disabled={!round.selected.length}
                    onClick={() =>
                      setRound((r) =>
                        r ? { ...r, selected: r.selected.slice(0, -1) } : r,
                      )
                    }
                  >
                    <Delete size={17} />
                    Apagar
                  </button>
                  <button
                    className="button"
                    disabled={round.selected.length !== round.tiles.length}
                    onClick={() => {
                      const next = checkAnagram(round);
                      setMessage(
                        next.checked
                          ? "Boa!"
                          : "A ordem ainda não encaixou. Tente novamente.",
                      );
                      setRound(next);
                    }}
                  >
                    Conferir palavra
                    <Check size={17} />
                  </button>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </GameShell>
  );
}
export function SentenceGame() {
  const [stage, setStage] = useState<ArcadeStage>(1),
    [round, setRound] = useState<SentenceRound | null>(null),
    [message, setMessage] = useState("");
  const { finish, storageError } = useGameRecords();
  const start = () => {
    setRound(createSentence(phraseBank, stage));
    setMessage("");
  };
  useEffect(() => {
    if (round?.phase === "won")
      finish(
        round.id,
        ("sentence-" + round.stage) as "sentence-1",
        true,
        round.mistakes,
        { correct: round.correct, total: round.correct + round.mistakes },
      );
  }, [round?.phase, round?.id, finish]);
  const target = round?.queue[round.index];
  return (
    <GameShell
      title="Frase na mão"
      description="Palavra por palavra, transforme uma ideia em português numa frase em inglês."
    >
      <StagePicker
        family="sentence"
        stage={stage}
        onChange={setStage}
        playing={round?.phase === "playing"}
      />
      {!round ? (
        <div className="arcade-game-intro sentence-intro">
          <span className="arcade-intro-glyph" aria-hidden="true">
            let’s<span>go.</span>
          </span>
          <h2>Agora as palavras têm uma missão.</h2>
          <p>
            Toque nos blocos para montar cinco frases. Toque em um bloco da sua
            resposta para removê-lo. Sem correr contra o relógio.
          </p>
          <button className="button" onClick={start}>
            Começar Frase na mão
            <ArrowRight size={17} />
          </button>
        </div>
      ) : (
        <>
          <PuzzleScore
            correct={round.correct}
            total={round.queue.length}
            mistakes={round.mistakes}
          />
          {round.phase === "won" ? (
            <GameResult
              roundId={round.id}
              won
              title="Cinco ideias viraram frases."
              onRestart={start}
              storageError={storageError}
            >
              <p>
                Você chegou ao fim deste desafio. Leve uma dessas frases para
                sua próxima conversa.
              </p>
            </GameResult>
          ) : (
            <section className="panel puzzle-board">
              <span className="eyebrow">
                FRASE {round.index + 1} DE {round.queue.length}
              </span>
              <h2 className="puzzle-clue">{target?.pt}</h2>
              <p className="muted">
                Comece com <strong lang="en">{target?.en.split(" ")[0]}</strong>{" "}
                e use todos os blocos para reconstruir o modelo.
              </p>
              <div
                className="puzzle-answer sentence-answer"
                role="group"
                aria-label="Sua frase"
              >
                {round.selected.length ? (
                  round.selected.map((id, i) => (
                    <button
                      key={id}
                      disabled={round.checked}
                      onClick={() =>
                        setRound((r) =>
                          r
                            ? {
                                ...r,
                                selected: r.selected.filter((_, n) => n !== i),
                              }
                            : r,
                        )
                      }
                    >
                      {round.tiles.find((t) => t.id === id)!.text}
                      <Delete size={13} />
                    </button>
                  ))
                ) : (
                  <span>Suas palavras aparecem aqui.</span>
                )}
              </div>
              <div
                className="sentence-bank"
                role="group"
                aria-label="Blocos disponíveis"
              >
                {round.tiles.map((tile) => (
                  <button
                    key={tile.id}
                    disabled={round.checked || round.selected.includes(tile.id)}
                    onClick={() =>
                      setRound((r) => (r ? selectSentence(r, tile.id) : r))
                    }
                  >
                    {tile.text}
                  </button>
                ))}
              </div>
              <p className="puzzle-message" role="status">
                {round.checked
                  ? "A frase ganhou sentido."
                  : message ||
                    "Experimente uma ordem. Você pode ajustar os blocos."}
              </p>
              {round.checked ? (
                <div className="puzzle-confirmation">
                  <AudioButton text={target!.en} label="Ouvir a frase" />
                  <button
                    className="button"
                    onClick={() => {
                      setRound((r) => (r ? nextSentence(r) : r));
                      setMessage("");
                    }}
                  >
                    Próxima frase
                    <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <div className="puzzle-actions">
                  <button
                    className="button secondary"
                    disabled={!round.selected.length}
                    onClick={() =>
                      setRound((r) => (r ? { ...r, selected: [] } : r))
                    }
                  >
                    <RotateCcw size={16} />
                    Limpar
                  </button>
                  <button
                    className="button"
                    disabled={round.selected.length !== round.tiles.length}
                    onClick={() => {
                      const next = checkSentence(round);
                      setMessage(
                        next.checked
                          ? "Boa construção!"
                          : "Esta ordem ainda difere do modelo. Confira a primeira palavra e a estrutura.",
                      );
                      setRound(next);
                    }}
                  >
                    Conferir frase
                    <Check size={17} />
                  </button>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </GameShell>
  );
}
export function SearchGame() {
  const [stage, setStage] = useState<ArcadeStage>(1),
    [round, setRound] = useState<SearchRound | null>(null),
    [anchor, setAnchor] = useState<number | null>(null),
    [preview, setPreview] = useState<number[]>([]),
    [message, setMessage] = useState(""),
    [focus, setFocus] = useState(0);
  const drag = useRef<{ start: number; last: number; moved: boolean } | null>(
      null,
    ),
    board = useRef<HTMLDivElement>(null);
  const { finish, storageError } = useGameRecords();
  const start = () => {
    setRound(createSearch(words, stage));
    setAnchor(null);
    setPreview([]);
    setMessage("");
    setFocus(0);
  };
  useEffect(() => {
    if (round?.phase === "won")
      finish(
        round.id,
        ("search-" + round.stage) as "search-1",
        true,
        round.misses,
        {
          correct: round.found.length,
          total: round.found.length + round.misses,
        },
      );
  }, [round?.phase, round?.id, finish]);
  function submit(first: number, last: number) {
    if (!round) return;
    const next = selectSearch(round, first, last);
    setMessage(
      next.found.length > round.found.length
        ? "Você encontrou mais uma!"
        : "Essa seleção não corresponde a uma palavra da lista. Tente de novo.",
    );
    setRound(next);
    setAnchor(null);
    setPreview([]);
  }
  function tap(cell: number) {
    if (anchor === null) {
      setAnchor(cell);
      setPreview([cell]);
      setMessage("Agora toque na última letra da palavra.");
    } else if (anchor === cell) {
      setAnchor(null);
      setPreview([]);
    } else submit(anchor, cell);
  }
  function cellAt(e: PointerEvent<HTMLDivElement>) {
    const element = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest<HTMLElement>("[data-cell]");
    return element && board.current?.contains(element)
      ? Number(element.dataset.cell)
      : null;
  }
  const foundCells = new Set(
    round?.placements
      .filter((p) => round.found.includes(p.word.id))
      .flatMap((p) => p.cells) || [],
  );
  return (
    <GameShell
      title="Caça-conexões"
      description="Encontre palavras escondidas e conecte cada uma ao seu significado."
    >
      <StagePicker
        family="search"
        stage={stage}
        onChange={setStage}
        playing={round?.phase === "playing"}
      />
      {!round ? (
        <div className="arcade-game-intro search-intro">
          <span className="arcade-intro-glyph" aria-hidden="true">
            f<span>i</span>nd
          </span>
          <h2>Uma boa palavra merece ser encontrada.</h2>
          <p>
            Arraste da primeira à última letra. Se preferir, toque nas duas
            pontas. No teclado, use as setas e Enter. A primeira etapa usa
            palavras na horizontal.
          </p>
          <button className="button" onClick={start}>
            Começar Caça-conexões
            <ArrowRight size={17} />
          </button>
        </div>
      ) : (
        <>
          <PuzzleScore
            correct={round.found.length}
            total={round.placements.length}
            mistakes={round.misses}
          />
          {round.phase === "won" ? (
            <GameResult
              roundId={round.id}
              won
              title="Você encontrou todas as conexões."
              onRestart={start}
              storageError={storageError}
            >
              <p>
                As palavras estavam ali. Agora fazem parte da sua coleção de
                vitórias.
              </p>
            </GameResult>
          ) : (
            <section className="panel search-stage">
              <p className="search-instructions">
                {stage === 1
                  ? "Da esquerda para a direita."
                  : stage === 2
                    ? "Na horizontal ou na vertical."
                    : "Na horizontal, na vertical ou na diagonal."}{" "}
                Arraste ou toque nas duas pontas.
              </p>
              <div
                ref={board}
                className="word-search-grid"
                role="grid"
                aria-label="Tabuleiro de letras"
                onPointerDown={(e) => {
                  const cell = cellAt(e);
                  if (cell === null) return;
                  e.preventDefault();
                  e.currentTarget.setPointerCapture(e.pointerId);
                  drag.current = { start: cell, last: cell, moved: false };
                  setPreview([cell]);
                  setFocus(cell);
                }}
                onPointerMove={(e) => {
                  if (!drag.current) return;
                  const cell = cellAt(e);
                  if (cell === null) return;
                  if (cell !== drag.current.start) drag.current.moved = true;
                  drag.current.last = cell;
                  setPreview(
                    straightCells(drag.current.start, cell, round.size),
                  );
                }}
                onPointerUp={(e) => {
                  const current = drag.current;
                  if (!current) return;
                  drag.current = null;
                  if (e.currentTarget.hasPointerCapture(e.pointerId))
                    e.currentTarget.releasePointerCapture(e.pointerId);
                  if (current.moved) submit(current.start, current.last);
                  else tap(current.start);
                }}
                onPointerCancel={() => {
                  drag.current = null;
                  setPreview([]);
                  setAnchor(null);
                }}
              >
                {Array.from({ length: round.size }, (_, row) => (
                  <div role="row" className="search-grid-row" key={row}>
                    {Array.from({ length: round.size }, (_, col) => {
                      const cell = row * round.size + col;
                      return (
                        <button
                          key={cell}
                          role="gridcell"
                          data-cell={cell}
                          tabIndex={focus === cell ? 0 : -1}
                          aria-label={
                            "Letra " +
                            round.grid[cell] +
                            ", linha " +
                            (row + 1) +
                            ", coluna " +
                            (col + 1)
                          }
                          aria-selected={
                            preview.includes(cell) || foundCells.has(cell)
                          }
                          className={
                            (foundCells.has(cell) ? "found " : "") +
                            (preview.includes(cell) ? "selected" : "")
                          }
                          onClick={(e) => {
                            if (e.detail === 0) tap(cell);
                          }}
                          onKeyDown={(e) => {
                            const offset =
                              e.key === "ArrowRight"
                                ? 1
                                : e.key === "ArrowLeft"
                                  ? -1
                                  : e.key === "ArrowDown"
                                    ? round.size
                                    : e.key === "ArrowUp"
                                      ? -round.size
                                      : 0;
                            if (!offset) return;
                            e.preventDefault();
                            const next = Math.max(
                              0,
                              Math.min(round.grid.length - 1, cell + offset),
                            );
                            setFocus(next);
                            board.current
                              ?.querySelector<HTMLButtonElement>(
                                '[data-cell="' + next + '"]',
                              )
                              ?.focus();
                          }}
                        >
                          {round.grid[cell]}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
              <p className="puzzle-message" role="status">
                {message || "Escolha uma palavra da lista para procurar."}
              </p>
              <div
                className="search-word-list"
                aria-label="Palavras para encontrar"
              >
                {round.placements.map((p) => (
                  <span
                    className={round.found.includes(p.word.id) ? "found" : ""}
                    key={p.word.id}
                  >
                    <strong lang="en">
                      {p.word.en}
                      {round.found.includes(p.word.id) && <Check size={15} />}
                    </strong>
                    <small>{p.word.pt}</small>
                  </span>
                ))}
              </div>
              {anchor !== null && (
                <button
                  className="button secondary"
                  onClick={() => {
                    setAnchor(null);
                    setPreview([]);
                  }}
                >
                  Cancelar seleção
                </button>
              )}
            </section>
          )}
        </>
      )}
    </GameShell>
  );
}
export function SprintGame() {
  const [stage, setStage] = useState<ArcadeStage>(1),
    [round, setRound] = useState<SprintRound | null>(null);
  const { finish, storageError } = useGameRecords();
  const start = () => setRound(createSprint(words, stage));
  useEffect(() => {
    if (round && round.phase !== "playing")
      finish(
        round.id,
        ("sprint-" + round.stage) as "sprint-1",
        round.phase === "won",
        round.queue.length - round.correct,
        { correct: round.correct, total: round.index + 1 },
      );
  }, [round?.phase, round?.id, finish]);
  const q = round?.queue[round.index];
  return (
    <GameShell
      title="Bate-pronto"
      description="Uma pista em português. Uma escolha em inglês. Acerte seis de oito sem perder os três corações."
    >
      <StagePicker
        family="sprint"
        stage={stage}
        onChange={setStage}
        playing={round?.phase === "playing"}
      />
      {!round ? (
        <div className="arcade-game-intro sprint-intro">
          <span className="arcade-intro-glyph" aria-hidden="true">
            go<span>!</span>
          </span>
          <h2>Reconheceu? Vai nessa.</h2>
          <p>
            Escolha a tradução em inglês. São oito desafios e três corações. O
            ritmo é seu, com resposta e exemplo depois de cada escolha.
          </p>
          <button className="button" onClick={start}>
            Começar Bate-pronto
            <ArrowRight size={17} />
          </button>
        </div>
      ) : (
        <>
          <div className="game-scoreboard">
            <div>
              <span>Acertos</span>
              <strong>
                {round.correct}
                <small>/ 8</small>
              </strong>
            </div>
            <div>
              <span>Corações</span>
              <strong
                className="game-hearts"
                aria-label={round.lives + " corações restantes"}
              >
                {[0, 1, 2].map((n) => (
                  <Heart
                    key={n}
                    size={20}
                    className={n < round.lives ? "alive" : "empty-heart"}
                  />
                ))}
              </strong>
            </div>
            <div>
              <span>Desafio</span>
              <strong>
                {round.index + 1}
                <small>/ 8</small>
              </strong>
            </div>
          </div>
          {round.phase !== "playing" ? (
            <GameResult
              roundId={round.id}
              won={round.phase === "won"}
              title={
                round.phase === "won"
                  ? "Seu vocabulário respondeu presente."
                  : "Uma nova chance de fazer a conexão."
              }
              onRestart={start}
              storageError={storageError}
            >
              <p>
                {round.correct} acertos.{" "}
                {round.phase === "won"
                  ? "Você passou pelo desafio!"
                  : "Veja as palavras novamente e tente no seu ritmo."}
              </p>
            </GameResult>
          ) : (
            <section className="panel puzzle-board sprint-board">
              <Progress value={(round.index / round.queue.length) * 100} />
              <span className="eyebrow">COMO VOCÊ DIZ EM INGLÊS?</span>
              <h2 className="puzzle-clue">{q!.word.pt}</h2>
              <div className="sprint-options">
                {q!.options.map((option) => (
                  <button
                    key={option.id}
                    disabled={!!round.checked}
                    className={
                      round.checked
                        ? option.id === q!.word.id
                          ? "correct"
                          : round.checked === option.id
                            ? "incorrect"
                            : ""
                        : ""
                    }
                    onClick={() =>
                      setRound((r) => (r ? answerSprint(r, option.id) : r))
                    }
                    lang="en"
                  >
                    {option.en}
                    {round.checked && option.id === q!.word.id && (
                      <Check size={20} />
                    )}
                  </button>
                ))}
              </div>
              {round.checked && (
                <div className="sprint-feedback" role="status">
                  <strong>
                    {round.checked === q!.word.id
                      ? "Boa conexão!"
                      : "A resposta era " + q!.word.en + "."}
                  </strong>
                  <p lang="en">{q!.word.example}</p>
                  <div className="button-row">
                    <AudioButton text={q!.word.en} />
                    <button
                      className="button"
                      onClick={() => setRound((r) => (r ? nextSprint(r) : r))}
                    >
                      Próximo desafio
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </GameShell>
  );
}
