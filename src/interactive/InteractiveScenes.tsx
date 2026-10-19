import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookmarkPlus,
  Check,
  Compass,
  Eye,
  List,
  MousePointer2,
  RotateCcw,
} from "lucide-react";
import { scenes, type Scene, type SceneItem } from "../content/scenes";
import { SceneArt } from "./SceneArt";
import { AudioButton, Badge, PageTitle, Progress } from "../components/ui";
import { useLearning } from "../hooks/useLearning";
import { makeCard, uid } from "../utils/learning";
import { shuffle } from "../games/engine";
import { speak } from "../services/speech";

function SceneView({ scene }: { scene: Scene }) {
  const { state, update, notify } = useLearning();
  const promptRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<SceneItem | null>(null);
  const [autoAudio, setAutoAudio] = useState(false);
  const [mode, setMode] = useState<"explore" | "challenge">("explore");
  const [round, setRound] = useState<SceneItem[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<{
    correct: boolean;
    selected: string;
  } | null>(null);
  const [correct, setCorrect] = useState(0);
  const [list, setList] = useState(false);
  const discovered = (state.drafts?.["explore-seen-" + scene.id]?.text || "")
    .split(",")
    .filter((id) => scene.items.some((item) => item.id === id));
  const finished = mode === "challenge" && index >= round.length;
  const target = round[index];
  useEffect(() => {
    if (mode === "challenge") {
      promptRef.current?.scrollIntoView({ block: "start" });
      promptRef.current?.focus({ preventScroll: true });
    }
  }, [mode, index]);
  const position = (item: SceneItem, i: number) =>
    scene.id === "body"
      ? { x: i % 2 === 0 ? 13 : 87, y: 7 + Math.floor(i / 2) * 9.4 }
      : { x: item.x, y: item.y };
  function choose(item: SceneItem) {
    if (mode === "challenge") {
      if (answer || finished || !target) return;
      const hit = item.id === target.id;
      setAnswer({ correct: hit, selected: item.id });
      if (hit) setCorrect((n) => n + 1);
      update((s) => ({
        ...s,
        attempts: [
          ...s.attempts,
          {
            id: uid(),
            exerciseId: target.id + "-identify",
            topic: "scene-" + scene.id,
            skill: "vocabulary",
            answer: item.en,
            correct: hit,
            date: new Date().toISOString(),
            seconds: 0,
            number:
              s.attempts.filter((a) => a.exerciseId === target.id + "-identify")
                .length + 1,
          },
        ],
      }));
      return;
    }
    setSelected(item);
    if (!discovered.includes(item.id))
      update((s) => ({
        ...s,
        drafts: {
          ...s.drafts,
          ["explore-seen-" + scene.id]: {
            text: [
              ...new Set([
                ...(s.drafts?.["explore-seen-" + scene.id]?.text || "")
                  .split(",")
                  .filter(Boolean),
                item.id,
              ]),
            ].join(","),
            updatedAt: new Date().toISOString(),
          },
        },
      }));
    if (autoAudio) speak(item.en, state.profile.speechRate, notify);
  }
  function start() {
    setRound(shuffle(scene.items).slice(0, 6));
    setIndex(0);
    setAnswer(null);
    setCorrect(0);
    setMode("challenge");
    setSelected(null);
  }
  function addCard(item: SceneItem) {
    if (
      state.cards.some(
        (c) => !c.deleted && c.front.toLowerCase() === item.en.toLowerCase(),
      )
    ) {
      notify("Esta palavra já está nos seus flashcards.");
      return;
    }
    update((s) => ({
      ...s,
      cards: [
        ...s.cards,
        makeCard(item.en, item.pt, scene.title, item.example),
      ],
    }));
    notify("Palavra adicionada aos flashcards e à revisão espaçada.");
  }
  return (
    <div className="interactive-page">
      <Link className="back-link" to="/explore">
        <ArrowLeft size={16} />
        Todas as cenas
      </Link>
      <PageTitle
        eyebrow="INGLÊS QUE VOCÊ PODE TOCAR"
        title={scene.title}
        description={scene.subtitle}
        action={
          <Badge>
            {scene.level} · {scene.items.length} elementos
          </Badge>
        }
      />
      <div className="scene-toolbar">
        <div className="level-tabs">
          <button
            aria-pressed={mode === "explore"}
            className={mode === "explore" ? "active" : ""}
            onClick={() => {
              setMode("explore");
              setAnswer(null);
            }}
          >
            Explorar a cena
          </button>
          <button
            aria-pressed={mode === "challenge"}
            className={mode === "challenge" ? "active" : ""}
            onClick={start}
          >
            Desafio: encontre a palavra
          </button>
        </div>
        <label className="check-label">
          <input
            type="checkbox"
            checked={autoAudio}
            onChange={(e) => setAutoAudio(e.target.checked)}
          />
          Ouvir ao tocar
        </label>
      </div>
      {mode === "explore" ? (
        <div className="scene-instruction">
          <MousePointer2 size={18} />
          <p>
            Toque em uma parte da ilustração ou nos pontos. Veja o nome, ouça e
            aprenda uma frase.
            <span>
              {discovered.length} de {scene.items.length} elementos explorados
            </span>
          </p>
        </div>
      ) : !finished ? (
        <section
          ref={promptRef}
          tabIndex={-1}
          className="scene-challenge-prompt"
          aria-live="polite"
        >
          <div>
            <small>
              DESAFIO {index + 1} DE {round.length}
            </small>
            <h2>
              Encontre: <span lang="en">{target?.en}</span>
            </h2>
            <p>
              Toque no lugar correspondente na ilustração ou use a lista em
              português.
            </p>
          </div>
          {target && (
            <AudioButton text={target.en} label="Ouvir a palavra do desafio" />
          )}
          <strong>{correct} acertos</strong>
        </section>
      ) : null}
      {!finished && (
        <div className="scene-workspace">
          <div className="scene-visual-column">
            <div className="scene-selection-caption" role="status">
              {mode === "explore" ? (
                selected ? (
                  <>
                    <strong lang="en">{selected.en}</strong>
                    <span>{selected.pt}</span>
                  </>
                ) : (
                  <>
                    <strong>Toque e descubra</strong>
                    <span>O nome aparece aqui.</span>
                  </>
                )
              ) : (
                <>
                  <strong lang="en">{target?.en}</strong>
                  <span>Encontre na ilustração.</span>
                </>
              )}
            </div>
            <div
              className="scene-board"
              onPointerUp={(event) => {
                if (
                  event.target instanceof Element &&
                  event.target.closest("button")
                )
                  return;
                const box = event.currentTarget.getBoundingClientRect();
                const x = event.clientX - box.left,
                  y = event.clientY - box.top;
                const nearest = scene.items
                  .map((item) => ({
                    item,
                    distance: Math.hypot(
                      (item.x / 100) * box.width - x,
                      (item.y / 100) * box.height - y,
                    ),
                  }))
                  .sort((a, b) => a.distance - b.distance)[0];
                if (nearest && nearest.distance < box.width * 0.12)
                  choose(nearest.item);
              }}
            >
              <SceneArt scene={scene.id} />
              {scene.id === "body" && (
                <svg
                  className="scene-callouts"
                  viewBox="0 0 800 600"
                  aria-hidden="true"
                >
                  {scene.items.map((item, i) => (
                    <g key={item.id}>
                      <line
                        x1={position(item, i).x * 8}
                        y1={position(item, i).y * 6}
                        x2={item.x * 8}
                        y2={item.y * 6}
                      />
                      <circle cx={item.x * 8} cy={item.y * 6} r="4" />
                    </g>
                  ))}
                </svg>
              )}
              <div
                className="scene-hotspots"
                role="group"
                aria-label={"Pontos de " + scene.title}
              >
                {scene.items.map((item, i) => (
                  <button
                    key={item.id}
                    style={{
                      left: position(item, i).x + "%",
                      top: position(item, i).y + "%",
                    }}
                    onClick={() => choose(item)}
                    disabled={mode === "challenge" && !!answer}
                    className={
                      "scene-hotspot " +
                      (selected?.id === item.id ? "is-selected " : "") +
                      (answer && target?.id === item.id ? "is-target " : "") +
                      (answer?.selected === item.id && !answer.correct
                        ? "is-wrong"
                        : "")
                    }
                    aria-label={"Ponto " + (i + 1) + ": " + item.pt}
                    aria-pressed={
                      mode === "explore" ? selected?.id === item.id : undefined
                    }
                  >
                    <span>{i + 1}</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              className="text-button scene-list-toggle"
              onClick={() => setList((v) => !v)}
              aria-expanded={list}
            >
              <List size={17} />
              {list ? "Ocultar" : "Ver"} lista acessível dos elementos
            </button>
            {list && (
              <div
                className="scene-item-list"
                role="group"
                aria-label="Elementos em português"
              >
                {scene.items.map((item, i) => (
                  <button
                    key={item.id}
                    disabled={mode === "challenge" && !!answer}
                    onClick={() => choose(item)}
                  >
                    <span>{i + 1}</span>
                    {item.pt}
                    {mode === "explore" && discovered.includes(item.id) && (
                      <Check size={14} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <aside className="scene-detail" aria-label="Palavra selecionada">
            {mode === "explore" ? (
              selected ? (
                <div key={selected.id} className="scene-word-detail">
                  <span className="eyebrow">UMA NOVA CONEXÃO</span>
                  <h2 lang="en">{selected.en}</h2>
                  <p className="scene-translation">{selected.pt}</p>
                  <AudioButton
                    text={selected.en}
                    label="Ouvir nome em inglês"
                  />
                  <div className="scene-example">
                    <span>USE EM UMA FRASE</span>
                    <p lang="en">{selected.example}</p>
                    <p>{selected.translation}</p>
                    <AudioButton
                      text={selected.example}
                      label="Ouvir exemplo"
                    />
                  </div>
                  <button className="button" onClick={() => addCard(selected)}>
                    <BookmarkPlus size={16} />
                    Salvar nos flashcards
                  </button>
                  <div className="scene-word-pagination">
                    <button
                      className="button secondary"
                      onClick={() =>
                        choose(
                          scene.items[
                            (scene.items.indexOf(selected) -
                              1 +
                              scene.items.length) %
                              scene.items.length
                          ],
                        )
                      }
                    >
                      <ArrowLeft size={15} />
                      Anterior
                    </button>
                    <button
                      className="button secondary"
                      onClick={() =>
                        choose(
                          scene.items[
                            (scene.items.indexOf(selected) + 1) %
                              scene.items.length
                          ],
                        )
                      }
                    >
                      Próxima
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="scene-detail-empty">
                  <Compass size={43} />
                  <h2>O inglês está nos detalhes.</h2>
                  <p>
                    Escolha um ponto na cena para descobrir a palavra, sua
                    tradução e como usá-la.
                  </p>
                  <span>Você também pode navegar com Tab e Enter.</span>
                </div>
              )
            ) : (
              <div className="scene-word-detail">
                <span className="eyebrow">OBSERVE E ENCONTRE</span>
                {answer ? (
                  <div
                    className={
                      "feedback " + (answer.correct ? "success" : "warning")
                    }
                    role="status"
                  >
                    <h2>
                      {answer.correct
                        ? "Você encontrou!"
                        : "Vamos localizar juntos."}
                    </h2>
                    <p>
                      <strong lang="en">{target.en}</strong> significa{" "}
                      {target.pt}. O ponto {scene.items.indexOf(target) + 1}{" "}
                      está destacado.
                    </p>
                    <p lang="en">{target.example}</p>
                    <AudioButton text={target.example} />
                    <button
                      className="button"
                      onClick={() => {
                        setIndex((i) => i + 1);
                        setAnswer(null);
                      }}
                    >
                      Continuar
                      <ArrowRight size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Eye size={35} />
                    <h2 lang="en">{target?.en}</h2>
                    <p>
                      Localize o elemento. Você pode tentar sem pressa; cada
                      resposta recebe uma explicação.
                    </p>
                    <p className="muted">
                      As respostas entram no histórico de vocabulário. Os jogos
                      livres continuam separados do curso.
                    </p>
                  </>
                )}
              </div>
            )}
          </aside>
        </div>
      )}
      {finished && (
        <section className="panel scene-summary">
          <span className="stat-icon green">
            <Check size={30} />
          </span>
          <h2>Você fez novas conexões.</h2>
          <p>
            {correct} de {round.length} elementos encontrados. Suas respostas
            foram salvas.
          </p>
          <Progress value={(correct / round.length) * 100} />
          <div className="button-row">
            <button className="button" onClick={start}>
              <RotateCcw size={17} />
              Novo desafio
            </button>
            <button
              className="button secondary"
              onClick={() => setMode("explore")}
            >
              Voltar a explorar
            </button>
          </div>
        </section>
      )}
      <div className="scene-next-steps">
        <Link to={"/lesson/" + scene.lesson}>
          <span className="eyebrow">COLOQUE EM UMA FRASE</span>
          <strong>
            Aula relacionada
            <ArrowRight size={17} />
          </strong>
        </Link>
        <Link to="/conversation">
          <span className="eyebrow">COLOQUE EM UMA CONVERSA</span>
          <strong>
            Praticar situações reais
            <ArrowRight size={17} />
          </strong>
        </Link>
      </div>
    </div>
  );
}
export default function InteractiveScenes() {
  const { id } = useParams();
  const scene = scenes.find((s) => s.id === id);
  if (scene) return <SceneView key={scene.id} scene={scene} />;
  if (id)
    return (
      <div className="empty-state">
        <h1>Esta cena não foi encontrada.</h1>
        <Link to="/explore" className="button">
          Ver todas as cenas
        </Link>
      </div>
    );
  return (
    <div className="interactive-page">
      <PageTitle
        eyebrow="EXPLORE. TOQUE. DESCUBRA."
        title="O mundo também é sua sala de aula."
        description="Aprenda o inglês das coisas que você vê todos os dias. Cenas clicáveis, frases úteis e pequenos desafios."
        action={
          <Badge>
            <Compass size={15} />6 cenas interativas
          </Badge>
        }
      />
      <section className="explore-hero">
        <div>
          <span className="eyebrow">APRENDER FICA MAIS CONCRETO</span>
          <h2>
            Um toque.
            <br />
            Uma palavra.
            <br />
            <em>Uma conexão com a vida real.</em>
          </h2>
          <p>
            Explore livremente, escute os exemplos e transforme o que descobriu
            em flashcards ou conversas.
          </p>
        </div>
        <div aria-hidden="true" className="explore-hero-words">
          <span>
            head <small>cabeça</small>
          </span>
          <span>
            kitchen <small>cozinha</small>
          </span>
          <span>
            steering wheel <small>volante</small>
          </span>
          <MousePointer2 size={40} />
        </div>
      </section>
      <div className="scene-catalog">
        {scenes.map((s) => (
          <Link
            key={s.id}
            to={"/explore/" + s.id}
            className="scene-catalog-card"
          >
            <div className="scene-thumbnail">
              <SceneArt scene={s.id} />
              <span>{s.icon}</span>
            </div>
            <div>
              <Badge tone="neutral">
                {s.level} · {s.items.length} palavras e expressões
              </Badge>
              <h2>{s.title}</h2>
              <p>{s.subtitle}</p>
              <span className="text-link">
                Entrar na cena
                <ArrowRight size={17} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
