"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart3, Brain, CheckCircle2, MessageCircle, Mic, ShieldCheck, Sparkles, Target, Volume2 } from "lucide-react";
import { AmbientBackground } from "@/components/home/AmbientBackground";
import { Button } from "@/components/shared/Button";
import { GlassCard } from "@/components/shared/GlassCard";
import { useAppState } from "@/components/providers/AppStateProvider";
import { hasCompletedAssessment } from "@/lib/assessment-state";
import FluentiaTextCycle from "@/components/ui/animated-text-cycle";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export function LandingPageClient() {
  const { state, hydrated } = useAppState();
  const startHref = hydrated && hasCompletedAssessment(state) ? "/dashboard" : "/assessment";
  const startLabel = hydrated && hasCompletedAssessment(state) ? "Continue Learning" : "Start Practicing Free";

  return (
    <main className="bg-bg-primary text-text-primary">
      <section className="mesh-gradient relative min-h-screen overflow-hidden px-5 py-20">
        <AmbientBackground />
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="relative z-10 mx-auto flex min-h-[calc(100vh-160px)] max-w-5xl flex-col items-center justify-center text-center"
        >
          <motion.p variants={fadeUp} className="rounded-full border border-border bg-white/5 px-4 py-2 text-sm font-semibold text-accent-primary">
            AI English speaking practice for real life
          </motion.p>
          <motion.h1 variants={fadeUp} className="mt-6 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">
            Master your next <br />
            <FluentiaTextCycle
              words={["Job Interview", "Business Pitch", "Global Travel", "Daily Chat", "Team Presentation"]}
              interval={3500}
            />{" "}
            with confidence.
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
            Fluentia is an AI speaking coach that listens, coaches, and guides you through real conversations with stronger accessibility, safer feedback, and production-ready practice flows.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
            {hydrated ? (
              <Link id="landing-start-practicing" href={startHref}>
                <Button id="landing-start-practicing-button" size="lg">{startLabel}</Button>
              </Link>
            ) : (
              <Button id="landing-start-practicing-button" size="lg" disabled className="min-w-48 opacity-70">
                Preparing...
              </Button>
            )}
            <a
              id="landing-see-how"
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-border px-6 py-4 font-semibold text-text-primary transition hover:border-accent-primary"
            >
              See How It Works
            </a>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap justify-center gap-3">
            {["60 Structured Scenarios", "Personalized Dashboard", "Voice + Text Support"].map((item) => (
              <span key={item} className="rounded-full border border-border bg-surface/70 px-4 py-2 text-sm text-text-secondary">
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-surface px-5 py-20">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }} className="mx-auto max-w-6xl">
          <motion.h2 variants={fadeUp} className="max-w-3xl text-3xl font-bold sm:text-4xl">You studied English for years. But you still freeze when it is time to speak.</motion.h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ["Grammar apps taught rules.", "Nobody taught you how to sound confident."],
              ["You understand everything.", "Speaking is where you go blank."],
              ["Language apps gave you streaks.", "They never gave you a real conversation."],
            ].map(([title, copy]) => (
              <motion.div variants={fadeUp} key={title}>
                <GlassCard className="h-full p-6">
                  <h3 className="mt-2 text-xl font-semibold">{title}</h3>
                  <p className="mt-3 leading-7 text-text-secondary">{copy}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="how-it-works" className="px-5 py-20">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }} className="mx-auto max-w-6xl">
          <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">How It Works</motion.h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              [Target, "Tell us your level", "Take the quick assessment so Fluentia can personalize your practice."],
              [MessageCircle, "Pick a real scenario", "Choose from formal, casual, Brain Boost, or free chat practice."],
              [Sparkles, "Practice, get coached, improve", "Get supportive feedback on fluency, tone, grammar, and vocabulary."],
            ].map(([Icon, title, copy], index) => {
              const StepIcon = Icon as typeof Target;
              return (
                <motion.div variants={fadeUp} key={title as string} className="rounded-2xl border border-border bg-surface/50 p-6">
                  <span className="inline-flex rounded-full bg-accent-primary/15 px-3 py-1 text-sm font-bold text-accent-primary">Step {index + 1}</span>
                  <StepIcon aria-hidden="true" className="mt-6 h-8 w-8 text-accent-primary" />
                  <h3 className="mt-5 text-xl font-semibold">{title as string}</h3>
                  <p className="mt-3 leading-7 text-text-secondary">{copy as string}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      <section className="bg-bg-secondary px-5 py-20">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }} className="mx-auto max-w-6xl">
          <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">Built for Confident Practice</motion.h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[
              [Mic, "Voice + Text Input", "Speak or type. Both modes keep practice moving."],
              [Brain, "Turn-by-turn AI Coaching", "Hybrid live AI with safe fallback keeps feedback available."],
              [BarChart3, "Your Progress Dashboard", "Track fluency, scenarios, and recent feedback over time."],
              [ShieldCheck, "Respectful by Design", "Moderation and cooldown protection keep practice safe."],
              [Volume2, "Listening Controls", "Global read-aloud settings let you practice at your pace."],
              [MessageCircle, "Scenario Practice", "Rehearse realistic conversations that build confidence for work and daily life."],
            ].map(([Icon, title, copy]) => {
              const FeatureIcon = Icon as typeof Mic;
              return (
                <motion.div variants={fadeUp} key={title as string}>
                  <GlassCard className="h-full p-6">
                    <FeatureIcon aria-hidden="true" className="h-8 w-8 text-accent-primary" />
                    <h3 className="mt-5 text-xl font-semibold">{title as string}</h3>
                    <p className="mt-3 leading-7 text-text-secondary">{copy as string}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      <section className="px-5 py-20">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-r from-accent-primary to-accent-secondary p-8 text-bg-primary sm:p-12">
          <CheckCircle2 aria-hidden="true" className="h-9 w-9" />
          <h2 className="mt-5 max-w-3xl text-3xl font-bold sm:text-4xl">Ready to stop hesitating and start speaking?</h2>
          {hydrated ? (
            <Link id="landing-final-cta" href={startHref} className="mt-7 inline-flex rounded-full bg-bg-primary px-6 py-4 font-semibold text-text-primary transition hover:bg-surface">
              {startLabel}
            </Link>
          ) : (
            <span id="landing-final-cta" aria-disabled="true" className="mt-7 inline-flex rounded-full bg-bg-primary/80 px-6 py-4 font-semibold text-text-secondary">
              Preparing...
            </span>
          )}
        </motion.div>
      </section>
    </main>
  );
}
