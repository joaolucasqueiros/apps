import { useState } from "react";
import {
  ArrowRight,
  ClipboardCheck,
  Target,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { PageTitle, Badge, Progress, AudioButton } from "../components/ui";
import { Exercise } from "../components/Exercise";
import { useLearning } from "../hooks/useLearning";
import { questionBank, selectAssessment } from "../assessments/engine";
import { lessons } from "../content/lessons";
import { listeningStories, readingStories } from "../content/stories";
import { uid, skillNames } from "../utils/learning";
import type { Level, TestResult } from "../types";
export function Tests() {
  const { state, update } = useLearning();
  const [level, setLevel] = useState<Level>("A2");
  const [topic, setTopic] = useState("simple-past");
  const [finished, setFinished] = useState<TestResult | null>(null);
  const active = state.activeAssessment;
  const pool =
    active?.questionIds
      .map((id) => questionBank.find((q) => q.id === id))
      .filter((q) => !!q) || [];
  const q = active ? pool[active.index] : undefined;
  const start = (kind: "diagnostic" | "module" | "level") => {
    const qs = selectAssessment(
      state.tests,
      kind === "level" ? level : undefined,
      kind === "module" ? topic : undefined,
      "speechSynthesis" in window,
    );
    if (!qs.length) return;
    const name =
      kind === "diagnostic"
        ? "Diagnóstico inicial"
        : kind === "module"
          ? `Avaliação · ${lessons.find((l) => l.id === topic)?.title}`
          : `Simulado de progressão · ${level}`;
    setFinished(null);
    update((s) => ({
      ...s,
      activeAssessment: {
        id: uid(),
        name,
        level: kind === "level" ? level : undefined,
        questionIds: qs.map((q) => q.id),
        index: 0,
        results: [],
      },
    }));
  };
  const finish = () => {
    if (!active) return;
    const result: TestResult = {
      id: active.id,
      name: active.name,
      date: new Date().toISOString(),
      level: active.level,
      answers: active.results.map(({ exerciseId, correct, skill }) => ({
        exerciseId,
        correct,
        skill,
      })),
    };
    update((s) => ({
      ...s,
      activeAssessment: undefined,
      tests: [...s.tests.filter((t) => t.id !== result.id), result],
    }));
    setFinished(result);
  };
  const story =
    q && [...listeningStories, ...readingStories].find((s) => s.id === q.topic);
  const percent = finished?.answers.length
    ? Math.round(
        (finished.answers.filter((r) => r.correct).length /
          finished.answers.length) *
          100,
      )
    : 0;
  return (
    <>
      <PageTitle
        eyebrow="DESCUBRA SEU PRÓXIMO PASSO"
        title="Entenda o que já faz sentido."
        description="Avaliações com correção explicativa. Um retrato do seu aprendizado, sem pressão."
      />
      {active && q && pool.length === active.questionIds.length ? (
        <>
          <section className="assessment-header">
            <div>
              <Badge>AVALIAÇÃO EM ANDAMENTO</Badge>
              <h2>{active.name}</h2>
            </div>
            <span>
              {active.index + 1} de {pool.length}
            </span>
            <Progress value={(active.index / pool.length) * 100} />
          </section>
          {story && (
            <section className="panel">
              <h3>{story.title}</h3>
              {q.skill === "listening" ? (
                <>
                  <p className="muted">
                    Áudio sintetizado · ouça antes de responder.
                  </p>
                  <AudioButton
                    text={story.text}
                    label="Ouvir conteúdo da avaliação"
                  />
                </>
              ) : (
                <p lang="en" className="story-text">
                  {story.text}
                </p>
              )}
            </section>
          )}
          <Exercise
            key={`${active.id}-${q.id}`}
            exercise={q}
            assessment
            savedAnswer={
              active.results.find((r) => r.exerciseId === q.id)?.answer
            }
            onResult={(correct, answer) =>
              update((s) => ({
                ...s,
                activeAssessment: s.activeAssessment
                  ? {
                      ...s.activeAssessment,
                      results: [
                        ...s.activeAssessment.results.filter(
                          (r) => r.exerciseId !== q.id,
                        ),
                        { exerciseId: q.id, correct, skill: q.skill, answer },
                      ],
                    }
                  : undefined,
              }))
            }
            onNext={() =>
              active.index === pool.length - 1
                ? finish()
                : update((s) => ({
                    ...s,
                    activeAssessment: s.activeAssessment
                      ? {
                          ...s.activeAssessment,
                          index: s.activeAssessment.index + 1,
                        }
                      : undefined,
                  }))
            }
          />
          <p className="muted">
            Sua posição e suas respostas estão salvas. Você pode sair e
            continuar esta avaliação depois.
          </p>
        </>
      ) : active ? (
        <section className="panel">
          <h2>O conteúdo desta avaliação foi atualizado.</h2>
          <p>
            As questões salvas não correspondem à versão atual. Suas respostas
            anteriores permanecem no histórico.
          </p>
          <button
            className="button"
            onClick={() =>
              update((s) => ({ ...s, activeAssessment: undefined }))
            }
          >
            Escolher nova avaliação
          </button>
        </section>
      ) : finished ? (
        <section className="panel assessment-result">
          <span className="stat-icon green">
            <CheckCircle2 size={30} />
          </span>
          <h2>Um retrato do que você aprendeu.</h2>
          <strong className="result-score">{percent}%</strong>
          <p>
            {finished.answers.filter((r) => r.correct).length} acertos em{" "}
            {finished.answers.length} questões.
          </p>
          <div className="skill-results">
            {Array.from(new Set(finished.answers.map((r) => r.skill))).map(
              (skill) => {
                const rs = finished.answers.filter((r) => r.skill === skill);
                return (
                  <div key={skill}>
                    <span>{skillNames[skill]}</span>
                    <strong>
                      {rs.filter((r) => r.correct).length}/{rs.length}
                    </strong>
                    <Progress
                      value={
                        (rs.filter((r) => r.correct).length / rs.length) * 100
                      }
                    />
                  </div>
                );
              },
            )}
          </div>
          <p>
            {percent >= 80
              ? "Bom aproveitamento nesta amostra. Continue praticando em novos contextos."
              : "Use os erros como guia: revise as explicações e retome os tópicos com mais dificuldade."}
          </p>
          <p className="info-note">
            Resultado limitado às questões e habilidades avaliadas. Não é
            certificação nem estimativa completa de CEFR. Speaking e escrita
            livre não foram avaliados.
          </p>
          <button className="button" onClick={() => setFinished(null)}>
            Voltar às avaliações
            <ArrowRight size={16} />
          </button>
        </section>
      ) : (
        <>
          <div className="assessment-grid">
            <article className="panel">
              <span className="stat-icon blue">
                <Target size={23} />
              </span>
              <h2>Onde estou agora?</h2>
              <p>
                Diagnóstico com até 12 questões reservadas de gramática,
                vocabulário, leitura e listening, quando há síntese disponível.
              </p>
              <Badge tone="neutral">Amostra de A1 a C1</Badge>
              <button className="button" onClick={() => start("diagnostic")}>
                Fazer diagnóstico
                <ArrowRight size={16} />
              </button>
            </article>
            <article className="panel">
              <span className="stat-icon peach">
                <BookOpen size={23} />
              </span>
              <h2>Uma ideia de cada vez.</h2>
              <p>
                Confira a compreensão de uma unidade com questões que não
                aparecem nos exercícios de estudo.
              </p>
              <label className="sr-only" htmlFor="test-topic">
                Unidade
              </label>
              <select
                id="test-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                {lessons.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </select>
              <button
                className="button secondary"
                onClick={() => start("module")}
              >
                Avaliar unidade
                <ArrowRight size={16} />
              </button>
            </article>
            <article className="panel">
              <span className="stat-icon lavender">
                <ClipboardCheck size={23} />
              </span>
              <h2>Pronto para avançar?</h2>
              <p>
                Até 12 questões do nível escolhido. O número varia conforme o
                banco disponível; priorizamos questões menos vistas.
              </p>
              <label className="sr-only" htmlFor="test-level">
                Nível
              </label>
              <select
                id="test-level"
                value={level}
                onChange={(e) => setLevel(e.target.value as Level)}
              >
                {["A1", "A2", "B1", "B2", "C1"].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <button
                className="button secondary"
                onClick={() => start("level")}
              >
                Começar simulado
                <ArrowRight size={16} />
              </button>
            </article>
          </div>
          <section className="panel test-history">
            <h2>Seu histórico de avaliações</h2>
            {state.tests.length ? (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Avaliação</th>
                      <th>Data</th>
                      <th>Questões</th>
                      <th>Aproveitamento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...state.tests].reverse().map((t) => (
                      <tr key={t.id}>
                        <td>{t.name}</td>
                        <td>{new Date(t.date).toLocaleDateString("pt-BR")}</td>
                        <td>{t.answers.length}</td>
                        <td>
                          {t.answers.length
                            ? Math.round(
                                (t.answers.filter((a) => a.correct).length /
                                  t.answers.length) *
                                  100,
                              )
                            : 0}
                          %
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="muted">
                Sua primeira avaliação vai aparecer aqui. Você também pode
                começar pelas aulas.
              </p>
            )}
          </section>
        </>
      )}
    </>
  );
}
