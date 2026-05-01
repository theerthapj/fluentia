"use client";

import { motion } from "framer-motion";
import { RotateCcw, ArrowLeft, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuizQuestion, QuizType } from "@/lib/brainboost-data";
import { quizMeta } from "@/lib/brainboost-data";

interface ScoreCardProps {
  quizType: QuizType;
  questions: QuizQuestion[];
  answers: boolean[]; // true = correct
  onPlayAgain: () => void;
  onBackToHub: () => void;
}

function getStars(score: number, total: number): number {
  const pct = score / total;
  if (pct >= 6 / 7) return 3;
  if (pct >= 4 / 7) return 2;
  return 1;
}

function getCorrectAnswer(q: QuizQuestion): string {
  if (q.type === "odd-word") return q.words[q.oddIndex];
  if (q.type === "spelling") return q.options[q.correctIndex];
  return q.correct.join(" ");
}

const messages: Record<number, string> = {
  3: "Outstanding! You're a language superstar! 🌟",
  2: "Great job! Keep practising and you'll get there! 💪",
  1: "Good effort! Every question teaches you something new! 📖",
};

export function ScoreCard({ quizType, questions, answers, onPlayAgain, onBackToHub }: ScoreCardProps) {
  const score = answers.filter(Boolean).length;
  const stars = getStars(score, questions.length);
  const meta = quizMeta[quizType];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 p-6 text-center">
        <p className="text-4xl">{meta.emoji}</p>
        <h2 className="mt-2 text-2xl font-bold">{meta.title}</h2>
        <p className="mt-1 text-text-secondary">Quiz Complete!</p>

        {/* Stars */}
        <div className="mt-4 flex justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <motion.div
              key={s}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: s <= stars ? 1 : 0.6, rotate: 0 }}
              transition={{ delay: s * 0.15, type: "spring", stiffness: 260 }}
            >
              <Star
                className={cn("h-10 w-10", s <= stars ? "fill-warning text-warning" : "fill-border text-border")}
                aria-hidden
              />
            </motion.div>
          ))}
        </div>

        {/* Score */}
        <motion.p
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-5xl font-bold text-text-primary"
        >
          {score} <span className="text-2xl text-text-secondary">/ {questions.length}</span>
        </motion.p>
        <p className="mt-2 font-semibold text-text-secondary">{messages[stars]}</p>
      </div>

      {/* Question Review */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-text-secondary">Review</h3>
        {questions.map((q, idx) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + idx * 0.07 }}
            className={cn(
              "rounded-2xl border p-4",
              answers[idx] ? "border-success/30 bg-success/8" : "border-error/30 bg-error/8",
            )}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-xl">{answers[idx] ? "✅" : "❌"}</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                  Q{idx + 1} · {q.type === "odd-word" ? "Odd Word" : q.type === "spelling" ? "Spelling" : "Idiom"}
                </p>
                <p className="mt-1 font-semibold text-text-primary">
                  Correct answer:{" "}
                  <span className="text-accent-primary">{getCorrectAnswer(q)}</span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">{q.explanation}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pb-8">
        <button
          onClick={onBackToHub}
          className="flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-text-secondary transition hover:border-accent-primary/50 hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All Quizzes
        </button>
        <button
          onClick={onPlayAgain}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent-primary px-5 py-3 text-sm font-bold text-bg-primary transition hover:bg-teal-300"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Play Again
        </button>
      </div>
    </motion.div>
  );
}
