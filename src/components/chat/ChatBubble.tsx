import { Volume2 } from "lucide-react";
import type { Message } from "@/types";
import { cn } from "@/lib/utils";
import { FluviCharacter, FluviThinkingDots } from "@/components/fluvi/FluviCharacter";
import { useFluvi } from "@/context/FluviContext";

export function ChatBubble({ message, loading }: { message: Message; loading?: boolean }) {
  const play = (speed: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.rate = speed;
    window.speechSynthesis.speak(utterance);
  };

  const { state: fluviState } = useFluvi();

  if (message.role === "system") {
    return <div className="mx-auto max-w-md rounded-full bg-white/5 px-4 py-2 text-center text-xs text-text-secondary">{message.content}</div>;
  }
  return (
    <div className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}>
      {message.role === "ai" && (
        <div className="flex-shrink-0 mt-1">
          <FluviCharacter size={56} />
        </div>
      )}
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-4 py-3 leading-7",
          message.role === "user" && "border-l-4 border-accent-primary bg-accent-primary/12 text-teal-50",
          message.role === "ai" && "bg-surface-elevated text-text-primary rounded-tl-sm",
          loading && "shimmer min-h-14 w-72 text-text-secondary flex items-center",
        )}
      >
        {loading ? (
           <div className="flex items-center gap-2">
             <span>{message.content}</span>
             {fluviState.mode === 'thinking' && <FluviThinkingDots />}
           </div>
        ) : (
          <p>{message.content}</p>
        )}
        {message.role === "ai" && !loading && (
          <div className="mt-3 flex items-center gap-2 text-xs text-text-secondary">
            <button 
              onClick={() => {
                if (typeof window !== "undefined" && "speechSynthesis" in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className="rounded p-1 hover:bg-white/10 hover:text-accent-primary transition focus:outline-none"
              title="Stop Audio"
            >
              <Volume2 className="h-4 w-4" />
            </button>
            <button onClick={() => play(0.6)} className="rounded-full border border-border bg-surface/50 px-2.5 py-1 hover:bg-white/10 hover:text-text-primary transition focus:outline-none focus:ring-1 focus:ring-accent-primary">Slow</button>
            <button onClick={() => play(1)} className="rounded-full border border-border bg-surface/50 px-2.5 py-1 hover:bg-white/10 hover:text-text-primary transition focus:outline-none focus:ring-1 focus:ring-accent-primary">Normal</button>
            <button onClick={() => play(1.5)} className="rounded-full border border-border bg-surface/50 px-2.5 py-1 hover:bg-white/10 hover:text-text-primary transition focus:outline-none focus:ring-1 focus:ring-accent-primary">Fast</button>
          </div>
        )}
      </div>
    </div>
  );
}
