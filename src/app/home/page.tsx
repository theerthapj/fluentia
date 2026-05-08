"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AmbientBackground } from "@/components/home/AmbientBackground";
import { OnboardingBanner } from "@/components/onboarding/OnboardingBanner";
import { LevelBadge } from "@/components/assessment/LevelBadge";
import { Button } from "@/components/shared/Button";
import { GlassCard } from "@/components/shared/GlassCard";
import { useAppState } from "@/components/providers/AppStateProvider";

function HomeSkeleton() {
  return (
    <main className="mesh-gradient min-h-screen px-5 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-4xl flex-col justify-center">
        <GlassCard className="p-7 sm:p-10">
          <div className="h-12 w-2/3 rounded-2xl bg-white/10" />
          <div className="mt-6 h-4 w-full rounded-full bg-white/10" />
          <div className="mt-3 h-4 w-4/5 rounded-full bg-white/10" />
          <div className="mt-8 h-14 w-full rounded-full bg-accent-primary/20 sm:w-44" />
        </GlassCard>
      </div>
    </main>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { state, hydrated, resetDemo } = useAppState();

  if (!hydrated) return <HomeSkeleton />;

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
                Practice real conversations with a supportive AI coach that helps you improve fluency, tone, confidence, and vocabulary with formal, casual, Brain Boost, and free-chat tracks.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button id="home-start-speaking" size="lg" className="w-full sm:w-auto" onClick={() => router.push(state.assessmentCompleted ? "/mode" : "/assessment")}>
                  Start Speaking
                </Button>
                <Button id="home-open-free-chat" size="lg" variant="secondary" className="w-full sm:w-auto" onClick={() => router.push("/free-chat")}>
                  Free Chat
                </Button>
              </div>
            </GlassCard>
          </motion.div>
          <motion.button
            id="home-reset-demo"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            onClick={() => {
              resetDemo();
              toast.success("Demo data reset.");
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
