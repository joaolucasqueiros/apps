import { useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Compass,
  Download,
  Flame,
  Medal,
  Mic,
  Orbit,
  Repeat2,
  Settings,
  Share2,
  Shield,
  Target,
  Trophy,
  Upload,
  Zap,
} from "lucide-react";
import { useLearning } from "../hooks/useLearning";
import { useProgression } from "../progression/useProgression";
import { ranks } from "../progression/engine";
import { useGameRecords } from "../games/useGameRecords";
import {
  getGameSnapshot,
  restoreGameProgress,
  validateGameBackup,
  type GameData,
} from "../games/recordsStore";
import { Badge, Progress } from "../components/ui";
const badgeIcons = {
  spark: Flame,
  orbit: Orbit,
  target: Target,
  medal: Medal,
  book: BookOpen,
  compass: Compass,
  voice: Mic,
  repeat: Repeat2,
};
export function Profile() {
  const { state, notify } = useLearning(),
    p = useProgression(),
    games = useGameRecords(),
    file = useRef<HTMLInputElement>(null);
  const [imported, setImported] = useState<GameData | null>(null),
    [error, setError] = useState("");
  const exportGames = () => {
    const blob = new Blob([JSON.stringify(getGameSnapshot().data, null, 2)], {
        type: "application/json",
      }),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download =
      "vira-arcade-" + new Date().toISOString().slice(0, 10) + ".json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const importGames = async (f: File | undefined) => {
    if (!f) return;
    setError("");
    setImported(null);
    if (f.size > 10 * 1024 * 1024) {
      setError("Escolha um backup de jogos de até 10 MB.");
      return;
    }
    try {
      setImported(validateGameBackup(JSON.parse(await f.text())));
    } catch {
      setError("Backup de jogos inválido. Seus pontos continuam preservados.");
    }
    if (file.current) file.current.value = "";
  };
  const share = async () => {
    const text =
      "Na VIRA, meu rank de participação é " +
      p.rank.key +
      " · " +
      p.rank.name +
      ". Já somei " +
      p.xp +
      " XP entre estudo e jogos. Inglês que vira conversa: " +
      location.origin +
      "/comece";
    try {
      await navigator.clipboard.writeText(text);
      notify("Sua conquista foi copiada. Compartilhe onde quiser.");
    } catch {
      notify(
        "Seu navegador não permitiu copiar. Você pode compartilhar o endereço da VIRA.",
      );
    }
  };
  const next = p.nextRank;
  return (
    <div className="profile-page">
      <header className="profile-page-heading">
        <div>
          <span className="eyebrow">SUA HISTÓRIA TEM UMA MARCA</span>
          <h1>Seu perfil. Sua virada.</h1>
          <p>Aprender, experimentar e voltar contam pontos por aqui.</p>
        </div>
        <Link to="/settings" className="button secondary">
          <Settings size={16} />
          Editar perfil
        </Link>
      </header>
      <section className="profile-hero">
        <div className="profile-person">
          <div className="profile-avatar">
            {state.profile.name.slice(0, 1).toUpperCase()}
            <span>
              <Zap size={16} />
            </span>
          </div>
          <div>
            <span className="eyebrow">JOGADOR DA PRÓPRIA HISTÓRIA</span>
            <h2>{state.profile.name}</h2>
            <p>Inglês na vida real. Uma conexão de cada vez.</p>
            <div className="profile-labels">
              <Badge>NÍVEL {p.level.level} DE PARTICIPAÇÃO</Badge>
              <span>Trilha de inglês {state.profile.initialLevel}</span>
            </div>
          </div>
        </div>
        <div
          className="profile-rank-emblem"
          style={{ "--rank-color": p.rank.color } as CSSProperties}
        >
          <span>RANK</span>
          <strong>{p.rank.key}</strong>
          <small>{p.rank.name}</small>
          <i aria-hidden="true">✳</i>
        </div>
        <div className="profile-xp-track">
          <div>
            <span>
              <Zap size={18} />
              {p.xp.toLocaleString("pt-BR")} XP
            </span>
            <strong>
              {Math.ceil(p.level.remaining).toLocaleString("pt-BR")} XP para o
              nível {p.level.level + 1}
            </strong>
          </div>
          <Progress
            value={p.level.percent}
            label="Progresso do nível de participação"
          />
          <small>
            {p.studyXp.toLocaleString("pt-BR")} XP de estudo +{" "}
            {p.gameXp.toLocaleString("pt-BR")} XP do Arcade
          </small>
        </div>
      </section>
      <div className="profile-summary-grid">
        <section>
          <BookOpen size={21} />
          <strong>{p.completed}</strong>
          <span>Aulas concluídas</span>
        </section>
        <section>
          <Trophy size={21} />
          <strong>{p.wins}</strong>
          <span>Vitórias no Arcade</span>
        </section>
        <section>
          <Medal size={21} />
          <strong>
            {p.badges.filter((b) => b.earned).length}
            <small>/{p.badges.length}</small>
          </strong>
          <span>Selos conquistados</span>
        </section>
        <section>
          <Target size={21} />
          <strong>
            {state.profile.initialLevel}
            <small>→{state.profile.goal}</small>
          </strong>
          <span>Sua trilha e objetivo</span>
        </section>
      </div>
      <section className="panel rank-roadmap">
        <div className="vira-section-heading">
          <div>
            <span className="eyebrow">UMA PATENTE PARA CADA VIRADA</span>
            <h2>
              {next
                ? "Próxima conquista: rank " + next.key + "."
                : "Você chegou ao topo das patentes."}
            </h2>
            <p>
              {next
                ? "Faltam " +
                  (next.min - p.xp).toLocaleString("pt-BR") +
                  " XP para " +
                  next.name +
                  ". Continue no seu ritmo."
                : "Seu aprendizado continua além do rank. Que situação você quer conseguir resolver agora?"}
            </p>
          </div>
          <button className="button secondary" onClick={share}>
            <Share2 size={16} />
            Copiar conquista
          </button>
        </div>
        <div className="rank-ladder">
          {ranks.map((rank) => (
            <div
              className={
                (p.xp >= rank.min ? "achieved " : "") +
                (rank.key === p.rank.key ? "current" : "")
              }
              key={rank.key}
            >
              <span style={{ "--rank-color": rank.color } as CSSProperties}>
                {rank.key}
                {p.xp >= rank.min && <Check size={12} />}
              </span>
              <strong>{rank.name}</strong>
              <small>{rank.min.toLocaleString("pt-BR")} XP</small>
              {rank.key === p.rank.key && <b>VOCÊ ESTÁ AQUI</b>}
            </div>
          ))}
        </div>
        <p className="rank-explanation">
          <Shield size={17} />
          Este é seu rank pessoal de participação, calculado com estudo e jogos.
          A1–C1 são níveis da trilha de inglês; os resultados por habilidade
          ficam em Minha evolução.
        </p>
      </section>
      <section className="profile-badges-section">
        <div className="vira-section-heading">
          <div>
            <span className="eyebrow">SELOS QUE CONTAM SUA HISTÓRIA</span>
            <h2>Pequenas vitórias. Marcas suas.</h2>
          </div>
          <span className="badge neutral">
            {p.badges.filter((b) => b.earned).length} conquistados
          </span>
        </div>
        <div className="profile-badge-grid">
          {p.badges.map((b) => {
            const Icon = badgeIcons[b.icon as keyof typeof badgeIcons] || Medal;
            return (
              <article key={b.id} className={b.earned ? "earned" : ""}>
                <span className="achievement-medallion">
                  <Icon size={29} />
                  {b.earned && <Check size={11} />}
                </span>
                <h3>{b.name}</h3>
                <p>{b.description}</p>
                <Progress value={b.percent} label={b.name} />
                <small>
                  {b.earned
                    ? "Conquistado"
                    : Math.min(b.current, b.target) + " de " + b.target}
                </small>
              </article>
            );
          })}
        </div>
      </section>
      <div className="profile-bottom-grid">
        <section className="panel">
          <span className="eyebrow">PONTOS COM CONTEXTO</span>
          <h2>O esforço tem várias formas.</h2>
          <ul className="xp-rules">
            <li>
              <span>Resposta de estudo correta</span>
              <strong>até 15 XP por questão</strong>
            </li>
            <li>
              <span>Aula concluída</span>
              <strong>80 XP</strong>
            </li>
            <li>
              <span>Cartão lembrado</span>
              <strong>10 XP por dia/cartão</strong>
            </li>
            <li>
              <span>Produção revisada</span>
              <strong>25 XP por atividade</strong>
            </li>
            <li>
              <span>Vitória no Arcade</span>
              <strong>40–80 XP</strong>
            </li>
            <li>
              <span>Primeira vitória do dia</span>
              <strong>+25 XP</strong>
            </li>
          </ul>
          <p className="muted">
            Repetir o mesmo registro não duplica pontos. Uma nova partida
            concluída tem seu próprio resultado. Pontos de jogos não alteram
            notas, aulas ou o relógio de estudo.
          </p>
          <Link to="/games" className="text-link">
            Escolher meu próximo jogo
            <ArrowRight size={16} />
          </Link>
        </section>
        <section className="panel profile-backup">
          <span className="eyebrow">CUIDE DAS SUAS CONQUISTAS</span>
          <h2>Seu progresso vai com você.</h2>
          <p>
            Os pontos e recordes do Arcade ficam neste navegador. Exporte uma
            cópia para guardar ou levar a outro dispositivo.
          </p>
          <div className="button-row">
            <button className="button secondary" onClick={exportGames}>
              <Download size={16} />
              Exportar jogos e XP
            </button>
            <button
              className="button secondary"
              onClick={() => file.current?.click()}
            >
              <Upload size={16} />
              Importar jogos
            </button>
          </div>
          <input
            hidden
            ref={file}
            type="file"
            accept=".json,application/json"
            aria-label="Backup de jogos e XP"
            onChange={(e) => void importGames(e.target.files?.[0])}
          />
          {imported && (
            <div className="feedback success">
              <strong>Backup de jogos válido.</strong>
              <p>
                {imported.events.length} partidas detalhadas. A mesclagem
                preserva as partidas atuais e evita duplicar IDs.
              </p>
              <button
                className="button"
                onClick={() => {
                  restoreGameProgress(imported);
                  setImported(null);
                  notify("Progresso dos jogos mesclado.");
                }}
              >
                Mesclar progresso dos jogos
              </button>
            </div>
          )}
          {error && (
            <p className="feedback warning" role="alert">
              {error}
            </p>
          )}
          {games.storageError && (
            <p className="feedback warning" role="status">
              {games.storageError}
            </p>
          )}
          <Link className="text-link" to="/settings">
            Backup das aulas e configurações
            <ArrowUpRight size={15} />
          </Link>
        </section>
      </div>
      <Link className="founder-dashboard-link" to="/comece">
        <span>
          <SparklesIcon />
          PRIMEIROS 100
        </span>
        <strong>Conheça a turma fundadora da VIRA.</strong>
        <span>
          Ver a proposta
          <ArrowRight size={16} />
        </span>
      </Link>
    </div>
  );
}
function SparklesIcon() {
  return <Zap size={16} />;
}
