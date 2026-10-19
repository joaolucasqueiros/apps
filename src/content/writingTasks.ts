export const extraWritingTasks = [
  {
    id: "introduce",
    title: "Uma mensagem de apresentação",
    level: "A1",
    prompt:
      "Escreva uma mensagem de 4 frases a um novo colega. Diga seu nome, de onde é, uma atividade de que gosta e faça uma pergunta.",
    model:
      "Hi, I'm João. I'm from Brazil, and I work as a driver. I like walking in the park with my family. What do you like to do in your free time?",
    checks: [
      "Apresentei meu nome e minha origem.",
      "Usei I am e um verbo para minha atividade.",
      "Fiz uma pergunta para continuar a conversa.",
      "Li a mensagem e conferi se ela está clara.",
    ],
  },
  {
    id: "appointment",
    title: "Uma consulta por mensagem",
    level: "A2",
    prompt:
      "Peça uma consulta. Explique brevemente o motivo, diga quando está disponível e peça confirmação do horário. Não inclua informações pessoais que não queira guardar no navegador.",
    model:
      "Hello, I'd like to make an appointment. My left shoulder has hurt since yesterday. I'm available on Thursday morning. Could you let me know which times are available? Thank you.",
    checks: [
      "Expliquei a finalidade da mensagem.",
      "Descrevi o motivo de forma clara.",
      "Informei minha disponibilidade.",
      "Pedi uma confirmação educada.",
    ],
  },
  {
    id: "shop-email",
    title: "Solicitando uma troca",
    level: "A2",
    prompt:
      "Escreva uma mensagem à loja: identifique o produto, explique o problema e peça uma troca ou reembolso.",
    model:
      "Hello, I bought a blue jacket from your shop on Monday. I tried it on at home, but the sleeves are too short. I still have the receipt. Could I exchange it for a larger size? Please let me know what I need to bring.",
    checks: [
      "Identifiquei o produto e a compra.",
      "Expliquei um problema específico.",
      "Solicitei uma solução.",
      "Usei um tom educado e direto.",
    ],
  },
  {
    id: "work-email",
    title: "Um e-mail de trabalho",
    level: "B1",
    prompt:
      "Avise que uma entrega terá atraso. Explique a causa sem culpar outra pessoa, proponha novo prazo e peça confirmação.",
    model:
      "Hi Alex, I'm writing about the delivery scheduled for Friday. We need one more day to check the payment system. Could we move the delivery to Monday morning? I can send a demonstration on Friday so you can review the main features. Please let me know whether this works for you.",
    checks: [
      "Expliquei o motivo do contato no início.",
      "Dei uma causa específica para o atraso.",
      "Propus prazo e alternativa concretos.",
      "Pedi confirmação e revisei o tom.",
    ],
  },
  {
    id: "trip-story",
    title: "Uma viagem que mudou de planos",
    level: "B1",
    prompt:
      "Conte uma experiência em 80–120 palavras: contexto, imprevisto, sua ação e resultado. Use pelo menos um conector de sequência.",
    model:
      "Last month, I travelled to visit a friend. I was waiting at the station when I learned that my train had been cancelled. First, I asked about another route. The assistant suggested taking a bus to the next town and a train from there. I called my friend to explain the delay, then bought a new ticket. The journey took longer than expected, but I arrived safely. I learned to check alternative routes before travelling.",
    checks: [
      "Dei contexto e expliquei o imprevisto.",
      "Distingui ações em andamento e acontecimentos.",
      "Usei conectores para organizar a sequência.",
      "Contei o resultado e uma aprendizagem.",
    ],
  },
  {
    id: "proposal",
    title: "Uma proposta com contraponto",
    level: "B2",
    prompt:
      "Proponha uma melhoria no seu bairro ou trabalho em 120–180 palavras. Apresente problema, solução, benefício, objeção e resposta.",
    model:
      "Our team spends too much time answering the same booking questions. I suggest creating a short guide with the most common answers. This could reduce repeated messages and make information easier to find. For example, customers could check payment methods before contacting us. One concern is that a guide may become outdated. To address this, we could assign one person to review it each month. A small trial would help us see whether customers find it useful before we invest more time.",
    checks: [
      "Defini um problema verificável.",
      "Propus uma ação e um benefício com exemplo.",
      "Considerei uma objeção real.",
      "Respondi à objeção e indiquei um próximo passo.",
    ],
  },
  {
    id: "summary",
    title: "Resumir sem copiar",
    level: "B2",
    prompt:
      "Leia 'Uma reunião que termina em decisão' em Reading. Escreva um resumo de 70–100 palavras com o problema, a mudança e o critério de sucesso. Separe sua opinião do resumo.",
    model:
      "The text describes a team that redesigned its long weekly meetings. Routine reports were sent in advance, while meeting time was used for concrete decisions. Participants had to explain their evidence and suggest alternatives when they disagreed. Each meeting ended with clear actions, owners and deadlines. Although meetings became shorter, the team judged success by understanding and follow-through rather than duration alone.",
    checks: [
      "Identifiquei a ideia principal.",
      "Selecionei informações essenciais.",
      "Usei minhas próprias palavras.",
      "Separei minha opinião das ideias do texto.",
    ],
  },
  {
    id: "evidence",
    title: "Síntese crítica de duas posições",
    level: "C1",
    prompt:
      "Leia 'Quando dois relatórios parecem discordar' em Reading. Escreva 180–250 palavras comparando os estudos, reconhecendo limitações e propondo uma recomendação condicional.",
    model:
      "The apparent disagreement between the reports reflects differences in what they measured. The first focused on individual output among experienced employees, whereas the second examined collaboration in newly formed teams. Their findings may therefore be compatible. However, voluntary participation and limited occupational coverage restrict generalisation. Taken together, the evidence suggests that remote-work policies should account for tasks, experience and support. A reasonable approach would preserve flexibility while providing structured opportunities for new colleagues to exchange knowledge. Its effectiveness should then be evaluated using measures of both individual output and collaboration. This recommendation remains conditional on local needs and further evidence.",
    checks: [
      "Comparei métodos e alcance das posições.",
      "Distingui evidência, interpretação e recomendação.",
      "Usei cautela proporcional aos limites.",
      "Concluí com uma recomendação e condições explícitas.",
    ],
  },
];
