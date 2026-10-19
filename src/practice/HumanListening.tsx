import { useEffect, useRef, useState } from "react";
import { openDB } from "idb";
import { ExternalLink, Headphones } from "lucide-react";
import { useLearning } from "../hooks/useLearning";
import { uid } from "../utils/learning";
type Clip = { id: string; name: string; blob: Blob };
const database = () =>
  openDB("english-path-media", 1, {
    upgrade(db) {
      db.createObjectStore("clips");
    },
  });
export function HumanListening() {
  const { state, update, notify } = useLearning();
  const [clip, setClip] = useState<Clip | null>(null),
    [url, setUrl] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    void database()
      .then(async (db) => {
        const value = await db.get("clips", "current");
        db.close();
        if (
          alive.current &&
          value &&
          typeof value.id === "string" &&
          typeof value.name === "string" &&
          value.blob instanceof Blob
        )
          setClip(value);
      })
      .catch(() => {
        if (alive.current)
          setError("O navegador não pôde recuperar a gravação local.");
      });
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    if (!clip) {
      setUrl("");
      return;
    }
    const next = URL.createObjectURL(clip.blob);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [clip]);
  async function choose(file: File | undefined) {
    if (!file) return;
    if (
      file.size > 20 * 1024 * 1024 ||
      !(
        /\.(mp3|wav|ogg|oga|m4a|mp4|webm)$/i.test(file.name) ||
        file.type.startsWith("audio/")
      )
    ) {
      setError(
        "Escolha um arquivo de áudio MP3, WAV, OGG, M4A ou WebM de até 20 MB.",
      );
      return;
    }
    setBusy(true);
    setError("");
    const next: Clip = { id: uid(), name: file.name, blob: file };
    try {
      const db = await database();
      await db.put("clips", next, "current");
      db.close();
      if (alive.current) {
        setClip(next);
        notify("Áudio guardado neste navegador para praticar offline.");
      }
    } catch {
      if (alive.current)
        setError(
          "Não foi possível guardar o arquivo. Verifique o espaço disponível no navegador.",
        );
    } finally {
      if (alive.current) setBusy(false);
    }
  }
  const key = "human-listening-" + clip?.id,
    transcript = state.drafts?.[key + "-transcript"]?.text || "",
    notes = state.drafts?.[key + "-notes"]?.text || "";
  const draft = (kind: string, text: string) =>
    update((s) => ({
      ...s,
      drafts: {
        ...s.drafts,
        [key + "-" + kind]: { text, updatedAt: new Date().toISOString() },
      },
    }));
  const save = () => {
    if (!clip || !notes.trim()) return;
    update((s) => ({
      ...s,
      attempts: [
        ...s.attempts,
        {
          id: uid(),
          exerciseId: key,
          topic: "human-listening",
          skill: "listening",
          answer: notes,
          correct: false,
          date: new Date().toISOString(),
          seconds: 0,
          number: s.attempts.filter((a) => a.exerciseId === key).length + 1,
          selfAssessed: true,
          assisted: !!transcript.trim(),
        },
      ],
    }));
    notify(
      "Anotações de escuta guardadas como reflexão, sem correção automática.",
    );
  };
  return (
    <section className="panel human-listening-resources">
      <span className="eyebrow">CONTATO COM PESSOAS REAIS</span>
      <h2>Leve a escuta além da voz sintetizada.</h2>
      <p>
        Use as lições locais para se preparar. Depois, ouça um trecho curto de
        uma fonte real: primeiro a ideia principal, depois detalhes e, por fim,
        a transcrição.
      </p>
      <div className="human-source-links">
        <a
          href="https://learningenglish.voanews.com/"
          target="_blank"
          rel="noreferrer"
        >
          <strong>
            VOA Learning English
            <ExternalLink size={14} />
          </strong>
          <small>
            Notícias e histórias para estudantes. Procure conteúdos com áudio e
            transcrição.
          </small>
        </a>
        <a
          href="https://learnenglish.britishcouncil.org/skills/listening"
          target="_blank"
          rel="noreferrer"
        >
          <strong>
            British Council
            <ExternalLink size={14} />
          </strong>
          <small>
            Prática de escuta por nível. Compare o que entendeu com as
            atividades da fonte.
          </small>
        </a>
        <a
          href="https://www.bbc.co.uk/learningenglish"
          target="_blank"
          rel="noreferrer"
        >
          <strong>
            BBC Learning English
            <ExternalLink size={14} />
          </strong>
          <small>
            Programas sobre linguagem e situações do cotidiano, com vozes
            humanas.
          </small>
        </a>
      </div>
      <p className="muted">
        Os links abrem sites externos. O catálogo local abaixo e os áudios das
        aulas usam síntese de voz; gravações externas não estão incluídas no
        cache do site.
      </p>
      <div className="local-audio-practice">
        <h3>
          <Headphones size={19} /> Meu áudio para escuta
        </h3>
        <p>
          Guarde uma gravação que você pode usar, como um trecho próprio ou
          autorizado. Ela fica neste dispositivo e pode ser ouvida offline.
        </p>
        <label>
          Escolher gravação atual · até 20 MB
          <input
            type="file"
            accept="audio/*,.mp3,.wav,.ogg,.m4a,.webm"
            disabled={busy}
            onChange={(e) => {
              void choose(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
        <small>
          Uma gravação por vez. Escolher outra substitui o arquivo atual.
          Arquivos de áudio não entram no backup JSON nem no Supabase.
        </small>
        {busy && <p role="status">Guardando o áudio…</p>}
        {error && (
          <p className="feedback warning" role="status">
            {error}
          </p>
        )}
        {clip && (
          <>
            <p>
              <strong>{clip.name}</strong>
            </p>
            <audio
              controls
              src={url}
              preload="metadata"
              aria-label="Minha gravação de escuta"
            />
            <label>
              O que entendi sem consultar o texto
              <textarea
                rows={4}
                lang="en"
                maxLength={5000}
                value={notes}
                onChange={(e) => draft("notes", e.target.value)}
                placeholder="Qual é a ideia principal? Quais detalhes você conseguiu reconhecer?"
              />
            </label>
            <details>
              <summary>Transcrição de apoio e comparação</summary>
              <label>
                Transcrição do trecho
                <textarea
                  rows={5}
                  lang="en"
                  maxLength={10000}
                  value={transcript}
                  onChange={(e) => draft("transcript", e.target.value)}
                  placeholder="Cole uma transcrição que você tem permissão para usar."
                />
              </label>
              <p>
                Compare suas anotações: quais palavras você confundiu? Que
                informação apareceu só na segunda escuta? Ouça novamente e
                repita uma frase.
              </p>
            </details>
            <button className="button" disabled={!notes.trim()} onClick={save}>
              Guardar reflexão de escuta
            </button>
          </>
        )}
      </div>
    </section>
  );
}
