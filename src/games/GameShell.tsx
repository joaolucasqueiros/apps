import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Gamepad2, Trophy, RotateCcw } from "lucide-react";
import { Badge, PageTitle } from "../components/ui";

export function GameShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="games-page">
      <Link to="/games" className="back-link">
        <ArrowLeft size={16} />
        Todos os jogos
      </Link>
      <PageTitle
        eyebrow="JOGOS LIVRES"
        title={title}
        description={description}
        action={
          <Badge tone="neutral">
            <Gamepad2 size={13} />
            Só por diversão
          </Badge>
        }
      />
      {children}
      <p className="game-disclaimer">
        Este é um espaço livre: partidas, erros e tempo de jogo ficam fora das
        aulas, revisões e avaliações do curso. Recordes são guardados somente
        neste navegador.
      </p>
    </div>
  );
}
export function GameResult({
  won,
  title,
  children,
  onRestart,
  storageError,
}: {
  won: boolean;
  title: string;
  children: ReactNode;
  onRestart: () => void;
  storageError: string;
}) {
  return (
    <section className={`game-result ${won ? "victory" : ""}`} role="status">
      <span className={`stat-icon ${won ? "green" : "peach"}`}>
        <Trophy size={27} />
      </span>
      <h2>{title}</h2>
      {children}
      <div className="button-row">
        <button className="button" onClick={onRestart}>
          <RotateCcw size={16} />
          Jogar de novo
        </button>
        <Link className="button secondary" to="/games">
          Escolher outro jogo
        </Link>
      </div>
      {storageError && <p className="feedback warning">{storageError}</p>}
    </section>
  );
}
