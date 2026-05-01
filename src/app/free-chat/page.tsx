"use client";

import { useRouter } from "next/navigation";
import { MessageSquare, BarChart2 } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { useAppState } from "@/components/providers/AppStateProvider";
import { GlassCard } from "@/components/shared/GlassCard";

export default function FreeChatPage() {
  const router = useRouter();
  const { state, setConversationKind, setScenario, setExercise, setConversationHistory } = useAppState();

  return (
    <main className="mesh-gradient min-h-screen px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <Breadcrumb current="Chat" />
        <h1 className="gradient-text text-4xl font-bold">Free Chat</h1>
        <p className="mt-3 text-text-secondary">Talk naturally, without a fixed scenario.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <GlassCard hover className="p-6">
            <button
              id="free-chat-start"
              className="block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
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
              <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary text-bg-primary">
                <MessageSquare aria-hidden="true" className="h-7 w-7" />
              </span>
              <h2 className="mt-6 text-2xl font-semibold">Chat</h2>
              <p className="mt-3 text-text-secondary">Start or continue an open-ended conversation.</p>
            </button>
          </GlassCard>

          <GlassCard hover className="p-6">
            <button
              id="free-chat-feedback"
              className="block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
              onClick={() => router.push("/feedback")}
            >
              <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary text-bg-primary">
                <BarChart2 aria-hidden="true" className="h-7 w-7" />
              </span>
              <h2 className="mt-6 text-2xl font-semibold">Feedback</h2>
              <p className="mt-3 text-text-secondary">Review your performance and recent coaching notes.</p>
            </button>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
