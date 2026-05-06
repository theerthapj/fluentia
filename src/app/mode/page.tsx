"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Briefcase, Coffee, Brain, Type, MessageCircle } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { GlassCard } from "@/components/shared/GlassCard";
import type { Mode } from "@/types";

const practiceOptions = [
  { id: "formal", title: "Formal", description: "Interviews, presentations, client calls, workplace meetings", Icon: Briefcase },
  { id: "casual", title: "Casual", description: "Friends, travel, shopping, everyday conversations", Icon: Coffee },
];

export default function ModePage() {
  const router = useRouter();
  const { state, hydrated, setConversationKind, setMode } = useAppState();

  useEffect(() => {
    if (hydrated && !state.assessmentCompleted) router.replace("/assessment");
  }, [hydrated, router, state.assessmentCompleted]);

  if (!hydrated) return null;

  const choose = (id: string) => {
    setMode(id as Mode);
    setConversationKind("scenario");
    router.push("/scenarios");
  };

  return (
    <main className="mesh-gradient min-h-screen px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <Breadcrumb current="Choose Mode" />
        <h1 className="gradient-text text-4xl font-bold">Choose Your Practice Mode</h1>
        <p className="mt-3 text-text-secondary">Match your coaching tone to the real-world situation.</p>
        <div className="mt-4 rounded-2xl border border-border bg-surface/40 p-4 text-sm text-text-secondary">
          Your current level is <strong className="text-text-primary">{state.level ?? "beginner"}</strong>, so you will see 10 scenarios for each selected mode.
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {practiceOptions.map(({ id, title, description, Icon }) => (
            <GlassCard key={id} hover className="p-6">
              <motion.button id={`mode-${id}`} onClick={() => choose(id)} className="block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-accent-primary">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary text-bg-primary">
                  <Icon aria-hidden="true" className="h-7 w-7" />
                </span>
                <h2 className="mt-6 text-2xl font-semibold">{title}</h2>
                <p className="mt-3 text-text-secondary">{description}</p>
              </motion.button>
            </GlassCard>
          ))}
        </div>
      </div>
    </main>
  );
}
