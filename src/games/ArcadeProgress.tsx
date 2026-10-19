import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, LockKeyhole, Sparkles, Zap } from "lucide-react";
import { useGameRecords } from "./useGameRecords";
import { familyWins, stageUnlocked } from "../progression/engine";
import { useProgression } from "../progression/useProgression";
import { Progress } from "../components/ui";
import type { ArcadeStage } from "./arcadeEngine";
export function StagePicker({
  family,
  stage,
  onChange,
  playing = false,
}: {
  family: string;
  stage: ArcadeStage;
  onChange: (stage: ArcadeStage) => void;
  playing?: boolean;
}) {
  const games = useGameRecords(),
    progress = useProgression();
  return (
    <div className="arcade-stages">
      <div className="arcade-stage-heading">
        <span>
          <Sparkles size={15} />
          ESCOLHA SEU DESAFIO
        </span>
        <small>{familyWins(games.records, family)} vitórias neste jogo</small>
      </div>
      <div>
        {([1, 2, 3] as const).map((n) => {
          const unlocked = stageUnlocked(n, family, games.records, progress.xp);
          return (
            <button
              key={n}
              aria-pressed={stage === n}
              disabled={!unlocked || playing}
              onClick={() => onChange(n)}
              className={stage === n ? "active" : ""}
            >
              <span>{unlocked ? "0" + n : <LockKeyhole size={16} />}</span>
              <strong>{["Aquecimento", "No ritmo", "Modo Vira"][n - 1]}</strong>
              <small>
                {unlocked
                  ? ["Comece por aqui", "Um passo além", "Vale a virada"][n - 1]
                  : n === 2
                    ? "3 vitórias ou 400 XP"
                    : "8 vitórias ou 1.200 XP"}
              </small>
            </button>
          );
        })}
      </div>
    </div>
  );
}
export function ArcadeProgress({ family }: { family: string }) {
  const games = useGameRecords(),
    progress = useProgression();
  const wins = familyWins(games.records, family);
  return (
    <div className="arcade-progress-strip">
      <span
        className="arcade-mini-rank"
        style={{ "--rank-color": progress.rank.color } as CSSProperties}
      >
        {progress.rank.key}
      </span>
      <div>
        <strong>
          Nível {progress.level.level}
          <span>{progress.xp.toLocaleString("pt-BR")} XP no perfil</span>
        </strong>
        <Progress
          value={progress.level.percent}
          label="Progresso do nível de participação"
        />
      </div>
      <span className="arcade-family-wins">
        {wins} {wins === 1 ? "vitória" : "vitórias"}
      </span>
    </div>
  );
}
export function RoundReward({ id }: { id?: string }) {
  const games = useGameRecords();
  const event = games.data.events.find((e) => e.id === id);
  if (!event) return null;
  return (
    <div className="round-reward">
      <span>
        <Zap size={19} />+{event.xp} XP
      </span>
      <div>
        <strong>
          {event.total ? Math.round((event.correct / event.total) * 100) : 0}%
          de aproveitamento
        </strong>
        <small>
          {event.correct} acertos em {event.total} ações avaliadas · pontos de
          participação
        </small>
      </div>
      <Link to="/profile" className="text-link">
        Ver meu rank
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}
