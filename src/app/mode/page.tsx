"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppState } from "@/components/providers/AppStateProvider";
import { GlassCard } from "@/components/shared/GlassCard";
import { modeCards } from "@/lib/constants";
import type { Mode } from "@/types";

export default function ModePage() {
  const router = useRouter();
  const { state, hydrated, setMode } = useAppState();
  useEffect(() => {
    if (hydrated && !state.assessmentCompleted) router.replace("/assessment");
  }, [hydrated, router, state.assessmentCompleted]);

  const choose = (mode: Mode) => {
    setMode(mode);
    router.push("/scenarios");
  };

  return (
    <main className="mesh-gradient min-h-screen px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="gradient-text text-4xl font-bold">Choose Your Practice Mode</h1>
        <p className="mt-3 text-text-secondary">Match your coaching tone to the real-world situation.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {modeCards.map(({ id, title, examples, Icon }) => (
            <GlassCard key={id} hover className="p-6">
              <motion.button id={`mode-${id}`} onClick={() => choose(id)} className="block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-accent-primary">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary text-bg-primary">
                  <Icon aria-hidden className="h-7 w-7" />
                </span>
                <h2 className="mt-6 text-3xl font-semibold">{title}</h2>
                <p className="mt-3 text-text-secondary">{examples}</p>
              </motion.button>
            </GlassCard>
          ))}
        </div>
      </div>
    </main>
  );
}
