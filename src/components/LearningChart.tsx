import { useMemo, useState } from "react";
import { useLearning } from "../hooks/useLearning";
import { learningEvidence } from "../progression/engine";
export function ActivityChart({ days = 7 }: { days?: number }) {
  const { state } = useLearning(),
    [selected, setSelected] = useState<number | null>(null);
  const data = useMemo(() => {
    const scored = learningEvidence(state).scored;
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (days - 1 - i));
      const next = new Date(date);
      next.setDate(next.getDate() + 1);
      const rows = scored.filter(
        (a) => Date.parse(a.date) >= +date && Date.parse(a.date) < +next,
      );
      const correct = rows.filter((a) => a.correct).length;
      return {
        label: date.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        }),
        short: date
          .toLocaleDateString("pt-BR", { weekday: "short" })
          .replace(".", ""),
        count: rows.length,
        correct,
        score: rows.length ? Math.round((correct / rows.length) * 100) : null,
      };
    });
  }, [state.attempts, days]);
  const max = Math.max(5, ...data.map((d) => d.count)),
    width = 700,
    height = 190,
    pad = 20,
    plotW = width - pad * 2,
    plotH = height - pad * 2;
  const points = data.map((d, i) => ({
    x: pad + (i / (data.length - 1 || 1)) * plotW,
    y: d.score === null ? null : height - pad - (d.score / 100) * plotH,
  }));
  const paths: string[] = [];
  let path = "";
  for (const p of points) {
    if (p.y === null) {
      if (path) paths.push(path);
      path = "";
    } else path += (path ? " L" : "M") + p.x + " " + p.y;
  }
  if (path) paths.push(path);
  const active =
    selected !== null && selected < data.length ? data[selected] : null;
  const hasData = data.some((d) => d.count > 0);
  return (
    <div className="vira-learning-chart">
      <div className="chart-legend">
        <span>
          <i className="volume-key" />
          Respostas novas
        </span>
        <span>
          <i className="accuracy-key" />
          Acerto sem apoio
        </span>
        <span className="chart-legend-note">
          Primeiras respostas por questão
        </span>
      </div>
      <div className="learning-chart-canvas">
        <div className="chart-scale">
          <span>100%</span>
          <span>50%</span>
          <span>0%</span>
        </div>
        <svg
          viewBox={"0 0 " + width + " " + height}
          role="img"
          aria-label={
            hasData
              ? "Evolução do aproveitamento nos últimos " + days + " dias"
              : "Ainda sem respostas avaliadas neste período"
          }
        >
          <defs>
            <linearGradient
              id={"chart-fill-" + days}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#ff7345" stopOpacity=".20" />
              <stop offset="100%" stopColor="#ff7345" stopOpacity=".02" />
            </linearGradient>
          </defs>
          {[0, 50, 100].map((n) => (
            <line
              key={n}
              x1={pad}
              x2={width - pad}
              y1={height - pad - (n / 100) * plotH}
              y2={height - pad - (n / 100) * plotH}
              className="learning-gridline"
            />
          ))}
          {data.map((d, i) => (
            <rect
              key={i}
              x={points[i].x - Math.min(15, plotW / data.length / 3)}
              y={height - pad - (d.count / max) * plotH * 0.7}
              width={Math.min(30, (plotW / data.length) * 0.55)}
              height={(d.count / max) * plotH * 0.7}
              rx="4"
              className={
                selected === i ? "learning-volume active" : "learning-volume"
              }
            />
          ))}
          {paths.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="learning-accuracy"
            />
          ))}
          {points.map((p, i) =>
            p.y !== null ? (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={selected === i ? 6 : 4}
                className="learning-point"
              />
            ) : null,
          )}
        </svg>
        {!hasData && (
          <div className="learning-chart-empty">
            <strong>Seu primeiro acerto começa essa curva.</strong>
            <span>Pratique uma atividade para acompanhar sua evolução.</span>
          </div>
        )}
      </div>
      <div className={"chart-day-buttons " + (days > 7 ? "many-days" : "")}>
        {data.map((d, i) => (
          <button
            key={i}
            onClick={() => setSelected(selected === i ? null : i)}
            aria-pressed={selected === i}
            aria-label={
              d.label + ": " + d.count + " respostas, " + d.correct + " acertos"
            }
          >
            {days === 7
              ? d.short
              : i % 5 === 0 || i === data.length - 1
                ? d.label
                : "·"}
          </button>
        ))}
      </div>
      {days > 7 && (
        <label className="chart-day-select">
          Ver um dia do período
          <select
            value={selected ?? ""}
            onChange={(e) =>
              setSelected(e.target.value === "" ? null : Number(e.target.value))
            }
          >
            <option value="">Escolha uma data</option>
            {data.map((d, i) => (
              <option key={i} value={i}>
                {d.label} · {d.count} respostas ·{" "}
                {d.score === null ? "sem avaliação" : d.score + "% de acertos"}
              </option>
            ))}
          </select>
        </label>
      )}
      <div className="chart-day-detail" role="status">
        {active ? (
          <>
            <strong>{active.label}</strong>
            <span>
              {active.count} respostas novas · {active.correct} acertos ·{" "}
              {active.score === null
                ? "sem avaliação"
                : active.score + "% de aproveitamento"}
            </span>
          </>
        ) : (
          <span>
            Toque em um dia para ver os resultados. Dias sem respostas ficam sem
            taxa de acerto.
          </span>
        )}
      </div>
    </div>
  );
}
