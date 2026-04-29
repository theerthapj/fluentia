"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { LevelBadge } from "@/components/assessment/LevelBadge";
import { LearningPlanModal } from "@/components/onboarding/LearningPlanModal";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Button } from "@/components/shared/Button";
import { GlassCard } from "@/components/shared/GlassCard";
import { ProgressStepper } from "@/components/shared/ProgressStepper";
import { assessmentQuestions, levelCopy, scoreAssessment } from "@/lib/constants";
import type { AssessmentAnswer, Level } from "@/types";

export default function AssessmentPage() {
  const router = useRouter();
  const { setAssessment } = useAppState();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);
  const [textValue, setTextValue] = useState("");
  const [result, setResult] = useState<{ level: Level; total: number } | null>(null);
  const [showPlan, setShowPlan] = useState(false);
  const question = assessmentQuestions[step];

  const saveAnswer = async (value: string) => {
    const next = [...answers.filter((item) => item.questionId !== question.id), { questionId: question.id, value }];
    setAnswers(next);
    setTextValue("");
    if (step < assessmentQuestions.length - 1) {
      setStep((current) => current + 1);
      return;
    }
    const response = await fetch("/api/assessment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers: next }) });
    const scored = response.ok ? await response.json() : scoreAssessment(next);
    setAssessment(scored.level, scored.scores);
    setResult({ level: scored.level, total: scored.scores.total });
    setShowPlan(true);
  };

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

  return (
    <main className="mesh-gradient min-h-screen px-5 py-10">
      <div className="mx-auto max-w-2xl">
        <ProgressStepper total={assessmentQuestions.length} current={step} />
        <AnimatePresence mode="wait">
          <motion.section key={question.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
            <GlassCard className="mt-8 p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-primary">{question.category}</p>
              <h1 className="mt-3 text-3xl font-semibold">{question.prompt}</h1>
              {"options" in question ? (
                <div className="mt-6 grid gap-3">
                  {question.options.map((option, index) => (
                    <button id={`assessment-option-${step}-${index}`} key={option} onClick={() => saveAnswer(option)} className="rounded-2xl border border-border bg-surface p-4 text-left transition hover:border-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary">
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-6">
                  <textarea
                    id={`assessment-text-${question.id}`}
                    value={textValue}
                    onChange={(event) => setTextValue(event.target.value)}
                    rows={6}
                    className="w-full rounded-2xl border border-border bg-surface p-4 text-text-primary outline-none focus:border-accent-primary"
                    placeholder="Write 2-3 clear sentences..."
                  />
                  <Button id={`assessment-next-${question.id}`} disabled={!textValue.trim()} className="mt-4 w-full" onClick={() => saveAnswer(textValue)}>Next</Button>
                </div>
              )}
            </GlassCard>
          </motion.section>
        </AnimatePresence>
      </div>
    </main>
  );
}
