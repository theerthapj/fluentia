"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { VoiceSimButton } from "@/components/chat/VoiceSimButton";
import type { PreferredInputMode } from "@/types";

export function ChatInput({
  value,
  onChange,
  onSend,
  onVoice,
  disabled,
  loading,
  preferredInputMode,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onVoice: (text: string) => void;
  disabled?: boolean;
  loading?: boolean;
  preferredInputMode: PreferredInputMode;
}) {
  return (
    <div className="border-t border-border bg-white/90 p-4 backdrop-blur">
      <div className={`mx-auto flex max-w-4xl items-center gap-3 ${preferredInputMode === "voice" ? "sm:flex-row-reverse" : ""}`}>
        <input
          id="chat-input"
          aria-label="Type your practice response"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSend();
            }
          }}
          placeholder={disabled ? "Input paused briefly..." : "Type your response..."}
          className="min-h-12 flex-1 rounded-full border border-[#A0C4FF] bg-[#F1F3F5] px-5 text-[#333333] outline-none transition placeholder:text-text-secondary/60 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20"
        />
        <VoiceSimButton id="chat-voice-button" onCapture={onVoice} disabled={disabled || loading} />
        <Button id="chat-send-button" aria-label="Send response" loading={loading} disabled={disabled || !value.trim()} onClick={onSend} className="h-12 w-12 px-0">
          <Send aria-hidden="true" className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
