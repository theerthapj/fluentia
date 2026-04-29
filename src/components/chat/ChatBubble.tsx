import type { Message } from "@/types";
import { cn } from "@/lib/utils";

export function ChatBubble({ message, loading }: { message: Message; loading?: boolean }) {
  if (message.role === "system") {
    return <div className="mx-auto max-w-md rounded-full bg-white/5 px-4 py-2 text-center text-xs text-text-secondary">{message.content}</div>;
  }
  return (
    <div className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-4 py-3 leading-7",
          message.role === "user" && "border-l-4 border-accent-primary bg-accent-primary/12 text-teal-50",
          message.role === "ai" && "bg-surface-elevated text-text-primary",
          loading && "shimmer min-h-14 w-72 text-text-secondary",
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
