"use client";

import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Button } from "@/components/shared/Button";
import { GlassCard } from "@/components/shared/GlassCard";

export default function FreeChatPage() {
  const router = useRouter();
  const { state, setConversationKind, setScenario, setExercise, setConversationHistory } = useAppState();

  return (
    <main className="mesh-gradient min-h-screen px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <Breadcrumb current="Chat" />
        <GlassCard className="p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-primary">Free Chat</p>
          <h1 className="mt-3 text-4xl font-bold">Talk naturally, without a fixed scenario.</h1>
          <p className="mt-4 max-w-2xl leading-7 text-text-secondary">
            Use Free Chat when you want open conversation practice with coaching on clarity, tone, vocabulary, and confidence.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-text-secondary sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-surface/50 p-4">Open-ended conversation</div>
            <div className="rounded-2xl border border-border bg-surface/50 p-4">Supportive feedback after each turn</div>
            <div className="rounded-2xl border border-border bg-surface/50 p-4">Works with text or voice input</div>
          </div>
          <Button
            id="free-chat-start"
            className="mt-8"
            onClick={() => {
              const isMatching = state.activeConversationKind === "free-chat";
              if (isMatching && state.conversationHistory.length > 1) {
                const wantsToContinue = window.confirm("You have an unfinished free chat session.\n\nClick OK to CONTINUE where you left off.\nClick Cancel to START a NEW conversation.");
                if (!wantsToContinue) {
                  setConversationHistory([]);
                }
              } else {
                setConversationHistory([]);
              }
              setConversationKind("free-chat");
              setScenario(null);
              setExercise(null);
              router.push("/chat?kind=free-chat");
            }}
          >
            Start Free Chat
          </Button>
        </GlassCard>
      </div>
    </main>
  );
}
