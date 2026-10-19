import { useLocation } from "react-router-dom";
import { ArcadeProgress, RoundReward } from "./ArcadeProgress";
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
  const family = useLocation().pathname.split("/")[2] || "memory";
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
            XP + DESAFIOS
          </Badge>
        }
      />
      <ArcadeProgress
        family={
          family === "secret-word"
            ? "secret"
            : family === "word-search"
              ? "search"
              : family
        }
      />
      {children}
      <p className="game-disclaimer">
        Este é um espaço livre: partidas, erros e tempo de jogo ficam fora das
        aulas, revisões e avaliações do curso. Pontos, níveis de jogo e recordes
        aparecem no perfil deste navegador. O rank de participação é
        independente da avaliação do seu inglês.
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
  roundId,
}: {
  won: boolean;
  title: string;
  children: ReactNode;
  onRestart: () => void;
  storageError: string;
  roundId?: string;
}) {
  return (
    <section className={`game-result ${won ? "victory" : ""}`} role="status">
      <span className={`stat-icon ${won ? "green" : "peach"}`}>
        <Trophy size={27} />
      </span>
      <h2>{title}</h2>
      {children}
      <RoundReward id={roundId} />
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
