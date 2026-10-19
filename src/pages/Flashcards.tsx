import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  Pencil,
  RotateCcw,
  ArrowRight,
  Layers,
  Check,
  Eye,
} from "lucide-react";
import { useLearning } from "../hooks/useLearning";
import { makeCard, schedule } from "../utils/learning";
import type { Flashcard } from "../types";
import { PageTitle, Empty, Badge, AudioButton } from "../components/ui";
import { lessons } from "../content/lessons";
import { mastery } from "../utils/learning";
export function Flashcards() {
  const { state, update, notify } = useLearning();
  const reviewing = useLocation().pathname === "/reviews";
  const [editing, setEditing] = useState<Flashcard | null>(null);
  const [creating, setCreating] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [example, setExample] = useState("");
  const [category, setCategory] = useState("Pessoal");
  const [show, setShow] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [deleteId, setDeleteId] = useState("");
  const cards = state.cards.filter((c) => !c.deleted);
  const due = cards
    .filter((c) => Date.parse(c.due) <= Date.now())
    .sort((a, b) => a.due.localeCompare(b.due));
  const current = due[0];
  const weak = lessons.filter(
    (l) => mastery(state.attempts, l.id).label === "Precisa de revisão",
  );
  const edit = (c?: Flashcard) => {
    setCreating(!c);
    setEditing(c || null);
    setFront(c?.front || "");
    setBack(c?.back || "");
    setExample(c?.example || "");
    setCategory(c?.category || "Pessoal");
  };
  const save = () => {
    if (!front.trim() || !back.trim()) return;
    const c = editing
      ? {
          ...editing,
          front: front.trim(),
          back: back.trim(),
          example,
          category,
          updatedAt: new Date().toISOString(),
        }
      : makeCard(front.trim(), back.trim(), category, example);
    update((s) => ({
      ...s,
      cards: [...s.cards.filter((x) => x.id !== c.id), c],
    }));
    setEditing(null);
    setCreating(false);
    notify("Flashcard salvo.");
  };
  const rate = (grade: number) => {
    if (!current) return;
    const next = schedule(current, grade);
    update((s) => ({
      ...s,
      cards: s.cards.map((c) => (c.id === next.id ? next : c)),
    }));
    setShow(false);
    setReviewed((v) => v + 1);
  };
  return (
    <>
      <PageTitle
        eyebrow={
          reviewing ? "FAÇA O CONHECIMENTO FICAR" : "SUA COLEÇÃO DE DESCOBERTAS"
        }
        title={
          reviewing
            ? "Revisitar também é avançar."
            : "Pequenas palavras. Novas possibilidades."
        }
        description={
          reviewing
            ? "Revise quando fizer sentido para você. Sem cobrança por dias ausentes."
            : "Guarde palavras e frases das aulas ou crie seus próprios cartões."
        }
        action={
          !reviewing ? (
            <button className="button" onClick={() => edit()}>
              <Plus size={17} />
              Criar flashcard
            </button>
          ) : (
            <Badge>{due.length} para revisar</Badge>
          )
        }
      />
      {(creating || editing) && (
        <form
          className="panel card-form"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <h2>{editing ? "Editar cartão" : "Um novo flashcard"}</h2>
          <div className="form-grid">
            <label>
              Palavra ou expressão
              <input
                required
                maxLength={500}
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="e.g. take a break"
              />
            </label>
            <label>
              Tradução ou significado
              <input
                required
                maxLength={500}
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder="fazer uma pausa"
              />
            </label>
            <label>
              Exemplo em inglês
              <input
                maxLength={1000}
                value={example}
                onChange={(e) => setExample(e.target.value)}
              />
            </label>
            <label>
              Categoria
              <input
                maxLength={100}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </label>
          </div>
          <div className="button-row">
            <button className="button" type="submit">
              <Check size={16} />
              Salvar cartão
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
      {reviewing ? (
        <>
          <div className="review-session-header">
            <span>
              <Layers size={17} />
              {reviewed} revisados nesta sessão
            </span>
            <Link to="/flashcards">
              Gerenciar cartões
              <ArrowRight size={15} />
            </Link>
          </div>
          {current ? (
            <div className="review-stage">
              <Badge tone="neutral">{current.category}</Badge>
              <h2 lang="en">{current.front}</h2>
              <AudioButton text={current.front} />
              {current.pronunciation && (
                <p className="muted">/{current.pronunciation}/</p>
              )}
              {show ? (
                <>
                  <div className="card-reveal">
                    <h3>{current.back}</h3>
                    {current.example && <p lang="en">{current.example}</p>}
                  </div>
                  <p>
                    Como foi lembrar? Sua avaliação define a próxima revisão.
                  </p>
                  <div className="rating-buttons">
                    {[
                      [0, "Não lembrei"],
                      [3, "Com dificuldade"],
                      [4, "Lembrei"],
                      [5, "Foi fácil"],
                    ].map(([g, t]) => (
                      <button key={g} onClick={() => rate(g as number)}>
                        {t}
                        <small>
                          {schedule(current, g as number).interval} dia(s)
                        </small>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <button className="button" onClick={() => setShow(true)}>
                  <Eye size={17} />
                  Mostrar resposta
                </button>
              )}
            </div>
          ) : (
            <Empty
              title={
                reviewed
                  ? "Você deu espaço para o conhecimento ficar."
                  : "Nenhum cartão pendente agora."
              }
              link={cards.length ? "/flashcards" : "/vocabulary"}
              label={cards.length ? "Ver meus cartões" : "Descobrir palavras"}
            >
              {cards.length
                ? "Seus cartões voltam na data calculada pela revisão espaçada."
                : "Adicione palavras do vocabulário ou crie um cartão para começar."}
            </Empty>
          )}
          {weak.length > 0 && (
            <section className="panel">
              <h2>Tópicos que merecem outra visita</h2>
              <p>
                Recomendados por erros recorrentes nas suas primeiras
                tentativas.
              </p>
              {weak.map((l) => (
                <Link
                  className="review-topic"
                  key={l.id}
                  to={`/lesson/${l.id}`}
                >
                  <RotateCcw size={17} />
                  {l.title}
                  <ArrowRight size={16} />
                </Link>
              ))}
            </section>
          )}
        </>
      ) : (
        <>
          {cards.length ? (
            <>
              <div className="filter-row">
                <span>
                  {cards.length} cartões · {due.length} para hoje
                </span>
                <Link className="button secondary" to="/reviews">
                  <RotateCcw size={16} />
                  Começar revisão
                </Link>
              </div>
              <div className="flashcard-grid">
                {cards.map((c) => (
                  <article className="panel flashcard-item" key={c.id}>
                    <Badge tone="neutral">{c.category}</Badge>
                    <div className="word-title">
                      <h2 lang="en">{c.front}</h2>
                      <AudioButton text={c.front} compact />
                    </div>
                    <p>{c.back}</p>
                    {c.example && (
                      <p className="muted" lang="en">
                        {c.example}
                      </p>
                    )}
                    <div className="flashcard-meta">
                      <span>
                        {Date.parse(c.due) <= Date.now()
                          ? "Pronto para revisar"
                          : `Revisar em ${new Date(c.due).toLocaleDateString("pt-BR")}`}
                      </span>
                      <span>{c.reviews.length} revisões</span>
                    </div>
                    <details>
                      <summary>Histórico de revisões</summary>
                      {c.reviews.length ? (
                        c.reviews.map((r, i) => (
                          <p key={i}>
                            {new Date(r.date).toLocaleDateString("pt-BR")} ·
                            Avaliação {r.grade}/5 · Intervalo {r.interval}{" "}
                            dia(s)
                          </p>
                        ))
                      ) : (
                        <p>Ainda sem revisões.</p>
                      )}
                    </details>
                    <div className="word-actions">
                      <button className="text-button" onClick={() => edit(c)}>
                        <Pencil size={15} />
                        Editar
                      </button>
                      <button
                        className="text-button danger"
                        onClick={() => setDeleteId(c.id)}
                      >
                        <Trash2 size={15} />
                        Excluir
                      </button>
                    </div>
                    {deleteId === c.id && (
                      <div className="delete-confirm">
                        <p>
                          Excluir este cartão e mantê-lo removido na
                          sincronização?
                        </p>
                        <button
                          className="button danger"
                          onClick={() => {
                            update((s) => ({
                              ...s,
                              cards: s.cards.map((x) =>
                                x.id === c.id
                                  ? {
                                      ...x,
                                      deleted: true,
                                      updatedAt: new Date().toISOString(),
                                    }
                                  : x,
                              ),
                            }));
                            setDeleteId("");
                          }}
                        >
                          Excluir cartão
                        </button>
                        <button
                          className="text-button"
                          onClick={() => setDeleteId("")}
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </>
          ) : (
            <Empty
              title="Sua coleção começa com uma palavra."
              link="/vocabulary"
              label="Explorar vocabulário"
            >
              Encontre uma palavra útil e toque em “Flashcard”. Ela passa a
              fazer parte das suas revisões.
            </Empty>
          )}
        </>
      )}
      <details className="method-note">
        <summary>Como a repetição espaçada funciona?</summary>
        <p>
          SM-2 adaptado: não lembrar reinicia a contagem e agenda em 1 dia.
          Respostas com nota 3, 4 ou 5 geram intervalos de 1 dia, depois 6 dias,
          depois intervalo anterior × facilidade. A facilidade começa em 2,5, é
          ajustada pela nota e nunca fica abaixo de 1,3. Toda avaliação fica no
          histórico. Os intervalos não são uma promessa de retenção.
        </p>
      </details>
    </>
  );
}
