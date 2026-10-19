import { Link } from "react-router-dom";
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      className={"vira-brand " + (compact ? "compact" : "")}
      aria-label="VIRA · Inglês que vira conversa"
    >
      <img src="/brand/vira-mark.png" alt="" width="44" height="44" />
      <span>
        vira
        <span className="brand-asterisk" aria-hidden="true">
          ✳
        </span>
        {!compact && <small>INGLÊS QUE VIRA CONVERSA</small>}
      </span>
    </Link>
  );
}
