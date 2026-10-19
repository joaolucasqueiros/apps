// Curadoria vazia por design: nenhum ID é publicado sem validação da fonte e da incorporação.
export interface Video {
  id: string;
  title: string;
  channel: string;
  topic: string;
  language: string;
  duration?: string;
  reason: string;
  lessonId: string;
  verifiedAt: string;
}
export const videos: Video[] = [];
