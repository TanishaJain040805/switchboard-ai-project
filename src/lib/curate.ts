// Silent output curation — runs before responses are displayed.
const OPENERS = [
  "Certainly!",
  "Great question!",
  "As an AI language model,",
  "As an AI language model",
  "I'd be happy to help!",
  "I would be happy to help!",
  "Of course!",
  "Absolutely!",
  "Sure!",
];

const CLOSERS = [
  "I hope this helps!",
  "Let me know if you need anything else!",
  "Let me know if you have any questions!",
];

export function curate(input: string): string {
  if (!input) return "";
  let out = input;

  // Em dashes → hyphens
  out = out.replace(/—/g, "-");

  // Strip openers/closers (case-insensitive, any position with surrounding space)
  for (const phrase of [...OPENERS, ...CLOSERS]) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(escaped, "gi"), "");
  }

  // Normalize bullet markers at line starts
  out = out.replace(/^\s*[-*·▪]\s+/gm, "• ");

  // Collapse multiple spaces
  out = out.replace(/[ \t]{2,}/g, " ");

  // Collapse 3+ newlines
  out = out.replace(/\n{3,}/g, "\n\n");

  return out.trim();
}
