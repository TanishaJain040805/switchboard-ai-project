import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, GraduationCap, Sparkles } from "lucide-react";
import { SwitchboardLogo } from "@/components/SwitchboardLogo";
import { ModelCard, MODELS, type ModelMeta } from "@/components/ModelCard";
import { routePrompt, type ModelId } from "@/lib/router";
import { curate } from "@/lib/curate";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Switchboard - Chat" },
      { name: "description", content: "Run one prompt across Claude, GPT-4o, Gemini, and Grok side by side." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const [selected, setSelected] = useState<Record<ModelId, boolean>>({
    claude: true,
    "gpt-4o": true,
    gemini: true,
    grok: true,
  });
  const [prompt, setPrompt] = useState("");
  const [debounced, setDebounced] = useState("");
  const [loading, setLoading] = useState<Record<ModelId, boolean>>({
    claude: false, "gpt-4o": false, gemini: false, grok: false,
  });
  const [responses, setResponses] = useState<Record<ModelId, string>>({
    claude: "", "gpt-4o": "", gemini: "", grok: "",
  });

  // Debounce prompt for suggestion banner
  useEffect(() => {
    const t = setTimeout(() => setDebounced(prompt), 300);
    return () => clearTimeout(t);
  }, [prompt]);

  const suggestion = useMemo(() => routePrompt(debounced), [debounced]);

  const toggle = (id: ModelId) => setSelected((s) => ({ ...s, [id]: !s[id] }));

  const useSuggested = () => {
    if (suggestion.isDefault) return;
    const next: Record<ModelId, boolean> = { claude: false, "gpt-4o": false, gemini: false, grok: false };
    suggestion.models.forEach((m) => { next[m] = true; });
    setSelected(next);
  };

  const send = () => {
    if (!prompt.trim()) return;
    const active = MODELS.filter((m) => selected[m.id]);
    if (active.length === 0) return;

    const loadState = { ...loading };
    active.forEach((m) => { loadState[m.id] = true; });
    setLoading(loadState);

    const fresh = { ...responses };
    active.forEach((m) => { fresh[m.id] = ""; });
    setResponses(fresh);

    // Simulated responses (no backend wired). Curated before display.
    active.forEach((m) => {
      const delay = 600 + Math.random() * 1200;
      setTimeout(() => {
        const raw = mockResponse(m, prompt);
        setResponses((r) => ({ ...r, [m.id]: curate(raw) }));
        setLoading((l) => ({ ...l, [m.id]: false }));
      }, delay);
    });
  };

  return (
    <div className="min-h-screen bg-app text-foreground flex flex-col">
      {/* Navbar */}
      <header className="px-5 sm:px-8 py-4 flex items-center justify-between">
        <Link to="/"><SwitchboardLogo /></Link>
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border border-border/70 bg-card">
          <GraduationCap className="size-3.5 text-cyan" style={{ color: "#06B6D4" }} />
          Student Mode
        </div>
      </header>

      <div className="divider-gradient mx-5 sm:mx-8" />

      {/* Model chips */}
      <div className="px-5 sm:px-8 py-4 flex flex-wrap gap-2">
        {MODELS.map((m) => (
          <ModelChip key={m.id} model={m} active={selected[m.id]} onClick={() => toggle(m.id)} />
        ))}
      </div>

      {/* Cards grid */}
      <main className="flex-1 px-5 sm:px-8 pb-44">
        <div className="grid gap-4 md:grid-cols-2">
          {MODELS.filter((m) => selected[m.id]).map((m) => (
            <ModelCard key={m.id} model={m} loading={loading[m.id]} response={responses[m.id]} />
          ))}
        </div>
        {MODELS.every((m) => !selected[m.id]) && (
          <p className="text-center text-sm text-muted-foreground mt-16">Select at least one model to begin.</p>
        )}
      </main>

      {/* Sticky prompt bar */}
      <div className="fixed bottom-0 inset-x-0 z-20 bg-app/90 backdrop-blur border-t border-border/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={suggestion.text}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="mb-2 flex justify-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs border border-primary/50 bg-primary/10 text-foreground/90">
                <Sparkles className="size-3.5" style={{ color: "#7C3AED" }} />
                <span>{suggestion.text}</span>
                {!suggestion.isDefault && (
                  <button
                    onClick={useSuggested}
                    className="ml-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white"
                    style={{ background: "linear-gradient(90deg, #7C3AED, #06B6D4)" }}
                  >
                    Use Suggested
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-end gap-2 rounded-2xl bg-card border border-border/70 p-2 focus-within:glow-purple transition">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
              }}
              rows={1}
              placeholder="Ask anything — internships, code, essays, design..."
              className="flex-1 resize-none bg-transparent outline-none px-3 py-2 text-sm placeholder:text-muted-foreground max-h-40"
            />
            <button
              onClick={send}
              disabled={!prompt.trim()}
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40 glow-purple transition hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #7C3AED, #5b21b6)" }}
            >
              <Send className="size-4" /> Send
            </button>
          </div>
        </div>
      </div>

      {/* OpenRouter badge */}
      <div className="fixed bottom-3 left-3 z-30 hidden sm:block">
        <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] border border-border/70 bg-card/80 backdrop-blur text-muted-foreground">
          ⚡ Powered by OpenRouter
        </div>
      </div>
    </div>
  );
}

function ModelChip({ model, active, onClick }: { model: ModelMeta; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium border transition ${
        active ? "border-transparent text-white" : "border-border/70 text-muted-foreground hover:text-foreground"
      }`}
      style={active ? { backgroundColor: model.color + "26", boxShadow: `inset 0 0 0 1px ${model.color}80` } : undefined}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: model.color }} />
      {model.name}
    </button>
  );
}

function mockResponse(m: ModelMeta, prompt: string): string {
  return `Certainly! Here's a ${m.name} take on: "${prompt.slice(0, 80)}"\n\n— Key idea one with solid reasoning.\n— Key idea two with a concrete example.\n— Key idea three you can use right away.\n\nI hope this helps!`;
}
