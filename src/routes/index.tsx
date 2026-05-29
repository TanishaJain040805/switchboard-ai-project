import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Columns, Wand2 } from "lucide-react";
import { SwitchboardLogo } from "@/components/SwitchboardLogo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Switchboard - One prompt. Every AI." },
      { name: "description", content: "Built for students and engineers. Get internship-ready outputs without switching between 10 tabs." },
      { property: "og:title", content: "Switchboard - One prompt. Every AI." },
      { property: "og:description", content: "Built for students and engineers. Internship-ready AI outputs, no tab-switching." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Sparkles, title: "Smart AI Routing", body: "We pick the best AI for your task automatically." },
  { icon: Columns, title: "Side-by-Side Compare", body: "See all responses at once, pick the best." },
  { icon: Wand2, title: "Clean Outputs", body: "No AI slop. Responses are silently curated before you see them." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-app text-foreground relative overflow-hidden">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[600px] rounded-full" style={{ background: "radial-gradient(closest-side, rgba(124,58,237,0.25), transparent)" }} />
        <div className="absolute top-1/3 right-0 size-[500px] rounded-full" style={{ background: "radial-gradient(closest-side, rgba(6,182,212,0.18), transparent)" }} />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <SwitchboardLogo />
        <Link to="/chat" className="text-sm text-muted-foreground hover:text-foreground transition">Open App</Link>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]"
        >
          <span className="text-gradient">One prompt. Every AI.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Built for students and engineers. Get internship-ready outputs without switching between 10 tabs.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex justify-center"
        >
          <Link
            to="/chat"
            className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-medium text-white glow-purple transition hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #7C3AED, #5b21b6)" }}
          >
            Launch Switchboard
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <div className="mt-24 grid gap-5 md:grid-cols-3 text-left">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="rounded-2xl bg-card p-6 border border-border/60 hover:glow-purple transition"
            >
              <div className="size-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(6,182,212,0.15))" }}>
                <f.icon className="size-5 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 text-center text-xs text-muted-foreground pb-8">
        ⚡ Powered by OpenRouter
      </footer>
    </div>
  );
}
