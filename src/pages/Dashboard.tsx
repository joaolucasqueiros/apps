import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  BookOpen,
  CheckCheck,
  Target,
  Headphones,
  Layers,
  Lightbulb,
  TrendingUp,
  Sparkles,
  Play,
} from "lucide-react";
import { useLearning } from "../hooks/useLearning";
import { lessons, lessonById, priorities } from "../content/lessons";
import { mastery } from "../utils/learning";
import { Badge, PathArt, Progress, SectionTitle } from "../components/ui";
export function ActivityChart({ days = 7 }: { days?: number }) {
  const { state } = useLearning();
  const today = new Date();
  const count = days === 7 ? 7 : days === 30 ? 10 : 15;
  const bucket = Math.ceil(days / count);
  const data = Array.from({ length: count }, (_, i) => {
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);
    end.setDate(end.getDate() - (count - 1 - i) * bucket);
    const start = new Date(end);
    start.setDate(start.getDate() - bucket + 1);
    start.setHours(0, 0, 0, 0);
    const a = state.attempts.filter(
      (a) => Date.parse(a.date) >= +start && Date.parse(a.date) <= +end,
    );
    return {
      label: end.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: days === 7 ? undefined : "2-digit",
        weekday: days === 7 ? "short" : undefined,
      }),
      value: a.length,
      correct: a.filter((a) => a.correct).length,
    };
  });
  const max = Math.max(5, ...data.map((d) => d.value));
  return (
    <div
      className="activity-chart"
      aria-label={`Atividades nos últimos ${days} dias`}
    >
      <div className="chart-y">
        <span>{max}</span>
        <span>{Math.round(max / 2)}</span>
        <span>0</span>
      </div>
      <div className="chart-plot">
        <div className="chart-grid" />
        <div className="chart-bars">
          {data.map((d, i) => (
            <div className="chart-column" key={i}>
              <div className="chart-bar-wrapper">
                <button
                  className={`chart-bar ${d.value ? "" : "zero"}`}
                  style={{ height: `${Math.max(2, (d.value / max) * 100)}%` }}
                  aria-label={`${d.label}: ${d.value} exercícios, ${d.correct} acertos`}
                  title={`${d.value} exercícios · ${d.correct} acertos`}
                >
                  <span>{d.value}</span>
                </button>
              </div>
              <small>{d.label}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export function Dashboard() {
  const { state } = useLearning();
  const [days, setDays] = useState(7);
  const lesson = lessonById(state.lastLesson) || lessons[0];
  const resume = state.activeAssessment
    ? "/tests"
    : state.activeSession && !state.activeSession.completed
      ? `/session/${state.activeSession.minutes}`
      : `/lesson/${lesson.id}`;
  const completed = state.lessons.filter((l) => l.completed).length;
  const levelLessons = lessons.filter((l) => l.level === "A2");
  const levelDone = state.lessons.filter(
    (l) => l.completed && levelLessons.some((x) => x.id === l.id),
  ).length;
  const due = state.cards.filter(
    (c) => !c.deleted && Date.parse(c.due) <= Date.now(),
  ).length;
  const errors = lessons.filter(
    (l) => mastery(state.attempts, l.id).label === "Precisa de revisão",
  );
  const recommended = (
    errors.length
      ? errors
      : priorities
          .map((id) => lessonById(id)!)
          .filter((l) => !state.lessons.find((p) => p.id === l.id)?.completed)
  ).slice(0, 3);
  const minutes = Math.floor(
    state.sessions.reduce((n, s) => n + s.seconds, 0) / 60,
  );
  const answered = new Set(state.attempts.map((a) => a.exerciseId)).size;
  return (
    <>
      <PageGreeting name={state.profile.name} />
      <section className="hero-card">
        <div className="hero-copy">
          <Badge>SEU INGLÊS, NO SEU RITMO</Badge>
          <h2>
            Um pouco hoje.
            <br />
            Mais confiança amanhã.
          </h2>
          <p>
            Você não precisa de uma rotina perfeita.
            <br />
            Só de um próximo passo que cabe no seu dia.
          </p>
          <Link className="button" to={resume}>
            Continuar estudando
            <ArrowRight size={17} />
          </Link>
          <span className="hero-footnote">
            <span className="status-dot" /> Do ponto em que você parou, sempre.
          </span>
        </div>
        <PathArt goal={state.profile.goal} />
      </section>
      <section className="stats-grid" aria-label="Seu progresso">
        <div className="stat-card">
          <span className="stat-icon blue">
            <Target size={19} />
          </span>
          <span>
            Nível de partida
            <strong>
              {state.profile.initialLevel}{" "}
              <small>→ Objetivo {state.profile.goal}</small>
            </strong>
            <small>
              Estimativa inicial · fazer <Link to="/tests">diagnóstico</Link>
            </small>
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-icon green">
            <BookOpen size={19} />
          </span>
          <span>
            Aulas concluídas
            <strong>
              {completed.toString().padStart(2, "0")}{" "}
              <small>/ {lessons.length}</small>
            </strong>
            <small>Cada descoberta conta</small>
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-icon peach">
            <Clock size={19} />
          </span>
          <span>
            Tempo de estudo
            <strong>
              {minutes} <small>min</small>
            </strong>
            <small>No seu próprio ritmo</small>
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-icon lavender">
            <CheckCheck size={19} />
          </span>
          <span>
            Exercícios praticados
            <strong>{answered.toString().padStart(2, "0")}</strong>
            <small>Conhecimento em construção</small>
          </span>
        </div>
      </section>
      <SectionTitle title="Quanto tempo você tem agora?" />
      <section className="session-grid">
        {[
          {
            n: 5,
            tag: "Um pequeno passo",
            desc: "Uma pausa, três exercícios e uma nova descoberta.",
            icon: Sparkles,
            color: "peach",
          },
          {
            n: 15,
            tag: "Entre no ritmo",
            desc: "Uma prática guiada para fortalecer o que você sabe.",
            icon: BookOpen,
            color: "green",
          },
          {
            n: 30,
            tag: "Vá um pouco além",
            desc: "Gramática, listening e uma revisão dos seus erros.",
            icon: Headphones,
            color: "blue",
          },
        ].map(({ n, tag, desc, icon: Icon, color }) => (
          <Link className="session-card" key={n} to={`/session/${n}`}>
            <span className={`stat-icon ${color}`}>
              <Icon size={18} />
            </span>
            <div>
              <h3>
                Tenho {n} minutos <ArrowUpRight size={17} />
              </h3>
              <strong>{tag}</strong>
              <p>{desc}</p>
            </div>
          </Link>
        ))}
      </section>
      <div className="dashboard-columns">
        <div>
          <SectionTitle
            title="Seu próximo capítulo"
            link="/course"
            label="Explorar meu curso"
          />
          <article className="continue-card">
            <div className="lesson-cover">
              <span>ENGLISH IN REAL LIFE</span>
              <div className="cover-timeline">
                <span>yesterday</span>
                <span>today</span>
                <span>tomorrow</span>
                <i />
              </div>
              <strong lang="en">
                I worked
                <br />
                <em>yesterday.</em>
              </strong>
              <div className="cover-bottom">
                A2 <span>✦</span> BUILD YOUR CONFIDENCE
              </div>
            </div>
            <div className="continue-copy">
              <div className="badge-row">
                <Badge>{lesson.level}</Badge>
                <span>GRAMÁTICA · {lesson.minutes} MIN</span>
              </div>
              <h3>{lesson.title}</h3>
              <p>{lesson.subtitle}</p>
              <div className="progress-label">
                <span>Seu progresso nesta aula</span>
                <strong>
                  {Math.min(
                    100,
                    Math.round(
                      ((state.lessons.find((l) => l.id === lesson.id)?.index ||
                        0) /
                        11) *
                        100,
                    ),
                  )}
                  %
                </strong>
              </div>
              <Progress
                value={
                  ((state.lessons.find((l) => l.id === lesson.id)?.index || 0) /
                    11) *
                  100
                }
              />
              <Link to={`/lesson/${lesson.id}`} className="text-link">
                {state.lessons.some((l) => l.id === lesson.id)
                  ? "Retomar aula"
                  : "Começar aula"}
                <ArrowRight size={16} />
              </Link>
            </div>
          </article>
          <div className="panel activity-panel">
            <div className="section-title">
              <div>
                <h2>Seu caminho, em movimento</h2>
                <p>Pequenos passos que se somam.</p>
              </div>
              <div className="segmented" aria-label="Período">
                {[7, 30, 90].map((n) => (
                  <button
                    key={n}
                    aria-pressed={days === n}
                    className={days === n ? "active" : ""}
                    onClick={() => setDays(n)}
                  >
                    {n} dias
                  </button>
                ))}
              </div>
            </div>
            <ActivityChart days={days} />
            {!state.attempts.length && (
              <p className="chart-empty-caption">
                Seu primeiro exercício vai dar início a esta história.
              </p>
            )}
            <div className="chart-legend">
              <span className="status-dot" /> Exercícios praticados{" "}
              <Link to="/progress">
                Ver minha evolução
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
        <div>
          <SectionTitle title="Uma boa hora para revisar" />
          <section className="review-card">
            <span className="review-illustration">
              <Layers size={26} />
              <span>{due}</span>
            </span>
            <h3>
              {due
                ? `${due} cartões esperam por você`
                : "Seu conhecimento merece ficar"}
            </h3>
            <p>
              {due
                ? "Revisitar uma ideia é o que faz ela ficar. Sem pressa."
                : "Salve as palavras que encontrar nas aulas e revise no momento certo."}
            </p>
            <Link
              to={due ? "/reviews" : "/vocabulary"}
              className="button secondary"
            >
              {due ? "Começar revisão" : "Explorar palavras"}
              <ArrowRight size={16} />
            </Link>
          </section>
          <section className="milestone-card">
            <div className="milestone-icon">
              <TrendingUp size={21} />
            </div>
            <h3>Próximo marco: {state.profile.goal}</h3>
            <p>Mais autonomia nas conversas do dia a dia.</p>
            <div className="progress-label">
              <span>Fundamentos de A2</span>
              <strong>
                {levelDone}/{levelLessons.length}
              </strong>
            </div>
            <Progress value={(levelDone / levelLessons.length) * 100} />
            <small>
              Aulas concluídas · não equivale a uma certificação CEFR.
            </small>
          </section>
          <div className="gentle-note">
            <Lightbulb size={19} />
            <p>
              Erros são pistas, não obstáculos.
              <br />
              <strong>Eles mostram seu próximo passo.</strong>
            </p>
          </div>
        </div>
      </div>
      <SectionTitle
        title="Escolhido para o seu caminho"
        link="/grammar"
        label="Ver conteúdos"
      />
      <div className="recommendation-grid">
        {recommended.map((l, i) => (
          <Link
            className="recommendation-card"
            key={l.id}
            to={`/lesson/${l.id}`}
          >
            <span className={`stat-icon ${["blue", "peach", "lavender"][i]}`}>
              <BookOpen size={20} />
            </span>
            <Badge tone="neutral">{l.level}</Badge>
            <h3>{l.title}</h3>
            <p>
              {errors.includes(l)
                ? "Reforço recomendado a partir das suas respostas."
                : l.subtitle}
            </p>
            <div>
              <span>{l.minutes} min · Gramática</span>
              <Play size={16} />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
function PageGreeting({ name }: { name: string }) {
  const date = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return (
    <div className="greeting">
      <div>
        <span className="eyebrow">BOM TER VOCÊ POR AQUI</span>
        <h1>
          {name === "Estudante" ? "Olá, vamos aprender?" : `Olá, ${name}!`}{" "}
          <span className="greeting-sun">☀</span>
        </h1>
        <p>Um novo dia, uma nova oportunidade de se expressar.</p>
      </div>
      <span className="date-label">{date}</span>
    </div>
  );
}
