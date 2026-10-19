import { Link } from "react-router-dom";
import { useLearning } from "../hooks/useLearning";
import { projects } from "../content/curriculum";
import type { Skill } from "../types";
const skills: { id: Skill; title: string; link: string }[] = [
  { id: "listening", title: "Entender ao ouvir", link: "/listening" },
  { id: "reading", title: "Compreender textos", link: "/reading" },
  { id: "speaking", title: "Participar de conversas", link: "/conversation" },
  { id: "writing", title: "Escrever com propósito", link: "/writing" },
];
export function ProgressEvidence() {
  const { state } = useLearning();
  const completed = projects.filter((p) =>
    state.attempts.some(
      (a) => a.topic === "project-" + p.id && a.correct && a.selfAssessed,
    ),
  );
  return (
    <section className="panel practical-evidence">
      <h2>O que você já colocou em prática</h2>
      <p className="muted">
        Compreensão avaliada e produção autoavaliada são evidências diferentes.
        Observe clareza e autonomia ao repetir uma tarefa.
      </p>
      <div className="practical-evidence-grid">
        {skills.map((skill) => {
          const objective = state.attempts.filter(
            (a) =>
              a.skill === skill.id &&
              a.number === 1 &&
              !a.assisted &&
              !a.selfAssessed,
          );
          const own = state.attempts.filter(
            (a) => a.skill === skill.id && a.selfAssessed,
          );
          return (
            <div key={skill.id}>
              <h3>{skill.title}</h3>
              <strong>
                {
                  new Set(
                    (skill.id === "speaking" || skill.id === "writing"
                      ? own
                      : objective
                    ).map((a) => a.exerciseId),
                  ).size
                }
              </strong>
              <p>
                {skill.id === "speaking" || skill.id === "writing"
                  ? "tarefas de produção registradas"
                  : "questões distintas respondidas sem apoio"}
              </p>
              <p>
                {objective.length
                  ? objective.filter((a) => a.correct).length +
                    " acertos em " +
                    objective.length +
                    " primeiras tentativas"
                  : own.length
                    ? "Produção com autoavaliação; sem nota de domínio."
                    : "Ainda sem evidências desta habilidade."}
              </p>
              <Link to={skill.link}>Praticar esta habilidade →</Link>
            </div>
          );
        })}
      </div>
      <div className="portfolio-summary">
        <h3>
          {completed.length} de {projects.length} projetos no portfólio
        </h3>
        {completed.length ? (
          <p>
            {completed.map((p) => p.title + " (" + p.level + ")").join(" · ")}
          </p>
        ) : (
          <p className="muted">
            Um projeto combina o que você aprendeu em uma tarefa completa.
          </p>
        )}
        <Link className="text-link" to="/practice/projects">
          Ver projetos e critérios →
        </Link>
      </div>
    </section>
  );
}
