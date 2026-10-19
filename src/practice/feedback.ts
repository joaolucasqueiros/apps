export interface WritingIssue {
  id: string;
  excerpt: string;
  suggestion: string;
  explanation: string;
  lesson: string;
}
type Rule = {
  id: string;
  pattern: RegExp;
  replacement: string | ((match: string) => string);
  explanation: string;
  lesson: string;
};
const base: Record<string, string> = {
  went: "go",
  saw: "see",
  ate: "eat",
  bought: "buy",
  made: "make",
  took: "take",
  had: "have",
  came: "come",
  drove: "drive",
  wrote: "write",
  spoke: "speak",
};
const rules: Rule[] = [
  {
    id: "i-is",
    pattern: /\bI is\b/gi,
    replacement: "I am",
    explanation: "Com I, a forma de be é am.",
    lesson: "to-be",
  },
  {
    id: "plural-be",
    pattern: /\b(you|we|they) is\b/gi,
    replacement: (m) => m.replace(/is$/i, "are"),
    explanation: "You, we e they usam are.",
    lesson: "to-be",
  },
  {
    id: "third-dont",
    pattern: /\b(he|she|it) (don't|do not)\b/gi,
    replacement: (m) => m.replace(/don't|do not/i, "does not"),
    explanation: "Na terceira pessoa singular, use does not + verbo base.",
    lesson: "negatives",
  },
  {
    id: "did-base",
    pattern:
      /\b(did|didn't|did not)\s+(went|saw|ate|bought|made|took|had|came|drove|wrote|spoke)\b/gi,
    replacement: (m) => m.replace(/\w+$/, (v) => base[v.toLowerCase()] || v),
    explanation: "Did já indica passado. O verbo seguinte fica na forma base.",
    lesson: "simple-past",
  },
  {
    id: "modal-to",
    pattern: /\b(can|could|must|should|will|would)\s+to\s+[a-z]+\b/gi,
    replacement: (m) => m.replace(/\s+to\s+/i, " "),
    explanation: "Depois desses modais, use o verbo base sem to.",
    lesson: "modals",
  },
  {
    id: "agree",
    pattern: /\bI am agree\b/gi,
    replacement: "I agree",
    explanation: "Agree é verbo: não precisa de am nesta afirmativa.",
    lesson: "simple-present",
  },
  {
    id: "discuss",
    pattern: /\bdiscuss about\b/gi,
    replacement: "discuss",
    explanation: "Discuss recebe o assunto diretamente: discuss the problem.",
    lesson: "register",
  },
  {
    id: "uncountable",
    pattern: /\b(informations|advices|furnitures|equipments)\b/gi,
    replacement: (m) => m.slice(0, -1),
    explanation:
      "Neste uso, o substantivo é incontável. Para unidades, use a piece of information/advice etc.",
    lesson: "quantifiers",
  },
  {
    id: "decision",
    pattern: /\b(do|did|doing) a decision\b/gi,
    replacement: (m) =>
      m.replace(
        /^\w+/,
        (v) =>
          ({ do: "make", did: "made", doing: "making" })[v.toLowerCase()] || v,
      ),
    explanation: "A combinação usual é make a decision.",
    lesson: "collocations",
  },
  {
    id: "forward",
    pattern: /\blook forward to hear\b/gi,
    replacement: "look forward to hearing",
    explanation: "To é preposição em look forward to, então pede gerúndio.",
    lesson: "register",
  },
  {
    id: "there-plural",
    pattern: /\bthere is (two|three|four|five|many|several)\b/gi,
    replacement: (m) => m.replace(/\bis\b/i, "are"),
    explanation: "Uma quantidade plural pede there are.",
    lesson: "describing-home",
  },
  {
    id: "more-better",
    pattern: /\bmore better\b/gi,
    replacement: "better",
    explanation: "Better já é a forma comparativa de good.",
    lesson: "comparatives",
  },
  {
    id: "depend",
    pattern: /\bdepends? of\b/gi,
    replacement: (m) => m.replace(/\bof$/i, "on"),
    explanation: "A combinação usual é depend on.",
    lesson: "prepositions",
  },
  {
    id: "age",
    pattern: /\bI have (\d+|twenty|thirty|forty|fifty) years old\b/gi,
    replacement: (m) => m.replace(/^I have/i, "I am"),
    explanation: "Idade é expressa com be: I am … years old.",
    lesson: "introductions",
  },
  {
    id: "want",
    pattern: /\bI want (learn|improve|study|make|go|speak|visit|buy)\b/gi,
    replacement: (m) => m.replace(/\bwant\b/i, "want to"),
    explanation: "Use want to + verbo.",
    lesson: "gerund-infinitive",
  },
];
export function analyseWriting(text: string) {
  const issues: WritingIssue[] = [];
  for (const rule of rules) {
    for (const match of text.matchAll(
      new RegExp(rule.pattern.source, rule.pattern.flags),
    )) {
      if (issues.length >= 30) break;
      const excerpt = match[0];
      issues.push({
        id: rule.id + "-" + match.index,
        excerpt,
        suggestion:
          typeof rule.replacement === "string"
            ? rule.replacement
            : rule.replacement(excerpt),
        explanation: rule.explanation,
        lesson: rule.lesson,
      });
    }
  }
  const words = text.match(/[a-z]+(?:['’-][a-z]+)*/gi) || [];
  return {
    issues,
    words: words.length,
    sentences: text.trim()
      ? text.split(/[.!?]+/).filter((s) => /[a-z]/i.test(s)).length
      : 0,
  };
}
