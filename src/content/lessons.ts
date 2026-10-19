import type { Exercise, Lesson, Level } from "../types";
import { coursePaths } from "./curriculum";
import { extraLessons, type Seed } from "./lessonExtensions";
const seeds: Seed[] = [
  {
    id: "simple-past",
    title: "Simple Past",
    level: "A2",
    subtitle: "Conte o que aconteceu. Com confiança.",
    rule: "Use o Simple Past para ações terminadas no passado. Com verbos regulares, acrescente -ed. Verbos irregulares têm formas próprias, como go → went.",
    detail:
      "Em perguntas e negativas, did carrega o passado: o verbo principal volta à forma base. Yesterday, last week e two days ago situam o acontecimento. A forma afirmativa é igual para todos os sujeitos.",
    formula: ["Sujeito", "verbo no passado", "complemento"],
    wrong: "I did not went to work.",
    right: "I did not go to work.",
    why: "Depois de did not, use go. O auxiliar já indica passado.",
    context:
      "Ao conversar com um passageiro, conte onde você trabalhou ontem e pergunte como foi o dia dele.",
    distractors: ["work", "working", "works"],
    rows: [
      "I <worked> yesterday.|Eu trabalhei ontem.",
      "She <visited> her family last Sunday.|Ela visitou a família no último domingo.",
      "We <went> to the park yesterday.|Nós fomos ao parque ontem.",
      "I <drove> downtown last night.|Eu dirigi até o centro ontem à noite.",
      "They <cooked> dinner together.|Eles prepararam o jantar juntos.",
      "Did you <enjoy> the trip?|Você gostou da viagem?",
      "He <bought> a new phone last week.|Ele comprou um celular novo na semana passada.",
      "I did not <see> the message.|Eu não vi a mensagem.",
    ],
  },
  {
    id: "simple-present",
    title: "Simple Present",
    level: "A1",
    subtitle: "Sua rotina em palavras.",
    rule: "Use o Simple Present para hábitos e fatos. I, you, we e they usam a forma base. Com he, she e it, acrescente -s ou -es.",
    detail:
      "Para perguntar, use do ou does antes do sujeito. Em negativas, do not ou does not vêm antes da forma base. Advérbios como usually vêm antes do verbo principal.",
    formula: ["He / She / It", "verbo + s", "rotina"],
    wrong: "She drive every day.",
    right: "She drives every day.",
    why: "She exige drives na afirmativa.",
    context:
      "Apresente sua rotina de motorista: horário em que começa, lugares em que trabalha e o que faz nos intervalos.",
    distractors: ["work", "working", "worked"],
    rows: [
      "She <works> from home.|Ela trabalha de casa.",
      "He <drives> every morning.|Ele dirige todas as manhãs.",
      "I <study> English every day.|Eu estudo inglês todos os dias.",
      "We <live> in Brazil.|Nós moramos no Brasil.",
      "My brother <likes> technology.|Meu irmão gosta de tecnologia.",
      "Do you <work> on Sundays?|Você trabalha aos domingos?",
      "The shop <opens> at nine.|A loja abre às nove.",
      "They do not <eat> meat.|Eles não comem carne.",
    ],
  },
  {
    id: "regular-verbs",
    title: "Verbos regulares",
    level: "A2",
    subtitle: "Pequenas terminações, grandes histórias.",
    rule: "No passado, verbos regulares recebem -ed: work → worked. Se já terminam em e, acrescente apenas d: live → lived. Consoante + y muda para ied: study → studied.",
    detail:
      "Em verbos curtos com consoante-vogal-consoante, a consoante final pode dobrar: stop → stopped. A pronúncia de -ed varia: worked /t/, played /d/, wanted /ɪd/. Ouça os exemplos.",
    formula: ["study → studied", "live → lived", "stop → stopped"],
    wrong: "I studyed yesterday.",
    right: "I studied yesterday.",
    why: "Consoante antes de y: troque y por i e acrescente ed.",
    context:
      "Conte sobre um projeto que você terminou e uma habilidade que aprendeu.",
    distractors: ["study", "studying", "studies"],
    rows: [
      "I <studied> at home.|Eu estudei em casa.",
      "The car <stopped> near the bank.|O carro parou perto do banco.",
      "We <played> football after work.|Nós jogamos futebol depois do trabalho.",
      "She <lived> in Recife.|Ela morou em Recife.",
      "They <cleaned> the kitchen.|Eles limparam a cozinha.",
      "I <wanted> a glass of water.|Eu queria um copo de água.",
      "He <opened> the door.|Ele abriu a porta.",
      "We <planned> a weekend trip.|Nós planejamos uma viagem de fim de semana.",
    ],
  },
  {
    id: "irregular-verbs",
    title: "Verbos irregulares",
    level: "A2",
    subtitle: "Go, went. See, saw. Uma história de cada vez.",
    rule: "Verbos irregulares não seguem a regra de -ed. Aprenda pares em contexto: go/went, see/saw, buy/bought, eat/ate, take/took, have/had.",
    detail:
      "A forma passada não muda com o sujeito: I went e she went. Ao usar did ou did not, retorne à forma base: Did you see? Evite memorizar listas sem frases: associe cada verbo a uma experiência sua.",
    formula: ["Hoje: I go", "Ontem: I went", "Pergunta: Did you go?"],
    wrong: "She buyed a ticket.",
    right: "She bought a ticket.",
    why: "O passado de buy é bought, uma forma irregular.",
    context: "Descreva uma viagem: o que você comeu, viu, comprou e levou.",
    distractors: ["buyed", "buy", "buying"],
    rows: [
      "We <ate> at a small restaurant.|Nós comemos em um restaurante pequeno.",
      "I <saw> a beautiful waterfall.|Eu vi uma cachoeira bonita.",
      "She <took> the bus to work.|Ela pegou o ônibus para o trabalho.",
      "He <had> a busy day.|Ele teve um dia corrido.",
      "They <made> breakfast together.|Eles fizeram o café da manhã juntos.",
      "I <found> my keys in the car.|Eu encontrei minhas chaves no carro.",
      "We <left> the house early.|Nós saímos de casa cedo.",
      "She <wrote> a message to her sister.|Ela escreveu uma mensagem para a irmã.",
    ],
  },
  {
    id: "articles",
    title: "A, An & The",
    level: "A1",
    subtitle: "Um objeto. Aquele objeto.",
    rule: "Use a ou an para apresentar um substantivo contável singular pela primeira vez. A escolha depende do som: a car, an apple, a university, an hour.",
    detail:
      "Use the quando o ouvinte consegue identificar o objeto: I saw a car. The car was blue. Para falar de coisas em geral no plural, normalmente não use artigo: Cars are useful.",
    formula: [
      "a + som consonantal",
      "an + som vocálico",
      "the + algo identificado",
    ],
    wrong: "I need an car.",
    right: "I need a car.",
    why: "Car começa com som consonantal, por isso usamos a.",
    context:
      "Explique o que há na sua casa e depois identifique um objeto específico.",
    distractors: ["a", "an", "the"],
    rows: [
      "I bought <an> umbrella.|Eu comprei um guarda-chuva.",
      "There is <a> table in the kitchen.|Há uma mesa na cozinha.",
      "Please close <the> door next to you.|Por favor, feche a porta ao seu lado.",
      "She is <an> engineer.|Ela é engenheira.",
      "He studies at <a> university.|Ele estuda em uma universidade.",
      "We waited for <an> hour.|Nós esperamos por uma hora.",
      "I saw a dog. <The> dog was black.|Eu vi um cachorro. O cachorro era preto.",
      "This is <a> useful tool.|Esta é uma ferramenta útil.",
    ],
  },
  {
    id: "prepositions",
    title: "Preposições de tempo e lugar",
    level: "A1",
    subtitle: "No lugar certo, na hora certa.",
    rule: "Para tempo: at com horas, on com dias e datas, in com meses, anos e partes do dia. Para lugar: in indica interior, on indica superfície e at indica um ponto ou local de atividade.",
    detail:
      "Compare at the airport (local de encontro), in the car (dentro) e on the table (superfície). Algumas combinações são fixas: at night, in the morning, on Monday.",
    formula: ["at 8:00", "on Monday", "in July"],
    wrong: "I work in Monday.",
    right: "I work on Monday.",
    why: "Dias da semana usam on.",
    context:
      "Combine com um passageiro um ponto de encontro e um horário de chegada.",
    distractors: ["in", "on", "at"],
    rows: [
      "The keys are <on> the table.|As chaves estão sobre a mesa.",
      "We meet <at> seven.|Nós nos encontramos às sete.",
      "My birthday is <in> July.|Meu aniversário é em julho.",
      "I work <on> Fridays.|Eu trabalho às sextas-feiras.",
      "She is <in> the kitchen.|Ela está na cozinha.",
      "They arrived <at> night.|Eles chegaram à noite.",
      "The meeting is <on> Tuesday.|A reunião é na terça-feira.",
      "We moved here <in> 2020.|Nós nos mudamos para cá em 2020.",
    ],
  },
  {
    id: "questions",
    title: "Formação de perguntas",
    level: "A1",
    subtitle: "Uma boa conversa começa com uma pergunta.",
    rule: "Com verbos comuns no presente, coloque do ou does antes do sujeito. No passado, use did. Uma palavra interrogativa como where vem antes do auxiliar.",
    detail:
      "Com o verbo be, inverta diretamente: You are ready → Are you ready? Perguntas com can seguem Can + sujeito + verbo. Não use do junto com be.",
    formula: ["Where", "do you", "live?"],
    wrong: "Where you live?",
    right: "Where do you live?",
    why: "Perguntas com live no presente precisam do auxiliar do.",
    context:
      "Pratique perguntas para um visitante: origem, destino e preferências.",
    distractors: ["Do", "Does", "Did"],
    rows: [
      "<Do> you speak English?|Você fala inglês?",
      "Where <does> she work?|Onde ela trabalha?",
      "<Did> they arrive yesterday?|Eles chegaram ontem?",
      "<Are> you ready to leave?|Você está pronto para sair?",
      "What <do> you need?|Do que você precisa?",
      "<Can> you help me?|Você pode me ajudar?",
      "When <does> the film start?|Quando o filme começa?",
      "Where <did> you park the car?|Onde você estacionou o carro?",
    ],
  },
  {
    id: "negatives",
    title: "Frases negativas",
    level: "A1",
    subtitle: "Diga o que não acontece.",
    rule: "Use do not ou does not + verbo base no presente. No passado, use did not + verbo base. As contrações comuns são don’t, doesn’t e didn’t.",
    detail:
      "Com be, coloque not depois do próprio verbo: I am not tired. Com modais, use can not/cannot ou should not. O verbo principal não recebe s nem passado depois do auxiliar.",
    formula: ["Sujeito", "do / does / did + not", "verbo base"],
    wrong: "He does not likes coffee.",
    right: "He does not like coffee.",
    why: "Does já marca a terceira pessoa. Like fica na forma base.",
    context:
      "Explique restrições de rota ou preferências de alimentação de forma educada.",
    distractors: ["do not", "does not", "did not"],
    rows: [
      "She <does not> drink coffee.|Ela não toma café.",
      "I <do not> work on Saturdays.|Eu não trabalho aos sábados.",
      "We <did not> travel last month.|Nós não viajamos no mês passado.",
      "He is <not> at home.|Ele não está em casa.",
      "They <do not> have a car.|Eles não têm carro.",
      "My phone <does not> work.|Meu celular não funciona.",
      "She <did not> call yesterday.|Ela não ligou ontem.",
      "We are <not> late.|Nós não estamos atrasados.",
    ],
  },
  {
    id: "auxiliaries",
    title: "Verbos auxiliares",
    level: "A2",
    subtitle: "As pequenas palavras que organizam a frase.",
    rule: "Do, be e have podem funcionar como auxiliares. Do forma perguntas e negativas simples. Be acompanha -ing no contínuo. Have acompanha o particípio nos tempos perfeitos.",
    detail:
      "O auxiliar concorda com o sujeito e carrega o tempo verbal. Compare Does she drive?, Is she driving? e Has she driven? Em respostas curtas, repita o auxiliar: Yes, she does.",
    formula: ["do + forma base", "be + verbo-ing", "have + particípio"],
    wrong: "Does she driving?",
    right: "Is she driving?",
    why: "Uma ação em andamento usa be + verbo-ing.",
    context:
      "Diferencie uma rotina, uma ação de agora e uma experiência já vivida.",
    distractors: ["Do", "Is", "Has"],
    rows: [
      "<Does> he work here?|Ele trabalha aqui?",
      "She <is> cooking right now.|Ela está cozinhando agora.",
      "They <have> finished the project.|Eles terminaram o projeto.",
      "<Did> you see my bag?|Você viu minha bolsa?",
      "We <are> waiting outside.|Nós estamos esperando lá fora.",
      "He <has> visited London.|Ele já visitou Londres.",
      "<Are> they studying now?|Eles estão estudando agora?",
      "Yes, she <does>.|Sim, ela faz isso.",
    ],
  },
  {
    id: "word-order",
    title: "Ordem das palavras",
    level: "A1",
    subtitle: "Organize as ideias em inglês.",
    rule: "A ordem comum de uma afirmativa é sujeito + verbo + objeto. Adjetivos geralmente vêm antes do substantivo: a red car. O inglês costuma exigir sujeito explícito.",
    detail:
      "Advérbios de frequência vêm antes do verbo principal, mas depois de be: I usually drive; I am usually busy. Para lugar e tempo, uma ordem natural é ação + lugar + tempo.",
    formula: ["I", "drive", "a blue car"],
    wrong: "I have a car blue.",
    right: "I have a blue car.",
    why: "Blue é um adjetivo e vem antes de car.",
    context:
      "Apresente seu carro, sua família e sua rotina usando frases curtas e bem organizadas.",
    distractors: ["blue car", "car blue", "blue a car"],
    rows: [
      "I drive a <blue car>.|Eu dirijo um carro azul.",
      "She <usually> walks to work.|Ela geralmente vai andando para o trabalho.",
      "We study English <at home>.|Nós estudamos inglês em casa.",
      "He has a <small kitchen>.|Ele tem uma cozinha pequena.",
      "They are <always> kind.|Eles são sempre gentis.",
      "I <need> a new phone.|Eu preciso de um celular novo.",
      "We bought a <red bicycle>.|Nós compramos uma bicicleta vermelha.",
      "She speaks English <very well>.|Ela fala inglês muito bem.",
    ],
  },
  {
    id: "present-continuous",
    title: "Present Continuous",
    level: "A1",
    subtitle: "O que está acontecendo agora?",
    rule: "Forme o Present Continuous com am, is ou are + verbo terminado em -ing. Ele descreve ações em andamento ou situações temporárias.",
    detail:
      "Retire e final antes de ing: drive → driving. Em verbos curtos, pode haver duplicação: run → running. Verbos de estado como know geralmente ficam no Simple Present.",
    formula: ["Sujeito", "am / is / are", "verbo-ing"],
    wrong: "I driving now.",
    right: "I am driving now.",
    why: "O contínuo exige o auxiliar be: am.",
    context: "Informe que está chegando e descreva o trânsito naquele momento.",
    distractors: ["drive", "drives", "driving"],
    rows: [
      "I am <driving> to the airport.|Eu estou dirigindo para o aeroporto.",
      "She is <reading> a book.|Ela está lendo um livro.",
      "They are <waiting> outside.|Eles estão esperando lá fora.",
      "We are <learning> English.|Nós estamos aprendendo inglês.",
      "He is <running> in the park.|Ele está correndo no parque.",
      "Are you <listening> to me?|Você está me ouvindo?",
      "The children are <playing> outside.|As crianças estão brincando lá fora.",
      "She is not <sleeping> now.|Ela não está dormindo agora.",
    ],
  },
  {
    id: "going-to",
    title: "Future with Going To",
    level: "A2",
    subtitle: "Transforme intenções em frases.",
    rule: "Use be + going to + verbo base para planos já decididos e previsões baseadas em evidências presentes.",
    detail:
      "O verbo be muda com o sujeito: I am, she is, they are. Compare um plano, I am going to study tonight, com uma decisão tomada agora usando will. A evidência de nuvens permite It is going to rain.",
    formula: ["am / is / are", "going to", "verbo base"],
    wrong: "I going to travel.",
    right: "I am going to travel.",
    why: "Going to precisa do verbo be.",
    context:
      "Conte seu plano para o próximo intervalo ou para uma viagem em família.",
    distractors: ["am", "is", "are"],
    rows: [
      "I <am> going to study tonight.|Eu vou estudar hoje à noite.",
      "She <is> going to buy a laptop.|Ela vai comprar um notebook.",
      "We <are> going to visit our family.|Nós vamos visitar nossa família.",
      "It is going to <rain>.|Vai chover.",
      "They are going to <travel> tomorrow.|Eles vão viajar amanhã.",
      "Are you going to <cook> dinner?|Você vai preparar o jantar?",
      "He <is> going to start a business.|Ele vai abrir um negócio.",
      "I am not going to <drive> tonight.|Eu não vou dirigir hoje à noite.",
    ],
  },
  {
    id: "will",
    title: "Future with Will",
    level: "A2",
    subtitle: "Decisões, promessas e possibilidades.",
    rule: "Use will + verbo base para decisões no momento, ofertas, promessas e previsões sem evidência imediata. A forma não muda com o sujeito.",
    detail:
      "A negativa é will not ou won’t. Para perguntar, coloque will antes do sujeito. Compare I will help you (oferta agora) com I am going to help tomorrow (plano anterior).",
    formula: ["Sujeito", "will", "verbo base"],
    wrong: "She will arrives soon.",
    right: "She will arrive soon.",
    why: "Depois de will, use a forma base arrive.",
    context:
      "Ofereça ajuda com malas e faça uma previsão sobre o tempo de chegada.",
    distractors: ["will", "is", "does"],
    rows: [
      "I <will> help you with your bags.|Eu vou ajudar você com suas malas.",
      "She will <arrive> soon.|Ela chegará em breve.",
      "We <will> call you tomorrow.|Nós ligaremos para você amanhã.",
      "It will <be> a good day.|Será um bom dia.",
      "They will not <forget> your name.|Eles não esquecerão seu nome.",
      "<Will> you join us?|Você vai se juntar a nós?",
      "I will <send> the address.|Eu enviarei o endereço.",
      "He will not <be> late.|Ele não vai se atrasar.",
    ],
  },
  {
    id: "present-perfect",
    title: "Present Perfect",
    level: "B1",
    subtitle: "O passado que conversa com o presente.",
    rule: "Use have ou has + particípio para experiências sem momento passado definido e situações que começaram antes e continuam agora.",
    detail:
      "Use ever em perguntas de experiência, never para nunca e already para algo já feito. Since marca o início; for marca duração. Com yesterday ou last year, prefira Simple Past.",
    formula: ["have / has", "particípio", "conexão com agora"],
    wrong: "I have went to London.",
    right: "I have been to London.",
    why: "Para uma experiência de visita já concluída, use have been to.",
    context:
      "Converse sobre experiências de viagem e sobre há quanto tempo trabalha como motorista.",
    distractors: ["have", "has", "did"],
    rows: [
      "I <have> visited Lisbon.|Eu já visitei Lisboa.",
      "She <has> finished her work.|Ela terminou o trabalho dela.",
      "We have lived here <for> five years.|Nós moramos aqui há cinco anos.",
      "He has worked here <since> 2020.|Ele trabalha aqui desde 2020.",
      "Have you ever <eaten> sushi?|Você já comeu sushi?",
      "They have never <seen> snow.|Eles nunca viram neve.",
      "She has already <sent> the email.|Ela já enviou o e-mail.",
      "I have <known> him for years.|Eu o conheço há anos.",
    ],
  },
  {
    id: "past-continuous",
    title: "Past Continuous",
    level: "B1",
    subtitle: "Uma cena em andamento no passado.",
    rule: "Use was ou were + verbo-ing para uma ação em andamento em um momento passado. Uma ação curta no Simple Past pode interromper essa cena.",
    detail:
      "Was acompanha I, he, she e it; were acompanha you, we e they. While apresenta uma ação em andamento. When costuma introduzir o acontecimento pontual.",
    formula: ["was / were + ing", "when", "ação pontual"],
    wrong: "They was working.",
    right: "They were working.",
    why: "They exige were.",
    context: "Explique o que estava fazendo quando recebeu uma ligação.",
    distractors: ["was", "were", "did"],
    rows: [
      "I <was> driving when you called.|Eu estava dirigindo quando você ligou.",
      "They <were> watching a film.|Eles estavam assistindo a um filme.",
      "She was <cooking> at eight.|Ela estava cozinhando às oito.",
      "We were <walking> when it rained.|Nós estávamos caminhando quando choveu.",
      "He <was> studying all evening.|Ele estava estudando a noite toda.",
      "What were you <doing>?|O que você estava fazendo?",
      "You <were> sleeping when I arrived.|Você estava dormindo quando eu cheguei.",
      "I was not <listening> to music.|Eu não estava ouvindo música.",
    ],
  },
  {
    id: "modals",
    title: "Modal Verbs",
    level: "B1",
    subtitle: "Habilidade, conselho e obrigação.",
    rule: "Can expressa habilidade ou permissão; should, conselho; must, obrigação forte; might, possibilidade. Todos vêm antes da forma base, sem to.",
    detail:
      "Modais não recebem s na terceira pessoa. Must not indica proibição; do not have to indica ausência de obrigação. Para pedidos educados, experimente Could you…?",
    formula: ["Sujeito", "can / should / must / might", "verbo base"],
    wrong: "She can to drive.",
    right: "She can drive.",
    why: "Depois de can, o verbo vem sem to.",
    context:
      "Dê conselhos a um visitante e explique regras do carro sem soar rude.",
    distractors: ["can", "should", "must"],
    rows: [
      "I <can> speak Portuguese.|Eu consigo falar português.",
      "You <should> take a break.|Você deveria fazer uma pausa.",
      "Passengers <must> wear seat belts.|Os passageiros devem usar cinto.",
      "It <might> rain later.|Talvez chova mais tarde.",
      "Could you <open> the window?|Você poderia abrir a janela?",
      "She can <swim> very well.|Ela consegue nadar muito bem.",
      "You must not <smoke> here.|Você não pode fumar aqui.",
      "He should <study> more often.|Ele deveria estudar com mais frequência.",
    ],
  },
  {
    id: "conditionals",
    title: "Conditionals",
    level: "B1",
    subtitle: "Se isso acontecer…",
    rule: "No zero conditional, use presente nas duas partes para fatos gerais. No first conditional, use if + presente, will + verbo para uma possibilidade futura real.",
    detail:
      "No second conditional, if + passado, would + verbo descreve situações imaginárias: If I had time, I would travel. Não coloque will na oração com if do primeiro condicional.",
    formula: ["If + presente", "→", "will + verbo"],
    wrong: "If it will rain, I will stay home.",
    right: "If it rains, I will stay home.",
    why: "A oração com if usa presente para uma condição futura possível.",
    context:
      "Planeje o trabalho conforme o trânsito ou imagine o que faria com mais tempo livre.",
    distractors: ["rains", "will rain", "raining"],
    rows: [
      "If it <rains>, I will stay home.|Se chover, eu ficarei em casa.",
      "If you heat ice, it <melts>.|Se você aquece gelo, ele derrete.",
      "If I had time, I <would> travel.|Se eu tivesse tempo, eu viajaria.",
      "We will leave if you <are> ready.|Nós sairemos se você estiver pronto.",
      "If she studies, she will <improve>.|Se ela estudar, ela vai melhorar.",
      "If I were you, I would <rest>.|Se eu fosse você, eu descansaria.",
      "If he calls, I will <answer>.|Se ele ligar, eu atenderei.",
      "If I won the prize, I <would> buy a house.|Se eu ganhasse o prêmio, eu compraria uma casa.",
    ],
  },
  {
    id: "comparatives",
    title: "Comparatives & Superlatives",
    level: "A2",
    subtitle: "Compare lugares, escolhas e experiências.",
    rule: "Adjetivos curtos costumam receber -er e -est. Longos usam more e most. Use than em comparações e the antes do superlativo.",
    detail:
      "Good muda para better/best; bad, para worse/worst. Adjetivos terminados em y mudam para ier/iest. Não combine more com -er: more cheaper não é padrão.",
    formula: ["cheaper than", "more comfortable than", "the best"],
    wrong: "This route is more faster.",
    right: "This route is faster.",
    why: "Fast já recebe er: não acrescente more.",
    context: "Compare rotas, preços de transporte e opções de viagem.",
    distractors: ["cheaper", "cheapest", "cheap"],
    rows: [
      "This bus is <cheaper> than a taxi.|Este ônibus é mais barato que um táxi.",
      "She is the <tallest> in her family.|Ela é a mais alta da família.",
      "This chair is more <comfortable>.|Esta cadeira é mais confortável.",
      "Today is <better> than yesterday.|Hoje está melhor que ontem.",
      "This is the <best> option.|Esta é a melhor opção.",
      "The park is <quieter> than downtown.|O parque é mais silencioso que o centro.",
      "This road is <worse> than the other one.|Esta estrada é pior que a outra.",
      "It is the <most> expensive hotel.|É o hotel mais caro.",
    ],
  },
  {
    id: "quantifiers",
    title: "Quantifiers",
    level: "A2",
    subtitle: "Quanto? Quantos? O suficiente?",
    rule: "Many e a few acompanham substantivos contáveis plurais. Much e a little acompanham incontáveis. A lot of funciona com ambos.",
    detail:
      "Some é comum em afirmativas e ofertas; any em perguntas e negativas. Few e little sem a enfatizam escassez; a few e a little indicam alguma quantidade disponível.",
    formula: ["many cars", "much water", "a lot of time"],
    wrong: "How many water do you need?",
    right: "How much water do you need?",
    why: "Water é incontável neste uso; por isso usamos much.",
    context:
      "Organize compras e fale sobre combustível, dinheiro e passageiros.",
    distractors: ["many", "much", "a few"],
    rows: [
      "How <much> water do you need?|De quanta água você precisa?",
      "There are <many> cars outside.|Há muitos carros lá fora.",
      "We have <a little> time before work.|Nós temos um pouco de tempo antes do trabalho.",
      "I bought <a few> apples.|Eu comprei algumas maçãs.",
      "There is not <any> milk left.|Não sobrou leite.",
      "Would you like <some> coffee?|Você gostaria de um pouco de café?",
      "How <many> people are coming?|Quantas pessoas estão vindo?",
      "She does not have <much> money.|Ela não tem muito dinheiro.",
    ],
  },
  {
    id: "gerund-infinitive",
    title: "Gerund & Infinitive",
    level: "B1",
    subtitle: "Aprenda o verbo e o que vem depois.",
    rule: "Alguns verbos exigem -ing, como enjoy e avoid. Outros pedem to + verbo, como want, decide e plan. Aprenda as combinações com exemplos.",
    detail:
      "Depois de preposições, use -ing: good at driving. Stop doing significa parar a atividade; stop to do significa interromper outra atividade para fazer algo. A escolha pode mudar o sentido.",
    formula: ["enjoy + ing", "want + to + verbo", "preposição + ing"],
    wrong: "I enjoy to drive.",
    right: "I enjoy driving.",
    why: "Enjoy é seguido por gerúndio.",
    context:
      "Fale de interesses, planos e habilidades em uma conversa profissional.",
    distractors: ["driving", "to drive", "drive"],
    rows: [
      "I enjoy <driving>.|Eu gosto de dirigir.",
      "She wants <to learn> English.|Ela quer aprender inglês.",
      "We decided <to travel> by train.|Nós decidimos viajar de trem.",
      "He is good at <cooking>.|Ele é bom em cozinhar.",
      "They avoid <working> late.|Eles evitam trabalhar até tarde.",
      "I stopped <to drink> some water.|Eu parei para beber um pouco de água.",
      "She plans <to start> a course.|Ela planeja começar um curso.",
      "Thank you for <helping> me.|Obrigado por me ajudar.",
    ],
  },
  {
    id: "relative-clauses",
    title: "Relative Clauses",
    level: "B1",
    subtitle: "Conecte ideias sem repetir tudo.",
    rule: "Use who para pessoas, which para coisas e where para lugares. Em orações que identificam o substantivo, that pode substituir who ou which.",
    detail:
      "Orações explicativas trazem informação extra entre vírgulas e não usam that. Em The book that I bought, o pronome é objeto e pode ser omitido. Em The man who called, é sujeito e precisa ficar.",
    formula: ["a person who…", "a thing which…", "a place where…"],
    wrong: "The man which called is here.",
    right: "The man who called is here.",
    why: "Para pessoas, who é a opção apropriada.",
    context:
      "Descreva objetos e pessoas quando você não lembrar uma palavra exata.",
    distractors: ["who", "which", "where"],
    rows: [
      "The woman <who> lives next door is kind.|A mulher que mora ao lado é gentil.",
      "This is the app <that> I use.|Este é o aplicativo que eu uso.",
      "The hotel <where> we stayed was quiet.|O hotel onde ficamos era tranquilo.",
      "My car, <which> is old, still works.|Meu carro, que é antigo, ainda funciona.",
      "He is the driver <who> helped us.|Ele é o motorista que nos ajudou.",
      "This is the book <that> I bought.|Este é o livro que eu comprei.",
      "That is the café <where> we met.|Aquele é o café onde nos conhecemos.",
      "The phone <which> broke was new.|O celular que quebrou era novo.",
    ],
  },
  {
    id: "passive-voice",
    title: "Passive Voice",
    level: "B2",
    subtitle: "Mude o foco da ação.",
    rule: "A voz passiva usa be + particípio. O objeto da ativa vira sujeito: They built the bridge → The bridge was built. O tempo fica no verbo be.",
    detail:
      "Use by para mencionar o agente quando relevante. Não é necessário dizer quem agiu se isso for desconhecido ou óbvio. Compare is made, was made e will be made.",
    formula: ["Objeto da ativa", "be no tempo certo", "particípio"],
    wrong: "The car was repair yesterday.",
    right: "The car was repaired yesterday.",
    why: "A passiva precisa do particípio repaired.",
    context:
      "Descreva processos, manutenção do carro e produtos sem focar em quem os fez.",
    distractors: ["built", "build", "building"],
    rows: [
      "The bridge was <built> in 1990.|A ponte foi construída em 1990.",
      "English is <spoken> in many countries.|O inglês é falado em muitos países.",
      "The car was <repaired> yesterday.|O carro foi consertado ontem.",
      "The results will be <sent> tomorrow.|Os resultados serão enviados amanhã.",
      "These phones are <made> in China.|Estes celulares são fabricados na China.",
      "The room is <cleaned> every day.|O quarto é limpo todos os dias.",
      "The window was <broken> last night.|A janela foi quebrada ontem à noite.",
      "The project has been <completed>.|O projeto foi concluído.",
    ],
  },
  {
    id: "reported-speech",
    title: "Reported Speech",
    level: "B2",
    subtitle: "Conte o que alguém disse.",
    rule: "Ao relatar uma fala passada, o tempo verbal geralmente recua: am → was, work → worked, will → would. Ajuste pronomes e referências de tempo conforme o contexto.",
    detail:
      "Say não exige um destinatário; tell exige: She told me. Perguntas relatadas usam ordem afirmativa: He asked where I lived. Se a informação continua verdadeira, o recuo nem sempre é obrigatório.",
    formula: ["She said", "that she", "was tired"],
    wrong: "He told that he was busy.",
    right: "He told me that he was busy.",
    why: "Tell exige a pessoa que recebeu a informação.",
    context:
      "Relate para sua família algo que um colega ou passageiro comentou.",
    distractors: ["was", "is", "were"],
    rows: [
      "She said she <was> tired.|Ela disse que estava cansada.",
      "He told me he <worked> nearby.|Ele me contou que trabalhava perto.",
      "They said they <would> call.|Eles disseram que ligariam.",
      "She asked where I <lived>.|Ela perguntou onde eu morava.",
      "He <told> me about the trip.|Ele me contou sobre a viagem.",
      "I said I <could> help.|Eu disse que poderia ajudar.",
      "She said she <had> finished.|Ela disse que tinha terminado.",
      "He asked if I <was> ready.|Ele perguntou se eu estava pronto.",
    ],
  },
  {
    id: "connectors",
    title: "Conectores & Argumentação",
    level: "C1",
    subtitle: "Dê estrutura às suas opiniões.",
    rule: "Use however para contraste entre ideias, therefore para resultado, moreover para acrescentar argumento e although para concessão dentro de uma frase.",
    detail:
      "Despite vem antes de substantivo ou -ing; although vem antes de uma oração. Whereas contrapõe dois fatos. Para argumentar com cuidado, diferencie evidência, opinião e conclusão e evite conectores excessivos.",
    formula: ["Ideia", "however / therefore", "relação lógica"],
    wrong: "Despite it was raining, we left.",
    right: "Although it was raining, we left.",
    why: "Uma oração completa pede although. Alternativa: Despite the rain.",
    context:
      "Defenda uma ideia sobre tecnologia ou mobilidade, reconhecendo uma limitação do seu argumento.",
    distractors: ["However", "Therefore", "Moreover"],
    rows: [
      "The route is longer. <However>, it is safer.|A rota é mais longa. Porém, ela é mais segura.",
      "It was late. <Therefore>, we went home.|Era tarde. Portanto, fomos para casa.",
      "<Although> it was raining, we walked.|Embora estivesse chovendo, nós caminhamos.",
      "<Despite> the traffic, we arrived on time.|Apesar do trânsito, chegamos a tempo.",
      "The app is fast. <Moreover>, it is free.|O aplicativo é rápido. Além disso, ele é gratuito.",
      "I prefer tea, <whereas> she prefers coffee.|Eu prefiro chá, enquanto ela prefere café.",
      "<Nevertheless>, the evidence remains limited.|Ainda assim, as evidências continuam limitadas.",
      "We should invest in transport <because> it improves access.|Devemos investir em transporte porque ele melhora o acesso.",
    ],
  },
];
function parse(row: string) {
  const [marked, pt] = row.split("|");
  const answer = marked.match(/<([^>]+)>/)![1];
  return {
    en: marked.replace(/[<>]/g, ""),
    pt,
    answer,
    sentence: marked.replace(/<[^>]+>/, "_____"),
  };
}
export const lessons: Lesson[] = [...seeds, ...extraLessons].map((s) => {
  const parsed = s.rows.map(parse);
  const make = (i: number): Exercise => {
    const r = parsed[i];
    const assessment = i >= 6;
    const kind = assessment
      ? i === 6
        ? "choice"
        : "translate"
      : (["choice", "gap", "order", "translate", "dictation", "gap"] as const)[
          i
        ];
    const isGap = kind === "choice" || kind === "gap";
    const options = [
      r.answer,
      ...s.distractors.filter(
        (x, j, all) =>
          x.toLowerCase() !== r.answer.toLowerCase() &&
          all.findIndex((y) => y.toLowerCase() === x.toLowerCase()) === j,
      ),
    ].slice(0, 4);
    // Deterministic rotation prevents the answer always occupying the same position.
    const shift = (i + s.id.length) % options.length;
    const shuffled = [...options.slice(shift), ...options.slice(0, shift)];
    return {
      id: `${s.id}-${i}`,
      topic: s.id,
      skill: "grammar",
      level: s.level,
      kind,
      prompt:
        kind === "translate"
          ? `Traduza: “${r.pt}”`
          : kind === "order"
            ? "Organize as palavras para formar a frase."
            : kind === "dictation"
              ? "Ouça e escreva a frase em inglês."
              : `Complete a frase para expressar: “${r.pt}”`,
      sentence: isGap ? r.sentence : kind === "order" ? r.en : undefined,
      options: kind === "choice" ? shuffled : undefined,
      answers: [isGap ? r.answer : r.en],
      explanation: `${s.rule} Aqui: “${r.en}” — ${r.pt}`,
      audio: kind === "dictation" ? r.en : undefined,
      assessment,
    };
  };
  return {
    id: s.id,
    title: s.title,
    subtitle: s.subtitle,
    level: s.level,
    minutes: s.level === "C1" ? 20 : 15,
    icon: "book",
    objectives: [
      `Usar ${s.title} em situações reais.`,
      "Reconhecer a estrutura e evitar o erro mais comum.",
      "Construir e ouvir frases antes de avaliar o aprendizado.",
    ],
    prerequisites:
      coursePaths[s.level].lessons.indexOf(s.id) > 0
        ? [
            coursePaths[s.level].lessons[
              coursePaths[s.level].lessons.indexOf(s.id) - 1
            ],
          ]
        : [],
    explanation: [s.rule, s.detail],
    formula: s.formula,
    examples: parsed.slice(0, 3).map(({ en, pt }) => ({ en, pt })),
    mistake: { wrong: s.wrong, right: s.right, why: s.why },
    context: s.context,
    guided: {
      prompt: parsed[3].sentence,
      answer: parsed[3].answer,
      why: `${parsed[3].en} — ${parsed[3].pt}. ${s.rule}`,
    },
    summary: s.rule,
    exercises: [
      ...parsed.slice(0, 6).map((_, i) => make(i)),
      {
        id: `${s.id}-error`,
        topic: s.id,
        skill: "grammar",
        level: s.level,
        kind: "error",
        prompt: "Reescreva a frase corrigindo o erro.",
        sentence: s.wrong,
        answers: [s.right],
        explanation: s.why,
      },
    ],
    assessment: parsed.slice(6).map((_, i) => make(i + 6)),
  };
});
export const lessonById = (id: string) => lessons.find((l) => l.id === id);
export const priorities = [
  "simple-past",
  "irregular-verbs",
  "articles",
  "prepositions",
  "questions",
  "word-order",
  "connectors",
  "simple-present",
];
export const allGrammarExercises = lessons.flatMap((l) => [
  ...l.exercises,
  ...l.assessment,
]);
