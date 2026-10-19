import { describe, it, expect } from "vitest";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { VideoPlayer } from "../components/VideoPlayer";
describe("video player unavailable fallback", () => {
  it("loads only on request and offers an external fallback if embedding fails", () => {
    const video = {
      id: "fixture-only",
      title: "Vídeo de teste",
      channel: "Canal de teste",
      topic: "Grammar",
      language: "English",
      reason: "Metadados de teste, sem curadoria publicada.",
      lessonId: "articles",
      verifiedAt: "fixture",
    };
    const { container } = render(<VideoPlayer video={video} />);
    expect(container.querySelector("iframe")).toBeNull();
    fireEvent.click(
      screen.getByRole("button", { name: "Carregar vídeo do YouTube" }),
    );
    const iframe = screen.getByTitle("Vídeo de teste");
    expect(iframe).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/fixture-only",
    );
    fireEvent.click(screen.getByRole("button", { name: "O player não funciona?" }));
    expect(screen.getByText(/Não foi possível incorporar/)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Abrir no YouTube" }),
    ).toHaveAttribute("target", "_blank");
    cleanup();
  });
});
