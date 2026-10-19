import type { LearningState, Skill } from "../types";
import type { GameRecords, GameSnapshot } from "../games/recordsStore";
import { lessons, lessonById } from "../content/lessons";
import { coursePaths } from "../content/curriculum";
import { conversations } from "../content/communication";
export const ranks = [
  {
    key: "D",
    name: "Primeira faísca",
    min: 0,
    color: "#ff794d",
    description: "Comece, experimente e descubra seu ritmo.",
  },
  {
    key: "C",
    name: "Na jogada",
    min: 500,
    color: "#91b9ff",
    description: "Você já está transformando intenção em prática.",
  },
  {
    key: "B",
    name: "Voz em movimento",
    min: 1500,
    color: "#d1ed70",
    description: "Seu repertório de experiências está crescendo.",
  },
  {
    key: "A",
    name: "Virada de chave",
    min: 4000,
    color: "#c5a8ff",
    description: "Aprender já faz parte do seu caminho.",
  },
  {
    key: "S",
    name: "Explorador incansável",
    min: 9000,
    color: "#ffc668",
    description: "Muita prática, muitas formas de usar o inglês.",
  },
] as const;
export function levelFromXp(xp: number) {
  const safe = Number.isFinite(xp) ? Math.max(0, xp) : 0;
  const level = Math.floor((1 + Math.sqrt(1 + safe * 0.08)) / 2);
  const current = Math.max(1, level),
    start = 50 * current * (current - 1),
    next = 50 * current * (current + 1);
  return {
    level: current,
    start,
    next,
    remaining: next - safe,
    percent: ((safe - start) / (next - start)) * 100,
  };
}
export function gameFamily(key: string) {
  return key.startsWith("memory")
    ? "memory"
    : key.startsWith("typing")
      ? "typing"
      : key.startsWith("secret")
        ? "secret"
        : key.split("-")[0];
}
export function familyWins(records: GameRecords, family: string) {
  return Object.entries(records)
    .filter(([key]) => gameFamily(key) === family)
    .reduce((n, [, r]) => n + (r?.wins || 0), 0);
}
export function stageUnlocked(
  stage: number,
  family: string,
  records: GameRecords,
  xp: number,
) {
  const wins = familyWins(records, family);
  return (
    stage === 1 ||
    (stage === 2 && (wins >= 3 || xp >= 400)) ||
    (stage === 3 && (wins >= 8 || xp >= 1200))
  );
}
export function engagement(state: LearningState, games: GameSnapshot) {
  const exercises = new Map<string, number>(),
    production = new Set<string>();
  for (const a of state.attempts) {
    if (a.selfAssessed) {
      if (a.correct) production.add(a.exerciseId);
      continue;
    }
    if (!a.assisted)
      exercises.set(
        a.exerciseId,
        Math.max(exercises.get(a.exerciseId) || 0, a.correct ? 15 : 3),
      );
  }
  const completed = new Set(
    state.lessons.filter((l) => l.completed).map((l) => l.id),
  );
  const reviewed = new Set(
    state.cards.flatMap((c) =>
      c.reviews
        .filter((r) => r.grade >= 3)
        .map((r) => c.id + ":" + r.date.slice(0, 10)),
    ),
  );
  const studyXp =
    [...exercises.values()].reduce((n, x) => n + x, 0) +
    completed.size * 80 +
    reviewed.size * 10 +
    production.size * 25;
  const xp = studyXp + games.xp;
  const rank = ranks.filter((r) => xp >= r.min).at(-1)!;
  const nextRank =
    ranks[ranks.findIndex((r) => r.key === rank.key) + 1] || null;
  const wins = Object.values(games.records).reduce(
    (n, r) => n + (r?.wins || 0),
    0,
  );
  const played = Object.values(games.records).reduce(
    (n, r) => n + (r?.played || 0),
    0,
  );
  const families = new Set(
    Object.entries(games.records)
      .filter(([, r]) => r && r.wins > 0)
      .map(([key]) => gameFamily(key)),
  );
  const perfects = games.data.events.filter(
    (e) => e.won && e.total > 0 && e.correct === e.total,
  ).length;
  const sceneWords = new Set(
    Object.entries(state.drafts || {})
      .filter(([key]) => key.startsWith("explore-seen-"))
      .flatMap(([, draft]) => draft.text.split(",").filter(Boolean)),
  ).size;
  const badges = [
    {
      id: "first-win",
      icon: "spark",
      name: "Primeira virada",
      description: "Vença uma partida.",
      current: wins,
      target: 1,
    },
    {
      id: "curious",
      icon: "orbit",
      name: "Sem medo de explorar",
      description: "Vença em três jogos diferentes.",
      current: families.size,
      target: 3,
    },
    {
      id: "perfect",
      icon: "target",
      name: "Na mosca",
      description: "Finalize três partidas sem erro.",
      current: perfects,
      target: 3,
    },
    {
      id: "collector",
      icon: "medal",
      name: "Colecionador de vitórias",
      description: "Vença 20 partidas.",
      current: wins,
      target: 20,
    },
    {
      id: "scholar",
      icon: "book",
      name: "Uma base que fica",
      description: "Conclua cinco aulas.",
      current: completed.size,
      target: 5,
    },
    {
      id: "explorer",
      icon: "compass",
      name: "Olhar curioso",
      description: "Explore 20 elementos nas cenas.",
      current: sceneWords,
      target: 20,
    },
    {
      id: "voice",
      icon: "voice",
      name: "Minha voz no jogo",
      description: "Registre três produções revisadas.",
      current: production.size,
      target: 3,
    },
    {
      id: "review",
      icon: "repeat",
      name: "Memória de longo prazo",
      description: "Revise dez cartões em dias de estudo.",
      current: reviewed.size,
      target: 10,
    },
  ].map((b) => ({
    ...b,
    earned: b.current >= b.target,
    percent: Math.min(100, (b.current / b.target) * 100),
  }));
  return {
    xp,
    studyXp,
    gameXp: games.xp,
    rank,
    nextRank,
    level: levelFromXp(xp),
    wins,
    played,
    badges,
    completed: completed.size,
    reviewed: reviewed.size,
  };
}
export function learningEvidence(state: LearningState) {
  const first = new Map<string, (typeof state.attempts)[number]>();
  for (const a of [...state.attempts].sort((a, b) =>
    a.date.localeCompare(b.date),
  ))
    if (
      a.number === 1 &&
      !a.assisted &&
      !a.selfAssessed &&
      !first.has(a.exerciseId)
    )
      first.set(a.exerciseId, a);
  const scored = [...first.values()];
  const skills = (
    [
      "grammar",
      "vocabulary",
      "listening",
      "reading",
      "speaking",
      "writing",
    ] as Skill[]
  ).map((skill) => {
    const rows = scored.filter((a) => a.skill === skill),
      own = new Set(
        state.attempts
          .filter((a) => a.skill === skill && a.selfAssessed)
          .map((a) => a.exerciseId),
      );
    return {
      skill,
      count: rows.length,
      correct: rows.filter((a) => a.correct).length,
      score: rows.length
        ? Math.round((rows.filter((a) => a.correct).length / rows.length) * 100)
        : null,
      production: own.size,
    };
  });
  return {
    scored,
    skills,
    count: scored.length,
    correct: scored.filter((a) => a.correct).length,
    accuracy: scored.length
      ? Math.round(
          (scored.filter((a) => a.correct).length / scored.length) * 100,
        )
      : null,
  };
}
export function nextSteps(state: LearningState) {
  const path = coursePaths[state.profile.initialLevel],
    current = lessonById(state.lastLesson);
  const nextId =
    path.lessons.find(
      (id) => !state.lessons.some((l) => l.id === id && l.completed),
    ) || path.lessons[0];
  const progress = state.lessons.find((l) => l.id === current?.id);
  const lesson =
    current && !progress?.completed
      ? current
      : lessonById(nextId) || lessons[0];
  const due = state.cards.filter(
    (c) => !c.deleted && Date.parse(c.due) <= Date.now(),
  ).length;
  const conversation =
    conversations.find((c) => c.lesson === lesson.id) ||
    conversations.find((c) => c.id === path.conversation)!;
  let primary = {
    to: "/lesson/" + lesson.id,
    title: lesson.title,
    verb: "Continuar estudando",
    detail:
      progress && progress.index > 0
        ? "Sua aula está salva exatamente onde você parou."
        : "Entenda a estrutura, pratique e use em uma situação real.",
    eyebrow: "SUA MISSÃO DE AGORA",
    minutes: lesson.minutes,
  };
  if (state.activeAssessment)
    primary = {
      to: "/tests",
      title: state.activeAssessment.name,
      verb: "Retomar avaliação",
      detail:
        "Você já respondeu " +
        state.activeAssessment.results.length +
        " de " +
        state.activeAssessment.questionIds.length +
        " questões.",
      eyebrow: "TERMINE O QUE COMEÇOU",
      minutes: 10,
    };
  else if (state.activeSession && !state.activeSession.completed)
    primary = {
      to: "/session/" + state.activeSession.minutes,
      title: "Sua sessão de " + state.activeSession.minutes + " minutos",
      verb: "Retomar sessão",
      detail:
        "As respostas anteriores estão guardadas. Continue na próxima atividade.",
      eyebrow: "SUA SESSÃO ESPERA POR VOCÊ",
      minutes: state.activeSession.minutes,
    };
  return {
    primary,
    lesson,
    due,
    steps: [
      {
        to: primary.to,
        title: "Construir a base",
        copy: primary.title,
        tag: "01",
        done: !!progress?.completed,
      },
      {
        to: "/conversation/" + conversation.id,
        title: "Colocar em conversa",
        copy: conversation.title,
        tag: "02",
        done: state.attempts.some(
          (a) => a.topic === "conversation-" + conversation.id,
        ),
      },
      {
        to: due ? "/reviews" : "/practice/projects/" + path.project,
        title: due ? "Revisar para lembrar" : "Usar em um projeto",
        copy: due
          ? due + " cartões prontos para revisar"
          : "Uma tarefa completa do nível " + state.profile.initialLevel,
        tag: "03",
        done: false,
      },
    ],
  };
}
