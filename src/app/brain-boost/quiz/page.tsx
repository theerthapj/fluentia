"use client";

import Link from "next/link";
import { Suspense, useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Brain } from "lucide-react";
import { QuizCard } from "@/components/brainboost/QuizCard";
import { ScoreCard } from "@/components/brainboost/ScoreCard";
import { getDailyQuestions, quizMeta } from "@/lib/brainboost-data";
import type { QuizQuestion, QuizType } from "@/lib/brainboost-data";

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
  const [roundKey, setRoundKey] = useState(0);

  const meta = quizMeta[quizType];
  const score = answers.filter(Boolean).length;

  const handleAnswer = useCallback(
    (correct: boolean) => {
      setAnswers((previous) => {
        const next = [...previous, correct];
        if (next.length === questions.length) {
          window.setTimeout(() => setFinished(true), 300);
        } else {
          window.setTimeout(() => setCurrentIndex((index) => index + 1), 250);
        }
        return next;
      });
    },
    [questions.length],
  );

  const handlePlayAgain = () => {
    setAnswers([]);
    setCurrentIndex(0);
    setFinished(false);
    setRoundKey((key) => key + 1);
  };

  return (
    <main className="min-h-screen bg-bg-primary px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            href="/brain-boost"
            className="flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-text-primary"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back
          </Link>
          <div className="flex min-w-0 items-center gap-2">
            <Brain className="h-5 w-5 shrink-0 text-accent-primary" aria-hidden />
            <span className="gradient-text truncate font-bold">BrainBoost Zone</span>
          </div>
          {!finished ? (
            <span className="shrink-0 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-text-secondary">
              {score}/{answers.length}
            </span>
          ) : null}
        </div>

        <div className="mb-6 flex items-center gap-3">
          <span className="text-3xl">{meta.emoji}</span>
          <div>
            <h1 className="text-xl font-bold text-text-primary">{meta.title}</h1>
            <p className="text-sm text-text-secondary">{meta.description}</p>
          </div>
        </div>

        <div className="glass-card p-6" key={roundKey}>
          <AnimatePresence mode="wait">
            {!finished ? (
              <motion.div
                key={`q-${currentIndex}`}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.2 }}
              >
                <QuizCard question={questions[currentIndex]} questionNumber={currentIndex + 1} total={questions.length} onAnswer={handleAnswer} />
              </motion.div>
            ) : (
              <motion.div key="scorecard" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <ScoreCard
                  quizType={quizType}
                  questions={questions}
                  answers={answers}
                  onPlayAgain={handlePlayAgain}
                  onBackToHub={() => router.push("/brain-boost")}
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
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-bg-primary">
          <div className="text-center">
            <Brain className="mx-auto h-10 w-10 animate-pulse text-accent-primary" aria-hidden />
            <p className="mt-4 text-text-secondary">Loading quiz...</p>
          </div>
        </main>
      }
    >
      <QuizContent />
    </Suspense>
  );
}
