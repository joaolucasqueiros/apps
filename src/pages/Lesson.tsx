import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Flag,
  Lightbulb,
  Plus,
  RotateCcw,
} from "lucide-react";
import { lessonById } from "../content/lessons";
import { useLearning } from "../hooks/useLearning";
import { AudioButton, Badge, Progress } from "../components/ui";
import { Exercise } from "../components/Exercise";
import { makeCard } from "../utils/learning";
import { videos } from "../content/videos";
import { VideoPlayer } from "../components/VideoPlayer";
export function Lesson() {
  const { id } = useParams();
  const lesson = lessonById(id || "");
  const { state, update, notify } = useLearning();
  const [guided, setGuided] = useState(false);
  if (!lesson)
    return (
      <>
        <h1>Aula não encontrada</h1>
        <Link to="/course">Explorar meu curso</Link>
      </>
    );
  const l = lesson;
  const progress = state.lessons.find((p) => p.id === l.id);
  const step = progress?.index || 0;
  const n = l.exercises.length;
  const summaryStep = n + 1;
  const finalStep = summaryStep + 1 + l.assessment.length;
  const go = (index: number) => {
    const now = new Date().toISOString();
    update((s) => ({
      ...s,
      lastLesson: l.id,
      lessons: [
        ...s.lessons.filter((p) => p.id !== l.id),
        {
          id: l.id,
          index,
          completed: progress?.completed || false,
          updatedAt: now,
        },
      ],
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const exercise =
    step >= 1 && step <= n
      ? l.exercises[step - 1]
      : step > summaryStep && step < finalStep
        ? l.assessment[step - summaryStep - 1]
        : undefined;
  const practiced = l.exercises.every((e) =>
    state.attempts.some((a) => a.exerciseId === e.id),
  );
  const finalCorrect = l.assessment.filter(
    (e) => state.attempts.filter((a) => a.exerciseId === e.id).at(-1)?.correct,
  ).length;
  const finish = () => {
    if (practiced && finalCorrect === l.assessment.length) {
      const now = new Date().toISOString();
      update((s) => ({
        ...s,
        lessons: [
          ...s.lessons.filter((p) => p.id !== l.id),
          { id: l.id, index: finalStep, completed: true, updatedAt: now },
        ],
      }));
    } else go(finalStep);
  };
  return (
    <div className="lesson-page">
      <Link to="/course" className="back-link">
        <ArrowLeft size={16} />
        Meu curso
      </Link>
      <div className="lesson-header">
        <div className="badge-row">
          <Badge>{l.level}</Badge>
          <span>GRAMÁTICA</span>
          <span>
            <Clock size={14} />
            {l.minutes} min
          </span>
        </div>
        <h1>{l.title}</h1>
        <p>{l.subtitle}</p>
        <Progress value={(step / finalStep) * 100} />
      </div>
      <nav className="lesson-tabs" aria-label="Etapas da aula">
        <button className={step === 0 ? "active" : ""} onClick={() => go(0)}>
          1. Descobrir
        </button>
        <button
          className={step > 0 && step <= n ? "active" : ""}
          onClick={() => go(Math.min(Math.max(1, step), n))}
        >
          2. Praticar
        </button>
        <button
          className={step > n ? "active" : ""}
          onClick={() => go(summaryStep)}
        >
          3. Revisar e avaliar
        </button>
      </nav>
      {step === 0 && (
        <>
          <section className="panel lesson-section">
            <span className="eyebrow">AO FINAL, VOCÊ VAI CONSEGUIR</span>
            <ul className="objectives">
              {l.objectives.map((o) => (
                <li key={o}>
                  <Check size={16} />
                  {o}
                </li>
              ))}
            </ul>
            {l.prerequisites.length > 0 && (
              <p className="muted">
                Vale retomar:{" "}
                {l.prerequisites.map((p) => (
                  <Link key={p} to={`/lesson/${p}`}>
                    {lessonById(p)?.title}
                  </Link>
                ))}
              </p>
            )}
            <h2>Vamos entender a ideia.</h2>
            {l.explanation.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <div className="formula" aria-label="Estrutura da regra">
              {l.formula.map((part, i) => (
                <span key={part}>
                  {i > 0 && <b>+</b>}
                  <strong>{part}</strong>
                </span>
              ))}
            </div>
            {l.id === "simple-past" && (
              <div className="timeline">
                <span>
                  <b>Yesterday</b>
                  <small>I worked.</small>
                </span>
                <span>
                  <b>Today</b>
                  <small>I work.</small>
                </span>
                <span>
                  <b>Tomorrow</b>
                  <small>I will work.</small>
                </span>
              </div>
            )}
          </section>
          <section className="lesson-section">
            <h2>Veja a regra ganhar vida.</h2>
            <div className="example-list">
              {l.examples.map((e) => (
                <article className="example-card" key={e.en}>
                  <div>
                    <h3 lang="en">{e.en}</h3>
                    <p>{e.pt}</p>
                  </div>
                  <AudioButton text={e.en} compact />
                  <button
                    className="icon-button"
                    aria-label={`Salvar frase: ${e.en}`}
                    onClick={() => {
                      if (
                        state.cards.some((c) => !c.deleted && c.front === e.en)
                      ) {
                        notify("Esta frase já está nos seus flashcards.");
                        return;
                      }
                      update((s) => ({
                        ...s,
                        cards: [...s.cards, makeCard(e.en, e.pt, l.title)],
                      }));
                      notify("Frase salva nos flashcards.");
                    }}
                  >
                    <Plus size={17} />
                  </button>
                </article>
              ))}
            </div>
          </section>
          <section className="mistake-card">
            <Lightbulb size={21} />
            <div>
              <h3>Um erro comum. Uma boa descoberta.</h3>
              <p className="wrong" lang="en">
                {l.mistake.wrong}
              </p>
              <p className="right" lang="en">
                {l.mistake.right}
              </p>
              <p>{l.mistake.why}</p>
            </div>
          </section>
          <section className="panel lesson-section">
            <span className="eyebrow">NA VIDA REAL</span>
            <p>{l.context}</p>
            <h3>Vamos fazer uma juntos?</h3>
            <p className="exercise-sentence" lang="en">
              {l.guided.prompt}
            </p>
            <button
              className="button secondary"
              onClick={() => setGuided(!guided)}
            >
              {guided ? "Ocultar explicação" : "Ver solução guiada"}
              <Lightbulb size={16} />
            </button>
            {guided && (
              <div className="feedback success">
                <strong>{l.guided.answer}</strong>
                <p>{l.guided.why}</p>
              </div>
            )}
          </section>
          {videos
            .filter((v) => v.lessonId === l.id)
            .map((v) => (
              <VideoPlayer key={v.id} video={v} />
            ))}
          <div className="lesson-action">
            <span>Agora é com você. Errar também é aprender.</span>
            <button className="button" onClick={() => go(1)}>
              Praticar o que aprendi
              <ArrowRight size={17} />
            </button>
          </div>
        </>
      )}
      {exercise && (
        <>
          <div className="practice-topline">
            <span>
              {step <= n
                ? `Exercício ${step} de ${n}`
                : `Avaliação ${step - summaryStep} de ${l.assessment.length}`}
            </span>
            <span>
              {step <= n
                ? "Prática com feedback"
                : "Questões reservadas para avaliação"}
            </span>
          </div>
          <Exercise
            key={exercise.id}
            exercise={exercise}
            assessment={step > summaryStep}
            onNext={() => (step + 1 === finalStep ? finish() : go(step + 1))}
          />
        </>
      )}
      {step === summaryStep && (
        <section className="panel summary-card">
          <span className="stat-icon green">
            <Flag size={25} />
          </span>
          <h2>Leve esta ideia com você.</h2>
          <p>{l.summary}</p>
          <div className="info-note">
            Conclusão: pratique os {n} exercícios e acerte as{" "}
            {l.assessment.length} questões de avaliação. As respostas ficam no
            seu histórico, incluindo tentativas anteriores.
          </div>
          {!practiced && <p>Você ainda tem exercícios para praticar.</p>}
          <button
            className="button"
            onClick={() => go(practiced ? summaryStep + 1 : 1)}
          >
            {practiced ? "Avaliar meu aprendizado" : "Continuar a prática"}
            <ArrowRight size={16} />
          </button>
        </section>
      )}
      {step >= finalStep && (
        <section className="panel summary-card">
          <span
            className={`stat-icon ${progress?.completed ? "green" : "peach"}`}
          >
            <CheckCircle2 size={28} />
          </span>
          <h2>
            {progress?.completed
              ? "Mais um passo no seu caminho."
              : "Você encontrou o que precisa reforçar."}
          </h2>
          <p>
            {finalCorrect} de {l.assessment.length} acertos na avaliação mais
            recente.
          </p>
          <p>
            {progress?.completed
              ? "Aula concluída. Volte para revisar quando quiser."
              : "Releia a regra, reveja os erros e tente a avaliação novamente. Seu histórico continua salvo."}
          </p>
          <div className="button-row">
            <button
              className="button secondary"
              onClick={() => go(progress?.completed ? 0 : 1)}
            >
              <RotateCcw size={16} />
              Revisitar aula
            </button>
            {!progress?.completed && (
              <button className="button" onClick={() => go(summaryStep + 1)}>
                Refazer avaliação
                <ArrowRight size={16} />
              </button>
            )}
            <Link
              className={`button ${progress?.completed ? "" : "secondary"}`}
              to="/course"
            >
              Explorar meu curso
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
