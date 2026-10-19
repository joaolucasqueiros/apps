import { HumanListening } from "../practice/HumanListening";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Headphones,
  BookOpen,
  Eye,
  Volume2,
} from "lucide-react";
import { listeningStories, readingStories } from "../content/stories";
import { PageTitle, Badge, AudioButton, Empty } from "../components/ui";
import { Exercise } from "../components/Exercise";
export function Stories() {
  const listening = useLocation().pathname === "/listening";
  const stories = listening ? listeningStories : readingStories;
  const [level, setLevel] = useState("Todos");
  const [selected, setSelected] = useState("");
  const [transcript, setTranscript] = useState(false);
  const [translation, setTranslation] = useState(false);
  const [index, setIndex] = useState(0);
  const story = stories.find((s) => s.id === selected);
  const questions = story?.questions.filter((q) => !q.assessment) || [];
  return (
    <>
      <PageTitle
        eyebrow={listening ? "OUÇA. PERCEBA. ENTENDA." : "UM MUNDO PARA LER"}
        title={
          listening
            ? "Abra espaço para o inglês chegar."
            : "Uma história. Novas conexões."
        }
        description={
          listening
            ? "Áudios sintetizados pelo seu navegador, com situações do mundo real."
            : "Textos curtos para compreender ideias, ampliar vocabulário e ganhar autonomia."
        }
      />
      {story ? (
        <>
          <button
            className="back-link"
            onClick={() => {
              setSelected("");
              setIndex(0);
              setTranscript(false);
              setTranslation(false);
            }}
          >
            <ArrowLeft size={16} />
            Voltar aos conteúdos
          </button>
          <section className="panel story-reader">
            <div className="badge-row">
              <Badge>{story.level}</Badge>
              <Badge tone="neutral">{story.category}</Badge>
            </div>
            <h2>{story.title}</h2>
            {listening ? (
              <>
                <div className="audio-player">
                  <span className="stat-icon blue">
                    <Volume2 size={24} />
                  </span>
                  <div>
                    <strong>Ouça com atenção. Repita quando quiser.</strong>
                    <p>Voz sintetizada · velocidade nas configurações</p>
                  </div>
                  <AudioButton text={story.text} label="Reproduzir áudio" />
                </div>
                <button
                  className="text-button"
                  onClick={() => setTranscript(!transcript)}
                >
                  <Eye size={16} />
                  {transcript ? "Ocultar" : "Mostrar"} transcrição
                </button>
              </>
            ) : (
              <AudioButton text={story.text} label="Ouvir texto sintetizado" />
            )}
            {(!listening || transcript) && (
              <div className="story-text" lang="en">
                {story.text.split(/(?<=[.!?])\s+/).map((sentence, i) => (
                  <p key={i}>
                    {sentence}
                    <AudioButton text={sentence} compact />
                  </p>
                ))}
              </div>
            )}
            <button
              className="text-button"
              onClick={() => setTranslation(!translation)}
            >
              {translation ? "Ocultar" : "Consultar"} tradução de apoio
            </button>
            {translation && <p className="translation">{story.translation}</p>}
          </section>
          <div className="section-title">
            <h2>O que você compreendeu?</h2>
            <span>
              {Math.min(index + 1, questions.length)} de {questions.length}
            </span>
          </div>
          {index < questions.length ? (
            <Exercise
              key={questions[index].id}
              exercise={questions[index]}
              assisted={transcript || translation}
              onNext={() => setIndex(index + 1)}
            />
          ) : (
            <Empty title="Uma nova história faz parte do seu caminho.">
              Suas respostas estão salvas. Você pode repetir o áudio, consultar
              a tradução ou explorar outro conteúdo.
            </Empty>
          )}
        </>
      ) : (
        <>
          <div className="story-level-filter">
            <label>
              Nível do conteúdo
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                {["Todos", "A1", "A2", "B1", "B2", "C1"].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </label>
            <span>
              {
                stories.filter((s) => level === "Todos" || s.level === level)
                  .length
              }{" "}
              conteúdos disponíveis
            </span>
          </div>
          <div className="story-grid">
            {stories
              .filter((s) => level === "Todos" || s.level === level)
              .map((s, i) => (
                <button
                  className="story-card"
                  key={s.id}
                  onClick={() => {
                    setSelected(s.id);
                    setIndex(0);
                  }}
                >
                  <div className={`story-art art-${i % 4}`}>
                    <span className="story-emoji">
                      {["🚘", "🌳", "🔑", "💡", "🍽️", "💻"][i % 6]}
                    </span>
                    <span className="story-art-label">
                      {listening ? "LISTEN & DISCOVER" : "READ & EXPLORE"}
                    </span>
                  </div>
                  <div className="story-card-copy">
                    <div className="badge-row">
                      <Badge>{s.level}</Badge>
                      <span>
                        {s.minutes} min · {s.category}
                      </span>
                    </div>
                    <h2>{s.title}</h2>
                    <p>
                      {listening
                        ? "Ouça, repita e descubra o que você entendeu."
                        : "Leia em inglês, explore o contexto e teste a compreensão."}
                    </p>
                    <span className="text-link">
                      {listening ? (
                        <Headphones size={16} />
                      ) : (
                        <BookOpen size={16} />
                      )}
                      Começar
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </button>
              ))}
          </div>
          {listening && (
            <div className="info-note">
              Não são gravações humanas. A reprodução requer uma voz em inglês
              instalada ou fornecida pelo navegador. Algumas vozes dependem de
              internet. Quando o áudio estiver indisponível, a transcrição
              oferece uma alternativa de estudo.
            </div>
          )}
        </>
      )}
      {listening && !story && <HumanListening />}
    </>
  );
}
