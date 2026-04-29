"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { VoiceSimButton } from "@/components/chat/VoiceSimButton";

export function ChatInput({
  value,
  onChange,
  onSend,
  onVoice,
  voiceFallback,
  disabled,
  loading,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onVoice: (text: string) => void;
  voiceFallback: string;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <div className="border-t border-border bg-bg-primary/90 p-4 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center gap-3">
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
          className="min-h-12 flex-1 rounded-full border border-border bg-surface px-5 text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-accent-primary"
        />
        <VoiceSimButton id="chat-voice-button" fallbackText={voiceFallback} onCapture={onVoice} />
        <Button id="chat-send-button" aria-label="Send response" loading={loading} disabled={disabled || !value.trim()} onClick={onSend} className="h-12 w-12 px-0">
          <Send aria-hidden className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
