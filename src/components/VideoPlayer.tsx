import { useState } from "react";
import { ExternalLink, Play, WifiOff } from "lucide-react";
import type { Video } from "../content/videos";
export function VideoPlayer({ video }: { video: Video }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <article className="panel video-card">
      <div className="video-frame">
        {!navigator.onLine ? (
          <p>
            <WifiOff />
            Vídeos precisam de conexão.
          </p>
        ) : failed ? (
          <p>
            Não foi possível incorporar este vídeo. Use a opção de abrir no
            YouTube.
          </p>
        ) : loaded ? (
          <iframe
            title={video.title}
            src={`https://www.youtube-nocookie.com/embed/${video.id}`}
            loading="lazy"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            onError={() => setFailed(true)}
          />
        ) : (
          <button className="video-load" onClick={() => setLoaded(true)}>
            <Play size={34} />
            Carregar vídeo do YouTube
          </button>
        )}
      </div>
      <h3>{video.title}</h3>
      <p>
        {video.channel} · {video.language}
        {video.duration && ` · ${video.duration}`}
      </p>
      <p>{video.reason}</p>
      <small>
        Tema: {video.topic} · Verificado em {video.verifiedAt}
      </small>
      <div className="word-actions">
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noreferrer"
        >
          Abrir no YouTube
          <ExternalLink size={14} />
        </a>
        {loaded && (
          <button className="text-button" onClick={() => setFailed(true)}>
            O player não funciona?
          </button>
        )}
      </div>
      <p className="muted">
        Se o canal bloquear a incorporação, abra o vídeo no YouTube e retorne
        aos exercícios da aula.
      </p>
    </article>
  );
}
