import type { Exercise, Level } from "../types";
export interface Story {
  id: string;
  title: string;
  level: Level;
  minutes: number;
  category: string;
  text: string;
  translation: string;
  questions: Exercise[];
}
type StorySeed = [
  string,
  string,
  Level,
  string,
  string,
  string,
  [string, string, string[], string][],
];
function build(rows: StorySeed[], skill: "reading" | "listening"): Story[] {
  return rows.map(([id, title, level, category, text, translation, qs]) => ({
    id,
    title,
    level,
    category,
    text,
    translation,
    minutes: skill === "listening" ? 5 : 8,
    questions: qs.map(([prompt, answer, options, why], i) => ({
      id: `${id}-q${i}`,
      topic: id,
      skill,
      level,
      kind: "choice",
      prompt,
      options,
      answers: [answer],
      explanation: why,
      assessment: i === 2,
    })),
  }));
}
export const listeningStories = build(
  [
    [
      "airport-ride",
      "Uma corrida para o aeroporto",
      "A2",
      "Trabalho",
      "Good morning! Are you going to the airport? The traffic is heavy today, so I am taking a different route. We should arrive in about thirty minutes. Please fasten your seat belt. Would you like me to turn on the air conditioning?",
      "Bom dia! Você está indo para o aeroporto? O trânsito está intenso hoje, então estou pegando uma rota diferente. Devemos chegar em cerca de trinta minutos. Por favor, coloque o cinto. Gostaria que eu ligasse o ar-condicionado?",
      [
        [
          "Por que o motorista escolheu outra rota?",
          "O trânsito está intenso.",
          [
            "O trânsito está intenso.",
            "O carro quebrou.",
            "O passageiro pediu uma parada.",
          ],
          "“The traffic is heavy today” explica a mudança de rota.",
        ],
        [
          "Qual é o tempo estimado?",
          "Trinta minutos.",
          ["Dez minutos.", "Trinta minutos.", "Uma hora."],
          "“In about thirty minutes” significa em cerca de trinta minutos.",
        ],
        [
          "O que o motorista oferece?",
          "Ligar o ar-condicionado.",
          ["Uma bebida.", "Ligar o ar-condicionado.", "Carregar a mala."],
          "A pergunta final é “Would you like me to turn on the air conditioning?”",
        ],
      ],
    ],
    [
      "weekend-plan",
      "Planos sem pressa",
      "A2",
      "Natureza",
      "This weekend, my family and I are going to visit a park outside the city. We will leave early on Saturday. My sister is bringing sandwiches, and I am bringing water. If it rains, we will visit a museum instead.",
      "Neste fim de semana, minha família e eu vamos visitar um parque fora da cidade. Sairemos cedo no sábado. Minha irmã levará sanduíches e eu levarei água. Se chover, visitaremos um museu.",
      [
        [
          "Quando a família vai sair?",
          "Cedo no sábado.",
          ["Na sexta à noite.", "Cedo no sábado.", "No domingo à tarde."],
          "“We will leave early on Saturday.”",
        ],
        [
          "Quem vai levar os sanduíches?",
          "A irmã.",
          ["O narrador.", "A irmã.", "O pai."],
          "“My sister is bringing sandwiches.”",
        ],
        [
          "Qual é o plano se chover?",
          "Visitar um museu.",
          ["Cancelar tudo.", "Ir à praia.", "Visitar um museu."],
          "“If it rains, we will visit a museum instead.”",
        ],
      ],
    ],
    [
      "lost-keys",
      "Onde estão as chaves?",
      "A1",
      "Casa",
      "I cannot find my keys. They are not on the kitchen table. My phone is on the sofa, and my wallet is in the drawer. Wait! My keys are in my jacket pocket. Now I am ready to go to work.",
      "Não consigo encontrar minhas chaves. Elas não estão na mesa da cozinha. Meu celular está no sofá e minha carteira está na gaveta. Espere! Minhas chaves estão no bolso da jaqueta. Agora estou pronto para ir trabalhar.",
      [
        [
          "Onde o celular está?",
          "No sofá.",
          ["Na gaveta.", "Na mesa.", "No sofá."],
          "“My phone is on the sofa.”",
        ],
        [
          "Onde as chaves estavam?",
          "No bolso da jaqueta.",
          ["No carro.", "No bolso da jaqueta.", "Na cozinha."],
          "O narrador encontra as chaves em “my jacket pocket”.",
        ],
        [
          "Para onde o narrador vai?",
          "Para o trabalho.",
          ["Para a escola.", "Para o parque.", "Para o trabalho."],
          "A última frase diz “go to work”.",
        ],
      ],
    ],
    [
      "new-project",
      "Uma ideia de negócio",
      "B1",
      "Negócios",
      "Last year, Ana started a small online business. At first, she worked alone and made many mistakes. Since then, she has hired two people and improved her website. Her biggest challenge is finding enough time to learn new skills. She takes short courses during her lunch break.",
      "No ano passado, Ana abriu um pequeno negócio online. No início, trabalhava sozinha e cometeu muitos erros. Desde então, contratou duas pessoas e melhorou o site. Seu maior desafio é encontrar tempo para aprender. Ela faz cursos curtos no almoço.",
      [
        [
          "Quando Ana abriu o negócio?",
          "No ano passado.",
          ["Há dois meses.", "No ano passado.", "Ontem."],
          "“Last year, Ana started…” situa a abertura no ano passado.",
        ],
        [
          "Qual é o maior desafio atual?",
          "Encontrar tempo para aprender.",
          [
            "Encontrar uma loja.",
            "Encontrar tempo para aprender.",
            "Comprar um computador.",
          ],
          "“Her biggest challenge is finding enough time to learn new skills.”",
        ],
        [
          "Quando ela faz cursos?",
          "Durante o intervalo do almoço.",
          [
            "Antes de dormir.",
            "Aos domingos.",
            "Durante o intervalo do almoço.",
          ],
          "O texto diz “during her lunch break”.",
        ],
      ],
    ],
    [
      "restaurant",
      "Um pedido no restaurante",
      "A2",
      "Alimentação",
      "I would like some rice and beans, please. Do you have grilled chicken? I do not eat red meat. For a drink, I will have water without ice. Could you bring the bill after the meal? I need to leave by two o’clock.",
      "Eu gostaria de arroz e feijão. Vocês têm frango grelhado? Não como carne vermelha. Para beber, vou querer água sem gelo. Poderia trazer a conta depois da refeição? Preciso sair até as duas.",
      [
        [
          "Que carne a pessoa não come?",
          "Carne vermelha.",
          ["Frango.", "Peixe.", "Carne vermelha."],
          "“I do not eat red meat.”",
        ],
        [
          "Como ela quer a água?",
          "Sem gelo.",
          ["Com gelo.", "Sem gelo.", "Com limão."],
          "“Water without ice” significa água sem gelo.",
        ],
        [
          "Até que horas ela precisa sair?",
          "Às duas.",
          ["Ao meio-dia.", "Às duas.", "Às três."],
          "“I need to leave by two o’clock.”",
        ],
      ],
    ],
    [
      "technology-choice",
      "Tecnologia e escolhas",
      "B2",
      "Tecnologia",
      "Remote work offers flexibility; however, it can make communication more difficult. Our team used to have long meetings every morning. We have replaced most of them with short written updates. Although the change was uncomfortable at first, we now have more time for focused work. The main drawback is that new colleagues sometimes feel isolated.",
      "O trabalho remoto oferece flexibilidade; porém, pode dificultar a comunicação. Nossa equipe costumava ter reuniões longas toda manhã. Substituímos a maioria por atualizações escritas curtas. Embora a mudança tenha sido desconfortável, agora temos mais tempo para foco. A desvantagem é o isolamento de novos colegas.",
      [
        [
          "O que substituiu a maioria das reuniões?",
          "Atualizações escritas curtas.",
          ["Mais ligações.", "Atualizações escritas curtas.", "Vídeos longos."],
          "“Short written updates” é a substituição descrita.",
        ],
        [
          "Qual é a desvantagem citada?",
          "Novos colegas podem se sentir isolados.",
          [
            "Todos trabalham menos.",
            "Novos colegas podem se sentir isolados.",
            "O sistema custa caro.",
          ],
          "A última frase identifica o isolamento como drawback.",
        ],
        [
          "Que conector introduz a dificuldade de comunicação?",
          "However.",
          ["Moreover.", "Therefore.", "However."],
          "However contrasta a flexibilidade com a dificuldade de comunicação.",
        ],
      ],
    ],
  ],
  "listening",
);
export const readingStories = build(
  [
    [
      "small-progress",
      "Pequenos intervalos, grandes mudanças",
      "A2",
      "Aprendizagem",
      "Lucas drives for a living. His schedule changes every week, so he cannot attend classes at a fixed time. Instead, he studies English for ten minutes between rides. He keeps a notebook in his car and writes down new words. Yesterday, he helped a visitor find a museum. He made a few mistakes, but the visitor understood him. Lucas felt proud.",
      "Lucas trabalha como motorista. Seus horários mudam toda semana, então não pode assistir a aulas em horário fixo. Ele estuda dez minutos entre corridas e anota palavras. Ontem ajudou um visitante. Cometeu alguns erros, mas foi entendido e sentiu orgulho.",
      [
        [
          "Por que Lucas estuda em intervalos?",
          "Os horários dele variam.",
          [
            "Ele não gosta de aulas.",
            "Os horários dele variam.",
            "Ele só trabalha de noite.",
          ],
          "O texto relaciona o horário variável à impossibilidade de frequentar aulas fixas.",
        ],
        [
          "Como ele se sentiu após ajudar o visitante?",
          "Orgulhoso.",
          ["Irritado.", "Orgulhoso.", "Entediado."],
          "A última frase diz “Lucas felt proud”.",
        ],
        [
          "O visitante entendeu Lucas?",
          "Sim, apesar de alguns erros.",
          ["Não.", "Sim, apesar de alguns erros.", "O texto não informa."],
          "“He made a few mistakes, but the visitor understood him.”",
        ],
      ],
    ],
    [
      "city-garden",
      "Um jardim no meio da cidade",
      "B1",
      "Comunidade",
      "An empty piece of land in our neighbourhood has become a community garden. The project was started by three neighbours who wanted a safe place for children to play. Today, twenty families grow vegetables there. Members share the work and the food. Although the garden requires regular care, people say it has brought them closer together.",
      "Um terreno vazio virou jardim comunitário. Três vizinhos iniciaram o projeto para criar um lugar seguro para crianças. Vinte famílias cultivam legumes e compartilham trabalho e alimentos. Apesar dos cuidados necessários, o jardim aproximou as pessoas.",
      [
        [
          "Quem iniciou o projeto?",
          "Três vizinhos.",
          ["A prefeitura.", "Três vizinhos.", "Uma escola."],
          "“The project was started by three neighbours.”",
        ],
        [
          "O que os membros compartilham?",
          "O trabalho e os alimentos.",
          [
            "Apenas ferramentas.",
            "O trabalho e os alimentos.",
            "Dinheiro de vendas.",
          ],
          "“Members share the work and the food.”",
        ],
        [
          "O que “brought them closer together” sugere?",
          "Fortaleceu os relacionamentos.",
          [
            "Mudaram de endereço.",
            "Fortaleceu os relacionamentos.",
            "O terreno ficou menor.",
          ],
          "A expressão descreve maior proximidade social entre os moradores.",
        ],
      ],
    ],
    [
      "digital-tools",
      "Ferramentas digitais com propósito",
      "B2",
      "Tecnologia",
      "A useful app should solve a specific problem rather than demand constant attention. Notifications can help users remember important tasks, but excessive reminders often become a distraction. Before adopting a new tool, ask whether it makes your routine simpler. The most effective technology is not necessarily the newest; it is the one that supports your goals without creating unnecessary work.",
      "Um aplicativo útil deve resolver um problema específico. Notificações ajudam, mas em excesso distraem. Antes de adotar uma ferramenta, pergunte se ela simplifica sua rotina. A tecnologia mais eficaz apoia seus objetivos sem criar trabalho desnecessário.",
      [
        [
          "Qual é a ideia central?",
          "Tecnologia deve apoiar objetivos e simplificar a rotina.",
          [
            "Novos apps são sempre melhores.",
            "Devemos desligar toda tecnologia.",
            "Tecnologia deve apoiar objetivos e simplificar a rotina.",
          ],
          "A conclusão defende utilidade e alinhamento a objetivos.",
        ],
        [
          "Qual problema os lembretes excessivos podem causar?",
          "Distração.",
          ["Maior autonomia.", "Distração.", "Redução de custos."],
          "“Excessive reminders often become a distraction.”",
        ],
        [
          "A ferramenta mais nova é sempre a mais eficaz?",
          "Não, a utilidade para os objetivos importa mais.",
          [
            "Sim.",
            "Não, a utilidade para os objetivos importa mais.",
            "O texto não opina.",
          ],
          "“Not necessarily the newest” rejeita essa equivalência.",
        ],
      ],
    ],
    [
      "flexible-learning",
      "Autonomia não significa ausência de estrutura",
      "C1",
      "Argumentação",
      "Flexible learning is sometimes mistaken for learning without direction. In reality, autonomy depends on clear goals and meaningful feedback. A rigid timetable may discourage people whose working hours vary; nevertheless, abandoning structure altogether can make progress difficult to recognise. A more sustainable approach combines a visible learning path with the freedom to choose when and how long to study. Evidence of improvement should come from demonstrated skills rather than the number of consecutive days an application has been opened.",
      "Aprendizagem flexível não é ausência de direção. Autonomia exige objetivos e feedback. Horários rígidos podem desanimar quem tem rotina variável, mas abandonar toda estrutura dificulta reconhecer progresso. Uma trilha visível com liberdade é mais sustentável. A melhora deve vir de habilidades demonstradas, não de dias consecutivos de acesso.",
      [
        [
          "Que equilíbrio o texto recomenda?",
          "Uma trilha clara com liberdade de horários.",
          [
            "Ausência total de estrutura.",
            "Uma trilha clara com liberdade de horários.",
            "Horários rígidos para todos.",
          ],
          "O autor propõe estrutura visível sem obrigatoriedade de horários.",
        ],
        [
          "Qual evidência de progresso o autor valoriza?",
          "Habilidades demonstradas.",
          [
            "Dias seguidos de acesso.",
            "Tempo com a tela aberta.",
            "Habilidades demonstradas.",
          ],
          "A última frase contrasta habilidades demonstradas com sequências de acesso.",
        ],
        [
          "Qual função nevertheless desempenha?",
          "Introduzir uma ressalva sobre abandonar toda estrutura.",
          [
            "Apresentar um exemplo.",
            "Repetir a tese.",
            "Introduzir uma ressalva sobre abandonar toda estrutura.",
          ],
          "O conector limita a crítica à rigidez, reconhecendo a utilidade da estrutura.",
        ],
      ],
    ],
  ],
  "reading",
);
export const storyExercises = [...listeningStories, ...readingStories].flatMap(
  (s) => s.questions,
);
