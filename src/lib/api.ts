import type { ModelId } from "@/lib/router";

async function callMistral(prompt: string): Promise<string> {
  const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer NgnTgjU8vUfwmCB7fUCmBhCovyMM30DM",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistral-small-latest",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Mistral error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

async function callGroq(prompt: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer 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",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Groq error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

async function callGemini(prompt: string): Promise<string> {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AQ.Ab8RN6I4vBykkdCW1wZL9K4tTW1hx5JM3lrcLB-osN21tRDO0Q",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    },
  );
  if (!res.ok) throw new Error(`Gemini error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

async function callGemma(prompt: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer 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",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gemma2-9b-it",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Gemma error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

export async function callModel(prompt: string, model: ModelId): Promise<string> {
  switch (model) {
    case "mistral":
      return callMistral(prompt);
    case "groq":
      return callGroq(prompt);
    case "gemini":
      return callGemini(prompt);
    case "deepseek":
      return callGemma(prompt);
  }
}
