"use client";

import Link from "next/link";
import { Brain } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { quizMeta } from "@/lib/brainboost-data";
import type { QuizType } from "@/lib/brainboost-data";

const quizTypes: QuizType[] = ["odd-word", "spelling", "fix-idiom"];

export default function BrainBoostPage() {
  return (
    <main className="mesh-gradient min-h-screen px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-primary/15">
            <Brain className="h-6 w-6 text-accent-primary" aria-hidden />
          </div>
          <span className="rounded-full border border-border bg-white/5 px-4 py-1.5 text-sm font-semibold text-accent-primary">
            New questions every day
          </span>
        </div>

        <h1 className="mt-5 text-4xl font-bold text-text-primary sm:text-5xl">
          BrainBoost <span className="gradient-text">Zone</span>
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-8 text-text-secondary">
          Three fun quiz types to sharpen your vocabulary, spelling, and phrase knowledge. Each session brings 7 fresh questions.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {quizTypes.map((type) => {
            const meta = quizMeta[type];
            return (
              <Link key={type} href={`/brain-boost/quiz?type=${type}`}>
                <GlassCard hover className="group h-full cursor-pointer p-6 transition-all duration-300">
                  <div className="text-4xl">{meta.emoji}</div>
                  <h2 className="mt-4 text-xl font-bold text-text-primary transition-colors group-hover:text-accent-primary">
                    {meta.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{meta.description}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-accent-primary/15 px-3 py-1 text-xs font-bold text-accent-primary">
                      7 Questions
                    </span>
                    <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-text-secondary">
                      Easy to Hard
                    </span>
                  </div>
                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-accent-primary transition-all duration-200 group-hover:gap-3">
                    Start Quiz
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">-&gt;</span>
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-3 gap-4 rounded-2xl border border-border bg-surface/40 p-5">
          {[
            { label: "Quiz Types", value: "3" },
            { label: "Questions Per Session", value: "7" },
            { label: "Total Question Pool", value: "63" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-accent-primary">{value}</p>
              <p className="mt-1 text-xs text-text-secondary">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-accent-primary/20 bg-accent-primary/5 p-5">
          <p className="text-sm font-semibold text-accent-primary">How it works</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text-secondary">
            <li>Questions rotate daily, so returning learners get a fresh set.</li>
            <li>Difficulty increases from question 1 to question 7.</li>
            <li>The final score screen explains every answer.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
