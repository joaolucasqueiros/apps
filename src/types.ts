export type Level = "A1" | "A2" | "B1" | "B2" | "C1";
export type Skill =
  | "grammar"
  | "vocabulary"
  | "listening"
  | "reading"
  | "writing"
  | "speaking";
export interface Exercise {
  id: string;
  topic: string;
  skill: Skill;
  level: Level;
  kind: "choice" | "gap" | "order" | "translate" | "error" | "dictation";
  prompt: string;
  sentence?: string;
  options?: string[];
  answers: string[];
  explanation: string;
  audio?: string;
  image?: { symbol: string; alt: string };
  assessment?: boolean;
}
export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  level: Level;
  minutes: number;
  icon: string;
  objectives: string[];
  prerequisites: string[];
  explanation: string[];
  formula: string[];
  examples: { en: string; pt: string }[];
  mistake: { wrong: string; right: string; why: string };
  context: string;
  guided: { prompt: string; answer: string; why: string };
  summary: string;
  exercises: Exercise[];
  assessment: Exercise[];
}
export interface Word {
  id: string;
  en: string;
  pt: string;
  category: string;
  example: string;
  pronunciation: string;
  part: string;
  illustration: string;
}
export interface Attempt {
  id: string;
  exerciseId: string;
  topic: string;
  skill: Skill;
  answer: string;
  correct: boolean;
  date: string;
  seconds: number;
  number: number;
  assisted?: boolean;
  selfAssessed?: boolean;
}
export interface Review {
  date: string;
  grade: number;
  interval: number;
}
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  example: string;
  pronunciation: string;
  category: string;
  due: string;
  interval: number;
  ease: number;
  repetitions: number;
  reviews: Review[];
  updatedAt: string;
  deleted?: boolean;
}
export interface LessonProgress {
  id: string;
  index: number;
  completed: boolean;
  updatedAt: string;
}
export interface TestResult {
  id: string;
  date: string;
  name: string;
  level?: Level;
  answers: { exerciseId: string; correct: boolean; skill: Skill }[];
}
export interface StudySession {
  id: string;
  date: string;
  seconds: number;
}
export interface Profile {
  name: string;
  goal: Level;
  initialLevel: Level;
  theme: "light" | "dark" | "system";
  speechRate: number;
  updatedAt: string;
}
export interface AssessmentDraft {
  id: string;
  name: string;
  level?: Level;
  questionIds: string[];
  index: number;
  results: {
    exerciseId: string;
    correct: boolean;
    skill: Skill;
    answer: string;
  }[];
}
export interface PracticeDraft {
  id: string;
  minutes: number;
  questionIds: string[];
  index: number;
  results: { exerciseId: string; answer: string; correct: boolean }[];
  completed: boolean;
}
export interface LearningState {
  version: 1;
  profile: Profile;
  attempts: Attempt[];
  cards: Flashcard[];
  lessons: LessonProgress[];
  tests: TestResult[];
  sessions: StudySession[];
  lastLesson: string;
  updatedAt: string;
  drafts?: Record<string, { text: string; updatedAt: string }>;
  activeAssessment?: AssessmentDraft;
  activeSession?: PracticeDraft;
}
