import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Clock3,
  Compass,
  Flame,
  Gamepad2,
  Layers,
  MessageCircle,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { useLearning } from "../hooks/useLearning";
import { useProgression } from "../progression/useProgression";
import { learningEvidence, nextSteps } from "../progression/engine";
import { Progress } from "../components/ui";
import { ActivityChart } from "../components/LearningChart";
import { skillNames } from "../utils/learning";
import { coursePaths } from "../content/curriculum";
export { ActivityChart } from "../components/LearningChart";
export function Dashboard() {
  const { state } = useLearning(),
    progress = useProgression(),
    [days, setDays] = useState(7);
  const evidence = useMemo(() => learningEvidence(state), [state.attempts]),
    path = nextSteps(state);
  const minutes = Math.floor(
      state.sessions.reduce((n, s) => n + s.seconds, 0) / 60,
    ),
    goal = coursePaths[state.profile.initialLevel];
  const greeting =
    state.profile.name === "Estudante"
      ? "Olá, bora virar esse jogo?"
      : "Olá, " + state.profile.name.split(" ")[0] + ". Bora virar esse jogo?";
  return (
    <div className="vira-dashboard">
      <header className="dashboard-heading">
        <div>
          <span className="eyebrow">SEU INGLÊS TEM LUGAR NA VIDA REAL</span>
          <h1>{greeting}</h1>
          <p>Um passo que cabe no seu dia. Uma conversa mais perto.</p>
        </div>
        <Link to="/profile" className="dashboard-rank-pill">
          <span style={{ background: progress.rank.color }}>
            {progress.rank.key}
          </span>
          <div>
            <strong>{progress.rank.name}</strong>
            <small>
              Nível {progress.level.level} ·{" "}
              {progress.xp.toLocaleString("pt-BR")} XP
            </small>
          </div>
          <ArrowUpRight size={17} />
        </Link>
      </header>
      <div className="dashboard-top-grid">
        <section className="mission-card">
          <div className="mission-copy">
            <span className="mission-kicker">
              <i />
              {path.primary.eyebrow}
            </span>
            <h2>
              Seu próximo passo
              <br />
              <em>já está aqui.</em>
            </h2>
            <p className="mission-lesson">{path.primary.title}</p>
            <p className="mission-detail">{path.primary.detail}</p>
            <div className="mission-actions">
              <Link className="button mission-button" to={path.primary.to}>
                {path.primary.verb}
                <ArrowRight size={18} />
              </Link>
              <span>
                <Clock3 size={15} />
                {path.primary.minutes} min · seu ritmo
              </span>
            </div>
          </div>
          <div className="mission-art" aria-hidden="true">
            <div className="mission-orbit" />
            <span className="mission-art-label">
              YOU CAN
              <br />
              <em>SAY IT.</em>
            </span>
            <img src="/brand/vira-mark.png" alt="" />
            <span className="mission-art-sticker">
              <Zap size={16} />
              VAI NA SUA
            </span>
            <span className="mission-small-star">✳</span>
          </div>
        </section>
        <aside className="today-card">
          <div className="today-heading">
            <span className="small-square">
              <Target size={19} />
            </span>
            <div>
              <span className="eyebrow">UMA COISA DE CADA VEZ</span>
              <h2>O caminho de hoje</h2>
            </div>
          </div>
          <div className="today-steps">
            {path.steps.map((step, i) => (
              <Link
                to={step.to}
                key={step.tag}
                className={i === 0 ? "current" : ""}
              >
                <span className="step-node">
                  {step.done ? <Check size={14} /> : step.tag}
                </span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.copy}</p>
                </div>
                <ArrowRight size={15} />
              </Link>
            ))}
          </div>
          <p className="today-footnote">
            Uma sugestão, sem sequência obrigatória.
          </p>
        </aside>
      </div>
      <section className="dashboard-stats" aria-label="Seu progresso">
        <div className="stat-card">
          <span className="stat-icon peach">
            <BookOpen size={21} />
          </span>
          <div>
            <span>Aulas concluídas</span>
            <strong>
              {String(progress.completed).padStart(2, "0")}
              <small>/ 48</small>
            </strong>
            <p>Estruturas que viram uso</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon blue">
            <Target size={21} />
          </span>
          <div>
            <span>Aproveitamento</span>
            <strong>
              {evidence.accuracy === null ? "—" : evidence.accuracy + "%"}
            </strong>
            <p>
              {evidence.count
                ? evidence.count + " questões sem apoio"
                : "Sua primeira atividade inicia a medida"}
            </p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon lavender">
            <Clock3 size={21} />
          </span>
          <div>
            <span>Tempo de estudo</span>
            <strong>
              {minutes}
              <small>min</small>
            </strong>
            <p>Jogos têm seu próprio espaço</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon lime">
            <Layers size={21} />
          </span>
          <div>
            <span>Revisões prontas</span>
            <strong>{String(path.due).padStart(2, "0")}</strong>
            <p>
              {path.due
                ? "Um reencontro com suas palavras"
                : "Tudo no seu tempo"}
            </p>
          </div>
        </div>
      </section>
      <div className="dashboard-middle-grid">
        <section className="panel learning-curve-panel">
          <div className="vira-section-heading">
            <div>
              <span className="eyebrow">EVOLUÇÃO QUE DÁ PARA ENXERGAR</span>
              <h2>Seu inglês, em movimento.</h2>
            </div>
            <div className="segmented">
              {[7, 30].map((n) => (
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
        </section>
        <section className="panel skill-compass">
          <span className="eyebrow">CADA HABILIDADE CONTA</span>
          <h2>
            Mais repertório.
            <br />
            Mais possibilidades.
          </h2>
          <div>
            {evidence.skills.map((skill) => (
              <div key={skill.skill} className="compass-skill">
                <div>
                  <span>{skillNames[skill.skill]}</span>
                  <strong>
                    {skill.score !== null
                      ? skill.score + "%"
                      : skill.production
                        ? skill.production + " práticas"
                        : "Comece aqui"}
                  </strong>
                </div>
                <Progress
                  value={skill.score ?? Math.min(100, skill.production * 10)}
                  label={skillNames[skill.skill]}
                />
                <small>
                  {skill.score !== null
                    ? skill.count + " primeiras respostas"
                    : skill.production
                      ? "Produção autoavaliada"
                      : "Ainda sem evidência avaliada"}
                </small>
              </div>
            ))}
          </div>
          <Link className="text-link" to="/progress">
            Ver meu aprendizado
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>
      <section className="dashboard-rhythm">
        <div>
          <span className="eyebrow">ROTINA CORRIDA? O INGLÊS CABE.</span>
          <h2>Quanto tempo é seu agora?</h2>
          <p>
            Escolha o tamanho da pausa. A sessão reúne estrutura, palavras,
            escuta e leitura.
          </p>
        </div>
        <div className="rhythm-options">
          {[
            { n: 5, tag: "Uma faísca", Icon: Zap },
            { n: 15, tag: "Pega o ritmo", Icon: Flame },
            { n: 30, tag: "Vai mais longe", Icon: Sparkles },
          ].map(({ n, tag, Icon }) => (
            <Link to={"/session/" + n} key={n}>
              <Icon size={22} />
              <strong>
                {n}
                <span>min</span>
              </strong>
              <small>{tag}</small>
              <ArrowUpRight size={17} />
            </Link>
          ))}
        </div>
      </section>
      <div className="dashboard-bottom-grid">
        <section className="practice-spotlight">
          <div>
            <span className="eyebrow">DÊ UM DESTINO ÀS PALAVRAS</span>
            <h2>
              Do “eu sei”
              <br />
              ao “eu consigo usar”.
            </h2>
            <p>{goal.goal}</p>
            <div className="button-row">
              <Link className="button secondary" to="/explore">
                <Compass size={17} />
                Explorar cenas
              </Link>
              <Link className="button secondary" to="/conversation">
                <MessageCircle size={17} />
                Entrar numa conversa
              </Link>
            </div>
          </div>
          <span className="practice-speech" aria-hidden="true">
            let’s
            <br />
            <em>talk.</em>
            <i>
              <ArrowUpRight size={20} />
            </i>
          </span>
        </section>
        <Link className="dashboard-arcade-card" to="/games">
          <div>
            <Gamepad2 size={26} />
            <span className="badge">7 JOGOS · XP + DESAFIOS</span>
          </div>
          <h2>
            Uma pausa.
            <br />
            <em>Uma virada.</em>
          </h2>
          <p>
            Jogue, suba de nível e desbloqueie novas etapas. As aulas esperam
            por você.
          </p>
          <span className="arcade-entry">
            Entrar no Arcade
            <ArrowUpRight size={20} />
          </span>
        </Link>
      </div>
      <Link className="founder-dashboard-link" to="/comece">
        <span>
          <Sparkles size={17} />
          TURMA FUNDADORA VIRA
        </span>
        <strong>Plataforma + duas aulas coletivas ao vivo por semana.</strong>
        <span>
          Conhecer o piloto
          <ArrowRight size={16} />
        </span>
      </Link>
    </div>
  );
}
