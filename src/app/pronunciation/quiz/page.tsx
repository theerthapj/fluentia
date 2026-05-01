"use client";

import { Suspense, useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Brain } from "lucide-react";
import Link from "next/link";
import { QuizCard } from "@/components/brainboost/QuizCard";
import { ScoreCard } from "@/components/brainboost/ScoreCard";
import { getDailyQuestions, quizMeta } from "@/lib/brainboost-data";
import type { QuizType, QuizQuestion } from "@/lib/brainboost-data";

const VALID_TYPES: QuizType[] = ["odd-word", "spelling", "fix-idiom"];

function QuizContent() {
  const router = useRouter();
  const params = useSearchParams();
  const rawType = params.get("type") as QuizType | null;
  const quizType: QuizType = rawType && VALID_TYPES.includes(rawType) ? rawType : "odd-word";

  const [questions] = useState<QuizQuestion[]>(() => getDailyQuestions(quizType));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const [key, setKey] = useState(0); // forces full remount on Play Again

  const meta = quizMeta[quizType];
  const score = answers.filter(Boolean).length;

  const handleAnswer = useCallback((correct: boolean) => {
    setAnswers((prev) => {
      const next = [...prev, correct];
      if (next.length === questions.length) {
        setTimeout(() => setFinished(true), 400);
      } else {
        setTimeout(() => setCurrentIndex((i) => i + 1), 300);
      }
      return next;
    });
  }, [questions.length]);

  const handlePlayAgain = () => {
    setAnswers([]);
    setCurrentIndex(0);
    setFinished(false);
    setKey((k) => k + 1);
  };

  const handleBackToHub = () => router.push("/pronunciation");

  return (
    <main className="min-h-screen bg-bg-primary px-4 py-8">
      <div className="mx-auto max-w-2xl">

        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/pronunciation"
            className="flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-text-primary"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent-primary" aria-hidden />
            <span className="gradient-text font-bold">BrainBoost Zone</span>
          </div>
          {!finished && (
            <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-text-secondary">
              {score}/{answers.length} ✓
            </span>
          )}
        </div>

        {/* Quiz type badge */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-3xl">{meta.emoji}</span>
          <div>
            <h1 className="text-xl font-bold text-text-primary">{meta.title}</h1>
            <p className="text-sm text-text-secondary">{meta.description}</p>
          </div>
        </div>

        {/* Card area */}
        <div className="glass-card p-6" key={key}>
          <AnimatePresence mode="wait">
            {!finished ? (
              <motion.div
                key={`q-${currentIndex}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <QuizCard
                  question={questions[currentIndex]}
                  questionNumber={currentIndex + 1}
                  total={questions.length}
                  onAnswer={handleAnswer}
                />
              </motion.div>
            ) : (
              <motion.div
                key="scorecard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ScoreCard
                  quizType={quizType}
                  questions={questions}
                  answers={answers}
                  onPlayAgain={handlePlayAgain}
                  onBackToHub={handleBackToHub}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </main>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <main className="grid min-h-screen place-items-center bg-bg-primary">
        <div className="text-center">
          <Brain className="mx-auto h-10 w-10 animate-pulse text-accent-primary" aria-hidden />
          <p className="mt-4 text-text-secondary">Loading quiz…</p>
        </div>
      </main>
    }>
      <QuizContent />
    </Suspense>
  );
}
