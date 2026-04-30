"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { LevelBadge } from "@/components/assessment/LevelBadge";
import { LearningPlanModal } from "@/components/onboarding/LearningPlanModal";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Button } from "@/components/shared/Button";
import { GlassCard } from "@/components/shared/GlassCard";
import { ProgressStepper } from "@/components/shared/ProgressStepper";
import { assessmentQuestions, levelCopy, scoreAssessment } from "@/lib/constants";
import { checkModeration } from "@/lib/moderation/checker";
import { validateTextInput } from "@/lib/validation";
import type { AssessmentAnswer, Level } from "@/types";

const PROGRESS_KEY = "fluentia_assessment_progress";

interface SavedProgress {
  step: number;
  answers: AssessmentAnswer[];
}

function loadProgress(): SavedProgress | null {
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedProgress;
    if (typeof parsed.step === "number" && Array.isArray(parsed.answers)) return parsed;
  } catch { /* corrupted data — start fresh */ }
  return null;
}

function saveProgress(step: number, answers: AssessmentAnswer[]) {
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify({ step, answers }));
  } catch { /* localStorage full — silently continue */ }
}

function clearProgress() {
  try {
    window.localStorage.removeItem(PROGRESS_KEY);
  } catch { /* ignore */ }
}

export default function AssessmentPage() {
  const router = useRouter();
  const { setAssessment } = useAppState();

  // Restore progress from localStorage on mount
  const restored = useMemo(() => {
    if (typeof window === "undefined") return null;
    return loadProgress();
  }, []);

  const [step, setStep] = useState(restored?.step ?? 0);
  const [answers, setAnswers] = useState<AssessmentAnswer[]>(restored?.answers ?? []);
  const [textValue, setTextValue] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [result, setResult] = useState<{ level: Level; total: number } | null>(null);
  const [showPlan, setShowPlan] = useState(false);
  const [moderationWarning, setModerationWarning] = useState<string | null>(null);

  const question = assessmentQuestions[step];

  // Compute text validation live
  const textValidation = useMemo(() => {
    if (!("options" in question)) return validateTextInput(textValue);
    return { valid: true };
  }, [textValue, question]);

  // Persist progress on every meaningful change
  useEffect(() => {
    saveProgress(step, answers);
  }, [step, answers]);

  // Restore text/option when navigating back to a previously-answered question
  useEffect(() => {
    const existing = answers.find((a) => a.questionId === question.id);
    if ("options" in question) {
      setSelectedOption(existing?.value ?? null);
      setTextValue("");
    } else {
      setTextValue(existing?.value ?? "");
      setSelectedOption(null);
    }
    setModerationWarning(null);
  }, [step, question, answers]);

  const saveAnswer = useCallback(
    async (value: string) => {
      const next = [...answers.filter((item) => item.questionId !== question.id), { questionId: question.id, value }];
      setAnswers(next);
      setTextValue("");
      setSelectedOption(null);
      setModerationWarning(null);

      if (step < assessmentQuestions.length - 1) {
        setDirection(1);
        setStep((current) => current + 1);
        return;
      }

      // Final step — score and complete
      clearProgress();
      const response = await fetch("/api/assessment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers: next }) });
      const scored = response.ok ? await response.json() : scoreAssessment(next);
      setAssessment(scored.level, scored.scores);
      setResult({ level: scored.level, total: scored.scores.total });
      setShowPlan(true);
    },
    [answers, question, step, setAssessment],
  );

  const handleTextSubmit = useCallback(() => {
    // Run moderation check on text answers
    const modResult = checkModeration(textValue);
    if (!modResult.safe) {
      setModerationWarning(modResult.warning ?? "Please rephrase your response.");
      return;
    }
    setModerationWarning(null);
    void saveAnswer(textValue);
  }, [textValue, saveAnswer]);

  const handleMcqConfirm = useCallback(() => {
    if (!selectedOption) return;
    setModerationWarning(null);
    void saveAnswer(selectedOption);
  }, [selectedOption, saveAnswer]);

  const goBack = useCallback(() => {
    if (step <= 0) return;
    // Save current text as draft so it's restored when returning
    if (!("options" in question) && textValue.trim()) {
      setAnswers((prev) => [...prev.filter((a) => a.questionId !== question.id), { questionId: question.id, value: textValue }]);
    }
    setDirection(-1);
    setModerationWarning(null);
    setStep((current) => current - 1);
  }, [step, question, textValue]);

  const handleStartOver = useCallback(() => {
    clearProgress();
    setStep(0);
    setAnswers([]);
    setTextValue("");
    setSelectedOption(null);
    setDirection(1);
    setModerationWarning(null);
  }, []);

  // --- Result screen ---
  if (result) {
    return (
      <main className="mesh-gradient grid min-h-screen place-items-center px-5 py-10">
        <GlassCard className="max-w-xl p-7 text-center sm:p-10">
          <CheckCircle2 aria-hidden className="mx-auto h-12 w-12 text-success" />
          <h1 className="mt-5 text-4xl font-bold">Assessment Complete</h1>
          <div className="mt-5"><LevelBadge level={result.level} /></div>
          <p className="mt-4 text-text-secondary">{levelCopy[result.level]} Your score was {result.total}/10.</p>
          <Button id="assessment-continue" className="mt-8 w-full" size="lg" onClick={() => router.push("/mode")}>Continue to Practice</Button>
        </GlassCard>
        {showPlan ? <LearningPlanModal level={result.level} onBegin={() => router.push("/mode")} /> : null}
      </main>
    );
  }

  // --- Assessment flow ---
  return (
    <main className="mesh-gradient min-h-screen px-5 py-10">
      <div className="mx-auto max-w-2xl">
        <ProgressStepper total={assessmentQuestions.length} current={step} />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.section
            key={question.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -24 }}
            transition={{ duration: 0.25 }}
          >
            <GlassCard className="mt-8 p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-primary">{question.category}</p>
              <h1 className="mt-3 text-3xl font-semibold">{question.prompt}</h1>

              {"options" in question ? (
                /* --- MCQ with Confirm step --- */
                <div className="mt-6">
                  <div className="grid gap-3">
                    {question.options.map((option, index) => (
                      <button
                        id={`assessment-option-${step}-${index}`}
                        key={option}
                        onClick={() => setSelectedOption(option)}
                        className={`rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary ${
                          selectedOption === option
                            ? "border-accent-primary bg-accent-primary/10 ring-1 ring-accent-primary"
                            : "border-border bg-surface hover:border-accent-primary"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <AnimatePresence>
                    {selectedOption ? (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }}>
                        <Button id={`assessment-confirm-${step}`} className="mt-4 w-full" onClick={handleMcqConfirm}>
                          Confirm Selection →
                        </Button>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              ) : (
                /* --- Text input with validation --- */
                <div className="mt-6">
                  <textarea
                    id={`assessment-text-${question.id}`}
                    value={textValue}
                    onChange={(event) => {
                      setTextValue(event.target.value);
                      setModerationWarning(null);
                    }}
                    rows={6}
                    className="w-full rounded-2xl border border-border bg-surface p-4 text-text-primary outline-none transition focus:border-accent-primary"
                    placeholder="Write 2–3 clear sentences..."
                  />

                  {/* Validation helper text */}
                  {textValue.trim().length > 0 && !textValidation.valid ? (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-amber-400"
                    >
                      {textValidation.reason}
                    </motion.p>
                  ) : null}

                  {/* Moderation warning */}
                  {moderationWarning ? (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-error"
                    >
                      {moderationWarning}
                    </motion.p>
                  ) : null}

                  <Button
                    id={`assessment-next-${question.id}`}
                    disabled={!textValidation.valid}
                    className="mt-4 w-full"
                    onClick={handleTextSubmit}
                  >
                    Next
                  </Button>
                </div>
              )}
            </GlassCard>

            {/* Back button + Start Over */}
            <div className="mt-4 flex items-center justify-between">
              {step > 0 ? (
                <button
                  id="assessment-back-button"
                  onClick={goBack}
                  className="flex items-center gap-1.5 text-sm text-text-secondary transition hover:text-accent-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              ) : <span />}
              <button
                id="assessment-start-over"
                onClick={handleStartOver}
                className="text-sm text-text-secondary/60 transition hover:text-text-secondary"
              >
                Start Over
              </button>
            </div>
          </motion.section>
        </AnimatePresence>
      </div>
    </main>
  );
}
