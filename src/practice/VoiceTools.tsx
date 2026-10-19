import { useEffect, useRef, useState } from "react";
import { Mic, Square, Circle } from "lucide-react";
type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  abort: () => void;
  onresult:
    | ((e: {
        results: { [i: number]: { [i: number]: { transcript: string } } };
      }) => void)
    | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};
export function VoiceTools({
  onTranscript,
}: {
  onTranscript: (text: string) => void;
}) {
  const [listening, setListening] = useState(false),
    [recording, setRecording] = useState(false),
    [pending, setPending] = useState(false),
    [extension, setExtension] = useState("webm"),
    [audio, setAudio] = useState(""),
    [error, setError] = useState("");
  const recognition = useRef<Recognition | null>(null),
    recorder = useRef<MediaRecorder | null>(null),
    stream = useRef<MediaStream | null>(null),
    url = useRef(""),
    alive = useRef(true),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null),
    callback = useRef(onTranscript);
  callback.current = onTranscript;
  const browser = window as unknown as {
    SpeechRecognition?: new () => Recognition;
    webkitSpeechRecognition?: new () => Recognition;
  };
  const Ctor = browser.SpeechRecognition || browser.webkitSpeechRecognition;
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      recognition.current?.abort();
      if (timer.current) clearTimeout(timer.current);
      if (recorder.current?.state === "recording") recorder.current.stop();
      stream.current?.getTracks().forEach((t) => t.stop());
      if (url.current) URL.revokeObjectURL(url.current);
    };
  }, []);
  const transcribe = () => {
    if (listening) {
      recognition.current?.abort();
      return;
    }
    if (!Ctor) return;
    setError("");
    try {
      const r = new Ctor();
      recognition.current = r;
      r.lang = "en-US";
      r.continuous = false;
      r.interimResults = false;
      r.onresult = (e) => {
        if (alive.current) callback.current(e.results[0][0].transcript);
      };
      r.onerror = () => {
        if (alive.current) {
          setListening(false);
          setError(
            "Não foi possível transcrever. Você pode digitar sua resposta ou gravar para ouvir depois.",
          );
        }
      };
      r.onend = () => {
        if (alive.current) setListening(false);
      };
      r.start();
      setListening(true);
    } catch {
      setError("Transcrição indisponível. Use o campo de texto.");
    }
  };
  const record = async () => {
    if (pending) return;
    if (recording) {
      recorder.current?.stop();
      return;
    }
    try {
      setError("");
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
        setError(
          "Gravação indisponível. Você pode praticar em voz alta e digitar.",
        );
        return;
      }
      setPending(true);
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!alive.current) {
        media.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = media;
      const r = new MediaRecorder(media);
      recorder.current = r;
      const chunks: BlobPart[] = [];
      r.ondataavailable = (e) => chunks.push(e.data);
      r.onstop = () => {
        media.getTracks().forEach((t) => t.stop());
        if (timer.current) clearTimeout(timer.current);
        if (!alive.current) return;
        if (url.current) URL.revokeObjectURL(url.current);
        url.current = URL.createObjectURL(
          new Blob(chunks, { type: r.mimeType }),
        );
        setAudio(url.current);
        setExtension(
          r.mimeType.includes("mp4")
            ? "m4a"
            : r.mimeType.includes("ogg")
              ? "ogg"
              : "webm",
        );
        setRecording(false);
      };
      r.start();
      setRecording(true);
      timer.current = setTimeout(() => {
        if (r.state === "recording") r.stop();
      }, 90000);
    } catch {
      stream.current?.getTracks().forEach((t) => t.stop());
      if (alive.current)
        setError(
          "O microfone não pôde ser usado. A resposta digitada continua disponível.",
        );
    } finally {
      if (alive.current) setPending(false);
    }
  };
  return (
    <div className="voice-tools">
      <div className="button-row">
        <button
          className="button secondary"
          onClick={transcribe}
          disabled={!Ctor || recording || pending}
        >
          {listening ? <Square size={15} /> : <Mic size={16} />}{" "}
          {listening ? "Parar transcrição" : "Falar e transcrever"}
        </button>
        <button
          className="button secondary"
          onClick={record}
          disabled={listening || pending}
        >
          {recording ? <Square size={15} /> : <Circle size={15} />}{" "}
          {pending
            ? "Abrindo microfone…"
            : recording
              ? "Parar gravação"
              : "Gravar para me ouvir"}
        </button>
      </div>
      {!Ctor && (
        <small>
          A transcrição não está disponível neste navegador. Digite ou grave sua
          resposta.
        </small>
      )}
      {recording && (
        <p role="status">Gravando · até 90 segundos. Pare quando terminar.</p>
      )}
      {audio && (
        <div>
          <audio controls src={audio} aria-label="Minha gravação" />
          <a
            className="text-link"
            href={audio}
            download={"english-path-minha-pratica." + extension}
          >
            Baixar minha gravação
          </a>
        </div>
      )}
      {error && (
        <p role="status" className="feedback warning">
          {error}
        </p>
      )}
      <small>
        A transcrição depende do navegador e pode usar internet. A gravação fica
        nesta sessão; baixe-a para guardar. Não há nota automática de pronúncia.
      </small>
    </div>
  );
}
