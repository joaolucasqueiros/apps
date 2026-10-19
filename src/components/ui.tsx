import { ArrowRight, Volume2, BookOpen, Check, Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useLearning } from "../hooks/useLearning";
import { speak } from "../services/speech";
export function AudioButton({
  text,
  label = "Ouvir",
  compact = false,
}: {
  text: string;
  label?: string;
  compact?: boolean;
}) {
  const { state, notify } = useLearning();
  return (
    <button
      className={`audio-button ${compact ? "icon-button" : ""}`}
      aria-label={`${label}: ${text}`}
      onClick={() => speak(text, state.profile.speechRate, notify)}
    >
      <Volume2 size={17} />
      {!compact && label}
    </button>
  );
}
export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-label={label || "Progresso"}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
    >
      <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
export function Empty({
  title,
  children,
  link,
  label = "Começar agora",
}: {
  title: string;
  children: ReactNode;
  link?: string;
  label?: string;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Inbox size={26} />
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
      {link && (
        <Link className="button secondary" to={link}>
          {label}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
export function PageTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-title">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
export function Badge({
  children,
  tone = "green",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return <span className={`badge ${tone}`}>{children}</span>;
}
export function SectionTitle({
  title,
  link,
  label = "Ver tudo",
}: {
  title: string;
  link?: string;
  label?: string;
}) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {link && (
        <Link to={link}>
          {label}
          <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
export function BookMark({ done }: { done: boolean }) {
  return (
    <span className={`lesson-marker ${done ? "done" : ""}`}>
      {done ? <Check size={18} /> : <BookOpen size={20} />}
    </span>
  );
}
export function PathArt({ goal = "B1" }: { goal?: string }) {
  return (
    <svg
      className="path-art"
      viewBox="0 0 390 210"
      aria-label="Um caminho conecta pequenos passos de aprendizagem"
      role="img"
    >
      <defs>
        <pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#a9cbbb" opacity=".55" />
        </pattern>
      </defs>
      <rect width="390" height="210" fill="url(#dots)" />
      <circle cx="305" cy="53" r="29" fill="#edc993" opacity=".7" />
      <path
        d="M35 182C110 120 197 222 248 141S299 75 355 80"
        stroke="#b1d0bd"
        strokeWidth="25"
        fill="none"
      />
      <path
        d="M35 182C110 120 197 222 248 141S299 75 355 80"
        stroke="#f4f8ee"
        strokeWidth="2"
        strokeDasharray="6 8"
        fill="none"
      />
      <g transform="translate(58 55) rotate(-8)">
        <rect
          x="0"
          y="0"
          width="142"
          height="87"
          rx="12"
          fill="white"
          stroke="#d6e4d9"
        />
        <rect x="14" y="14" width="29" height="29" rx="8" fill="#e0efe6" />
        <path
          d="m22 29 5 5 10-12"
          fill="none"
          stroke="#388169"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <text x="53" y="27" fontSize="11" fill="#64756d">
          UM PASSO POR VEZ
        </text>
        <text x="14" y="65" fontSize="18" fill="#245744" fontWeight="600">
          I can do this.
        </text>
      </g>
      <g transform="translate(240 112) rotate(7)">
        <rect width="112" height="68" rx="11" fill="#fff" stroke="#d6e4d9" />
        <text x="15" y="24" fontSize="10" fill="#7d8980">
          SEU PRÓXIMO NÍVEL
        </text>
        <text x="15" y="51" fontSize="24" fill="#28634e" fontWeight="600">
          {goal}
        </text>
        <path
          d="m71 48 13-13m-10 0h10v10"
          fill="none"
          stroke="#28634e"
          strokeWidth="2"
        />
      </g>
      <circle cx="224" cy="71" r="17" fill="#628a70" />
      <path
        d="m218 71 4 4 8-9"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M23 180v-30m0 14c-19-9-16-24-16-24 20 0 18 20 16 24m0-3c2-22 16-25 16-25 7 16-4 24-16 25"
        stroke="#7f9d7f"
        fill="#aac6a5"
        strokeWidth="2"
      />
    </svg>
  );
}
