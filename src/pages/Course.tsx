import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Clock, Search, CheckCircle2 } from "lucide-react";
import { lessons, priorities } from "../content/lessons";
import { useLearning } from "../hooks/useLearning";
import { mastery } from "../utils/learning";
import { PageTitle, Progress, Badge, BookMark } from "../components/ui";
import type { Level } from "../types";
export function Course() {
  const { state } = useLearning();
  const grammar = useLocation().pathname === "/grammar";
  const [level, setLevel] = useState<Level | "Todos">(grammar ? "Todos" : "A2");
  const [search, setSearch] = useState("");
  const filtered = lessons
    .filter(
      (l) =>
        (level === "Todos" || l.level === level) &&
        `${l.title} ${l.subtitle}`.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      const rank = (id: string) => {
        const i = priorities.indexOf(id);
        return i < 0 ? 99 : i;
      };
      return rank(a.id) - rank(b.id);
    });
  const done = state.lessons.filter((l) => l.completed).length;
  return (
    <>
      <PageTitle
        eyebrow={
          grammar
            ? "ENTENDA, CONSTRUA, USE"
            : "UMA TRILHA. MUITAS POSSIBILIDADES."
        }
        title={
          grammar ? "Gramática que faz sentido." : "Seu inglês tem um caminho."
        }
        description="Aprenda com exemplos reais. Avance no seu ritmo e volte sempre que precisar."
      />
      <section className="course-banner">
        <div>
          <Badge>SEU OBJETIVO · {state.profile.goal}</Badge>
          <h2>Da ideia à conversa.</h2>
          <p>
            Fortaleça os fundamentos e construa confiança para se expressar.
          </p>
        </div>
        <div>
          <strong>
            {done} <small>de {lessons.length} aulas concluídas</small>
          </strong>
          <Progress value={(done / lessons.length) * 100} />
          <small>Todas as aulas estão disponíveis. Sem bloqueios.</small>
        </div>
      </section>
      <div className="filter-row">
        <div className="level-tabs" aria-label="Nível">
          {(["Todos", "A1", "A2", "B1", "B2", "C1"] as const).map((l) => (
            <button
              key={l}
              aria-pressed={level === l}
              className={level === l ? "active" : ""}
              onClick={() => setLevel(l)}
            >
              {l}
              {l === "A2" && <span> seu ponto de partida</span>}
            </button>
          ))}
        </div>
        <label className="inline-search">
          <Search size={17} />
          <input
            aria-label="Buscar aulas"
            placeholder="Encontrar uma aula"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>
      <div className="course-description">
        <h2>
          {level === "Todos"
            ? "Explore os fundamentos e avance"
            : `${level} · ${{ A1: "Primeiros passos", A2: "Inglês para o dia a dia", B1: "Conexões e autonomia", B2: "Ideias com clareza", C1: "Expressão e argumentação" }[level]}`}
        </h2>
        <span>{filtered.length} aulas disponíveis</span>
      </div>
      <div className="lesson-list">
        {filtered.map((l, i) => {
          const p = state.lessons.find((p) => p.id === l.id);
          const m = mastery(state.attempts, l.id);
          return (
            <Link
              to={`/lesson/${l.id}`}
              className={`lesson-row ${p?.completed ? "completed" : ""}`}
              key={l.id}
            >
              <span className="lesson-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <BookMark done={!!p?.completed} />
              <div className="lesson-row-text">
                <div>
                  <h3>{l.title}</h3>
                  {priorities.indexOf(l.id) >= 0 && (
                    <Badge tone="neutral">Prioridade para você</Badge>
                  )}
                </div>
                <p>{l.subtitle}</p>
                <span>
                  <Clock size={13} />
                  {l.minutes} min · {l.exercises.length} exercícios · {l.level}
                </span>
              </div>
              <span className="lesson-status">
                {p?.completed ? (
                  <>
                    <CheckCircle2 size={15} />
                    Concluída
                  </>
                ) : m.label === "Não iniciado" ? (
                  "Começar"
                ) : (
                  m.label
                )}
              </span>
              <ArrowRight size={18} />
            </Link>
          );
        })}
      </div>
      {!filtered.length && (
        <p className="empty-state">
          Nenhuma aula encontrada. Tente outra busca.
        </p>
      )}
      <div className="info-note">
        O currículo inicial contém 24 unidades de gramática. Os níveis CEFR
        organizam a dificuldade; concluir as unidades não substitui uma
        avaliação completa de proficiência.
      </div>
    </>
  );
}
