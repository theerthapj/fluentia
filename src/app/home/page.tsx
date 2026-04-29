"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AmbientBackground } from "@/components/home/AmbientBackground";
import { OnboardingBanner } from "@/components/onboarding/OnboardingBanner";
import { LevelBadge } from "@/components/assessment/LevelBadge";
import { Button } from "@/components/shared/Button";
import { GlassCard } from "@/components/shared/GlassCard";
import { useAppState } from "@/components/providers/AppStateProvider";

export default function HomePage() {
  const router = useRouter();
  const { state, resetDemo } = useAppState();
  return (
    <main className="mesh-gradient relative min-h-screen overflow-hidden px-5 py-10">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-4xl flex-col justify-center">
        {!state.assessmentCompleted ? <OnboardingBanner /> : null}
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
            <GlassCard className="p-7 sm:p-10">
              {state.level ? <LevelBadge level={state.level} /> : null}
              <h1 className="gradient-text mt-5 text-5xl font-bold leading-tight">Ready to Speak?</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-text-secondary">
                Practice real conversations with a supportive AI coach that helps you improve fluency, tone, confidence, and vocabulary.
              </p>
              <Button id="home-start-speaking" size="lg" className="mt-8 w-full sm:w-auto" onClick={() => router.push(state.assessmentCompleted ? "/mode" : "/assessment")}>
                Start Speaking
              </Button>
            </GlassCard>
          </motion.div>
          <motion.button
            id="home-reset-demo"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            onClick={() => {
              resetDemo();
              router.refresh();
            }}
            className="mx-auto mt-8 block rounded-full px-4 py-2 text-sm text-text-secondary hover:text-text-primary"
          >
            Reset Demo
          </motion.button>
        </motion.div>
      </div>
    </main>
  );
}
