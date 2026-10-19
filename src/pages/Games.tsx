import { Link, Route, Routes } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  Gamepad2,
  Keyboard,
  Puzzle,
  Trophy,
} from "lucide-react";
import { Badge, PageTitle } from "../components/ui";
import { MemoryGame } from "../games/MemoryGame";
import { TypingGame } from "../games/TypingGame";
import { SecretWordGame } from "../games/SecretWordGame";
import { useGameRecords } from "../games/useGameRecords";
import "../styles/games.css";

function GamesHome() {
  const { records } = useGameRecords();
  const wins = Object.values(records).reduce(
    (sum, value) => sum + value.wins,
    0,
  );
  const games = [
    {
      path: "memory",
      title: "Memória em dois idiomas",
      description:
        "Encontre os pares entre inglês e português. Boa memória, nenhuma pressa.",
      tag: "4, 6 ou 8 pares",
      Icon: Brain,
      style: "memory",
      labels: ["hello", "olá"],
    },
    {
      path: "typing",
      title: "Chuva de palavras",
      description:
        "As palavras aparecem na tela. Digite antes que escapem e capture 10 para vencer.",
      tag: "3 ritmos para escolher",
      Icon: Keyboard,
      style: "typing",
      labels: ["keyboard", "type & win"],
    },
    {
      path: "secret-word",
      title: "Palavra secreta",
      description:
        "Use a dica, descubra as letras e desvende uma palavra em inglês.",
      tag: "6 chances · sem relógio",
      Icon: Puzzle,
      style: "secret",
      labels: ["P", "?", "A", "Y"],
    },
  ];
  return (
    <div className="games-page">
      <PageTitle
        eyebrow="UMA PAUSA PARA SE DIVERTIR"
        title="Seu inglês também pode brincar."
        description="Jogos rápidos para abrir quando der vontade. Sem tarefas, sem prazos, sem compromisso com o curso."
        action={
          <Badge tone="neutral">
            <Gamepad2 size={14} />
            Jogos livres
          </Badge>
        }
      />
      <section className="games-hero">
        <div>
          <span className="eyebrow">ESCOLHA UM JOGO. O RITMO É SEU.</span>
          <h2>
            Um intervalo.
            <br />
            Algumas palavras.
            <br />
            <em>Só diversão.</em>
          </h2>
          <p>
            Quer jogar uma rodada ou passar um tempo? Entre, experimente e volte
            quando quiser.
          </p>
        </div>
        <div className="games-hero-art" aria-hidden="true">
          <span className="hero-letter letter-one">A</span>
          <span className="hero-letter letter-two">B</span>
          <span className="hero-letter letter-three">C</span>
          <Gamepad2 size={88} />
          <i>let’s play</i>
        </div>
      </section>
      <div className="games-catalog">
        {games.map(({ path, title, description, tag, Icon, style, labels }) => (
          <Link
            className={`casual-game-card ${style}-tile`}
            key={path}
            to={`/games/${path}`}
          >
            <div className="casual-card-art" aria-hidden="true">
              <Icon size={38} />
              <div>
                {labels.map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>
            </div>
            <div className="casual-card-copy">
              <Badge tone="neutral">{tag}</Badge>
              <h2>{title}</h2>
              <p>{description}</p>
              <span className="text-link">
                Jogar agora
                <ArrowRight size={17} />
              </span>
            </div>
          </Link>
        ))}
      </div>
      <div className="games-record-note">
        <span className="stat-icon peach">
          <Trophy size={22} />
        </span>
        <div>
          <h2>
            {wins
              ? `${wins} ${wins === 1 ? "vitória guardada" : "vitórias guardadas"} por aqui`
              : "Seu primeiro recorde está esperando."}
          </h2>
          <p>
            Recordes locais, só para você. Partidas não alteram seu nível,
            progresso, revisões ou tempo de estudo. Não há meta diária.
          </p>
        </div>
      </div>
    </div>
  );
}
export default function Games() {
  return (
    <Routes>
      <Route index element={<GamesHome />} />
      <Route path="memory" element={<MemoryGame />} />
      <Route path="typing" element={<TypingGame />} />
      <Route path="secret-word" element={<SecretWordGame />} />
      <Route
        path="*"
        element={
          <div className="empty-state">
            <h1>Vamos escolher outro jogo?</h1>
            <Link className="button" to="/games">
              Ver jogos livres
            </Link>
          </div>
        }
      />
    </Routes>
  );
}
