import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  Gamepad2,
  Keyboard,
  Puzzle,
  Search,
  Shuffle,
  Trophy,
  Type,
  Zap,
} from "lucide-react";
import { Badge, PageTitle, Progress } from "../components/ui";
import { MemoryGame } from "../games/MemoryGame";
import { TypingGame } from "../games/TypingGame";
import { SecretWordGame } from "../games/SecretWordGame";
import {
  AnagramGame,
  SearchGame,
  SentenceGame,
  SprintGame,
} from "../games/ArcadeGames";
import { useGameRecords } from "../games/useGameRecords";
import { useProgression } from "../progression/useProgression";
import { familyWins } from "../progression/engine";
import "../styles/games.css";
import "../styles/arcade.css";
export const arcadeCatalog = [
  {
    path: "memory",
    title: "Memória em dois idiomas",
    description: "Vire, lembre e encontre os pares.",
    tag: "Memória",
    category: "Palavras",
    Icon: Brain,
    style: "memory",
    labels: ["hello", "olá"],
    family: "memory",
  },
  {
    path: "typing",
    title: "Chuva de palavras",
    description: "Capture as palavras antes que escapem.",
    tag: "Digitação",
    category: "Agilidade",
    Icon: Keyboard,
    style: "typing",
    labels: ["type", "& win"],
    family: "typing",
  },
  {
    path: "secret-word",
    title: "Palavra secreta",
    description: "Uma dica. Seis chances. Sua descoberta.",
    tag: "Letras",
    category: "Palavras",
    Icon: Puzzle,
    style: "secret",
    labels: ["P", "?", "A", "Y"],
    family: "secret",
  },
  {
    path: "anagram",
    title: "Remixa",
    description: "Letras fora do lugar, novas conexões.",
    tag: "Anagrama",
    category: "Palavras",
    Icon: Shuffle,
    style: "anagram",
    labels: ["m", "i", "x"],
    family: "anagram",
  },
  {
    path: "word-search",
    title: "Caça-conexões",
    description: "Encontre, arraste e faça a conexão.",
    tag: "Caça-palavras",
    category: "Palavras",
    Icon: Search,
    style: "search",
    labels: ["F", "I", "N", "D"],
    family: "search",
  },
  {
    path: "sentence",
    title: "Frase na mão",
    description: "Monte uma ideia, bloco por bloco.",
    tag: "Construção",
    category: "Frases",
    Icon: Type,
    style: "sentence",
    labels: ["let’s", "talk."],
    family: "sentence",
  },
  {
    path: "sprint",
    title: "Bate-pronto",
    description: "Reconheça a palavra e escolha sua resposta.",
    tag: "Escolha rápida",
    category: "Agilidade",
    Icon: Zap,
    style: "sprint",
    labels: ["go", "!"],
    family: "sprint",
  },
];
function GamesHome() {
  const { records, data } = useGameRecords(),
    p = useProgression(),
    [category, setCategory] = useState("Todos");
  const shown = arcadeCatalog.filter(
    (g) => category === "Todos" || g.category === category,
  );
  return (
    <div className="games-page arcade-home">
      <PageTitle
        eyebrow="VIRA ARCADE · UMA PAUSA QUE VALE XP"
        title="Seu inglês também pode brincar."
        description="Jogue no seu ritmo, descubra palavras e conquiste novas etapas. O próximo recorde pode ser seu."
        action={
          <Link className="badge arcade-profile-badge" to="/profile">
            <Trophy size={14} />
            Meu rank {p.rank.key}
            <ArrowUpRight size={14} />
          </Link>
        }
      />
      <section className="games-hero arcade-hero">
        <div>
          <span className="eyebrow">07 JOGOS. VÁRIOS JEITOS DE VIRAR.</span>
          <h2>
            Uma rodada.
            <br />
            Uma descoberta.
            <br />
            <em>Mais uma?</em>
          </h2>
          <p>
            Ganhe XP, avance do aquecimento ao Modo Vira e deixe suas conquistas
            no perfil. Sem perder pontos por dar uma pausa.
          </p>
          <Link className="arcade-hero-cta" to="/games/anagram">
            Experimentar Remixa
            <ArrowRight size={18} />
          </Link>
        </div>
        <div className="arcade-hero-art" aria-hidden="true">
          <span className="arcade-hero-word">
            PLAY
            <span>
              <ArrowUpRight size={60} />
            </span>
          </span>
          <img src="/brand/vira-mark.png" alt="" />
          <span className="arcade-hero-sticker">
            <Zap size={18} />
            BOA JOGADA.
          </span>
        </div>
      </section>
      <section className="arcade-profile-strip">
        <div>
          <span
            className="arcade-rank-square"
            style={{ background: p.rank.color }}
          >
            {p.rank.key}
          </span>
          <div>
            <strong>{p.rank.name}</strong>
            <small>Nível {p.level.level} de participação</small>
          </div>
        </div>
        <div className="arcade-strip-xp">
          <strong>
            {p.xp.toLocaleString("pt-BR")}
            <small>XP</small>
          </strong>
          <Progress value={p.level.percent} label="Seu nível de participação" />
        </div>
        <div className="arcade-strip-wins">
          <Trophy size={20} />
          <strong>{p.wins}</strong>
          <small>vitórias</small>
        </div>
        <Link className="text-link" to="/profile">
          Ver perfil
          <ArrowUpRight size={16} />
        </Link>
      </section>
      <div className="arcade-catalog-heading">
        <div>
          <span className="eyebrow">ESCOLHA A SUA PRÓXIMA VIRADA</span>
          <h2>Qual vai ser o jogo?</h2>
        </div>
        <div className="arcade-filter" aria-label="Filtrar jogos">
          {["Todos", "Palavras", "Frases", "Agilidade"].map((c) => (
            <button
              key={c}
              className={category === c ? "active" : ""}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="games-catalog">
        {shown.map(
          ({ path, title, description, tag, Icon, style, labels, family }) => (
            <Link
              className={"casual-game-card " + style + "-tile"}
              key={path}
              to={"/games/" + path}
            >
              <div className="casual-card-art" aria-hidden="true">
                <Icon size={34} />
                <div>
                  {labels.map((label, i) => (
                    <span key={i}>{label}</span>
                  ))}
                </div>
                <b>
                  {familyWins(records, family) > 0
                    ? familyWins(records, family) + " vitórias"
                    : "VEM JOGAR"}
                </b>
              </div>
              <div className="casual-card-copy">
                <Badge tone="neutral">{tag}</Badge>
                <h2>{title}</h2>
                <p>{description}</p>
                <span className="text-link">
                  Jogar agora
                  <ArrowUpRight size={17} />
                </span>
              </div>
            </Link>
          ),
        )}
      </div>
      <section className="arcade-how-to">
        <span className="arcade-how-number">
          <ArrowUpRight size={40} />
        </span>
        <div>
          <h2>Você joga. O perfil guarda a história.</h2>
          <p>
            Vitórias rendem de 40 a 80 XP, com um bônus de 25 XP na primeira
            vitória do dia. Novas etapas abrem com vitórias no jogo ou XP do
            perfil. O rank registra participação; suas aulas e avaliações seguem
            com os próprios resultados.
          </p>
          <Link className="text-link" to="/profile">
            Entender pontos, níveis e selos
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
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
      <Route path="anagram" element={<AnagramGame />} />
      <Route path="word-search" element={<SearchGame />} />
      <Route path="sentence" element={<SentenceGame />} />
      <Route path="sprint" element={<SprintGame />} />
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
