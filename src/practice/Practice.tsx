import { useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Headphones,
  Lightbulb,
  Mic,
  RotateCcw,
  Target,
} from "lucide-react";
import {
  AudioButton,
  Badge,
  Empty,
  PageTitle,
  Progress,
} from "../components/ui";
import { useLearning } from "../hooks/useLearning";
import { projects, coursePaths, levelOrder } from "../content/curriculum";
import { pronunciationLessons } from "../content/communication";
import { lessons } from "../content/lessons";
import { scenes } from "../content/scenes";
import { Exercise } from "../components/Exercise";
import { ExerciseContext } from "./ExerciseContext";
import { VoiceTools } from "./VoiceTools";
import { errorTopics, transferQuestions } from "./adaptive";
import { transcriptionDiff, uid } from "../utils/learning";
import type { Level } from "../types";

function PracticeHome() {
  const { state } = useLearning();
  const errors = errorTopics(state.attempts);
  const links = [
    {
      path: "errors",
      icon: RotateCcw,
      title: "Meus erros frequentes",
      copy: "Retome dificuldades com explicações e frases novas.",
      tag: errors.length + " temas para retomar",
    },
    {
      path: "pronunciation",
      icon: Mic,
      title: "Laboratório de pronúncia",
      copy: "Sons, sílaba tônica, ligação de palavras e entonação.",
      tag: "8 práticas · A1 a B2",
    },
    {
      path: "projects",
      icon: Lightbulb,
      title: "Projetos de comunicação",
      copy: "Junte o que aprendeu para resolver uma situação completa.",
      tag: "5 projetos · A1 a C1",
    },
    {
      path: "diagnostic",
      icon: Target,
      title: "Diagnóstico prático",
      copy: "Combine compreensão, produção e uma reflexão por habilidade.",
      tag: "Escuta, leitura, escrita e fala",
    },
  ];
  return (
    <>
      <PageTitle
        eyebrow="TRANSFORME CONHECIMENTO EM USO"
        title="Entender é o começo. Usar é o próximo passo."
        description="Reveja dificuldades, treine sua voz e reúna evidências do que consegue comunicar."
      />
      <div className="practice-hub">
        {links.map(({ path, icon: Icon, title, copy, tag }) => (
          <Link
            className="panel practice-hub-card"
            key={path}
            to={"/practice/" + path}
          >
            <span className="stat-icon green">
              <Icon size={26} />
            </span>
            <Badge tone="neutral">{tag}</Badge>
            <h2>{title}</h2>
            <p>{copy}</p>
            <span className="text-link">
              Começar
              <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </div>
      <section className="panel">
        <h2>Um plano que cabe na sua rotina</h2>
        <p>
          As sessões combinam gramática, vocabulário, escuta e leitura,
          priorizando seus erros e seu nível de partida. Depois, use uma
          conversa ou escrita curta para produzir inglês.
        </p>
        <div className="button-row">
          {[5, 15, 30].map((n) => (
            <Link className="button secondary" key={n} to={"/session/" + n}>
              {n} minutos
              <ArrowRight size={15} />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
function Errors() {
  const { state } = useLearning();
  const [topic, setTopic] = useState(""),
    [index, setIndex] = useState(0);
  const [questions, setQuestions] = useState<
    ReturnType<typeof transferQuestions>
  >([]);
  const rows = errorTopics(state.attempts);
  const active = questions[index];
  const title = (id: string) =>
    lessons.find((l) => l.id === id)?.title ||
    scenes.find((s) => "scene-" + s.id === id)?.title ||
    id.replace("vocabulary:", "");
  const start = (id: string) => {
    setQuestions(transferQuestions(state.attempts, id));
    setTopic(id);
    setIndex(0);
  };
  return (
    <>
      <Link to="/practice" className="back-link">
        <ArrowLeft size={16} />
        Todas as práticas
      </Link>
      <PageTitle
        eyebrow="ERROS VIRAM DIREÇÃO"
        title="Um pouco mais de atenção aqui."
        description="Dificuldades identificadas nas respostas sem apoio. Exercícios ainda não praticados vêm primeiro; avaliações reservadas ficam fora."
      />
      {topic ? (
        <>
          <button className="back-link" onClick={() => setTopic("")}>
            <ArrowLeft size={16} />
            Voltar aos meus erros
          </button>
          <h2>{title(topic)}</h2>
          {active ? (
            <>
              <p className="muted">
                Atividade {index + 1} de {questions.length} ·{" "}
                {state.attempts.some((a) => a.exerciseId === active.id)
                  ? "Retomada de uma frase já praticada"
                  : "Uma frase nova para aplicar a estrutura"}
              </p>
              <ExerciseContext exercise={active} />
              <Exercise
                key={active.id}
                exercise={active}
                onNext={() => setIndex((i) => i + 1)}
              />
            </>
          ) : (
            <section className="panel">
              <CheckCircle2 size={30} />
              <h2>Você retomou este tema.</h2>
              <p>
                As novas respostas estão no histórico. Aprender a usar a
                estrutura em outro contexto é mais útil do que decorar uma
                resposta.
              </p>
              <button className="button" onClick={() => setTopic("")}>
                Escolher outro tema
              </button>
            </section>
          )}
        </>
      ) : rows.length ? (
        <div className="error-topic-list">
          {rows.map((row) => (
            <section className="panel" key={row.topic}>
              <div>
                <Badge tone="peach">
                  {row.errors.length}{" "}
                  {row.errors.length === 1
                    ? "erro para retomar"
                    : "erros para retomar"}
                </Badge>
                <h2>{title(row.topic)}</h2>
                {row.errors.slice(-3).map((a) => (
                  <p className="error-example" key={a.id}>
                    <span>Sua resposta</span>
                    <q lang="en">{a.answer}</q>
                  </p>
                ))}
              </div>
              <button
                className="button"
                onClick={() => start(row.topic)}
                disabled={!transferQuestions(state.attempts, row.topic).length}
              >
                Praticar este tema
                <ArrowRight size={16} />
              </button>
            </section>
          ))}
        </div>
      ) : (
        <Empty title="Ainda não há erros para retomar." link="/course">
          Pratique uma aula ou um desafio interativo. Dificuldades de respostas
          avaliadas aparecerão aqui.
        </Empty>
      )}
    </>
  );
}
function Pronunciation() {
  const { state, update, notify } = useLearning();
  const [id, setId] = useState(pronunciationLessons[0].id),
    [compare, setCompare] = useState(false);
  const lesson = pronunciationLessons.find((p) => p.id === id)!;
  const key = "pronunciation-" + id;
  const text = state.drafts?.[key]?.text || "";
  const saveDraft = (value: string) =>
    update((s) => ({
      ...s,
      drafts: {
        ...s.drafts,
        [key]: { text: value, updatedAt: new Date().toISOString() },
      },
    }));
  const save = (comfortable: boolean) => {
    update((s) => ({
      ...s,
      attempts: [
        ...s.attempts,
        {
          id: uid(),
          exerciseId: key,
          topic: key,
          skill: "speaking",
          answer: text || "[Prática em voz alta sem transcrição]",
          correct: comfortable,
          date: new Date().toISOString(),
          seconds: 0,
          number: s.attempts.filter((a) => a.exerciseId === key).length + 1,
          selfAssessed: true,
        },
      ],
    }));
    notify("Prática de pronúncia registrada como autoavaliação.");
  };
  return (
    <>
      <Link to="/practice" className="back-link">
        <ArrowLeft size={16} />
        Todas as práticas
      </Link>
      <PageTitle
        eyebrow="SUA VOZ, COM MAIS CONSCIÊNCIA"
        title="Sons que fazem diferença."
        description="Perceba contrastes, experimente o ritmo e compare sua própria gravação. O objetivo é ser compreendido."
      />
      <label className="practice-select">
        Escolha uma prática
        <select
          value={id}
          onChange={(e) => {
            setId(e.target.value);
            setCompare(false);
          }}
        >
          {pronunciationLessons.map((p) => (
            <option value={p.id} key={p.id}>
              {p.level} · {p.title}
            </option>
          ))}
        </select>
      </label>
      <section className="panel pronunciation-stage">
        <Badge>{lesson.level} · PRONÚNCIA</Badge>
        <h2>{lesson.title}</h2>
        <p>{lesson.explanation}</p>
        <div className="pronunciation-pairs">
          {lesson.pairs.map(([a, b]) => (
            <div key={a}>
              <span lang="en">
                {a}
                <AudioButton text={a.replace(/_/g, " ")} compact />
              </span>
              <span lang="en">
                {b}
                <AudioButton text={b.replace(/_/g, " ")} compact />
              </span>
            </div>
          ))}
        </div>
        <div className="info-note">{lesson.tip}</div>
        <h3>Ouça, faça uma pausa e repita</h3>
        <p className="pronunciation-target" lang="en">
          {lesson.sentence}
        </p>
        <AudioButton text={lesson.sentence} label="Ouvir frase de prática" />
        <p className="stress-guide" lang="en">
          {lesson.stress}
        </p>
        <small>
          Maiúsculas destacam as sílabas ou palavras de apoio. A realização pode
          variar entre sotaques.
        </small>
        <VoiceTools key={id} onTranscript={saveDraft} />
        <label>
          Minha transcrição
          <input
            lang="en"
            value={text}
            maxLength={3000}
            onChange={(e) => {
              saveDraft(e.target.value);
              setCompare(false);
            }}
            placeholder="Você também pode digitar o que disse."
          />
        </label>
        <button
          className="button secondary"
          disabled={!text.trim()}
          onClick={() => setCompare(true)}
        >
          Comparar palavras
        </button>
        {compare && (
          <div className="transcript-feedback">
            <div className="diff-words">
              {transcriptionDiff(lesson.sentence, text).map((w, i) => (
                <span key={i} className={w.found ? "found" : "missing"}>
                  {w.word}
                </span>
              ))}
            </div>
            <p>
              Esta comparação localiza palavras da frase na transcrição. Ela não
              avalia som, entonação, ordem ou sotaque.
            </p>
          </div>
        )}
        <div className="button-row">
          <button className="button secondary" onClick={() => save(false)}>
            Quero repetir
          </button>
          <button className="button" onClick={() => save(true)}>
            Consegui me expressar melhor
          </button>
        </div>
      </section>
    </>
  );
}
function ProjectList() {
  const { state } = useLearning();
  return (
    <>
      <Link to="/practice" className="back-link">
        <ArrowLeft size={16} />
        Todas as práticas
      </Link>
      <PageTitle
        eyebrow="UM OBJETIVO. VÁRIAS HABILIDADES."
        title="Faça algo com o inglês que aprendeu."
        description="Projetos de comunicação ao final de cada etapa. Você pode tentar antes, voltar às aulas e refazer depois."
      />
      <div className="project-list">
        {projects.map((p) => (
          <Link
            className="panel project-card"
            key={p.id}
            to={"/practice/projects/" + p.id}
          >
            <Badge>{p.level}</Badge>
            <h2>{p.title}</h2>
            <p>{p.goal}</p>
            <span className="text-link">
              {state.attempts.some(
                (a) => a.topic === "project-" + p.id && a.correct,
              )
                ? "Revisitar meu projeto"
                : "Começar o projeto"}
              <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
function Project() {
  const { id } = useParams(),
    p = projects.find((p) => p.id === id);
  const { state, update, notify } = useLearning();
  const [model, setModel] = useState(false);
  if (!p) return <ProjectList />;
  const key = "project-" + p.id,
    text = state.drafts?.[key]?.text || "";
  const criteria = (state.drafts?.[key + "-checks"]?.text || "").split("|");
  const setDraft = (value: string) =>
    update((s) => ({
      ...s,
      drafts: {
        ...s.drafts,
        [key]: { text: value, updatedAt: new Date().toISOString() },
      },
    }));
  const toggle = (item: string) =>
    update((s) => ({
      ...s,
      drafts: {
        ...s.drafts,
        [key + "-checks"]: {
          text: (criteria.includes(item)
            ? criteria.filter((x) => x !== item)
            : [...criteria, item]
          )
            .filter(Boolean)
            .join("|"),
          updatedAt: new Date().toISOString(),
        },
      },
    }));
  const save = () => {
    if (!text.trim() || !p.criteria.every((c) => criteria.includes(c))) return;
    update((s) => ({
      ...s,
      attempts: [
        ...s.attempts,
        {
          id: uid(),
          exerciseId: key,
          topic: key,
          skill: "writing",
          answer: text,
          correct: true,
          date: new Date().toISOString(),
          seconds: 0,
          number: s.attempts.filter((a) => a.exerciseId === key).length + 1,
          selfAssessed: true,
          assisted: model,
        },
      ],
    }));
    notify("Projeto incluído no seu portfólio como autoavaliação.");
  };
  return (
    <>
      <Link to="/practice/projects" className="back-link">
        <ArrowLeft size={16} />
        Todos os projetos
      </Link>
      <PageTitle
        eyebrow={"PROJETO · " + p.level}
        title={p.title}
        description={p.goal}
      />
      <section className="panel project-stage">
        <p className="project-brief">{p.brief}</p>
        <h2>Prepare, produza e revise</h2>
        <ol>
          {p.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className="button-row">
          <Link
            className="button secondary"
            to={"/conversation/" + p.conversation}
          >
            Ensaiar a conversa
          </Link>
          <Link className="button secondary" to="/reading">
            Leitura de apoio
          </Link>
          <Link className="button secondary" to="/writing">
            Caderno de escrita
          </Link>
        </div>
        <label>
          Meu projeto em inglês
          <textarea
            lang="en"
            rows={8}
            maxLength={10000}
            value={text}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Escreva seu roteiro ou sua produção. O rascunho fica salvo."
          />
        </label>
        <VoiceTools key={p.id} onTranscript={setDraft} />
        <button
          className="text-button"
          aria-expanded={model}
          onClick={() => setModel((v) => !v)}
        >
          {model ? "Ocultar" : "Ver"} exemplo de apoio
        </button>
        {model && (
          <div className="info-note">
            <p lang="en">{p.model}</p>
            <AudioButton text={p.model} />
          </div>
        )}
        <h3>Confira sua produção</h3>
        {p.criteria.map((c) => (
          <label className="check-label" key={c}>
            <input
              type="checkbox"
              checked={criteria.includes(c)}
              onChange={() => toggle(c)}
            />
            {c}
          </label>
        ))}
        <button
          className="button"
          disabled={
            !text.trim() || !p.criteria.every((c) => criteria.includes(c))
          }
          onClick={save}
        >
          <CheckCircle2 size={17} />
          Guardar no meu portfólio
        </button>
        <p className="muted">
          Este registro reúne sua produção e seus critérios. Não é uma
          certificação nem uma correção integral do texto. Para validar
          comunicação espontânea, pratique também com uma pessoa.
        </p>
      </section>
    </>
  );
}
function Diagnostic() {
  const { state, update, notify } = useLearning();
  const [level, setLevel] = useState<Level>(state.profile.initialLevel),
    [saved, setSaved] = useState(false);
  const project = projects.find((p) => p.level === level)!;
  const [checks, setChecks] = useState<string[]>([]);
  const key = "diagnostic-" + level;
  const oral = state.drafts?.[key + "-speaking"]?.text || "",
    written = state.drafts?.[key + "-writing"]?.text || "";
  const draft = (kind: string, text: string) => {
    setSaved(false);
    update((s) => ({
      ...s,
      drafts: {
        ...s.drafts,
        [key + "-" + kind]: { text, updatedAt: new Date().toISOString() },
      },
    }));
  };
  const criteria = [
    "Consegui transmitir a ideia principal.",
    "Consigo explicar ou reformular minha resposta.",
    "Sei quais pontos ainda preciso praticar.",
  ];
  const objective = state.tests
    .filter((t) => t.name === "Diagnóstico inicial")
    .at(-1);
  function finish() {
    if (!oral.trim() || !written.trim()) return;
    update((s) => ({
      ...s,
      attempts: [
        ...s.attempts,
        ...(["speaking", "writing"] as const).map((skill) => ({
          id: uid(),
          exerciseId: key + "-" + skill,
          topic: key,
          skill,
          answer: skill === "speaking" ? oral : written,
          correct: checks.length === criteria.length,
          date: new Date().toISOString(),
          seconds: 0,
          number:
            s.attempts.filter((a) => a.exerciseId === key + "-" + skill)
              .length + 1,
          selfAssessed: true,
        })),
      ],
    }));
    setSaved(true);
    notify(
      "Produções do diagnóstico salvas. Confira as habilidades e os próximos passos.",
    );
  }
  return (
    <>
      <Link to="/practice" className="back-link">
        <ArrowLeft size={16} />
        Todas as práticas
      </Link>
      <PageTitle
        eyebrow="UM RETRATO PARA ESCOLHER O PRÓXIMO PASSO"
        title="Compreender e produzir: olhe os dois lados."
        description="Combine uma avaliação objetiva com tarefas de fala e escrita. Os resultados de cada habilidade permanecem separados."
      />
      <section className="panel">
        <Badge>1 · COMPREENSÃO E ESTRUTURAS</Badge>
        <h2>Listening, reading, vocabulário e gramática</h2>
        <p>
          Faça o diagnóstico objetivo e volte para completar as tarefas de
          produção. Ele fornece resultados por habilidade, sem atribuir um CEFR
          global.
        </p>
        {objective && (
          <p className="feedback success">
            Diagnóstico objetivo salvo:{" "}
            {objective.answers.filter((a) => a.correct).length} acertos em{" "}
            {objective.answers.length} questões.
          </p>
        )}
        <Link className="button" to="/tests">
          {objective
            ? "Rever ou refazer diagnóstico"
            : "Abrir diagnóstico objetivo"}
          <ArrowRight size={16} />
        </Link>
      </section>
      <section className="panel diagnostic-production">
        <Badge>2 · PRODUÇÃO COM CRITÉRIOS</Badge>
        <label>
          Complexidade da tarefa
          <select
            value={level}
            onChange={(e) => {
              setLevel(e.target.value as Level);
              setChecks([]);
              setSaved(false);
            }}
          >
            {levelOrder.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </label>
        <h2>{project.title}</h2>
        <p>{project.brief}</p>
        <label htmlFor="diagnostic-speaking">
          Minha resposta oral ou roteiro
        </label>
        <textarea
          id="diagnostic-speaking"
          rows={4}
          lang="en"
          maxLength={5000}
          value={oral}
          onChange={(e) => draft("speaking", e.target.value)}
        />
        <VoiceTools
          key={level}
          onTranscript={(text) => draft("speaking", text)}
        />
        <p className="muted">
          Se apenas digitar, este registro demonstra preparação escrita para
          falar. A avaliação da comunicação oral exige ouvir sua fala; o site
          não atribui nota acústica.
        </p>
        <label htmlFor="diagnostic-writing">Minha produção escrita</label>
        <textarea
          id="diagnostic-writing"
          lang="en"
          rows={5}
          maxLength={5000}
          value={written}
          onChange={(e) => draft("writing", e.target.value)}
        />
        {criteria.map((c) => (
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
        <button
          className="button"
          disabled={!oral.trim() || !written.trim()}
          onClick={finish}
        >
          Salvar diagnóstico de produção
        </button>
        {saved && (
          <div className="feedback success" role="status">
            <h3>Você tem um ponto de comparação.</h3>
            <p>
              Repita a tarefa depois de estudar e compare clareza, detalhes e
              autonomia.
            </p>
            <Link className="text-link" to="/progress">
              Ver evidências por habilidade
              <ArrowRight size={16} />
            </Link>
            <Link className="text-link" to="/course">
              Seguir a trilha de aulas
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>
      <section className="panel">
        <h2>Escolha um ponto de partida</h2>
        <p>
          Use seus resultados e a dificuldade percebida. Você pode mudar de
          nível sem perder o histórico.
        </p>
        <button
          className="button secondary"
          onClick={() => {
            update((s) => ({
              ...s,
              profile: {
                ...s.profile,
                initialLevel: level,
                updatedAt: new Date().toISOString(),
              },
            }));
            notify("Seu ponto de partida agora é " + level + ".");
          }}
        >
          Usar {level} como ponto de partida
        </button>
        <p className="muted">{coursePaths[level].goal}</p>
      </section>
    </>
  );
}
export default function Practice() {
  return (
    <Routes>
      <Route index element={<PracticeHome />} />
      <Route path="errors" element={<Errors />} />
      <Route path="pronunciation" element={<Pronunciation />} />
      <Route path="projects" element={<ProjectList />} />
      <Route
        path="projects/:id"
        element={<Project key={location.pathname} />}
      />
      <Route path="diagnostic" element={<Diagnostic />} />
      <Route path="*" element={<PracticeHome />} />
    </Routes>
  );
}
