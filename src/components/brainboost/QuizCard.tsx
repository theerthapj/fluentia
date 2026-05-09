"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuizQuestion, OddWordQuestion, SpellingQuestion, IdiomQuestion } from "@/lib/brainboost-data";
import { correctEmojis, wrongEmojis } from "@/lib/brainboost-data";
import { useFluvi } from "@/context/FluviContext";

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  total: number;
  onAnswer: (correct: boolean) => void;
}

interface FeedbackDetails {
  message?: string;
  correctPhrase?: string;
  explanation?: string;
  durationMs?: number;
}

type AnswerHandler = (correct: boolean, details?: FeedbackDetails) => void;

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Odd Word Sub-component ───────────────────────────────────────────────────
function OddWordCard({ question, onAnswer }: { question: OddWordQuestion; onAnswer: AnswerHandler }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (idx: number) => {
    if (revealed) return;
    const correct = idx === question.oddIndex;
    setSelected(idx);
    setRevealed(true);
    setTimeout(() => onAnswer(correct), 1400);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {question.words.map((word, idx) => {
        const isCorrect = idx === question.oddIndex;
        const isSelected = selected === idx;
        return (
          <motion.button
            key={idx}
            whileTap={{ scale: revealed ? 1 : 0.96 }}
            onClick={() => handleSelect(idx)}
            disabled={revealed}
            className={cn(
              "rounded-2xl border-2 px-4 py-5 text-center text-lg font-bold transition-all duration-300",
              !revealed && "border-border bg-surface/60 text-text-primary hover:border-accent-primary hover:bg-accent-primary/10 cursor-pointer",
              revealed && isCorrect && "border-success bg-success/15 text-success",
              revealed && isSelected && !isCorrect && "border-error bg-error/15 text-error",
              revealed && !isSelected && !isCorrect && "border-border bg-surface/30 text-text-secondary",
            )}
          >
            {word}
            {revealed && isCorrect && <CheckCircle2 className="mx-auto mt-1 h-4 w-4" aria-hidden />}
            {revealed && isSelected && !isCorrect && <XCircle className="mx-auto mt-1 h-4 w-4" aria-hidden />}
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Spelling Sub-component ───────────────────────────────────────────────────
function SpellingCard({ question, onAnswer }: { question: SpellingQuestion; onAnswer: AnswerHandler }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (idx: number) => {
    if (revealed) return;
    const correct = idx === question.correctIndex;
    setSelected(idx);
    setRevealed(true);
    setTimeout(() => onAnswer(correct), 1400);
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {question.options.map((option, idx) => {
        const isCorrect = idx === question.correctIndex;
        const isSelected = selected === idx;
        return (
          <motion.button
            key={idx}
            whileTap={{ scale: revealed ? 1 : 0.96 }}
            onClick={() => handleSelect(idx)}
            disabled={revealed}
            className={cn(
              "rounded-2xl border-2 px-5 py-4 text-center font-mono text-lg font-semibold tracking-wide transition-all duration-300",
              !revealed && "border-border bg-surface/60 text-text-primary hover:border-accent-secondary hover:bg-accent-secondary/10 cursor-pointer",
              revealed && isCorrect && "border-success bg-success/15 text-success",
              revealed && isSelected && !isCorrect && "border-error bg-error/15 text-error",
              revealed && !isSelected && !isCorrect && "border-border bg-surface/30 text-text-secondary",
            )}
          >
            {option}
            {revealed && isCorrect && <CheckCircle2 className="mx-auto mt-1 h-4 w-4" aria-hidden />}
            {revealed && isSelected && !isCorrect && <XCircle className="mx-auto mt-1 h-4 w-4" aria-hidden />}
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Fix Idiom Sub-component ──────────────────────────────────────────────────
function IdiomCard({ question, onAnswer }: { question: IdiomQuestion; onAnswer: AnswerHandler }) {
  const [placed, setPlaced] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>([...question.scrambled]);
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const placeWord = (word: string, availIdx: number) => {
    if (revealed) return;
    setPlaced((p) => [...p, word]);
    setAvailable((a) => a.filter((_, i) => i !== availIdx));
  };

  const removeWord = (placedIdx: number) => {
    if (revealed) return;
    const word = placed[placedIdx];
    setPlaced((p) => p.filter((_, i) => i !== placedIdx));
    setAvailable((a) => [...a, word]);
  };

  const checkAnswer = () => {
    const correct = placed.join(" ") === question.correct.join(" ");
    setIsCorrect(correct);
    setRevealed(true);
    setTimeout(() => {
      if (correct) {
        onAnswer(true);
        return;
      }

      onAnswer(false, {
        message: "Good try! The correct phrase is:",
        correctPhrase: question.correct.join(" "),
        explanation: question.explanation,
        durationMs: 4000,
      });
    }, 1600);
  };

  const reset = () => {
    setPlaced([]);
    setAvailable([...question.scrambled]);
  };

  return (
    <div className="space-y-4">
      {/* Answer tray */}
      <div className="min-h-[72px] rounded-2xl border-2 border-dashed border-accent-primary/40 bg-accent-primary/5 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-text-secondary">Your answer</p>
        <div className="flex flex-wrap gap-2">
          {placed.map((word, idx) => (
            <motion.button
              key={`placed-${idx}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => removeWord(idx)}
              disabled={revealed}
              className={cn(
                "rounded-full border px-3 py-1 text-sm font-semibold transition",
                !revealed && "border-accent-primary bg-accent-primary/20 text-accent-primary hover:bg-error/20 hover:border-error hover:text-error cursor-pointer",
                revealed && isCorrect && "border-success bg-success/15 text-success",
                revealed && !isCorrect && "border-error bg-error/15 text-error",
              )}
            >
              {word}
            </motion.button>
          ))}
          {placed.length === 0 && <span className="text-sm text-text-secondary/50 italic">Tap words below to place them here…</span>}
        </div>
      </div>

      {/* Word bank */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-text-secondary">Word bank</p>
        <div className="flex flex-wrap gap-2">
          {available.map((word, idx) => (
            <motion.button
              key={`avail-${idx}-${word}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => placeWord(word, idx)}
              disabled={revealed}
              className="cursor-pointer rounded-full border border-border bg-surface px-3 py-1 text-sm font-semibold text-text-primary transition hover:border-accent-primary hover:bg-accent-primary/10 disabled:opacity-50"
            >
              {word}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Controls */}
      {!revealed && (
        <div className="flex gap-3 pt-1">
          <button
            onClick={reset}
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-text-secondary transition hover:border-accent-primary/50"
          >
            Reset
          </button>
          <button
            onClick={checkAnswer}
            disabled={placed.length !== question.correct.length}
            className="flex-1 rounded-full bg-accent-primary px-4 py-2 text-sm font-bold text-bg-primary transition hover:bg-teal-300 disabled:opacity-40"
          >
            Check Answer
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main QuizCard ────────────────────────────────────────────────────────────
export function QuizCard({ question, questionNumber, total, onAnswer }: QuizCardProps) {
  const [feedback, setFeedback] = useState<({ correct: boolean; emoji: string } & FeedbackDetails) | null>(null);
  const answerLockedRef = useRef(false);
  const { triggerCorrect, triggerIncorrect } = useFluvi();

  const handleAnswer: AnswerHandler = (correct, details) => {
    if (answerLockedRef.current) return;
    answerLockedRef.current = true;
    const emoji = correct ? pickRandom(correctEmojis) : pickRandom(wrongEmojis);
    if (correct) triggerCorrect();
    else triggerIncorrect(details?.message);
    setFeedback({ correct, emoji, ...details });
    setTimeout(() => {
      setFeedback(null);
      onAnswer(correct);
    }, details?.durationMs ?? 1200);
  };

  const prompt =
    question.type === "odd-word"
      ? "Which word does NOT belong with the others?"
      : question.type === "spelling"
        ? "Which is the CORRECT spelling?"
        : "Arrange the words to complete the phrase:";

  return (
    <div className="relative">
      {/* Feedback overlay */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-3xl"
            style={{ background: feedback.correct ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.10)" }}
          >
            <span className="text-6xl">{feedback.emoji}</span>
            <p className={cn("mt-2 text-xl font-bold", feedback.correct ? "text-success" : "text-warning")}>
              {feedback.correct ? "Correct!" : feedback.message ?? "Not quite!"}
            </p>
            {feedback.correctPhrase ? (
              <p className="mt-3 max-w-sm px-6 text-center text-lg font-bold text-text-primary">
                {feedback.correctPhrase}
              </p>
            ) : null}
            {feedback.explanation ? (
              <p className="mt-2 max-w-md px-6 text-center text-sm leading-relaxed text-text-secondary">
                {feedback.explanation}
              </p>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-text-secondary">Question {questionNumber} of {total}</span>
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 w-6 rounded-full transition-all duration-300",
                i < questionNumber - 1 ? "bg-accent-primary" : i === questionNumber - 1 ? "bg-accent-primary/60" : "bg-border",
              )}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-text-secondary">{prompt}</p>

      {/* Render by type */}
      {question.type === "odd-word" && <OddWordCard question={question} onAnswer={handleAnswer} />}
      {question.type === "spelling" && <SpellingCard question={question} onAnswer={handleAnswer} />}
      {question.type === "fix-idiom" && <IdiomCard question={question} onAnswer={handleAnswer} />}
    </div>
  );
}
