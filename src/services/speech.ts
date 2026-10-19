export function speak(
  text: string,
  rate = 0.85,
  onError?: (message: string) => void,
) {
  if (!("speechSynthesis" in window)) {
    onError?.(
      "Síntese de voz indisponível neste navegador. Você pode usar o texto para praticar.",
    );
    return false;
  }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  const voice =
    speechSynthesis.getVoices().find((v) => v.lang === "en-US") ||
    speechSynthesis.getVoices().find((v) => v.lang.startsWith("en"));
  if (voice) utterance.voice = voice;
  utterance.onerror = () =>
    onError?.(
      "O áudio não pôde ser reproduzido. Verifique as vozes disponíveis no dispositivo.",
    );
  speechSynthesis.speak(utterance);
  return true;
}
