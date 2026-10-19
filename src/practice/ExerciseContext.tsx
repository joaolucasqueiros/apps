import { Link } from "react-router-dom";
import { lessons } from "../content/lessons";
import { readingStories, listeningStories } from "../content/stories";
import { AudioButton } from "../components/ui";
import type { Exercise } from "../types";
export function ExerciseContext({ exercise }: { exercise: Exercise }) {
  const story = [...readingStories, ...listeningStories].find(
      (s) => s.id === exercise.topic,
    ),
    lesson = lessons.find((l) => l.id === exercise.topic);
  if (story)
    return (
      <section className="panel practice-context">
        <h3>{story.title}</h3>
        {exercise.skill === "listening" ? (
          <>
            <p className="muted">Voz sintetizada · ouça antes de responder.</p>
            <AudioButton text={story.text} label="Ouvir contexto" />
          </>
        ) : (
          <p lang="en" className="story-text">
            {story.text}
          </p>
        )}
      </section>
    );
  if (lesson)
    return (
      <section className="session-rule">
        <h3>{lesson.title}</h3>
        <p>{lesson.explanation[0]}</p>
        <Link className="text-link" to={"/lesson/" + lesson.id}>
          Aprofundar na aula
        </Link>
      </section>
    );
  return null;
}
