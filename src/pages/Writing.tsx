import { useState } from "react";
import { PenLine, Check, Lightbulb } from "lucide-react";
import { PageTitle, Badge, AudioButton } from "../components/ui";
import { useLearning } from "../hooks/useLearning";
import { uid } from "../utils/learning";
const tasks = [
  {
    id: "yesterday",
    title: "Uma pequena história de ontem",
    level: "A2",
    prompt:
      "Escreva de 3 a 5 frases sobre o seu dia de ontem. Use pelo menos um verbo regular e um irregular.",
    model:
      "Yesterday, I worked in the morning. I drove to the airport and met a visitor from Canada. After work, I cooked dinner with my family. It was a busy but good day.",
    checks: [
      "Situei a história no passado.",
      "Usei uma forma irregular, como went, drove ou met.",
      "Depois de did not, usei o verbo base.",
      "As frases têm sujeito e verbo.",
    ],
  },
  {
    id: "home",
    title: "Seu lugar favorito em casa",
    level: "A1",
    prompt:
      "Descreva um cômodo em 3 frases. Use there is, a/an e uma preposição de lugar.",
    model:
      "There is a small table in my kitchen. A coffee maker is on the counter. The window is next to the stove.",
    checks: [
      "Usei a/an antes de um substantivo singular novo.",
      "Descrevi onde algo está.",
      "Coloquei o adjetivo antes do substantivo.",
      "Consigo visualizar o cômodo lendo minhas frases.",
    ],
  },
  {
    id: "plans",
    title: "Um plano para o fim de semana",
    level: "A2",
    prompt:
      "Conte o que você pretende fazer e ofereça uma alternativa se chover.",
    model:
      "I am going to visit a park with my family this weekend. We are going to leave early. If it rains, we will watch a film at home instead.",
    checks: [
      "Usei be + going to para um plano.",
      "Usei o verbo base depois de going to.",
      "A condição com if usa o presente.",
      "O resultado da condição usa will + verbo.",
    ],
  },
  {
    id: "opinion",
    title: "Tecnologia que ajuda de verdade",
    level: "B2",
    prompt:
      "Escreva um parágrafo sobre um aplicativo útil. Apresente uma vantagem e uma limitação, com um exemplo.",
    model:
      "Navigation apps make my work easier because they suggest faster routes. For example, I can avoid heavy traffic during rush hour. However, these tools sometimes recommend narrow streets. Therefore, I combine their suggestions with my own experience.",
    checks: [
      "Apresentei uma ideia principal clara.",
      "Dei um exemplo específico.",
      "Usei um conector para introduzir uma limitação.",
      "Minha conclusão está ligada ao argumento.",
    ],
  },
];
export function Writing() {
  const { state, update, notify } = useLearning();
  const [id, setId] = useState(tasks[0].id);
  const task = tasks.find((t) => t.id === id)!;
  const latest = state.attempts
    .filter((a) => a.exerciseId === `writing-${id}`)
    .at(-1);
  const [draft, setDraft] = useState(
    state.drafts?.[`writing-${id}`]?.text ?? latest?.answer ?? "",
  );
  const [show, setShow] = useState(false);
  const [checks, setChecks] = useState<string[]>([]);
  const save = (success: boolean) => {
    if (!draft.trim()) return;
    update((s) => ({
      ...s,
      attempts: [
        ...s.attempts,
        {
          id: uid(),
          exerciseId: `writing-${id}`,
          topic: `writing-${id}`,
          skill: "writing",
          answer: draft.trim(),
          correct: success,
          date: new Date().toISOString(),
          seconds: 0,
          number:
            s.attempts.filter((a) => a.exerciseId === `writing-${id}`).length +
            1,
          selfAssessed: true,
        },
      ],
    }));
    notify("Texto e autoavaliação salvos no histórico.");
  };
  return (
    <>
      <PageTitle
        eyebrow="ORGANIZE SUAS IDEIAS"
        title="Sua próxima história começa aqui."
        description="Escreva, compare com um modelo e revise com critérios claros."
      />
      <div className="level-tabs">
        {tasks.map((t) => (
          <button
            key={t.id}
            className={id === t.id ? "active" : ""}
            onClick={() => {
              setId(t.id);
              setDraft(
                state.drafts?.[`writing-${t.id}`]?.text ??
                  state.attempts
                    .filter((a) => a.exerciseId === `writing-${t.id}`)
                    .at(-1)?.answer ??
                  "",
              );
              setShow(false);
              setChecks([]);
            }}
          >
            {t.level} ·{" "}
            {t.id === "yesterday"
              ? "Ontem"
              : t.id === "home"
                ? "Casa"
                : t.id === "plans"
                  ? "Planos"
                  : "Opinião"}
          </button>
        ))}
      </div>
      <section className="panel writing-stage">
        <Badge>{task.level} · PRÁTICA LIVRE</Badge>
        <h2>{task.title}</h2>
        <p>{task.prompt}</p>
        <label>
          Seu texto em inglês
          <textarea
            rows={7}
            lang="en"
            maxLength={10000}
            placeholder="Take your time. Start with one sentence…"
            value={draft}
            onChange={(e) => {
              const text = e.target.value;
              setDraft(text);
              update((s) => ({
                ...s,
                drafts: {
                  ...s.drafts,
                  [`writing-${id}`]: {
                    text,
                    updatedAt: new Date().toISOString(),
                  },
                },
              }));
            }}
          />
        </label>
        <div className="writing-actions">
          <span>
            {draft.trim() ? draft.trim().split(/\s+/).length : 0} palavras
          </span>
          <button
            className="button"
            disabled={!draft.trim()}
            onClick={() => {
              setShow(true);
              save(false);
            }}
          >
            <Lightbulb size={17} />
            Salvar e revisar meu texto
          </button>
        </div>
        {show && (
          <div className="writing-review">
            <h3>Uma possibilidade, não a única resposta</h3>
            <p lang="en">{task.model}</p>
            <AudioButton text={task.model} />
            <h3>Revise sua construção</h3>
            {task.checks.map((c) => (
              <label className="check-label" key={c}>
                <input
                  type="checkbox"
                  checked={checks.includes(c)}
                  onChange={() =>
                    setChecks((v) =>
                      v.includes(c) ? v.filter((x) => x !== c) : [...v, c],
                    )
                  }
                />
                {c}
              </label>
            ))}
            <div className="button-row">
              <button className="button secondary" onClick={() => save(false)}>
                <PenLine size={16} />
                Ainda quero melhorar
              </button>
              <button className="button" onClick={() => save(true)}>
                <Check size={16} />
                Concluí minha revisão
              </button>
            </div>
          </div>
        )}
      </section>
      <p className="info-note">
        Esta atividade é uma autoavaliação orientada. O sistema não corrige
        semanticamente textos livres e não calcula domínio de writing a partir
        desta resposta.
      </p>
      <section className="panel">
        <h2>Seu caderno de escrita</h2>
        {state.attempts
          .filter((a) => a.skill === "writing")
          .slice(-8)
          .reverse()
          .map((a) => (
            <details key={a.id}>
              <summary>
                {new Date(a.date).toLocaleString("pt-BR")} ·{" "}
                {tasks.find((t) => `writing-${t.id}` === a.exerciseId)?.title}
              </summary>
              <p lang="en" className="preserve-text">
                {a.answer}
              </p>
              <small>
                Autoavaliação: {a.correct ? "revisão concluída" : "em revisão"}
              </small>
            </details>
          ))}
        {!state.attempts.some((a) => a.skill === "writing") && (
          <p className="muted">
            Seu primeiro texto aparecerá aqui depois de salvo.
          </p>
        )}
      </section>
    </>
  );
}
