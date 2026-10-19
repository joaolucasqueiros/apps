import type { Exercise, Word } from "../types";
const groups: [string, string, string[]][] = [
  [
    "Casa e cômodos",
    "🏠",
    [
      "bedroom|quarto|My bedroom is upstairs.|ˈbed.ruːm",
      "living room|sala de estar|We watch films in the living room.|ˈlɪv.ɪŋ ruːm",
      "ceiling|teto|The ceiling is white.|ˈsiː.lɪŋ",
      "hallway|corredor|Your shoes are in the hallway.|ˈhɔːl.weɪ",
    ],
  ],
  [
    "Banheiro e cozinha",
    "🚿",
    [
      "sink|pia|Please wash the dishes in the sink.|sɪŋk",
      "shower|chuveiro|I take a shower before work.|ˈʃaʊ.ər",
      "stove|fogão|The soup is on the stove.|stəʊv",
      "faucet|torneira|Turn off the faucet.|ˈfɔː.sɪt",
    ],
  ],
  [
    "Objetos domésticos",
    "🪑",
    [
      "shelf|prateleira|The books are on the shelf.|ʃelf",
      "drawer|gaveta|My keys are in the drawer.|drɔːr",
      "pillow|travesseiro|I need a softer pillow.|ˈpɪl.əʊ",
      "blanket|cobertor|This blanket is warm.|ˈblæŋ.kɪt",
    ],
  ],
  [
    "Trabalho",
    "💼",
    [
      "shift|turno|My shift starts at seven.|ʃɪft",
      "colleague|colega de trabalho|My colleague lives nearby.|ˈkɒl.iːɡ",
      "deadline|prazo final|The deadline is tomorrow.|ˈded.laɪn",
      "schedule|agenda de horários|My schedule changes every day.|ˈskedʒ.uːl",
    ],
  ],
  [
    "Direção e trânsito",
    "🚦",
    [
      "traffic light|semáforo|Turn left at the traffic light.|ˈtræf.ɪk laɪt",
      "seat belt|cinto de segurança|Please fasten your seat belt.|ˈsiːt belt",
      "crosswalk|faixa de pedestres|Stop before the crosswalk.|ˈkrɒs.wɔːk",
      "roundabout|rotatória|Take the second exit at the roundabout.|ˈraʊnd.ə.baʊt",
    ],
  ],
  [
    "Transportes",
    "🚆",
    [
      "fare|tarifa de transporte|How much is the bus fare?|feər",
      "platform|plataforma|The train leaves from platform two.|ˈplæt.fɔːm",
      "subway|metrô|We took the subway downtown.|ˈsʌb.weɪ",
      "flight|voo|Our flight leaves at noon.|flaɪt",
    ],
  ],
  [
    "Dinheiro",
    "💳",
    [
      "change|troco|Keep the change.|tʃeɪndʒ",
      "receipt|recibo|Could I have a receipt?|rɪˈsiːt",
      "savings|economias|I use my savings for emergencies.|ˈseɪ.vɪŋz",
      "fee|taxa|There is a small service fee.|fiː",
    ],
  ],
  [
    "Negócios",
    "📊",
    [
      "profit|lucro|Our profit increased this month.|ˈprɒf.ɪt",
      "customer|cliente|The customer asked a question.|ˈkʌs.tə.mər",
      "invoice|fatura|Please send the invoice by email.|ˈɪn.vɔɪs",
      "budget|orçamento|We have a small budget.|ˈbʌdʒ.ɪt",
    ],
  ],
  [
    "Alimentação",
    "🥗",
    [
      "fork|garfo|I need a fork and a knife.|fɔːk",
      "beans|feijão|We eat rice and beans.|biːnz",
      "meal|refeição|Breakfast is my favourite meal.|miːl",
      "slice|fatia|Would you like a slice of bread?|slaɪs",
    ],
  ],
  [
    "Compras",
    "🛒",
    [
      "refund|reembolso|I asked for a refund.|ˈriː.fʌnd",
      "discount|desconto|Is there a discount today?|ˈdɪs.kaʊnt",
      "checkout|caixa da loja|You can pay at the checkout.|ˈtʃek.aʊt",
      "size|tamanho|Do you have this in a larger size?|saɪz",
    ],
  ],
  [
    "Família",
    "👨‍👩‍👧",
    [
      "nephew|sobrinho|My nephew is learning English.|ˈnef.juː",
      "niece|sobrinha|My niece loves the outdoors.|niːs",
      "siblings|irmãos e irmãs|I have two siblings.|ˈsɪb.lɪŋz",
      "grandparents|avós|We visit our grandparents on Sundays.|ˈɡræn.peə.rənts",
    ],
  ],
  [
    "Relacionamentos",
    "🤝",
    [
      "trust|confiança|Trust takes time to build.|trʌst",
      "neighbour|vizinho|Our neighbour is very helpful.|ˈneɪ.bər",
      "friendship|amizade|Our friendship started at school.|ˈfrend.ʃɪp",
      "partner|parceiro ou parceira|My partner works from home.|ˈpɑːt.nər",
    ],
  ],
  [
    "Saúde cotidiana",
    "🩹",
    [
      "headache|dor de cabeça|I have a headache today.|ˈhed.eɪk",
      "appointment|consulta marcada|I have a medical appointment at ten.|əˈpɔɪnt.mənt",
      "sore throat|dor de garganta|Hot tea helps my sore throat.|ˌsɔː ˈθrəʊt",
      "pharmacy|farmácia|Is there a pharmacy nearby?|ˈfɑː.mə.si",
    ],
  ],
  [
    "Viagens",
    "🧳",
    [
      "luggage|bagagem|Your luggage is in the boot.|ˈlʌɡ.ɪdʒ",
      "boarding pass|cartão de embarque|Show your boarding pass at the gate.|ˈbɔː.dɪŋ pɑːs",
      "accommodation|hospedagem|We booked accommodation near the beach.|əˌkɒm.əˈdeɪ.ʃən",
      "itinerary|roteiro de viagem|Our itinerary includes three cities.|aɪˈtɪn.ər.ər.i",
    ],
  ],
  [
    "Tecnologia",
    "💻",
    [
      "keyboard|teclado|My keyboard is wireless.|ˈkiː.bɔːd",
      "charger|carregador|Can I borrow your phone charger?|ˈtʃɑː.dʒər",
      "password|senha|Choose a strong password.|ˈpɑːs.wɜːd",
      "update|atualização|The latest update fixed the problem.|ˈʌp.deɪt",
    ],
  ],
  [
    "Natureza",
    "🌿",
    [
      "trail|trilha|This trail leads to a waterfall.|treɪl",
      "waterfall|cachoeira|We swam near the waterfall.|ˈwɔː.tə.fɔːl",
      "sunrise|nascer do sol|We watched the sunrise together.|ˈsʌn.raɪz",
      "wildlife|vida selvagem|Please respect the local wildlife.|ˈwaɪld.laɪf",
    ],
  ],
  [
    "Sentimentos",
    "🌤️",
    [
      "proud|orgulhoso|I am proud of my progress.|praʊd",
      "relieved|aliviado|She felt relieved after the test.|rɪˈliːvd",
      "overwhelmed|sobrecarregado|I feel overwhelmed by all these tasks.|ˌəʊ.vəˈwelmd",
      "grateful|grato|I am grateful for your help.|ˈɡreɪt.fəl",
    ],
  ],
  [
    "Expressões idiomáticas",
    "💡",
    [
      "a piece of cake|muito fácil|The exercise was a piece of cake.|ə piːs əv keɪk",
      "break the ice|quebrar o gelo|A friendly question can break the ice.|breɪk ði aɪs",
      "under the weather|indisposto|I am feeling under the weather.|ˈʌn.də ðə ˈweð.ər",
      "once in a blue moon|muito raramente|We eat out once in a blue moon.|wʌns ɪn ə bluː muːn",
    ],
  ],
  [
    "Verbos mais comuns",
    "⚡",
    [
      "bring|trazer|Please bring your documents.|brɪŋ",
      "leave|sair ou deixar|We leave home at seven.|liːv",
      "keep|manter ou guardar|Keep your receipt.|kiːp",
      "choose|escolher|You can choose any lesson.|tʃuːz",
    ],
  ],
  [
    "Phrasal verbs",
    "🧩",
    [
      "pick up|buscar alguém|I will pick you up at the airport.|pɪk ʌp",
      "turn on|ligar um aparelho|Please turn on the light.|tɜːn ɒn",
      "find out|descobrir|I need to find out the price.|faɪnd aʊt",
      "give up|desistir|Do not give up on learning.|ɡɪv ʌp",
    ],
  ],
  [
    "Collocations",
    "🔗",
    [
      "make a decision|tomar uma decisão|We need to make a decision today.|meɪk ə dɪˈsɪʒ.ən",
      "take a break|fazer uma pausa|Let us take a break.|teɪk ə breɪk",
      "heavy traffic|trânsito intenso|There is heavy traffic downtown.|ˈhev.i ˈtræf.ɪk",
      "pay attention|prestar atenção|Please pay attention to the signs.|peɪ əˈten.ʃən",
    ],
  ],
  [
    "Expressões de conversação",
    "💬",
    [
      "by the way|a propósito|By the way, where are you from?|baɪ ðə weɪ",
      "I mean|quero dizer|It is near here. I mean, two blocks away.|aɪ miːn",
      "sounds good|parece bom|Dinner at seven? Sounds good.|saʊndz ɡʊd",
      "let me think|deixe-me pensar|Let me think about your question.|let mi θɪŋk",
    ],
  ],
  [
    "Vocabulário para argumentação",
    "⚖️",
    [
      "evidence|evidência|We need evidence to support the claim.|ˈev.ɪ.dəns",
      "drawback|desvantagem|The main drawback is the cost.|ˈdrɔː.bæk",
      "whereas|enquanto em contraste|I prefer buses, whereas she prefers trains.|weərˈæz",
      "in contrast|em contraste|The city is busy. In contrast, the village is quiet.|ɪn ˈkɒn.trɑːst",
    ],
  ],
];
export const words: Word[] = groups.flatMap(
  ([category, illustration, rows], g) =>
    rows.map((row, i) => {
      const [en, pt, example, pronunciation] = row.split("|");
      return {
        id: `word-${g}-${i}`,
        en,
        pt,
        example,
        pronunciation,
        category,
        illustration,
        part:
          g === 16 ? "adjetivo" : g >= 17 ? "expressão / verbo" : "substantivo",
      };
    }),
);
export const categories = groups.map(([name]) => name);
const images: Record<string, { symbol: string; alt: string }> = {
  shower: { symbol: "🚿", alt: "Água saindo de um chuveiro" },
  keyboard: { symbol: "⌨️", alt: "Teclas de um teclado de computador" },
  fork: { symbol: "🍴", alt: "Talheres com um garfo à esquerda" },
  beans: { symbol: "🫘", alt: "Grãos de feijão" },
  "traffic light": { symbol: "🚦", alt: "Sinal de trânsito com três luzes" },
  subway: { symbol: "🚇", alt: "Entrada de uma estação de metrô" },
};
export const vocabularyExercises: Exercise[] = words.map((w, i) => {
  const image = images[w.en];
  const auditory = !image && i % 3 === 0;
  const peers = words.filter((x) => x.category === w.category && x.id !== w.id);
  const options = image
    ? [w.en, ...peers.map((p) => p.en)]
    : [w.pt, ...peers.map((p) => p.pt)];
  const rotate = i % 4;
  return {
    id: `vocab-${w.id}`,
    topic: `vocabulary:${w.category}`,
    skill: auditory ? "listening" : "vocabulary",
    level: i > 67 ? "B1" : "A2",
    kind: "choice",
    prompt: image
      ? "Qual palavra corresponde ao objeto ilustrado?"
      : auditory
        ? "Ouça a palavra. Qual é seu significado?"
        : `Qual o significado de “${w.en}” neste contexto?`,
    sentence: image || auditory ? undefined : w.example,
    image,
    audio: auditory ? w.en : undefined,
    options: [...options.slice(rotate), ...options.slice(0, rotate)],
    answers: [image ? w.en : w.pt],
    explanation: `${w.en} significa “${w.pt}”. Exemplo: ${w.example}`,
    assessment: i % 4 === 3,
  };
});
