import type { Level } from "../types";
export const levelOrder: Level[] = ["A1", "A2", "B1", "B2", "C1"];
export const coursePaths: Record<
  Level,
  {
    title: string;
    goal: string;
    lessons: string[];
    conversation: string;
    project: string;
  }
> = {
  A1: {
    title: "Entenda e se apresente",
    goal: "Apresentar-se, descrever a casa e fazer perguntas simples.",
    lessons: [
      "introductions",
      "to-be",
      "possessives",
      "word-order",
      "articles",
      "simple-present",
      "questions",
      "negatives",
      "prepositions",
      "present-continuous",
      "time-prices",
    ],
    conversation: "new-neighbour",
    project: "my-world",
  },
  A2: {
    title: "Resolva o cotidiano",
    goal: "Pedir comida, explicar sintomas, dar direções e contar fatos.",
    lessons: [
      "auxiliaries",
      "describing-home",
      "health-symptoms",
      "ordering-food",
      "giving-directions",
      "daily-errands",
      "car-problems",
      "regular-verbs",
      "irregular-verbs",
      "simple-past",
      "comparatives",
      "quantifiers",
      "going-to",
      "will",
    ],
    conversation: "restaurant-order",
    project: "day-in-town",
  },
  B1: {
    title: "Converse com autonomia",
    goal: "Relatar experiências, explicar problemas e sustentar uma conversa.",
    lessons: [
      "past-continuous",
      "storytelling",
      "present-perfect",
      "modals",
      "gerund-infinitive",
      "phrasal-verbs",
      "relative-clauses",
      "conditionals",
      "travel-problems",
      "job-interviews",
    ],
    conversation: "job-interview",
    project: "travel-solution",
  },
  B2: {
    title: "Defenda ideias e negocie",
    goal: "Explicar razões, comparar alternativas e chegar a acordos.",
    lessons: [
      "past-perfect",
      "passive-voice",
      "reported-speech",
      "modal-deduction",
      "third-conditional",
      "collocations",
      "negotiation",
    ],
    conversation: "team-meeting",
    project: "better-work",
  },
  C1: {
    title: "Expresse nuance e sintetize",
    goal: "Analisar evidências, adaptar o registro e argumentar com limites.",
    lessons: [
      "connectors",
      "hedging",
      "inversion",
      "cleft-sentences",
      "register",
      "synthesis",
    ],
    conversation: "balanced-opinion",
    project: "evidence-policy",
  },
};
export interface PracticalProject {
  id: string;
  level: Level;
  title: string;
  goal: string;
  brief: string;
  steps: string[];
  criteria: string[];
  model: string;
  conversation: string;
  reading: string;
  writing: string;
}
export const projects: PracticalProject[] = [
  {
    id: "my-world",
    level: "A1",
    title: "Apresente seu mundo",
    goal: "Apresentar-se e descrever um lugar.",
    brief:
      "Prepare uma apresentação de 45–60 segundos. Diga quem você é, como é sua rotina e descreva um cômodo de casa. Depois, faça uma pergunta a quem escuta.",
    steps: [
      "Explore a cena da casa e salve 3 palavras.",
      "Escreva um roteiro curto com começo, descrição e pergunta.",
      "Fale sem ler uma vez; grave se quiser.",
      "Converse com alguém e anote uma pergunta que recebeu.",
    ],
    criteria: [
      "Apresentei quem sou e de onde sou.",
      "Descrevi rotina e lugar com frases compreensíveis.",
      "Usei uma preposição para localizar um objeto.",
      "Fiz uma pergunta e revisei meu roteiro.",
    ],
    model:
      "Hi, I'm João, and I'm from Brazil. I work as a driver and study English in my free time. My favourite room is the kitchen. There is a small table next to the window. We have dinner there every evening. What is your favourite place at home?",
    conversation: "new-neighbour",
    reading: "room-for-a-guest",
    writing: "introduce",
  },
  {
    id: "day-in-town",
    level: "A2",
    title: "Um dia pela cidade",
    goal: "Pedir, orientar e resolver uma tarefa.",
    brief:
      "Imagine um visitante passando o dia com você. Escreva um trajeto de três paradas: restaurante, farmácia e estação. Inclua um pedido educado e uma pergunta de confirmação.",
    steps: [
      "Explore as cenas de trânsito, restaurante e serviços.",
      "Dê duas instruções entre cada parada.",
      "Simule um pedido e um esclarecimento.",
      "Mude um detalhe e repita sem decorar.",
    ],
    criteria: [
      "Usei pontos de referência e direções.",
      "Fiz um pedido educado com informação específica.",
      "Pedi confirmação ou esclarecimento.",
      "Consegui adaptar uma frase ao mudar um detalhe.",
    ],
    model:
      "First, we'll have lunch at the café next to the bank. Could we have a table for two? After lunch, go straight for two blocks and turn right at the lights. The pharmacy is on your left. Does that make sense? Then we'll take the number twelve bus to the station.",
    conversation: "city-directions",
    reading: "wrong-size",
    writing: "shop-email",
  },
  {
    id: "travel-solution",
    level: "B1",
    title: "Resolva um imprevisto de viagem",
    goal: "Explicar um problema, avaliar opções e narrar a solução.",
    brief:
      "Seu voo foi cancelado e você precisa chegar a uma reunião. Explique o problema, peça duas opções, escolha uma e depois escreva uma mensagem contando o resultado.",
    steps: [
      "Faça a conversa do aeroporto.",
      "Liste duas alternativas com vantagem e limitação.",
      "Explique sua escolha em voz alta por 90 segundos.",
      "Escreva uma mensagem com contexto, ação e resultado.",
    ],
    criteria: [
      "Expliquei o problema e a necessidade.",
      "Perguntei por alternativas e detalhes.",
      "Justifiquei uma escolha com uma razão.",
      "Contei a solução com sequência e tempos verbais coerentes.",
    ],
    model:
      "My flight has been cancelled, and I have a meeting tomorrow morning. Could you check flights from another airport? A later flight would be easier, but it might arrive too late. I chose a connecting flight because it would get me there tonight. Then I contacted the hotel to confirm a late arrival.",
    conversation: "airport-delay",
    reading: "repair-or-replace",
    writing: "trip-story",
  },
  {
    id: "better-work",
    level: "B2",
    title: "Proponha uma melhoria e negocie",
    goal: "Defender uma proposta com exemplo e contraponto.",
    brief:
      "Escolha um problema realista do trabalho ou bairro. Prepare uma proposta de 150–200 palavras e uma apresentação de dois minutos. Peça a outra pessoa que faça uma objeção.",
    steps: [
      "Descreva o problema com um exemplo concreto.",
      "Apresente solução, benefício e custo.",
      "Responda a uma objeção sem ignorá-la.",
      "Confirme ação, responsável e prazo.",
    ],
    criteria: [
      "Apresentei problema e proposta com clareza.",
      "Sustentei um benefício com exemplo.",
      "Considerei uma objeção e propus alternativa.",
      "Terminei com um acordo ou próximo passo verificável.",
    ],
    model:
      "Our meetings often end without clear decisions. I suggest sending routine updates in advance and using meeting time for choices that need discussion. This could reduce repetition and help us identify obstacles. A possible drawback is the extra writing, so we could use a simple template. Let's try it for two weeks and review whether actions are clearer.",
    conversation: "team-meeting",
    reading: "meeting-design",
    writing: "proposal",
  },
  {
    id: "evidence-policy",
    level: "C1",
    title: "Uma recomendação apoiada em evidências",
    goal: "Sintetizar posições e justificar uma recomendação condicional.",
    brief:
      "Use o texto dos dois relatórios sobre trabalho remoto. Escreva 200–250 palavras e apresente sua recomendação em dois minutos. Diferencie resultados, limites e interpretação.",
    steps: [
      "Identifique o que cada estudo mediu.",
      "Compare onde os resultados podem coexistir.",
      "Explique pelo menos duas limitações.",
      "Formule uma recomendação e diga como avaliá-la.",
    ],
    criteria: [
      "Comparei fontes e métodos, sem apenas listar.",
      "Distingui evidência e minha interpretação.",
      "Calibrei a linguagem aos limites.",
      "Propus uma recomendação condicional com avaliação posterior.",
    ],
    model:
      "The reports appear to conflict, yet they investigate different outcomes. One measures individual output, whereas the other examines collaboration in new teams. Their findings may therefore be compatible. Given the limited samples, a universal recommendation would be premature. A flexible policy with structured support for new colleagues seems reasonable, provided that both productivity and collaboration are monitored.",
    conversation: "balanced-opinion",
    reading: "claims-and-evidence",
    writing: "evidence",
  },
];
