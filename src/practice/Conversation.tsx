import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MessageCircle,
  RotateCcw,
} from "lucide-react";
import { conversations, type Conversation } from "../content/communication";
import { AudioButton, Badge, PageTitle, Progress } from "../components/ui";
import { VoiceTools } from "./VoiceTools";
import { analyseWriting } from "./feedback";
import { useLearning } from "../hooks/useLearning";
import { uid } from "../utils/learning";
type Draft = { answers: string[]; current: string; help: boolean };
export function readConversationDraft(
  text: string | undefined,
  conversation: Conversation,
): Draft {
  try {
    const d = JSON.parse(text || "null");
    if (
      d &&
      Array.isArray(d.answers) &&
      d.answers.length <= conversation.turns.length &&
      d.answers.every(
        (a: unknown) => typeof a === "string" && a.length <= 3000,
      ) &&
      typeof d.current === "string" &&
      d.current.length <= 3000 &&
      typeof d.help === "boolean"
    )
      return d;
  } catch {
    /* A malformed imported draft never blocks the conversation. */
  }
  return { answers: [], current: "", help: false };
}
function ConversationRoom({ conversation: c }: { conversation: Conversation }) {
  const { state, update, notify } = useLearning();
  const key = "conversation-" + c.id;
  const initial = readConversationDraft(state.drafts?.[key]?.text, c);
  const [draft, setDraft] = useState(initial),
    [review, setReview] = useState(false),
    [criteria, setCriteria] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const step = draft.answers.length,
    turn = c.turns[step],
    finished = step === c.turns.length;
  const analysis = analyseWriting(draft.current);
  function persist(next: Draft) {
    setDraft(next);
    update((s) => ({
      ...s,
      drafts: {
        ...s.drafts,
        [key]: {
          text: JSON.stringify(next),
          updatedAt: new Date().toISOString(),
        },
      },
    }));
  }
  function send() {
    if (!draft.current.trim() || !checked) return;
    const answer = draft.current.trim();
    const next = {
      answers: [...draft.answers, answer],
      current: "",
      help: false,
    };
    setDraft(next);
    setChecked(false);
    setReview(false);
    update((s) => ({
      ...s,
      drafts: {
        ...s.drafts,
        [key]: {
          text: JSON.stringify(next),
          updatedAt: new Date().toISOString(),
        },
      },
      attempts: [
        ...s.attempts,
        {
          id: uid(),
          exerciseId: key + "-" + step,
          topic: key,
          skill: "speaking",
          answer,
          correct: criteria.length === 3,
          date: new Date().toISOString(),
          seconds: 0,
          number:
            s.attempts.filter((a) => a.exerciseId === key + "-" + step).length +
            1,
          selfAssessed: true,
          assisted: draft.help,
        },
      ],
    }));
    setCriteria([]);
    notify("Resposta salva como prática de conversação, com autoavaliação.");
  }
  const rubric = [
    "Respondi à intenção da pergunta.",
    "Usei uma frase que consigo explicar.",
    "Consigo fazer uma pergunta ou pedir esclarecimento.",
  ];
  return (
    <>
      <Link to="/conversation" className="back-link">
        <ArrowLeft size={16} />
        Todas as situações
      </Link>
      <PageTitle
        eyebrow="VOCÊ TAMBÉM FAZ PARTE DA CONVERSA"
        title={c.title}
        description={c.goal}
        action={
          <Badge>
            {c.level} · {c.turns.length} turnos
          </Badge>
        }
      />
      <div className="conversation-layout">
        <section className="panel conversation-room">
          <div className="conversation-header">
            <span>{c.icon}</span>
            <div>
              <strong>Prática guiada</strong>
              <small>Roteiro com respostas livres · sem conversa de IA</small>
            </div>
            <span>
              {Math.min(step + 1, c.turns.length)} / {c.turns.length}
            </span>
          </div>
          <Progress value={(step / c.turns.length) * 100} />
          {draft.answers.map((answer, i) => (
            <div className="conversation-past" key={i}>
              <p className="actor-bubble" lang="en">
                {c.turns[i].question}
              </p>
              <p className="learner-bubble" lang="en">
                {answer}
              </p>
            </div>
          ))}
          {!finished ? (
            <>
              <div className="actor-bubble current-turn">
                <small>SEU INTERLOCUTOR</small>
                <h2 lang="en">{turn.question}</h2>
                <AudioButton text={turn.question} label="Ouvir pergunta" />
                <details
                  onToggle={(e) => {
                    if (e.currentTarget.open && !draft.help)
                      persist({ ...draft, help: true });
                  }}
                >
                  <summary>Ver tradução de apoio</summary>
                  <p>{turn.translation}</p>
                </details>
              </div>
              <div className="conversation-goal">
                <strong>Sua missão neste turno</strong>
                <p>{turn.goal}</p>
              </div>
              <label htmlFor="conversation-answer">
                Sua resposta em inglês
              </label>
              <textarea
                id="conversation-answer"
                lang="en"
                rows={4}
                maxLength={3000}
                value={draft.current}
                placeholder="Responda do seu jeito. Você também pode transcrever sua voz."
                onChange={(e) => {
                  persist({ ...draft, current: e.target.value });
                  setReview(false);
                  setChecked(false);
                }}
              />
              <VoiceTools
                key={step}
                onTranscript={(text) => {
                  persist({ ...draft, current: text });
                  setChecked(false);
                  setReview(false);
                }}
              />
              <div className="button-row">
                <button
                  className="button secondary"
                  onClick={() => {
                    persist({ ...draft, help: true });
                    setReview(true);
                  }}
                >
                  <MessageCircle size={16} />
                  Ver um modelo e dicas
                </button>
                <button
                  className="button"
                  disabled={!draft.current.trim()}
                  onClick={() => {
                    setReview(true);
                    setChecked(true);
                  }}
                >
                  Revisar minha resposta
                  <ArrowRight size={16} />
                </button>
              </div>
              {review && (
                <div className="conversation-review">
                  <h3>Compare a intenção e a forma</h3>
                  {draft.help && (
                    <>
                      <p lang="en">{turn.model}</p>
                      <AudioButton text={turn.model} />
                    </>
                  )}
                  <p>{turn.tip}</p>
                  {analysis.issues.map((issue) => (
                    <p className="feedback warning" key={issue.id}>
                      <strong>{issue.excerpt}</strong> → {issue.suggestion}
                      <br />
                      {issue.explanation}
                    </p>
                  ))}
                  <p className="muted">
                    As dicas locais reconhecem padrões de escrita. Elas não
                    entendem toda resposta livre e não avaliam a qualidade
                    acústica.
                  </p>
                  {rubric.map((item) => (
                    <label className="check-label" key={item}>
                      <input
                        type="checkbox"
                        checked={criteria.includes(item)}
                        onChange={() =>
                          setCriteria((v) =>
                            v.includes(item)
                              ? v.filter((x) => x !== item)
                              : [...v, item],
                          )
                        }
                      />
                      {item}
                    </label>
                  ))}
                  {checked && (
                    <button className="button" onClick={send}>
                      Registrar e continuar
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="conversation-finished">
              <Check size={38} />
              <h2>Você sustentou uma conversa.</h2>
              <p>
                As {c.turns.length} respostas estão guardadas no seu histórico.
                Escolha uma delas e tente falar sem ler.
              </p>
              <button
                className="button"
                onClick={() => {
                  persist({ answers: [], current: "", help: false });
                  setCriteria([]);
                  setReview(false);
                  setChecked(false);
                }}
              >
                <RotateCcw size={16} />
                Repetir com outras palavras
              </button>
            </div>
          )}
        </section>
        <aside className="conversation-sidebar">
          <section className="panel">
            <span className="eyebrow">QUANDO FALTAR UMA PALAVRA</span>
            <h2>A conversa pode continuar.</h2>
            {[
              "Could you repeat that, please?",
              "What does that mean?",
              "Let me think for a moment.",
              "Could you speak more slowly?",
            ].map((text) => (
              <p lang="en" key={text}>
                {text}
                <AudioButton text={text} compact />
              </p>
            ))}
          </section>
          <Link className="practice-link-card" to={"/lesson/" + c.lesson}>
            Preparar a estrutura na aula
            <ArrowRight size={17} />
          </Link>
          {c.scene && (
            <Link className="practice-link-card" to={"/explore/" + c.scene}>
              Explorar a cena relacionada
              <ArrowRight size={17} />
            </Link>
          )}
          <Link className="practice-link-card" to="/practice/pronunciation">
            Treinar pronúncia e ritmo
            <ArrowRight size={17} />
          </Link>
          <section className="panel">
            <h3>Pratique com uma pessoa</h3>
            <p>
              Troquem de papel, mudem um detalhe e façam uma pergunta fora do
              roteiro. Depois, contem o que entenderam.
            </p>
            <p className="muted">
              Suas respostas ficam salvas ao sair. Gravações precisam ser
              baixadas para permanecer.
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}
export default function ConversationPage() {
  const { id } = useParams(),
    c = conversations.find((c) => c.id === id);
  if (c) return <ConversationRoom key={c.id} conversation={c} />;
  return (
    <>
      <PageTitle
        eyebrow="PRATIQUE A VIDA EM INGLÊS"
        title="Uma situação. Sua vez de responder."
        description="Converse com um roteiro, use sua voz ou digite e ganhe autonomia para falar com pessoas."
        action={<Badge>12 situações · A1 a C1</Badge>}
      />
      <div className="conversation-catalog">
        {conversations.map((c) => (
          <Link
            className="panel conversation-card"
            to={"/conversation/" + c.id}
            key={c.id}
          >
            <span className="conversation-card-icon">{c.icon}</span>
            <Badge tone="neutral">
              {c.level} · {c.turns.length} turnos
            </Badge>
            <h2>{c.title}</h2>
            <p>{c.goal}</p>
            <span className="text-link">
              Entrar na conversa
              <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
