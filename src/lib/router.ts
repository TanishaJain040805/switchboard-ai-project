export type ModelId = "mistral" | "groq" | "gemini" | "deepseek";

export interface Suggestion {
  text: string;
  models: ModelId[];
  isDefault?: boolean;
}

export function routePrompt(prompt: string): Suggestion {
  const p = prompt.toLowerCase();

  if (/(project|internship|placement|interview)/.test(p)) {
    return {
      text: "Suggested: Mistral + Groq - best for project work",
      models: ["mistral", "groq"],
    };
  }
  if (/(code|debug|error|bug|stack trace|exception)/.test(p)) {
    return { text: "Suggested: Mistral - best for code & debugging", models: ["mistral"] };
  }
  if (/(essay|write|report|resume|cover letter|professional)/.test(p)) {
    return { text: "Suggested: Groq - best for writing & professional docs", models: ["groq"] };
  }
  if (/(search|latest|news|2024|2025|today|trending)/.test(p)) {
    return { text: "Suggested: DeepSeek - best for real-time info", models: ["deepseek"] };
  }
  if (/(image|design|visual|figma|ui|ux|diagram)/.test(p)) {
    return { text: "Suggested: Gemini - best for visual/design tasks", models: ["gemini"] };
  }

  return {
    text: "Running on all selected models",
    models: ["mistral", "groq", "gemini", "deepseek"],
    isDefault: true,
  };
}
