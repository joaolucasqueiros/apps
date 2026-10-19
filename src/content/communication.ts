import type { Level, Skill } from "../types";
export interface ConversationTurn {
  question: string;
  translation: string;
  goal: string;
  model: string;
  tip: string;
}
export interface Conversation {
  id: string;
  title: string;
  level: Level;
  icon: string;
  scene?: string;
  lesson: string;
  goal: string;
  turns: ConversationTurn[];
}
type Turn = [string, string, string, string, string];
const convo = (
  id: string,
  title: string,
  level: Level,
  icon: string,
  lesson: string,
  goal: string,
  rows: Turn[],
  scene?: string,
): Conversation => ({
  id,
  title,
  level,
  icon,
  lesson,
  goal,
  scene,
  turns: rows.map(([question, translation, goal, model, tip]) => ({
    question,
    translation,
    goal,
    model,
    tip,
  })),
});
export const conversations: Conversation[] = [
  convo(
    "new-neighbour",
    "Conhecendo alguém",
    "A1",
    "👋",
    "introductions",
    "Apresentar-se, perguntar de volta e combinar outro encontro.",
    [
      [
        "Hi! I'm Alex. What's your name?",
        "Oi! Sou Alex. Como você se chama?",
        "Diga seu nome e cumprimente.",
        "Hi, I'm João. Nice to meet you.",
        "I am + nome; Nice to meet you ao conhecer alguém.",
      ],
      [
        "Where are you from?",
        "De onde você é?",
        "Diga de onde é e pergunte de volta.",
        "I'm from Brazil. And you?",
        "Continue a conversa com And you?",
      ],
      [
        "What do you do in your free time?",
        "O que você faz no seu tempo livre?",
        "Mencione um interesse e faça uma pergunta.",
        "I like walking in the park. What about you?",
        "Like + gerúndio descreve uma atividade de que gosta.",
      ],
      [
        "Would you like to have coffee sometime?",
        "Você gostaria de tomar café qualquer dia?",
        "Aceite ou recuse educadamente e sugira um horário.",
        "That sounds good. Are you free on Saturday?",
        "Você pode recusar: Thanks, but I can't this week.",
      ],
    ],
    "everyday",
  ),
  convo(
    "restaurant-order",
    "Um pedido completo",
    "A2",
    "🍽️",
    "ordering-food",
    "Pedir uma refeição, confirmar restrições e pagar.",
    [
      [
        "Good evening. How many people?",
        "Boa noite. Quantas pessoas?",
        "Peça uma mesa e indique a quantidade.",
        "A table for two, please.",
        "A table for + número.",
      ],
      [
        "Are you ready to order?",
        "Vocês estão prontos para pedir?",
        "Escolha um prato e pergunte sobre um ingrediente.",
        "I'd like the grilled fish. Does it contain nuts?",
        "Use Does it contain…? para ingredientes.",
      ],
      [
        "What would you like to drink?",
        "O que você gostaria de beber?",
        "Peça uma bebida com uma preferência.",
        "A glass of still water without ice, please.",
        "Still = sem gás; sparkling = com gás.",
      ],
      [
        "Is there anything else I can get you?",
        "Posso trazer mais alguma coisa?",
        "Peça a conta e confirme o pagamento.",
        "Could we have the bill, please? Can I pay by card?",
        "Bill/check se refere à conta.",
      ],
    ],
    "restaurant",
  ),
  convo(
    "doctor-visit",
    "Explicando um sintoma",
    "A2",
    "🩺",
    "health-symptoms",
    "Localizar uma dor, explicar quando começou e pedir esclarecimento.",
    [
      [
        "Hello. What seems to be the problem?",
        "Olá. O que está acontecendo?",
        "Diga onde dói.",
        "My left knee hurts.",
        "Use hurts com uma parte singular; hurt com plural.",
      ],
      [
        "When did the pain start?",
        "Quando a dor começou?",
        "Explique quando começou e o que estava fazendo.",
        "It started yesterday while I was walking.",
        "Situe o evento no passado.",
      ],
      [
        "Do you have any allergies?",
        "Você tem alguma alergia?",
        "Informe uma alergia ou diga que não conhece nenhuma.",
        "I'm allergic to penicillin.",
        "Se não sabe, diga I'm not sure; não invente uma informação médica.",
      ],
      [
        "Do you have any questions?",
        "Você tem alguma pergunta?",
        "Peça que uma orientação seja repetida.",
        "Could you explain that again more slowly, please?",
        "Pedir esclarecimento faz parte de se comunicar.",
      ],
    ],
    "body",
  ),
  convo(
    "home-tour",
    "Uma visita em casa",
    "A1",
    "🏡",
    "describing-home",
    "Receber uma visita e localizar cômodos e objetos.",
    [
      [
        "Your home is lovely! How many rooms are there?",
        "Sua casa é linda! Quantos cômodos há?",
        "Descreva a casa brevemente.",
        "There are two bedrooms and a small kitchen.",
        "There are + plural.",
      ],
      [
        "Where can I leave my bag?",
        "Onde posso deixar minha bolsa?",
        "Indique um lugar usando uma preposição.",
        "You can leave it on the chair next to the door.",
        "On indica sobre; next to, ao lado.",
      ],
      [
        "Could I have a glass of water?",
        "Posso pegar um copo de água?",
        "Ofereça água e indique onde ficam os copos.",
        "Of course. The glasses are in the kitchen cupboard.",
        "Glasses é o plural de glass.",
      ],
      [
        "Where is the bathroom?",
        "Onde fica o banheiro?",
        "Dê uma orientação curta.",
        "Go up the stairs. It's on your right.",
        "Use imperativo e um ponto de referência.",
      ],
    ],
    "house",
  ),
  convo(
    "mechanic",
    "Na oficina",
    "A2",
    "🔧",
    "car-problems",
    "Relatar um defeito, perguntar preço e prazo.",
    [
      [
        "Good morning. How can I help?",
        "Bom dia. Como posso ajudar?",
        "Descreva uma peça e o problema.",
        "The engine makes a strange noise.",
        "Descreva o que percebeu, sem precisar diagnosticar.",
      ],
      [
        "When did you first notice it?",
        "Quando percebeu isso pela primeira vez?",
        "Informe quando começou.",
        "I noticed it yesterday on my way home.",
        "Use simple past para um momento definido.",
      ],
      [
        "We need to check the car first.",
        "Precisamos verificar o carro primeiro.",
        "Peça um orçamento antes de autorizar o conserto.",
        "Could you give me an estimate before doing any repairs?",
        "Before + gerúndio.",
      ],
      [
        "We can call you this afternoon.",
        "Podemos ligar esta tarde.",
        "Confirme o prazo e como será avisado.",
        "Thank you. What time should I expect your call?",
        "Confirme detalhes antes de encerrar.",
      ],
    ],
    "car",
  ),
  convo(
    "city-directions",
    "Ajudando com o caminho",
    "A2",
    "🧭",
    "giving-directions",
    "Dar direções e confirmar a compreensão.",
    [
      [
        "Excuse me. Is there a pharmacy near here?",
        "Com licença. Há uma farmácia perto daqui?",
        "Indique um ponto de referência.",
        "Yes, there's one next to the supermarket.",
        "There's = there is.",
      ],
      [
        "How do I get there?",
        "Como chego lá?",
        "Dê duas instruções curtas.",
        "Go straight for two blocks, then turn left.",
        "First/then ajudam a organizar.",
      ],
      [
        "Is it on the left or on the right?",
        "Fica à esquerda ou à direita?",
        "Confirme o lado e outro ponto de referência.",
        "It's on your right, across from the bank.",
        "Across from = do outro lado, em frente.",
      ],
      [
        "Can I walk there?",
        "Posso ir a pé?",
        "Estime o tempo e confirme se a pessoa entendeu.",
        "Yes, it's about five minutes on foot. Does that help?",
        "About torna a estimativa menos exata.",
      ],
    ],
    "traffic",
  ),
  convo(
    "shop-return",
    "Compras e troca",
    "A2",
    "🛍️",
    "daily-errands",
    "Explicar um problema e solicitar uma solução.",
    [
      [
        "Hi! Are you looking for anything in particular?",
        "Oi! Você procura algo específico?",
        "Peça uma peça no tamanho desejado.",
        "Do you have this shirt in a medium?",
        "In a medium indica tamanho.",
      ],
      [
        "Would you like to try it on?",
        "Gostaria de experimentar?",
        "Pergunte onde fica o provador.",
        "Yes, please. Where are the fitting rooms?",
        "Try it on é experimentar uma peça.",
      ],
      [
        "How was it?",
        "Como ficou?",
        "Diga o problema e peça uma alternativa.",
        "It's a little small. Do you have a larger size?",
        "Larger compara os tamanhos.",
      ],
      [
        "You can exchange it within thirty days.",
        "Você pode trocar em até trinta dias.",
        "Confirme o recibo e o pagamento.",
        "Great. Can I pay by card and have a receipt, please?",
        "Receipt é recibo; recipe é receita culinária.",
      ],
    ],
    "everyday",
  ),
  convo(
    "hotel-checkin",
    "Chegada ao hotel",
    "B1",
    "🧳",
    "travel-problems",
    "Confirmar reserva, pedir informações e resolver um problema.",
    [
      [
        "Welcome. Do you have a reservation?",
        "Bem-vindo. Você tem uma reserva?",
        "Informe o nome da reserva e a duração.",
        "Yes, I have a reservation under Silva for three nights.",
        "Under + sobrenome é comum para reservas.",
      ],
      [
        "Here is your key. You're on the third floor.",
        "Aqui está sua chave. Você está no terceiro andar.",
        "Pergunte sobre café da manhã e internet.",
        "Is breakfast included? How can I connect to the Wi-Fi?",
        "Faça perguntas específicas.",
      ],
      [
        "Is everything all right with your room?",
        "Está tudo bem com seu quarto?",
        "Relate um problema e peça ajuda.",
        "The air conditioning isn't working. Could someone check it?",
        "Be + not working para um equipamento.",
      ],
      [
        "We can offer you a different room.",
        "Podemos oferecer outro quarto.",
        "Aceite e confirme um detalhe.",
        "Thank you. Is the new room on the same floor?",
        "Confirme o que muda antes de concordar.",
      ],
    ],
  ),
  convo(
    "airport-delay",
    "Voo atrasado",
    "B1",
    "✈️",
    "travel-problems",
    "Entender uma mudança e pedir alternativas.",
    [
      [
        "I'm afraid your flight has been cancelled.",
        "Receio que seu voo tenha sido cancelado.",
        "Pergunte qual alternativa existe.",
        "Is there another flight to the same destination today?",
        "Another + singular.",
      ],
      [
        "There is a flight tomorrow morning.",
        "Há um voo amanhã de manhã.",
        "Explique sua necessidade e peça outra opção.",
        "I have a meeting tomorrow. Could you check other airports?",
        "Explique o motivo e formule um pedido.",
      ],
      [
        "We can book a connecting flight this evening.",
        "Podemos reservar um voo com conexão esta noite.",
        "Peça horário e duração da conexão.",
        "What time does it leave, and how long is the connection?",
        "Pergunte para decidir com informação.",
      ],
      [
        "Would you like me to change your booking?",
        "Gostaria que eu alterasse sua reserva?",
        "Confirme bagagem e aceite ou recuse.",
        "Will my luggage be transferred? If so, please change it.",
        "If so retoma uma condição anterior.",
      ],
    ],
  ),
  convo(
    "job-interview",
    "Uma entrevista de emprego",
    "B1",
    "💼",
    "job-interviews",
    "Apresentar experiência e responder com exemplos.",
    [
      [
        "Could you tell me a little about yourself?",
        "Você pode falar um pouco sobre você?",
        "Apresente experiência relevante e objetivo.",
        "I have worked in customer service for three years. I'd like to develop my skills here.",
        "Priorize experiência relevante à vaga.",
      ],
      [
        "Tell me about a difficult situation you handled.",
        "Conte uma situação difícil que resolveu.",
        "Descreva situação, ação e resultado.",
        "A delivery was delayed. I contacted the customer and arranged a new time. We solved it that day.",
        "Dê evidência concreta.",
      ],
      [
        "What would you like to improve?",
        "O que gostaria de melhorar?",
        "Cite uma habilidade e como está trabalhando nela.",
        "I'd like to improve my English, so I practise speaking every week.",
        "Mostre uma ação, não apenas uma intenção.",
      ],
      [
        "Do you have any questions for us?",
        "Você tem alguma pergunta para nós?",
        "Pergunte sobre responsabilidades ou desenvolvimento.",
        "What would success look like in the first three months?",
        "Uma pergunta pertinente também mostra interesse.",
      ],
    ],
  ),
  convo(
    "team-meeting",
    "Uma reunião com acordo",
    "B2",
    "🤝",
    "negotiation",
    "Propor, discordar com respeito e confirmar uma decisão.",
    [
      [
        "What do you suggest for the next stage?",
        "O que sugere para a próxima etapa?",
        "Proponha uma ação com justificativa.",
        "I suggest testing the new process with a small group first.",
        "Suggest + gerúndio.",
      ],
      [
        "That may take more time than we have.",
        "Isso pode levar mais tempo do que temos.",
        "Reconheça a preocupação e ofereça alternativa.",
        "I see your point. How about a shorter trial with five people?",
        "How about + substantivo ou gerúndio.",
      ],
      [
        "Could you explain the main benefit?",
        "Você poderia explicar o principal benefício?",
        "Dê uma razão e um exemplo.",
        "It would help us find problems early. For example, we could check the payment flow.",
        "Conecte proposta e consequência.",
      ],
      [
        "All right. What are the next steps?",
        "Certo. Quais são os próximos passos?",
        "Confirme responsável, ação e prazo.",
        "I'll prepare the trial by Friday, and we can review the results on Monday.",
        "Um acordo claro tem ação, responsável e prazo.",
      ],
    ],
  ),
  convo(
    "balanced-opinion",
    "Defenda uma opinião com nuance",
    "C1",
    "⚖️",
    "synthesis",
    "Comparar argumentos e reconhecer limites.",
    [
      [
        "Should cities invest more in public transport?",
        "As cidades deveriam investir mais em transporte público?",
        "Apresente uma posição com uma razão.",
        "On balance, yes. Better public transport can improve access to jobs.",
        "Marque sua posição sem universalizar.",
      ],
      [
        "Some people say the cost is too high.",
        "Algumas pessoas dizem que o custo é alto demais.",
        "Reconheça a objeção e compare os impactos.",
        "That is a valid concern. However, we should also consider the long-term cost of congestion.",
        "Reconhecer uma objeção não exige abandonar a tese.",
      ],
      [
        "What evidence would you need?",
        "De que evidências você precisaria?",
        "Diga que dados avaliaria e um limite.",
        "I'd compare travel times and access across neighbourhoods, while accounting for differences in population.",
        "Especifique medidas e fatores de comparação.",
      ],
      [
        "Could you sum up your position?",
        "Você poderia resumir sua posição?",
        "Conclua com condição e próximo passo.",
        "The investment seems worthwhile, provided that it meets local needs and its results are evaluated.",
        "Provided that introduz uma condição.",
      ],
    ],
  ),
];
export interface PronunciationLesson {
  id: string;
  title: string;
  level: Level;
  explanation: string;
  tip: string;
  pairs: [string, string][];
  sentence: string;
  stress: string;
}
export const pronunciationLessons: PronunciationLesson[] = [
  {
    id: "th",
    level: "A1",
    title: "TH: língua entre os dentes",
    explanation:
      "Em think, o ar passa entre língua e dentes sem vibração. Em this, a posição é parecida, mas a voz vibra.",
    tip: "Encoste levemente a ponta da língua entre os dentes. Evite substituir automaticamente por t, f ou d.",
    pairs: [
      ["think", "sink"],
      ["three", "tree"],
      ["then", "den"],
    ],
    sentence: "I think these three things are useful.",
    stress: "I THINK these THREE THINGS are USEful.",
  },
  {
    id: "i-sounds",
    title: "Ship e sheep",
    level: "A1",
    explanation:
      "/ɪ/ em ship e /iː/ em sheep diferem na qualidade da vogal, além da duração.",
    tip: "Em sheep, a língua fica mais alta e à frente. Em ship, relaxe um pouco a vogal; não pense apenas em falar mais rápido.",
    pairs: [
      ["ship", "sheep"],
      ["sit", "seat"],
      ["live", "leave"],
    ],
    sentence: "Please sit in this seat and leave your bag here.",
    stress: "Please SIT in this SEAT and LEAVE your BAG HERE.",
  },
  {
    id: "h",
    title: "H inicial com ar",
    level: "A1",
    explanation:
      "Em house e hungry, o h inicial é pronunciado com uma saída leve de ar. Em hour e honest, ele é mudo.",
    tip: "Compare o início de heat e eat. Não acrescente um som de r forte.",
    pairs: [
      ["heat", "eat"],
      ["hill", "ill"],
      ["hat", "at"],
    ],
    sentence: "He has a house on a hill.",
    stress: "He HAS a HOUSE on a HILL.",
  },
  {
    id: "ed",
    title: "As três pronúncias de -ed",
    level: "A2",
    explanation:
      "Depois de /t/ ou /d/, -ed soa /ɪd/: wanted, needed. Depois de outros sons surdos, /t/: worked. Depois dos demais sonoros, /d/: played.",
    tip: "A escolha depende do som final do verbo base. Não acrescente uma sílaba extra em worked ou played.",
    pairs: [
      ["work", "worked"],
      ["play", "played"],
      ["want", "wanted"],
    ],
    sentence: "I worked, played and wanted to rest.",
    stress: "I WORKED, PLAYED and WANTed to REST.",
  },
  {
    id: "plural-s",
    title: "Plural: /s/, /z/ e /ɪz/",
    level: "A2",
    explanation:
      "O -s varia com o som anterior: cups /s/, keys /z/, buses /ɪz/. Em buses, há uma sílaba extra.",
    tip: "Encoste a mão na garganta para notar vibração em /z/; compare com /s/.",
    pairs: [
      ["cup", "cups"],
      ["key", "keys"],
      ["bus", "buses"],
    ],
    sentence: "There are cups, keys and boxes on the table.",
    stress: "There are CUPS, KEYS and BOXes on the TAble.",
  },
  {
    id: "word-stress",
    title: "A sílaba que dá ritmo à palavra",
    level: "B1",
    explanation:
      "Em palavras com mais de uma sílaba, uma costuma receber destaque. PHOtograph e phoTOGraphy mudam a sílaba tônica.",
    tip: "Marque a sílaba forte e reduza as fracas. A marcação em maiúsculas é um apoio visual, não uma transcrição fonética.",
    pairs: [
      ["PHOtograph", "phoTOGraphy"],
      ["REcord (noun)", "reCORD (verb)"],
      ["PREsent (noun)", "preSENT (verb)"],
    ],
    sentence: "Could you record a short presentation?",
    stress: "Could you reCORD a short presenTAtion?",
  },
  {
    id: "linking",
    title: "Conecte palavras ao falar",
    level: "B1",
    explanation:
      "Na fala contínua, a consoante final de uma palavra pode se ligar à vogal inicial da próxima: turn_it_off.",
    tip: "Comece devagar e mantenha as palavras reconhecíveis. Conectar sons ajuda a compreender falantes reais; não é obrigatório imitar um único sotaque.",
    pairs: [
      ["turn it off", "turn_it_off"],
      ["pick it up", "pick_it_up"],
      ["an apple", "an_apple"],
    ],
    sentence: "Could you pick it up and turn it off?",
    stress: "Could you PICK_it_UP and TURN_it_OFF?",
  },
  {
    id: "intonation",
    title: "Entonação e foco da mensagem",
    level: "B2",
    explanation:
      "Destacar palavras diferentes muda o contraste: I asked for TEA pode corrigir uma bebida; I ASKED pode corrigir a ideia de ter recebido algo.",
    tip: "Grave a mesma frase destacando palavras diferentes. Compare qual informação parece nova ou contrastada.",
    pairs: [
      ["I wanted TEA.", "I WANTED tea."],
      ["Did YOU call?", "Did you CALL?"],
      ["Really? ↗", "Really. ↘"],
    ],
    sentence: "I asked for still water, not sparkling water.",
    stress: "I asked for STILL water, not SPARKLING water.",
  },
];
export const practicalSkills: {
  id: Skill;
  title: string;
  description: string;
  link: string;
}[] = [
  {
    id: "listening",
    title: "Entender a mensagem",
    description: "Ouvir a ideia principal e localizar informações.",
    link: "/listening",
  },
  {
    id: "speaking",
    title: "Participar de uma conversa",
    description: "Responder, perguntar de volta e pedir esclarecimento.",
    link: "/conversation",
  },
  {
    id: "reading",
    title: "Ler com autonomia",
    description: "Entender textos, argumentos e instruções.",
    link: "/reading",
  },
  {
    id: "writing",
    title: "Escrever com propósito",
    description: "Organizar uma mensagem e revisar a clareza.",
    link: "/writing",
  },
];
