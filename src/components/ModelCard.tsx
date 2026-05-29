import { Copy, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export interface ModelMeta {
  id: "mistral" | "groq" | "gemini" | "deepseek";
  name: string;
  color: string;
  glowClass: string;
  icon: string;
}

export const MODELS: ModelMeta[] = [
  { id: "mistral", name: "Mistral", color: "#F59E50", glowClass: "glow-mistral", icon: "✦" },
  { id: "groq", name: "Groq", color: "#34D399", glowClass: "glow-groq", icon: "◎" },
  { id: "gemini", name: "Gemini", color: "#60A5FA", glowClass: "glow-gemini", icon: "✧" },
  { id: "deepseek", name: "DeepSeek", color: "#F472B6", glowClass: "glow-deepseek", icon: "✕" },
];

interface Props {
  model: ModelMeta;
  loading: boolean;
  response: string;
}

export function ModelCard({ model, loading, response }: Props) {
  const [copied, setCopied] = useState(false);
  const wordCount = response ? response.trim().split(/\s+/).filter(Boolean).length : 0;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl bg-card overflow-hidden flex flex-col min-h-[260px] ${model.glowClass}`}
    >
      <div className="h-1.5 w-full" style={{ backgroundColor: model.color }} />
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none" style={{ color: model.color }}>{model.icon}</span>
          <span className="font-medium">{model.name}</span>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{model.id}</span>
      </div>

      <div className="flex-1 px-4 py-3 text-sm text-foreground/90">
        {loading ? (
          <div className="space-y-2">
            <div className="h-3 rounded shimmer w-[92%]" />
            <div className="h-3 rounded shimmer w-[80%]" />
            <div className="h-3 rounded shimmer w-[88%]" />
            <div className="h-3 rounded shimmer w-[65%]" />
          </div>
        ) : response ? (
          <p className="whitespace-pre-wrap leading-relaxed">{response}</p>
        ) : (
          <div className="space-y-2 pulse-soft">
            <div className="h-3 rounded shimmer w-[70%]" />
            <div className="h-3 rounded shimmer w-[55%]" />
            <div className="h-3 rounded shimmer w-[40%]" />
            <p className="text-xs text-muted-foreground pt-2">Awaiting your prompt…</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-border/60 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <button
            onClick={copy}
            disabled={!response}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-secondary/70 disabled:opacity-40 transition"
          >
            <Copy className="size-3.5" /> {copied ? "Copied" : "Copy"}
          </button>
          <button
            disabled={!response}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-secondary/70 disabled:opacity-40 transition"
          >
            <FileText className="size-3.5" /> Send to Notion
          </button>
        </div>
        <span>{wordCount} words</span>
      </div>
    </motion.div>
  );
}
