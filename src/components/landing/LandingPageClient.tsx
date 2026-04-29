"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart3, Brain, CheckCircle2, MessageCircle, Mic, ShieldCheck, Sparkles, Target } from "lucide-react";
import { AmbientBackground } from "@/components/home/AmbientBackground";
import { Button } from "@/components/shared/Button";
import { GlassCard } from "@/components/shared/GlassCard";
import { useAppState } from "@/components/providers/AppStateProvider";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export function LandingPageClient() {
  const { state } = useAppState();
  const startHref = state.assessmentCompleted ? "/dashboard" : "/assessment";

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
          <motion.h1 variants={fadeUp} className="gradient-text mt-6 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">
            Speak English with Real Confidence
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
            Fluentia is an AI speaking coach that listens, corrects, and guides you - one real conversation at a time.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link id="landing-start-practicing" href={startHref}>
              <Button id="landing-start-practicing-button" size="lg">Start Practicing Free</Button>
            </Link>
            <a
              id="landing-see-how"
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-border px-6 py-4 font-semibold text-text-primary transition hover:border-accent-primary"
            >
              See How It Works
            </a>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap justify-center gap-3">
            {["8 Real Scenarios", "Instant AI Feedback", "Voice + Text Support"].map((item) => (
              <span key={item} className="rounded-full border border-border bg-surface/70 px-4 py-2 text-sm text-text-secondary">
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-surface px-5 py-20">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }} className="mx-auto max-w-6xl">
          <motion.h2 variants={fadeUp} className="max-w-3xl text-3xl font-bold sm:text-4xl">You studied English for years. But you still freeze when it&apos;s time to speak.</motion.h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ["Grammar apps taught rules.", "Nobody taught you how to sound confident."],
              ["You understand everything.", "Speaking is where you go blank."],
              ["Language apps gave you streaks.", "They never gave you a real conversation."],
            ].map(([title, copy], index) => (
              <motion.div variants={fadeUp} key={title}>
                <GlassCard className="h-full p-6">
                  <div className="text-3xl">{["😰", "🔇", "📖"][index]}</div>
                  <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                  <p className="mt-3 leading-7 text-text-secondary">{copy}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="how-it-works" className="px-5 py-20">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }} className="mx-auto max-w-6xl">
          <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">How It Works</motion.h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              [Target, "Tell us your level", "Take the quick assessment so Fluentia can personalize your practice."],
              [MessageCircle, "Pick a real scenario", "Choose job interviews, ordering food, meeting friends, and more."],
              [Sparkles, "Practice, get coached, improve", "Get helpful feedback on fluency, tone, grammar, and vocabulary."],
            ].map(([Icon, title, copy], index) => {
              const StepIcon = Icon as typeof Target;
              return (
                <motion.div variants={fadeUp} key={title as string} className="rounded-2xl border border-border bg-surface/50 p-6">
                  <span className="inline-flex rounded-full bg-accent-primary/15 px-3 py-1 text-sm font-bold text-accent-primary">Step {index + 1}</span>
                  <StepIcon aria-hidden className="mt-6 h-8 w-8 text-accent-primary" />
                  <h3 className="mt-5 text-xl font-semibold">{title as string}</h3>
                  <p className="mt-3 leading-7 text-text-secondary">{copy as string}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      <section className="bg-bg-secondary px-5 py-20">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }} className="mx-auto max-w-6xl">
          <motion.h2 variants={fadeUp} className="text-3xl font-bold sm:text-4xl">Built for Confident Practice</motion.h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[
              [Mic, "Voice + Text Input", "Speak or type. Both modes keep the practice moving."],
              [Brain, "Turn-by-turn AI Coaching", "Instant tips after each message help you improve in context."],
              [BarChart3, "Your Progress Dashboard", "Track fluency, scenarios, and recent feedback over time."],
              [ShieldCheck, "Safe for All Ages", "Content moderation keeps practice respectful and focused."],
            ].map(([Icon, title, copy]) => {
              const FeatureIcon = Icon as typeof Mic;
              return (
                <motion.div variants={fadeUp} key={title as string}>
                  <GlassCard className="h-full p-6">
                    <FeatureIcon aria-hidden className="h-8 w-8 text-accent-primary" />
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
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-r from-accent-primary to-accent-secondary p-8 text-bg-primary sm:p-12">
          <CheckCircle2 aria-hidden className="h-9 w-9" />
          <h2 className="mt-5 max-w-3xl text-3xl font-bold sm:text-4xl">Ready to stop hesitating and start speaking?</h2>
          <Link id="landing-final-cta" href="/assessment" className="mt-7 inline-flex rounded-full bg-bg-primary px-6 py-4 font-semibold text-text-primary transition hover:bg-surface">
            Start for Free
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
