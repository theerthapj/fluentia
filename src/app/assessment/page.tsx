"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { LevelBadge } from "@/components/assessment/LevelBadge";
import { LearningPlanModal } from "@/components/onboarding/LearningPlanModal";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Button } from "@/components/shared/Button";
import { GlassCard } from "@/components/shared/GlassCard";
import { ProgressStepper } from "@/components/shared/ProgressStepper";
import { FluviCharacter } from "@/components/fluvi/FluviCharacter";
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
    if (!parsed || typeof parsed !== "object") return null;
    if (!Number.isInteger(parsed.step) || !Array.isArray(parsed.answers)) return null;

    const validQuestionIds = new Set<string>(assessmentQuestions.map((question) => question.id));
    return {
      step: Math.min(Math.max(parsed.step, 0), assessmentQuestions.length - 1),
      answers: parsed.answers.filter(
        (answer): answer is AssessmentAnswer =>
          Boolean(answer) &&
          typeof answer.questionId === "string" &&
          typeof answer.value === "string" &&
          validQuestionIds.has(answer.questionId),
      ),
    };
  } catch {}
  return null;
}

function saveProgress(step: number, answers: AssessmentAnswer[]) {
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify({ step, answers }));
  } catch {}
}

function clearProgress() {
  try {
    window.localStorage.removeItem(PROGRESS_KEY);
  } catch {}
}

export default function AssessmentPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { setAssessment } = useAppState();

  const restored = useMemo(() => {
    if (typeof window === "undefined") return null;
    return loadProgress();
  }, []);
  const initialQuestion = assessmentQuestions[restored?.step ?? 0] ?? assessmentQuestions[0];
  const initialAnswer = restored?.answers.find((answer) => answer.questionId === initialQuestion.id);

  const [step, setStep] = useState(restored?.step ?? 0);
  const [answers, setAnswers] = useState<AssessmentAnswer[]>(restored?.answers ?? []);
  const [textValue, setTextValue] = useState("options" in initialQuestion ? "" : (initialAnswer?.value ?? ""));
  const [selectedOption, setSelectedOption] = useState<string | null>("options" in initialQuestion ? (initialAnswer?.value ?? null) : null);
  const [direction, setDirection] = useState(1);
  const [result, setResult] = useState<{ level: Level; total: number } | null>(null);
  const [showPlan, setShowPlan] = useState(false);
  const [moderationWarning, setModerationWarning] = useState<string | null>(null);

  const question = assessmentQuestions[step];
  const bannerMessage = params.get("message");

  const syncDraftForStep = useCallback((nextStep: number, nextAnswers: AssessmentAnswer[]) => {
    const nextQuestion = assessmentQuestions[nextStep] ?? assessmentQuestions[0];
    const existing = nextAnswers.find((answer) => answer.questionId === nextQuestion.id);
    if ("options" in nextQuestion) {
      setSelectedOption(existing?.value ?? null);
      setTextValue("");
    } else {
      setTextValue(existing?.value ?? "");
      setSelectedOption(null);
    }
  }, []);

  const textValidation = useMemo(() => {
    if (!("options" in question)) return validateTextInput(textValue);
    return { valid: true, checklist: { hasEnoughWords: true, hasEnoughDetail: true, hasSentenceShape: true } };
  }, [textValue, question]);

  useEffect(() => {
    saveProgress(step, answers);
  }, [step, answers]);

  const saveAnswer = useCallback(
    async (value: string) => {
      const next = [...answers.filter((item) => item.questionId !== question.id), { questionId: question.id, value }];
      setAnswers(next);
      setTextValue("");
      setSelectedOption(null);
      setModerationWarning(null);

      if (step < assessmentQuestions.length - 1) {
        const nextStep = step + 1;
        setDirection(1);
        setStep(nextStep);
        syncDraftForStep(nextStep, next);
        return;
      }

      clearProgress();
      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: next }),
      });
      const scored = response.ok ? await response.json() : scoreAssessment(next);
      setAssessment(scored.level, scored.scores);
      setResult({ level: scored.level, total: scored.scores.total });
      setShowPlan(true);
    },
    [answers, question.id, step, setAssessment, syncDraftForStep],
  );

  const handleTextSubmit = useCallback(() => {
    const modResult = checkModeration(textValue);
    if (!modResult.safe) {
      setModerationWarning(modResult.warning ?? "Please rephrase your response.");
      return;
    }
    if (!textValidation.valid) {
      setModerationWarning(textValidation.reason ?? "Please write a clearer response.");
      return;
    }
    setModerationWarning(null);
    void saveAnswer(textValue);
  }, [textValue, saveAnswer, textValidation]);

  const handleMcqConfirm = useCallback(() => {
    if (!selectedOption) return;
    setModerationWarning(null);
    void saveAnswer(selectedOption);
  }, [selectedOption, saveAnswer]);

  const goBack = useCallback(() => {
    if (step <= 0) return;
    let nextAnswers = answers;
    if (!("options" in question) && textValue.trim()) {
      nextAnswers = [...answers.filter((answer) => answer.questionId !== question.id), { questionId: question.id, value: textValue }];
      setAnswers(nextAnswers);
    }
    const nextStep = step - 1;
    setDirection(-1);
    setModerationWarning(null);
    setStep(nextStep);
    syncDraftForStep(nextStep, nextAnswers);
  }, [answers, question, step, syncDraftForStep, textValue]);

  const handleStartOver = useCallback(() => {
    clearProgress();
    setStep(0);
    setAnswers([]);
    syncDraftForStep(0, []);
    setDirection(1);
    setModerationWarning(null);
  }, [syncDraftForStep]);

  if (result) {
    return (
      <main className="mesh-gradient grid min-h-screen place-items-center px-5 py-10">
        <GlassCard className="max-w-xl p-7 text-center sm:p-10">
          <div className="mx-auto mb-2 flex justify-center">
            <FluviCharacter size={92} />
          </div>
          <CheckCircle2 aria-hidden="true" className="mx-auto h-12 w-12 text-success" />
          <h1 className="mt-5 text-4xl font-bold">Assessment Complete</h1>
          <div className="mt-5"><LevelBadge level={result.level} /></div>
          <p className="mt-4 text-text-secondary">
            {levelCopy[result.level]} Your score was {result.total}/10. You can change your level anytime from Dashboard or Settings.
          </p>
          {!showPlan ? (
            <Button id="assessment-continue" className="mt-8 w-full" size="lg" onClick={() => router.push("/mode")}>Continue to Practice</Button>
          ) : null}
        </GlassCard>
        {showPlan ? <LearningPlanModal level={result.level} onBegin={() => router.push("/mode")} /> : null}
      </main>
    );
  }

  return (
    <main className="mesh-gradient min-h-screen px-5 py-10">
      <div className="mx-auto max-w-2xl pb-32">
        <ProgressStepper total={assessmentQuestions.length} current={step} />
        {bannerMessage ? (
          <div className="mt-5 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">{bannerMessage}</div>
        ) : null}

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
              <div className="mb-6 flex items-center gap-4">
                <div className="shrink-0">
                  <FluviCharacter size={72} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-primary">{question.category}</p>
                  <p className="mt-1 text-sm leading-6 text-text-secondary">Take your time. Honest answers help shape better practice.</p>
                </div>
              </div>
              <h1 className="mt-3 text-3xl font-semibold">{question.prompt}</h1>

              {"options" in question ? (
                <fieldset className="mt-6">
                  <legend className="sr-only">{question.prompt}</legend>
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
                      <motion.div
                        className="mt-8 mb-8 flex justify-end gap-4"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button id={`assessment-confirm-${step}`} className="w-full" onClick={handleMcqConfirm}>
                          Confirm Selection
                        </Button>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </fieldset>
              ) : (
                <div className="mt-6">
                  <div className="rounded-2xl border border-border bg-surface/50 p-4 text-sm text-text-secondary">
                    Write 1-3 clear sentences. We look for enough detail, at least 5 words, and one complete thought.
                  </div>
                  <textarea
                    id={`assessment-text-${question.id}`}
                    value={textValue}
                    onChange={(event) => {
                      setTextValue(event.target.value);
                      setModerationWarning(null);
                    }}
                    rows={6}
                    className="mt-4 w-full rounded-2xl border border-border bg-surface p-4 text-text-primary outline-none transition focus:border-accent-primary"
                    placeholder="Write your answer here..."
                  />
                  <div className="mt-3 grid gap-2 text-sm text-text-secondary sm:grid-cols-3">
                    <span className={textValidation.checklist.hasEnoughWords ? "text-success" : ""}>At least 5 words</span>
                    <span className={textValidation.checklist.hasEnoughDetail ? "text-success" : ""}>Enough detail</span>
                    <span className={textValidation.checklist.hasSentenceShape ? "text-success" : ""}>Complete sentence</span>
                  </div>
                  {textValue.trim().length > 0 && !textValidation.valid ? (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-sm text-amber-400">
                      {textValidation.reason}
                    </motion.p>
                  ) : null}
                  {moderationWarning ? (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-sm text-error">
                      {moderationWarning}
                    </motion.p>
                  ) : null}
                  <div className="mt-8 mb-8 flex justify-end gap-4">
                    <Button id={`assessment-next-${question.id}`} className="w-full" onClick={handleTextSubmit}>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </GlassCard>

            <div className="mt-8 mb-8 flex items-center justify-between">
              {step > 0 ? (
                <button
                  id="assessment-back-button"
                  onClick={goBack}
                  className="flex items-center gap-1.5 text-sm text-text-secondary transition hover:text-accent-primary"
                >
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  Back
                </button>
              ) : <span />}
              <button
                id="assessment-start-over"
                onClick={handleStartOver}
                className="text-sm text-text-secondary/80 transition hover:text-text-secondary"
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
