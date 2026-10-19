import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CheckCheck,
  Clock,
  Award,
  ArrowRight,
  Layers,
} from "lucide-react";
import { useLearning } from "../hooks/useLearning";
import { lessons } from "../content/lessons";
import { mastery, skillNames } from "../utils/learning";
import { PageTitle, Progress as Bar, Empty, Badge } from "../components/ui";
import { ActivityChart } from "./Dashboard";
import type { Skill } from "../types";
export function ProgressPage() {
  const { state } = useLearning();
  const [days, setDays] = useState(30);
  const scored = state.attempts.filter(
    (a) => a.number === 1 && !a.selfAssessed && !a.assisted,
  );
  const correct = scored.filter((a) => a.correct).length;
  const totalSeconds = state.sessions.reduce((a, s) => a + s.seconds, 0);
  const reviews = state.cards.reduce((a, c) => a + c.reviews.length, 0);
  const done = state.lessons.filter((l) => l.completed).length;
  const achievements = [
    {
      title: "Primeira descoberta",
      desc: "Seu primeiro exercício praticado.",
      earned: state.attempts.length > 0,
      icon: CheckCheck,
    },
    {
      title: "Um capítulo seu",
      desc: "Uma aula concluída, do começo à avaliação.",
      earned: done > 0,
      icon: BookOpen,
    },
    {
      title: "Palavras que ficam",
      desc: "Cinco flashcards salvos na coleção.",
      earned: state.cards.filter((c) => !c.deleted).length >= 5,
      icon: Layers,
    },
    {
      title: "Uma nova conexão",
      desc: "Dez revisões espaçadas realizadas.",
      earned: reviews >= 10,
      icon: Award,
    },
  ];
  return (
    <>
      <PageTitle
        eyebrow="CADA DESCOBERTA DEIXA UMA MARCA"
        title="Olhe o caminho que está construindo."
        description="Progresso de verdade, com espaço para pausas, erros e recomeços."
      />
      <div className="stats-grid">
        <div className="stat-card">
          <CheckCheck size={22} />
          <span>
            Respostas registradas<strong>{state.attempts.length}</strong>
            <small>
              {correct} acertos · {scored.length - correct} erros em primeiras
              tentativas sem ajuda
            </small>
          </span>
        </div>
        <div className="stat-card">
          <Clock size={22} />
          <span>
            Tempo com a página ativa
            <strong>
              {Math.floor(totalSeconds / 60)} <small>min</small>
            </strong>
          </span>
        </div>
        <div className="stat-card">
          <BookOpen size={22} />
          <span>
            Aulas concluídas<strong>{done}</strong>
          </span>
        </div>
        <div className="stat-card">
          <Layers size={22} />
          <span>
            Revisões realizadas<strong>{reviews}</strong>
          </span>
        </div>
      </div>
      <div className="dashboard-columns">
        <section className="panel">
          <div className="section-title">
            <h2>Pequenos passos, ao longo do tempo</h2>
            <div className="segmented">
              {[7, 30, 90].map((d) => (
                <button
                  aria-pressed={d === days}
                  key={d}
                  className={d === days ? "active" : ""}
                  onClick={() => setDays(d)}
                >
                  {d} dias
                </button>
              ))}
            </div>
          </div>
          <ActivityChart days={days} />
          {!state.attempts.length && (
            <p className="chart-empty-caption">
              Ainda sem dados. Seu primeiro exercício inicia o gráfico.
            </p>
          )}
        </section>
        <section className="panel skill-panel">
          <h2>Seu inglês por habilidade</h2>
          <p>Acertos na primeira tentativa, sem ajuda ou autoavaliação.</p>
          {(Object.keys(skillNames) as Skill[]).map((skill) => {
            const a = scored.filter((a) => a.skill === skill);
            const score = a.length
              ? Math.round((a.filter((x) => x.correct).length / a.length) * 100)
              : 0;
            return (
              <div className="skill-row" key={skill}>
                <div>
                  <span>{skillNames[skill]}</span>
                  <strong>{a.length ? `${score}%` : "Sem avaliação"}</strong>
                </div>
                <Bar value={score} />
                <small>
                  {a.length
                    ? `${a.length} respostas avaliadas`
                    : "Prática livre não gera nota de domínio"}
                </small>
              </div>
            );
          })}
        </section>
      </div>
      <section className="panel">
        <h2>O que seus resultados estão dizendo</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Conteúdo</th>
                <th>Classificação</th>
                <th>Aproveitamento</th>
                <th>Próximo passo</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((l) => {
                const m = mastery(state.attempts, l.id);
                return (
                  <tr key={l.id}>
                    <td>
                      {l.title}
                      <small className="table-small">
                        {l.level} · {m.count} primeiras tentativas
                      </small>
                    </td>
                    <td>
                      <Badge
                        tone={
                          m.label === "Precisa de revisão"
                            ? "peach"
                            : m.label === "Não iniciado"
                              ? "neutral"
                              : "green"
                        }
                      >
                        {m.label}
                      </Badge>
                    </td>
                    <td>{m.count ? `${m.score}%` : "—"}</td>
                    <td>
                      <Link to={`/lesson/${l.id}`}>
                        {m.label === "Precisa de revisão"
                          ? "Reforçar"
                          : "Explorar"}
                        <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <details>
          <summary>Regras transparentes de classificação</summary>
          <p>
            Consideramos até as últimas 20 primeiras tentativas por tópico. Não
            iniciado: nenhuma. Precisa de revisão: pelo menos 2 erros e menos de
            70%. Bom domínio: pelo menos 4 questões distintas e 80%.
            Consolidado: pelo menos 8 questões distintas, 90% e atividade em
            pelo menos 2 datas. Os demais casos ficam em aprendizagem.
            Tentativas com ajuda e autoavaliações não entram na pontuação.
          </p>
        </details>
      </section>
      <h2 className="standalone-heading">Conquistas sem pressa</h2>
      <div className="achievement-grid">
        {achievements.map(({ title, desc, earned, icon: Icon }) => (
          <article
            className={`panel achievement ${earned ? "earned" : ""}`}
            key={title}
          >
            <Icon size={26} />
            <h3>{title}</h3>
            <p>{desc}</p>
            <Badge tone={earned ? "green" : "neutral"}>
              {earned ? "Conquistado" : "No seu tempo"}
            </Badge>
          </article>
        ))}
      </div>
      <section className="panel">
        <h2>Estimativa de nível</h2>
        <p>
          Seu ponto de partida declarado é {state.profile.initialLevel} e seu
          objetivo é {state.profile.goal}. O banco é uma amostra de estudo,
          insuficiente para inferir um nível CEFR global. Veja o aproveitamento
          por nível nas avaliações, considerando apenas as habilidades
          amostradas.
        </p>
        {state.tests.length ? (
          <Link className="text-link" to="/tests">
            Ver histórico de avaliações
            <ArrowRight size={16} />
          </Link>
        ) : (
          <Link className="button secondary" to="/tests">
            Fazer diagnóstico
            <ArrowRight size={16} />
          </Link>
        )}
      </section>
      <section className="panel">
        <h2>Seu histórico de aprendizagem</h2>
        {state.attempts.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Conteúdo</th>
                  <th>Sua resposta</th>
                  <th>Registro</th>
                </tr>
              </thead>
              <tbody>
                {state.attempts
                  .slice(-50)
                  .reverse()
                  .map((a) => (
                    <tr key={a.id}>
                      <td>{new Date(a.date).toLocaleString("pt-BR")}</td>
                      <td>
                        {lessons.find((l) => l.id === a.topic)?.title ||
                          a.topic}
                        <small className="table-small">
                          {skillNames[a.skill]} · tentativa {a.number} ·{" "}
                          {a.seconds}s
                        </small>
                      </td>
                      <td className="answer-cell">{a.answer}</td>
                      <td>
                        {a.selfAssessed
                          ? "Autoavaliação"
                          : a.assisted
                            ? "Com apoio"
                            : a.correct
                              ? "Acerto"
                              : "Em revisão"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <p className="muted">
              Últimos 50 registros. O backup contém todo o histórico.
            </p>
          </div>
        ) : (
          <Empty title="Sua história ainda está começando." link="/course">
            Pratique uma aula e volte para ver seus resultados.
          </Empty>
        )}
      </section>
    </>
  );
}
