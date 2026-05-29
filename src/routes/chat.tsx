import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, GraduationCap, Sparkles, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { SwitchboardLogo } from "@/components/SwitchboardLogo";
import { ModelCard, MODELS, type ModelMeta } from "@/components/ModelCard";
import { routePrompt, type ModelId } from "@/lib/router";
import { curate } from "@/lib/curate";
import { callModel } from "@/lib/api";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Switchboard - Chat" },
      { name: "description", content: "Run one prompt across Mistral, Groq, Gemini, and DeepSeek side by side." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const [selected, setSelected] = useState<Record<ModelId, boolean>>({
    mistral: true,
    groq: true,
    gemini: true,
    deepseek: true,
  });
  const [prompt, setPrompt] = useState("");
  const [debounced, setDebounced] = useState("");
  const [loading, setLoading] = useState<Record<ModelId, boolean>>({
    mistral: false, groq: false, gemini: false, deepseek: false,
  });
  const [responses, setResponses] = useState<Record<ModelId, string>>({
    mistral: "", groq: "", gemini: "", deepseek: "",
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
    const next: Record<ModelId, boolean> = { mistral: false, groq: false, gemini: false, deepseek: false };
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

    active.forEach((m) => {
      callModel(prompt, m.id)
        .then((text) => {
          setResponses((r) => ({ ...r, [m.id]: curate(text) }));
        })
        .catch((err) => {
          setResponses((r) => ({ ...r, [m.id]: `Error: ${err.message}` }));
        })
        .finally(() => {
          setLoading((l) => ({ ...l, [m.id]: false }));
        });
    });
  };

  return (
    <div className="min-h-screen bg-app text-foreground flex flex-col">
      {/* Navbar */}
      <header className="px-5 sm:px-8 py-4 flex items-center justify-between">
        <Link to="/"><SwitchboardLogo /></Link>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border border-border/70 bg-card">
            <GraduationCap className="size-3.5 text-cyan" style={{ color: "#06B6D4" }} />
            Student Mode
          </div>
        </div>
      </header>

      <div className="divider-gradient mx-5 sm:mx-8" />

      {/* Model chips */}
      <div className="px-5 sm:px-8 py-4 flex flex-wrap gap-2">
        {MODELS.map((m) => (
          <ModelChip key={m.id} model={m} active={selected[m.id]} onClick={() => toggle(m.id)} />
        ))}
      </div>

      {/* Tool buttons */}
      <div className="px-5 sm:px-8 pb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground mr-1">Send to Tools →</span>
        {TOOLS.map((tool) => (
          <button
            key={tool.name}
            onClick={() => {
              navigator.clipboard.writeText(prompt);
              window.open(tool.url, "_blank");
              toast(`Prompt copied! Paste it in ${tool.name}`);
            }}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border border-border/70 hover:border-foreground/30 transition"
            style={{ color: tool.color, borderColor: tool.color + "40" }}
          >
            <ExternalLink className="size-3" />
            {tool.name}
          </button>
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

const TOOLS = [
  { name: "Figma AI", url: "https://www.figma.com/ai", color: "#A855F7" },
  { name: "Canva AI", url: "https://www.canva.com/ai-image-generator", color: "#06B6D4" },
  { name: "Notion AI", url: "https://www.notion.so/product/ai", color: "#FFFFFF" },
  { name: "Lovable AI", url: "https://lovable.dev", color: "#EC4899" },
];
