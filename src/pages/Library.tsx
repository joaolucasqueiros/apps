import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Headphones,
  FileText,
  ArrowRight,
  Video,
  Search,
} from "lucide-react";
import { lessons } from "../content/lessons";
import { words, categories } from "../content/vocabulary";
import { listeningStories, readingStories } from "../content/stories";
import { videos } from "../content/videos";
import { questionBank } from "../assessments/engine";
import { PageTitle, Badge } from "../components/ui";
import { VideoPlayer } from "../components/VideoPlayer";
export function Library() {
  const [query, setQuery] = useState("");
  const resources = [
    ...lessons.map((l) => ({
      title: l.title,
      desc: l.subtitle,
      path: `/lesson/${l.id}`,
      type: "Gramática",
      level: l.level,
      Icon: BookOpen,
    })),
    ...categories.map((c) => ({
      title: c,
      desc: `${words.filter((w) => w.category === c).length} palavras e expressões em contexto`,
      path: "/vocabulary",
      type: "Vocabulário",
      level: "A2–B1",
      Icon: BookOpen,
    })),
    ...listeningStories.map((s) => ({
      title: s.title,
      desc: s.category,
      path: "/listening",
      type: "Listening sintetizado",
      level: s.level,
      Icon: Headphones,
    })),
    ...readingStories.map((s) => ({
      title: s.title,
      desc: s.category,
      path: "/reading",
      type: "Reading",
      level: s.level,
      Icon: FileText,
    })),
  ].filter((r) =>
    `${r.title} ${r.desc}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <PageTitle
        eyebrow="EXPLORE. DESCUBRA. VOLTE QUANDO QUISER."
        title="Um mundo de inglês ao seu alcance."
        description="Todo o conteúdo em um lugar. Escolha o que faz sentido para o seu momento."
      />
      <div className="library-summary">
        <span>
          <strong>{lessons.length}</strong> aulas
        </span>
        <span>
          <strong>{words.length}</strong> palavras e expressões
        </span>
        <span>
          <strong>{questionBank.length}</strong> questões
        </span>
        <span>
          <strong>{listeningStories.length + readingStories.length}</strong>{" "}
          histórias e situações
        </span>
      </div>
      <label className="inline-search library-search">
        <Search size={18} />
        <input
          aria-label="Buscar na biblioteca"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="O que você quer explorar hoje?"
        />
      </label>
      <div className="resource-grid">
        {resources.map((r) => (
          <Link
            key={`${r.type}-${r.title}`}
            className="resource-card"
            to={r.path}
          >
            <span className="stat-icon green">
              <r.Icon size={20} />
            </span>
            <div>
              <span className="eyebrow">
                {r.type} · {r.level}
              </span>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </div>
            <ArrowRight size={17} />
          </Link>
        ))}
      </div>
      {!resources.length && (
        <p className="empty-state">Nenhum conteúdo encontrado.</p>
      )}
      <section className="panel video-library">
        <div className="section-title">
          <h2>
            <Video size={21} />
            Aprender com outros olhares
          </h2>
          <Badge tone="neutral">YOUTUBE</Badge>
        </div>
        {videos.length ? (
          <div className="video-grid">
            {videos.map((v) => (
              <VideoPlayer key={v.id} video={v} />
            ))}
          </div>
        ) : (
          <div className="curation-note">
            <span className="stat-icon peach">
              <Video size={26} />
            </span>
            <div>
              <h3>Vídeos em curadoria.</h3>
              <p>
                O player incorporado está implementado. A verificação dos vídeos
                foi bloqueada pelo acesso de rede deste ambiente; nenhum ID foi
                inventado ou publicado sem validação.
              </p>
              <p>
                As aulas, exemplos de áudio e exercícios locais continuam
                disponíveis. O responsável pelo conteúdo pode cadastrar fontes
                verificadas seguindo o README.
              </p>
            </div>
          </div>
        )}
      </section>
      <div className="info-note">
        Banco inicial: {questionBank.filter((q) => !q.assessment).length}{" "}
        questões de estudo e {questionBank.filter((q) => q.assessment).length}{" "}
        reservadas para avaliações. O conteúdo é uma base inicial expansível; B2
        e C1 têm cobertura menor e não representam um curso CEFR completo.
      </div>
    </>
  );
}
