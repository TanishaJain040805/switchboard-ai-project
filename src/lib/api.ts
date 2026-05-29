import type { ModelId } from "@/lib/router";

const MODEL_MAP: Record<ModelId, string> = {
  claude: "anthropic/claude-sonnet-4-5",
  "gpt-4o": "openai/gpt-4o",
  gemini: "google/gemini-pro-1.5",
  grok: "x-ai/grok-beta",
};

export async function callOpenRouter(prompt: string, model: ModelId): Promise<string> {
  const apiKey = localStorage.getItem("openrouter_api_key");
  if (!apiKey) {
    throw new Error("OpenRouter API key not set. Click the gear icon ⚙ to add your key.");
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL_MAP[model],
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenRouter error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}
