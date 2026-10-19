import { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Square,
  ArrowRight,
  MessageCircle,
  Check,
} from "lucide-react";
import { useLearning } from "../hooks/useLearning";
import { AudioButton, Badge, PageTitle } from "../components/ui";
import { transcriptionDiff, uid } from "../utils/learning";
type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult:
    | ((event: {
        results: { [i: number]: { [i: number]: { transcript: string } } };
      }) => void)
    | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};
const prompts = [
  {
    target: "I worked yesterday, but I am taking a break now.",
    pt: "Eu trabalhei ontem, mas estou fazendo uma pausa agora.",
    question: "What did you do yesterday?",
    model:
      "Yesterday, I drove to the airport and helped a visitor find his hotel.",
  },
  {
    target: "Would you like me to turn on the air conditioning?",
    pt: "Você gostaria que eu ligasse o ar-condicionado?",
    question: "How do you help a passenger feel comfortable?",
    model: "I ask if they would like some music or air conditioning.",
  },
  {
    target: "There is a charger in the drawer next to the sofa.",
    pt: "Há um carregador na gaveta ao lado do sofá.",
    question: "Where do you keep your phone charger?",
    model: "I keep my charger in a drawer in the living room.",
  },
  {
    target: "I am going to visit my family this weekend.",
    pt: "Eu vou visitar minha família neste fim de semana.",
    question: "What are you going to do this weekend?",
    model: "I am going to visit a park with my family if the weather is good.",
  },
  {
    target: "I have been learning English for a few months.",
    pt: "Eu estudo inglês há alguns meses.",
    question: "Why are you learning English?",
    model: "I want to speak with visitors and learn more about technology.",
  },
];
export function Speaking() {
  const { state, update, notify } = useLearning();
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<"shadow" | "conversation">("shadow");
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const [compared, setCompared] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audio, setAudio] = useState("");
  const recognition = useRef<Recognition | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const audioRef = useRef("");
  const browser = window as unknown as {
    SpeechRecognition?: new () => Recognition;
    webkitSpeechRecognition?: new () => Recognition;
  };
  const Ctor = browser.SpeechRecognition || browser.webkitSpeechRecognition;
  const prompt = prompts[index];
  useEffect(
    () => () => {
      recognition.current?.abort();
      if (recorder.current?.state === "recording") recorder.current.stop();
      stream.current?.getTracks().forEach((t) => t.stop());
      if (audioRef.current) URL.revokeObjectURL(audioRef.current);
    },
    [],
  );
  const recognize = () => {
    if (!Ctor) return;
    setError("");
    setCompared(false);
    try {
      const r = new Ctor();
      recognition.current = r;
      r.lang = "en-US";
      r.continuous = false;
      r.interimResults = false;
      r.onresult = (e) => setText(e.results[0][0].transcript);
      r.onerror = (e) => {
        setError(
          e.error === "not-allowed"
            ? "O microfone não foi autorizado. Você pode digitar ou praticar sem microfone."
            : `Reconhecimento indisponível (${e.error}). Experimente digitar sua fala.`,
        );
        setListening(false);
      };
      r.onend = () => setListening(false);
      r.start();
      setListening(true);
    } catch {
      setError(
        "Não foi possível iniciar o reconhecimento. Use o modo sem microfone.",
      );
    }
  };
  const record = async () => {
    try {
      setError("");
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
        setError(
          "Gravação indisponível neste navegador ou conexão. Pratique lendo em voz alta.",
        );
        return;
      }
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = media;
      const r = new MediaRecorder(media);
      recorder.current = r;
      const chunks: BlobPart[] = [];
      r.ondataavailable = (e) => chunks.push(e.data);
      r.onstop = () => {
        media.getTracks().forEach((t) => t.stop());
        if (audioRef.current) URL.revokeObjectURL(audioRef.current);
        const url = URL.createObjectURL(new Blob(chunks, { type: r.mimeType }));
        audioRef.current = url;
        setAudio(url);
        setRecording(false);
      };
      r.start();
      setRecording(true);
    } catch {
      setError(
        "Não foi possível acessar o microfone. A prática sem gravação continua disponível.",
      );
    }
  };
  const save = (comfortable: boolean) => {
    update((s) => ({
      ...s,
      attempts: [
        ...s.attempts,
        {
          id: uid(),
          exerciseId: `speaking-${mode}-${index}`,
          topic: "speaking-practice",
          skill: "speaking",
          answer: text || "[Prática oral sem transcrição]",
          correct: comfortable,
          date: new Date().toISOString(),
          seconds: 0,
          number: 1,
          selfAssessed: true,
        },
      ],
    }));
    notify("Prática registrada como autoavaliação, sem nota fonética.");
  };
  return (
    <>
      <PageTitle
        eyebrow="SUA VOZ TAMBÉM ESTÁ APRENDENDO"
        title="Encontre confiança, uma frase por vez."
        description="Ouça, repita e experimente. Você não precisa falar perfeitamente para começar."
      />
      <div className="level-tabs">
        <button
          className={mode === "shadow" ? "active" : ""}
          onClick={() => {
            setMode("shadow");
            setCompared(false);
          }}
        >
          Shadowing
        </button>
        <button
          className={mode === "conversation" ? "active" : ""}
          onClick={() => {
            setMode("conversation");
            setCompared(false);
          }}
        >
          Perguntas e respostas
        </button>
      </div>
      <section className="panel speaking-stage">
        <Badge>
          PRÁTICA {index + 1} DE {prompts.length}
        </Badge>
        <span className="speaking-icon">
          <MessageCircle size={34} />
        </span>
        <h2 lang="en">{mode === "shadow" ? prompt.target : prompt.question}</h2>
        <p>
          {mode === "shadow"
            ? prompt.pt
            : "Responda com suas próprias palavras. A comparação é uma orientação, não uma correção semântica automática."}
        </p>
        <AudioButton
          text={mode === "shadow" ? prompt.target : prompt.question}
          label="Ouvir e repetir"
        />
        <div className="speech-controls">
          <button
            className="button"
            disabled={!Ctor || recording}
            onClick={() =>
              listening ? recognition.current?.stop() : recognize()
            }
          >
            {listening ? <Square size={17} /> : <Mic size={17} />}{" "}
            {listening ? "Parar reconhecimento" : "Falar e transcrever"}
          </button>
          <button
            className="button secondary"
            disabled={listening}
            onClick={() =>
              recording ? recorder.current?.stop() : void record()
            }
          >
            {recording ? <Square size={17} /> : <Mic size={17} />}{" "}
            {recording ? "Encerrar gravação" : "Gravar para me ouvir"}
          </button>
        </div>
        {listening && <p role="status">Ouvindo… Fale em inglês.</p>}
        {!Ctor && (
          <p className="info-note">
            <MicOff size={17} /> Reconhecimento de fala indisponível neste
            navegador. Use o campo abaixo ou pratique sem microfone.
          </p>
        )}
        {error && (
          <p className="feedback warning" role="status">
            {error}
          </p>
        )}
        {audio && (
          <div className="recording-playback">
            <label>
              Sua gravação, somente nesta sessão
              <audio controls src={audio} />
            </label>
          </div>
        )}
        <label className="speech-input-label">
          Sua transcrição ou resposta digitada
          <textarea
            lang="en"
            rows={3}
            placeholder="Você também pode digitar sua resposta aqui…"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setCompared(false);
            }}
          />
        </label>
        <button
          className="button secondary"
          disabled={!text.trim()}
          onClick={() => setCompared(true)}
        >
          {mode === "shadow" ? "Comparar palavras" : "Ver resposta-modelo"}
          <ArrowRight size={16} />
        </button>
        {compared && (
          <div className="transcript-feedback">
            {mode === "shadow" ? (
              <>
                <h3>Comparação de palavras</h3>
                <div className="diff-words">
                  {transcriptionDiff(prompt.target, text).map((w, i) => (
                    <span className={w.found ? "found" : "missing"} key={i}>
                      {w.word}
                    </span>
                  ))}
                </div>
                <p>
                  Verde: palavra encontrada na transcrição. Laranja: ausente. A
                  ordem e a qualidade acústica não são avaliadas.
                </p>
              </>
            ) : (
              <>
                <h3>Uma resposta natural possível</h3>
                <p lang="en">{prompt.model}</p>
                <AudioButton text={prompt.model} />
                <p>
                  Compare sua intenção e estrutura. Respostas diferentes também
                  podem estar corretas.
                </p>
              </>
            )}
          </div>
        )}
        <div className="speaking-self">
          <p>Como você se sentiu ao praticar?</p>
          <button className="button secondary" onClick={() => save(false)}>
            Quero repetir
          </button>
          <button className="button secondary" onClick={() => save(true)}>
            <Check size={16} />
            Mais confiante
          </button>
        </div>
        <button
          className="text-link"
          onClick={() => {
            recognition.current?.abort();
            setIndex((index + 1) % prompts.length);
            setText("");
            setCompared(false);
          }}
        >
          Próxima situação
          <ArrowRight size={16} />
        </button>
      </section>
      <div className="info-note">
        A transcrição pode usar serviços externos do navegador e depender de
        internet. Ela não é uma avaliação acústica profissional. Gravações
        permanecem apenas na sessão; não são enviadas ao Supabase.
      </div>
      <label className="speed-control">
        Velocidade da voz: {state.profile.speechRate.toFixed(2)}×
        <input
          aria-label="Velocidade da voz"
          type="range"
          min="0.5"
          max="1.5"
          step="0.05"
          value={state.profile.speechRate}
          onChange={(e) =>
            update((s) => ({
              ...s,
              profile: {
                ...s.profile,
                speechRate: Number(e.target.value),
                updatedAt: new Date().toISOString(),
              },
            }))
          }
        />
      </label>
    </>
  );
}
