export type ModelId = "claude" | "gpt-4o" | "gemini" | "grok";

export interface Suggestion {
  text: string;
  models: ModelId[];
  isDefault?: boolean;
}

export function routePrompt(prompt: string): Suggestion {
  const p = prompt.toLowerCase();

  if (/(project|internship|placement|interview)/.test(p)) {
    return {
      text: "Suggested: Claude + GPT-4o - best for project work",
      models: ["claude", "gpt-4o"],
    };
  }
  if (/(code|debug|error|bug|stack trace|exception)/.test(p)) {
    return { text: "Suggested: Claude - best for code & debugging", models: ["claude"] };
  }
  if (/(essay|write|report|resume|cover letter|professional)/.test(p)) {
    return { text: "Suggested: GPT-4o - best for writing & professional docs", models: ["gpt-4o"] };
  }
  if (/(search|latest|news|2024|2025|today|trending)/.test(p)) {
    return { text: "Suggested: Grok - best for real-time info", models: ["grok"] };
  }
  if (/(image|design|visual|figma|ui|ux|diagram)/.test(p)) {
    return { text: "Suggested: Gemini - best for visual/design tasks", models: ["gemini"] };
  }

  return {
    text: "Running on all selected models",
    models: ["claude", "gpt-4o", "gemini", "grok"],
    isDefault: true,
  };
}
