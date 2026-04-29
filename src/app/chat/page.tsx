"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { ScenarioHeader } from "@/components/chat/ScenarioHeader";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Button } from "@/components/shared/Button";
import { SafetyBanner } from "@/components/shared/SafetyBanner";
import { getScenario, voiceSamples } from "@/lib/constants";
import { checkModeration } from "@/lib/moderation/checker";
import { registerViolation } from "@/lib/moderation/escalation";
import { uid } from "@/lib/utils";
import type { ConversationResponse, Message } from "@/types";

function ChatContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { state, setConversationHistory, setLastFeedback, setWarnings } = useAppState();
  const scenario = useMemo(() => getScenario(params.get("scenario") ?? state.selectedScenario?.id), [params, state.selectedScenario]);
  const mode = state.selectedMode ?? "formal";
  const level = state.level ?? "beginner";
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [safety, setSafety] = useState<string | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  const messages = state.conversationHistory.length
    ? state.conversationHistory
    : [{ id: uid("ai"), role: "ai" as const, content: scenario.openingPrompt, createdAt: new Date().toISOString() }];

  useEffect(() => {
    if (!state.conversationHistory.length) setConversationHistory(messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const until = state.cooldownUntil;
      setCooldownRemaining(until && until > Date.now() ? Math.ceil((until - Date.now()) / 1000) : 0);
    }, 500);
    return () => window.clearInterval(timer);
  }, [state.cooldownUntil]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading || cooldownRemaining) return;
    const moderation = checkModeration(trimmed);
    if (!moderation.safe) {
      const escalation = registerViolation();
      setWarnings(escalation.warningCount, escalation.cooldownUntil);
      setSafety(escalation.message || moderation.warning || "Please rephrase respectfully.");
      return;
    }
    setSafety(null);
    const userMessage: Message = { id: uid("user"), role: "user", content: trimmed, createdAt: new Date().toISOString() };
    const nextMessages = [...messages, userMessage];
    setConversationHistory(nextMessages);
    setInput("");
    setLoading(true);
    const loadingMessage: Message = { id: "loading", role: "ai", content: "Analyzing tone, fluency, and confidence...", createdAt: new Date().toISOString() };
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 1500));
      const response = await fetch("/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, scenarioId: scenario.id, mode, level, history: nextMessages }),
      });
      const data = (await response.json()) as ConversationResponse;
      if (!data.safe || !data.aiMessage || !data.feedback) {
        setSafety(data.warning ?? "Please rephrase your response.");
        return;
      }
      setLastFeedback(data.feedback);
      setConversationHistory([...nextMessages, data.aiMessage]);
    } catch {
      toast.error("Could not analyze this turn. Try again.");
    } finally {
      setLoading(false);
    }
    return loadingMessage;
  };

  const userTurns = messages.filter((message) => message.role === "user").length;

  return (
    <main className="flex min-h-screen flex-col bg-bg-primary">
      <ScenarioHeader scenario={scenario} mode={mode} />
      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 py-6 pb-32">
        {safety ? <SafetyBanner message={cooldownRemaining ? `${safety} ${cooldownRemaining}s remaining.` : safety} onDismiss={() => setSafety(null)} /> : null}
        {messages.map((message) => <ChatBubble key={message.id} message={message} />)}
        {loading ? <ChatBubble message={{ id: "loading", role: "ai", content: "Analyzing tone, fluency, and confidence...", createdAt: new Date().toISOString() }} loading /> : null}
        {userTurns >= 2 && state.lastFeedback ? (
          <Button id="chat-feedback-button" className="mx-auto mt-2" onClick={() => router.push("/feedback")}>Get Detailed Feedback</Button>
        ) : null}
      </section>
      <div className="fixed inset-x-0 bottom-0 z-20">
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={send}
          onVoice={() => setInput(voiceSamples[scenario.id] ?? voiceSamples["daily-communication"])}
          disabled={Boolean(cooldownRemaining)}
          loading={loading}
        />
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
