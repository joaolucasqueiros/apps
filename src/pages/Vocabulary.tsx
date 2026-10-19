import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Plus, Check, ArrowLeft, ArrowRight } from "lucide-react";
import { words, categories, vocabularyExercises } from "../content/vocabulary";
import { useLearning } from "../hooks/useLearning";
import { makeCard } from "../utils/learning";
import { AudioButton, Badge, PageTitle, Empty } from "../components/ui";
import { Exercise } from "../components/Exercise";
export function Vocabulary() {
  const { state, update, notify } = useLearning();
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") || "");
  const [category, setCategory] = useState("Todos");
  const [practice, setPractice] = useState<number | null>(null);
  const filtered = words.filter(
    (w) =>
      (category === "Todos" || w.category === category) &&
      `${w.en} ${w.pt}`.toLowerCase().includes(search.toLowerCase()),
  );
  const exercises = vocabularyExercises.filter(
    (e) =>
      !e.assessment &&
      (category === "Todos" || e.topic === `vocabulary:${category}`),
  );
  return (
    <>
      <PageTitle
        eyebrow="DÊ NOME AO SEU MUNDO"
        title="Palavras que fazem parte da sua vida."
        description="Da cozinha à próxima viagem. Aprenda em contexto, ouça e leve para a memória."
        action={
          <button className="button" onClick={() => setPractice(0)}>
            Praticar vocabulário
            <ArrowRight size={16} />
          </button>
        }
      />
      {practice !== null ? (
        <>
          <button className="back-link" onClick={() => setPractice(null)}>
            <ArrowLeft size={16} />
            Voltar às palavras
          </button>
          {practice < exercises.length ? (
            <>
              <p className="muted">
                Prática {practice + 1} de {exercises.length} · {category}
              </p>
              <Exercise
                exercise={exercises[practice]}
                key={exercises[practice].id}
                onNext={() => setPractice(practice + 1)}
              />
            </>
          ) : (
            <Empty
              title="Palavras que agora fazem mais sentido."
              link="/reviews"
              label="Revisar cartões"
            >
              Sua prática está salva. Volte às palavras ou experimente uma
              revisão.
            </Empty>
          )}
        </>
      ) : (
        <>
          <div className="filter-row">
            <label className="inline-search">
              <Search size={17} />
              <input
                aria-label="Buscar palavras"
                placeholder="Uma palavra em inglês ou português…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <label className="select-label">
              Categoria
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Todos</option>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <span className="muted">
              {filtered.length} palavras e expressões
            </span>
          </div>
          <div className="vocabulary-grid">
            {filtered.map((w) => {
              const saved = state.cards.some(
                (c) => !c.deleted && c.front === w.en,
              );
              return (
                <article className="word-card" key={w.id}>
                  <div
                    className="word-illustration"
                    role="img"
                    aria-label={`Ilustração da categoria ${w.category}`}
                  >
                    <span>{w.illustration}</span>
                    <Badge tone="neutral">{w.category}</Badge>
                  </div>
                  <div className="word-content">
                    <div className="word-title">
                      <h2 lang="en">{w.en}</h2>
                      <AudioButton text={w.en} compact />
                    </div>
                    <p className="word-pronunciation">
                      /{w.pronunciation}/ <span>{w.part}</span>
                    </p>
                    <strong>{w.pt}</strong>
                    <p className="word-example" lang="en">
                      “{w.example}”
                    </p>
                    <div className="word-actions">
                      <AudioButton text={w.example} label="Ouvir exemplo" />
                      <button
                        className={`text-button ${saved ? "saved" : ""}`}
                        aria-label={`${saved ? "Salvo" : "Salvar"}: ${w.en}`}
                        onClick={() => {
                          if (saved) {
                            notify("Esta palavra já está nos flashcards.");
                            return;
                          }
                          update((s) => ({
                            ...s,
                            cards: [
                              ...s.cards,
                              makeCard(
                                w.en,
                                w.pt,
                                w.category,
                                w.example,
                                w.pronunciation,
                              ),
                            ],
                          }));
                          notify("Palavra salva. Você já pode revisá-la.");
                        }}
                      >
                        {saved ? <Check size={16} /> : <Plus size={16} />}{" "}
                        {saved ? "Salvo" : "Flashcard"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {!filtered.length && (
            <Empty title="Vamos tentar outra palavra?">
              Nenhuma palavra corresponde a essa busca.
            </Empty>
          )}
          <p className="info-note">
            As ilustrações representam categorias. As pronúncias em IPA são
            referências; as vozes sintetizadas disponíveis dependem do seu
            dispositivo.
          </p>
        </>
      )}
    </>
  );
}
