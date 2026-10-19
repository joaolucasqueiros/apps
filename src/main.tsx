import React, { Component, lazy, Suspense, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { LearningProvider } from "./hooks/useLearning";
import { AppLayout } from "./layouts/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { Course } from "./pages/Course";
import { Lesson } from "./pages/Lesson";
import { Vocabulary } from "./pages/Vocabulary";
import { Flashcards } from "./pages/Flashcards";
import { Stories } from "./pages/Stories";
import { Speaking } from "./pages/Speaking";
import { Writing } from "./pages/Writing";
import { Tests } from "./pages/Tests";
import { ProgressPage } from "./pages/Progress";
import { Library } from "./pages/Library";
import { Settings } from "./pages/Settings";
import { Session } from "./pages/Session";
import "./styles.css";
const Games = lazy(() => import("./pages/Games"));
class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <main className="fatal">
        <h1>O caminho teve uma pausa inesperada.</h1>
        <p>
          Seus dados salvos continuam neste navegador. Recarregue para tentar
          novamente.
        </p>
        <button onClick={() => location.reload()}>Reabrir o aplicativo</button>
      </main>
    ) : (
      this.props.children
    );
  }
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <LearningProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="course" element={<Course />} />
              <Route path="grammar" element={<Course />} />
              <Route path="lesson/:id" element={<Lesson />} />
              <Route path="vocabulary" element={<Vocabulary />} />
              <Route path="flashcards" element={<Flashcards />} />
              <Route path="reviews" element={<Flashcards />} />
              <Route path="listening" element={<Stories />} />
              <Route path="reading" element={<Stories />} />
              <Route path="speaking" element={<Speaking />} />
              <Route path="writing" element={<Writing />} />
              <Route path="tests" element={<Tests />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="library" element={<Library />} />
              <Route path="settings" element={<Settings />} />
              <Route path="session/:minutes" element={<Session />} />
              <Route
                path="games/*"
                element={
                  <Suspense
                    fallback={<p role="status">Preparando os jogos…</p>}
                  >
                    <Games />
                  </Suspense>
                }
              />
              <Route
                path="*"
                element={
                  <div className="empty-state">
                    <h1>Vamos encontrar seu caminho?</h1>
                    <Link className="button" to="/">
                      Voltar ao início
                    </Link>
                  </div>
                }
              />
            </Route>
          </Routes>
        </LearningProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
