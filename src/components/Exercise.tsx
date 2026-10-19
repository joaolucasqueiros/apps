import { useEffect, useRef, useState } from "react";
import { Check, ArrowRight, RotateCcw, Lightbulb, X } from "lucide-react";
import type { Exercise as ExerciseType } from "../types";
import { useLearning } from "../hooks/useLearning";
import { isCorrect, uid } from "../utils/learning";
import { AudioButton } from "./ui";
export function Exercise({
  exercise: e,
  onNext,
  onResult,
  assessment = false,
  assisted = false,
  savedAnswer,
}: {
  exercise: ExerciseType;
  onNext?: () => void;
  onResult?: (correct: boolean, answer: string) => void;
  assessment?: boolean;
  assisted?: boolean;
  savedAnswer?: string;
}) {
  const { update, state } = useLearning();
  const [answer, setAnswer] = useState(savedAnswer || "");
  const [checked, setChecked] = useState(savedAnswer !== undefined);
  const [selected, setSelected] = useState<number[]>([]);
  const [help, setHelp] = useState(false);
  const began = useRef(Date.now());
  const tokens = (e.sentence || "")
    .split(" ")
    .map((text, id) => ({ text, id }))
    .sort((a, b) => ((a.id * 7 + 3) % 11) - ((b.id * 7 + 3) % 11));
  useEffect(() => {
    setAnswer(savedAnswer || "");
    setChecked(savedAnswer !== undefined);
    setSelected([]);
    setHelp(false);
    began.current = Date.now();
  }, [e.id, savedAnswer]);
  const correct = isCorrect(e, answer);
  const submit = () => {
    if (!answer.trim() || checked) return;
    const prior = state.attempts.filter((a) => a.exerciseId === e.id).length;
    update((s) => ({
      ...s,
      attempts: [
        ...s.attempts,
        {
          id: uid(),
          exerciseId: e.id,
          topic: e.topic,
          skill: e.skill,
          answer,
          correct,
          date: new Date().toISOString(),
          seconds: Math.round((Date.now() - began.current) / 1000),
          number: prior + 1,
          assisted: assisted || help,
        },
      ],
    }));
    setChecked(true);
    onResult?.(correct, answer);
  };
  const choose = (ids: number[]) => {
    setSelected(ids);
    setAnswer(ids.map((id) => tokens.find((t) => t.id === id)!.text).join(" "));
  };
  return (
    <div className="exercise-card">
      <div className="exercise-heading">
        <span className="eyebrow">
          {assessment
            ? "AVALIAÇÃO"
            : e.kind === "order"
              ? "CONSTRUÇÃO DE FRASE"
              : e.kind === "dictation"
                ? "DITADO"
                : "SUA VEZ DE PRATICAR"}
        </span>
        {e.audio && <AudioButton text={e.audio} label="Ouvir frase" />}
      </div>
      <h3>{e.prompt}</h3>
      {e.image && (
        <div className="exercise-image" role="img" aria-label={e.image.alt}>
          {e.image.symbol}
        </div>
      )}
      {e.sentence && e.kind !== "order" && (
        <p className="exercise-sentence" lang="en">
          {e.sentence}
        </p>
      )}
      {e.kind === "order" ? (
        <>
          <div className="answer-zone" aria-label="Sua frase">
            {selected.length ? (
              selected.map((id, i) => (
                <button
                  key={id}
                  disabled={checked}
                  onClick={() => choose(selected.filter((_, n) => n !== i))}
                >
                  {tokens.find((t) => t.id === id)?.text}
                  <X size={12} />
                </button>
              ))
            ) : (
              <span>Toque nas palavras na ordem correta</span>
            )}
          </div>
          <div className="word-bank">
            {tokens.map((t) => (
              <button
                key={t.id}
                disabled={checked || selected.includes(t.id)}
                onClick={() => choose([...selected, t.id])}
              >
                {t.text}
              </button>
            ))}
          </div>
        </>
      ) : e.options ? (
        <div className="choices">
          {e.options.map((option, i) => (
            <button
              key={option}
              disabled={checked}
              className={`${answer === option ? "selected" : ""} ${checked && e.answers.includes(option) ? "correct-choice" : ""} ${checked && answer === option && !correct ? "wrong-choice" : ""}`}
              onClick={() => setAnswer(option)}
            >
              <span>{String.fromCharCode(65 + i)}</span>
              {option}
              {checked && e.answers.includes(option) && <Check size={18} />}
            </button>
          ))}
        </div>
      ) : (
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            submit();
          }}
        >
          <label className="sr-only" htmlFor={`answer-${e.id}`}>
            Sua resposta
          </label>
          <input
            autoComplete="off"
            id={`answer-${e.id}`}
            lang="en"
            placeholder={
              e.kind === "gap"
                ? "Digite o que falta…"
                : "Escreva sua resposta em inglês…"
            }
            value={answer}
            disabled={checked}
            onChange={(ev) => setAnswer(ev.target.value)}
          />
        </form>
      )}
      {e.kind === "dictation" && !assessment && (
        <button className="text-button" onClick={() => setHelp(!help)}>
          {help ? "Ocultar" : "Mostrar"} frase de apoio
        </button>
      )}
      {help && e.audio && (
        <p className="hint" lang="en">
          {e.audio}{" "}
          <small>
            Use esta ajuda para praticar; o registro desta tentativa não
            representa listening independente.
          </small>
        </p>
      )}
      {checked && (
        <div
          className={`feedback ${correct ? "success" : "warning"}`}
          role="status"
        >
          <strong>
            {correct
              ? "Muito bem! Você acertou."
              : "Vamos entender essa resposta."}
          </strong>
          {!correct && (
            <p>
              Resposta esperada: <b lang="en">{e.answers[0]}</b>
            </p>
          )}
          <p>{e.explanation}</p>
        </div>
      )}
      <div className="exercise-footer">
        <span>
          <Lightbulb size={15} /> Cada tentativa faz parte do caminho.
        </span>
        {!checked ? (
          <button className="button" disabled={!answer.trim()} onClick={submit}>
            Verificar resposta
            <Check size={16} />
          </button>
        ) : (
          <div className="button-row">
            {!assessment && !correct && (
              <button
                className="button secondary"
                onClick={() => {
                  setChecked(false);
                  setAnswer("");
                  setSelected([]);
                  began.current = Date.now();
                }}
              >
                <RotateCcw size={15} />
                Tentar de novo
              </button>
            )}
            {onNext && (
              <button className="button" onClick={onNext}>
                Continuar
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
