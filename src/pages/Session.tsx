import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useLearning } from "../hooks/useLearning";
import { selectPractice } from "../practice/adaptive";
import { ExerciseContext } from "../practice/ExerciseContext";
import { questionBank } from "../assessments/engine";
import { uid } from "../utils/learning";
import { PageTitle, Badge, Progress } from "../components/ui";
import { Exercise } from "../components/Exercise";
export function Session() {
  const { minutes } = useParams();
  const duration = [5, 15, 30].includes(Number(minutes)) ? Number(minutes) : 5;
  const { state, update } = useLearning();
  const start = () => {
    const chosen = selectPractice(state, duration);
    update((s) => ({
      ...s,
      activeSession: {
        id: uid(),
        minutes: duration,
        questionIds: chosen.map((q) => q.id),
        index: 0,
        results: [],
        completed: false,
      },
    }));
  };
  useEffect(() => {
    if (!state.activeSession || state.activeSession.minutes !== duration)
      start();
  }, [duration]);
  const active = state.activeSession;
  if (!active || active.minutes !== duration)
    return <p role="status">Preparando sua sessão…</p>;
  const pool = active.questionIds
    .map((id) => questionBank.find((q) => q.id === id))
    .filter((q) => !!q);
  const q = pool[active.index];
  const correct = active.results.filter((r) => r.correct).length;
  return (
    <>
      <PageTitle
        eyebrow="UMA SESSÃO QUE CABE NO SEU DIA"
        title={
          active.completed
            ? "Esse tempo foi seu."
            : `Seu próximo passo em ${duration} minutos.`
        }
        description="Uma sugestão de duração, sem cronômetro obrigatório. Você pode parar quando precisar."
      />
      {active.completed ? (
        <section className="panel summary-card">
          <span className="stat-icon green">
            <CheckCircle2 size={28} />
          </span>
          <h2>Você abriu espaço para aprender.</h2>
          <p>
            {correct} acertos em {pool.length} atividades. Todas as tentativas
            estão no seu histórico.
          </p>
          <p>
            Revise as explicações dos erros e volte às aulas quando quiser
            aprofundar.
          </p>
          <div className="button-row">
            <Link className="button" to="/reviews">
              Revisar o que fica
              <ArrowRight size={16} />
            </Link>
            <button className="button secondary" onClick={start}>
              Começar nova sessão
            </button>
            <Link className="button secondary" to="/conversation">
              Praticar uma conversa
            </Link>
            <Link className="button secondary" to="/writing">
              Escrever com propósito
            </Link>
            <Link className="button secondary" to="/progress">
              Ver minha evolução
            </Link>
          </div>
        </section>
      ) : q && pool.length === active.questionIds.length ? (
        <>
          <div className="practice-topline">
            <Badge>{duration} MIN · SEU RITMO</Badge>
            <span>
              {active.index + 1} de {pool.length} atividades
            </span>
          </div>
          <Progress value={(active.index / pool.length) * 100} />
          <ExerciseContext exercise={q} />
          <Exercise
            key={`${active.id}-${q.id}`}
            exercise={q}
            savedAnswer={
              active.results.find((r) => r.exerciseId === q.id)?.answer
            }
            onResult={(correct, answer) =>
              update((s) => ({
                ...s,
                activeSession: s.activeSession
                  ? {
                      ...s.activeSession,
                      results: [
                        ...s.activeSession.results.filter(
                          (r) => r.exerciseId !== q.id,
                        ),
                        { exerciseId: q.id, answer, correct },
                      ],
                    }
                  : undefined,
              }))
            }
            onNext={() =>
              update((s) => ({
                ...s,
                activeSession: s.activeSession
                  ? {
                      ...s.activeSession,
                      index:
                        active.index === pool.length - 1
                          ? active.index
                          : active.index + 1,
                      completed: active.index === pool.length - 1,
                    }
                  : undefined,
              }))
            }
          />
          <p className="muted">
            Sua sessão fica salva para continuar depois, inclusive após
            recarregar.
          </p>
        </>
      ) : (
        <section className="panel">
          <h2>O conteúdo desta sessão mudou.</h2>
          <p>
            Suas respostas continuam no histórico. Inicie uma nova seleção de
            atividades.
          </p>
          <button className="button" onClick={start}>
            Preparar nova sessão
          </button>
        </section>
      )}
    </>
  );
}
