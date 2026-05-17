"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { CulturalNote } from "@/components/chat/CulturalNote";
import { InlineCoachingTip } from "@/components/chat/InlineCoachingTip";
import { ScenarioHeader } from "@/components/chat/ScenarioHeader";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Button } from "@/components/shared/Button";
import { SafetyBanner } from "@/components/shared/SafetyBanner";
import { FluentiaAnimatedChat } from "@/components/ui/fluentia-animated-chat";
import {
  getPronunciationExercise,
  getScenario,
  getScenarioCulturalNote,
  getScenarioOpening,
} from "@/lib/constants";
import { checkModeration } from "@/lib/moderation/checker";
import { registerViolation } from "@/lib/moderation/escalation";
import { uid } from "@/lib/utils";
import type { ConversationKind, ConversationResponse, Message } from "@/types";
import { useFluvi } from "@/context/FluviContext";
import { FluviFeedbackPanel } from "@/components/fluvi/FluviFeedbackPanel";
import type { FeedbackResult } from "@/types/fluvi.types";

function ChatContent() {
  const router = useRouter();
  const params = useSearchParams();
  const {
    state,
    hydrated,
    setConversationHistory,
    setConversationKind,
    setExercise,
    setLastFeedback,
    setScenario,
    setWarnings,
  } = useAppState();
  const [loading, setLoading] = useState(false);
  const [safety, setSafety] = useState<string | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);
  const [fluviFeedback, setFluviFeedback] = useState<FeedbackResult | null>(null);

  // Fluvi state triggers — additive, does not replace any existing logic
  const {
    startThinking,
    stopThinking,
    triggerCelebration,
    triggerCorrect,
    triggerGrammarSuccess,
    triggerIncorrect,
    triggerPronunciationSuccess,
    triggerWarning,
  } = useFluvi();

  const kind = (params.get("kind") as ConversationKind | null) ?? state.activeConversationKind ?? "scenario";
  const scenarioId = params.get("scenario");
  const exerciseId = params.get("exercise");
  const scenario = kind === "scenario" ? getScenario(scenarioId ?? state.selectedScenario?.id) : null;
  const exercise = kind === "pronunciation" ? getPronunciationExercise(exerciseId ?? state.selectedExerciseId) : null;
  const mode = kind === "scenario" ? scenario?.mode ?? state.selectedMode ?? "formal" : null;
  const level = state.level ?? (scenario?.level ?? exercise?.level ?? "beginner");
  const userTurns = state.conversationHistory.filter((message) => message.role === "user").length;
  const advanced = kind === "scenario" && userTurns > 0;
  const historyMatchesContext =
    (kind === "scenario" && state.selectedScenario?.id === scenario?.id && state.activeConversationKind === "scenario") ||
    (kind === "pronunciation" && state.selectedExerciseId === exercise?.id && state.activeConversationKind === "pronunciation") ||
    (kind === "free-chat" && state.activeConversationKind === "free-chat");

  const initialMessage = useMemo<Message>(() => {
    if (kind === "free-chat") {
      return {
        id: uid("ai"),
        role: "ai",
        content: "Welcome to Free Chat. Tell me what is on your mind today, and I will help you sound clear, natural, and confident.",
        createdAt: new Date().toISOString(),
      };
    }
    if (kind === "pronunciation" && exercise) {
      return {
        id: uid("ai"),
        role: "ai",
        content: `Let's practice "${exercise.title}". Say or type this line: ${exercise.prompt}`,
        createdAt: new Date().toISOString(),
      };
    }
    return {
      id: uid("ai"),
      role: "ai",
      content: getScenarioOpening(scenario ?? getScenario(), userTurns),
      createdAt: new Date().toISOString(),
    };
  }, [kind, exercise, scenario, userTurns]);

  const messages = useMemo(
    () => (historyMatchesContext && state.conversationHistory.length ? state.conversationHistory : [initialMessage]),
    [historyMatchesContext, initialMessage, state.conversationHistory],
  );
  const culturalNote = kind === "scenario" && scenario ? getScenarioCulturalNote(scenario, userTurns) : exercise?.coachNote ?? "Breathe, slow down, and focus on one clear improvement at a time.";
  const announceText = useMemo(() => [...messages].reverse().find((message) => message.role === "ai")?.content ?? "", [messages]);

  useEffect(() => {
    if (!hydrated) return;
    setConversationKind(kind);
    if (kind === "scenario" && scenario) setScenario(scenario);
    if (kind === "pronunciation" && exercise) setExercise(exercise.id);
    if (kind !== "scenario") setScenario(null);
    if (kind !== "pronunciation") setExercise(null);
    if (!historyMatchesContext || !state.conversationHistory.length) setConversationHistory([initialMessage]);
  }, [
    hydrated,
    kind,
    scenario,
    exercise,
    historyMatchesContext,
    initialMessage,
    setConversationHistory,
    setConversationKind,
    setExercise,
    setScenario,
    state.conversationHistory.length,
  ]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const until = state.cooldownUntil;
      setCooldownRemaining(until && until > Date.now() ? Math.ceil((until - Date.now()) / 1000) : 0);
    }, 500);
    return () => window.clearInterval(timer);
  }, [state.cooldownUntil]);

  useEffect(() => {
    if (!announceText) return;
    if (!state.preferences.listeningEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(announceText);
    utterance.rate = state.preferences.playbackSpeed === "slow" ? 0.85 : state.preferences.playbackSpeed === "fast" ? 1.15 : 1;
    window.speechSynthesis.speak(utterance);
  }, [announceText, state.preferences.listeningEnabled, state.preferences.playbackSpeed]);

  const send = async (text: string, requestWrapUp = false) => {
    const trimmed = text.trim();
    if (!trimmed || loading || cooldownRemaining) return;
    const moderation = checkModeration(trimmed);
    if (!moderation.safe) {
      const escalation = registerViolation();
      setWarnings(escalation.warningCount, escalation.cooldownUntil);
      setSafety(escalation.message || moderation.warning || "Please rephrase respectfully.");
      triggerWarning(); // Fluvi: show warning animation
      return;
    }
    setSafety(null);
    const userMessage: Message = { id: uid("user"), role: "user", content: trimmed, createdAt: new Date().toISOString() };
    const nextMessages = [...messages, userMessage];
    setConversationHistory(nextMessages);
    setLoading(true);
    startThinking(); // Fluvi: show thinking animation
    try {
      const response = await fetch("/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          kind,
          scenarioId: scenario?.id ?? null,
          exerciseId: exercise?.id ?? null,
          mode,
          level,
          history: nextMessages.slice(-30),
          requestWrapUp,
        }),
      });
      const data = (await response.json()) as ConversationResponse;
      if (!data.safe || !data.aiMessage || !data.feedback) {
        setSafety(data.warning ?? "Please rephrase your response.");
        return;
      }
      setLastFeedback(data.feedback);
      setTipVisible(true);
      setConversationHistory([...nextMessages, data.aiMessage]);

      // Fluvi: map existing FeedbackPayload → FeedbackResult and trigger animation
      stopThinking();
      const score = data.feedback.fluencyScore;
      const fluviResult: FeedbackResult = {
        fluency_score: score,
        confidence_level: data.feedback.confidenceLevel === 'low' ? 'Low' : data.feedback.confidenceLevel === 'medium' ? 'Medium' : 'High',
        tone_assessment: { label: data.feedback.toneLabel, appropriate: score >= 5, explanation: data.feedback.quickTip },
        strengths: data.feedback.strengths,
        suggestions: data.feedback.improvements,
        grammar_corrections: data.feedback.grammarCorrections,
        vocabulary_suggestions: data.feedback.vocabularySuggestions.map(v => ({ word: v.word, alternatives: [v.alternative], definition: v.context })),
        simple_version: data.feedback.simpleRewrite,
        advanced_version: data.feedback.advancedRewrite,
        encouragement: data.feedback.encouragementMessage,
      };
      setFluviFeedback(fluviResult);
      if (score >= 8) {
        triggerCelebration();
      } else if (kind === "pronunciation" && score >= 6) {
        triggerPronunciationSuccess();
      } else if (score >= 7 && data.feedback.grammarCorrections.length === 0) {
        triggerGrammarSuccess();
      } else if (score >= 6) {
        triggerCorrect();
      } else {
        triggerIncorrect();
      }

      if (requestWrapUp) {
        router.push("/feedback");
      }
    } catch {
      toast.error("Could not analyze this turn. Try again.");
    } finally {
      stopThinking(); // Fluvi: stop thinking if an error occurred
      setLoading(false);
    }
  };

  if (!hydrated) {
    return (
      <main className="flex min-h-screen flex-col bg-bg-primary">
        <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 py-6 pb-72 lg:pb-56">
          <div className="h-20 rounded-3xl border border-border bg-surface/60" />
          <div className="h-28 rounded-3xl border border-border bg-surface/60" />
          <div className="h-40 rounded-3xl border border-border bg-surface/60" />
        </section>
      </main>
    );
  }

  const title = kind === "free-chat" ? "Free Chat" : kind === "pronunciation" ? exercise?.title ?? "Pronunciation Practice" : scenario?.title ?? "Scenario Practice";
  const canWrapUp = kind === "pronunciation" ? userTurns >= 1 : userTurns >= 2;

  return (
    <main className="flex min-h-screen flex-col bg-bg-primary">
      <ScenarioHeader scenario={scenario} mode={mode} advanced={advanced} kind={kind} title={title} />
      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 py-6 pb-72 lg:pb-56">
        <Breadcrumb current="Chat" />

        {/* Fluvi is now embedded in ChatBubble and FluviFeedbackPanel */}

        <CulturalNote note={culturalNote} />
        {safety ? <SafetyBanner message={cooldownRemaining ? `${safety} ${cooldownRemaining}s remaining.` : safety} onDismiss={() => setSafety(null)} /> : null}
        <div aria-live="polite" aria-atomic="false" className="sr-only">
          {announceText}
        </div>
        <div className="space-y-4">
          {messages.map((message) => <ChatBubble key={message.id} message={message} />)}
          {loading ? <ChatBubble message={{ id: "loading", role: "ai", content: "Analyzing tone, fluency, and confidence...", createdAt: new Date().toISOString() }} loading /> : null}
        </div>
        {state.lastFeedback?.quickTip && tipVisible ? <InlineCoachingTip tip={state.lastFeedback.quickTip} onDismiss={() => setTipVisible(false)} /> : null}

        {/* Fluvi Feedback Panel — additive, shown below messages when feedback is available */}
        {fluviFeedback && (
          <FluviFeedbackPanel
            feedback={fluviFeedback}
            isCorrect={(fluviFeedback.fluency_score ?? 0) >= 6}
          />
        )}

        <div className="mt-2 flex flex-wrap justify-center gap-3">
          {canWrapUp && state.lastFeedback ? (
            <Button id="chat-feedback-button" onClick={() => router.push("/feedback")}>Get Detailed Feedback</Button>
          ) : null}
        </div>
      </section>
      <div className="fixed inset-x-0 bottom-24 z-30 lg:left-72 lg:bottom-0">
        <div className="border-t border-border bg-white/90 px-4 py-4 shadow-[0_-10px_28px_rgba(74,144,226,0.1)] backdrop-blur">
          <FluentiaAnimatedChat
            scenarioTitle={title}
            onSendMessage={(text, options) => void send(text, Boolean(options?.requestWrapUp))}
            canWrapUp={canWrapUp}
            disabled={Boolean(cooldownRemaining)}
            loading={loading}
            onUnsafeInput={(message) => setSafety(message)}
          />
        </div>
      </div>
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-bg-primary">Loading chat...</main>}>
      <ChatContent />
    </Suspense>
  );
}
