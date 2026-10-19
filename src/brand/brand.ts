export const brand = {
  name: "VIRA",
  tagline: "Inglês que vira conversa.",
  mission: "Tire seu inglês da cabeça. Leve para a vida.",
  pilotPrice: "19,90",
  pilotSize: 100,
  founderWhatsApp: "5538998146695",
};
export function founderContact() {
  const configured = import.meta.env.VITE_FOUNDER_WHATSAPP?.trim();
  const whatsapp = (configured || brand.founderWhatsApp).replace(/\D/g, "");
  const email = import.meta.env.VITE_FOUNDER_EMAIL?.trim();
  const message =
    "Olá! Quero saber sobre a turma fundadora da VIRA: R$ 19,90 por mês, plataforma e duas aulas coletivas ao vivo por semana.";
  if (whatsapp && /^\d{10,15}$/.test(whatsapp))
    return {
      label: "Conversar sobre a turma",
      href:
        "https://wa.me/" + whatsapp + "?text=" + encodeURIComponent(message),
    };
  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return {
      label: "Quero participar do piloto",
      href:
        "mailto:" +
        email +
        "?subject=" +
        encodeURIComponent("Turma fundadora VIRA") +
        "&body=" +
        encodeURIComponent(message),
    };
  return null;
}
