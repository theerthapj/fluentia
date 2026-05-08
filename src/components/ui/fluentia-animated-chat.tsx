"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Command as CommandIcon, Languages, Loader2, Mic, MessageSquare, Send, Sparkles, Square, X, Zap } from "lucide-react";
import { toast } from "sonner";
import { useAppState } from "@/components/providers/AppStateProvider";
import { checkModeration } from "@/lib/moderation/checker";
import { registerViolation } from "@/lib/moderation/escalation";
import { cn } from "@/lib/utils";

type SendOptions = {
  requestWrapUp?: boolean;
};

type FluentiaAnimatedChatProps = {
  scenarioTitle: string;
  onSendMessage: (text: string, options?: SendOptions) => void;
  canWrapUp?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onUnsafeInput?: (message: string) => void;
};

const learningCommands = [
  { icon: Languages, label: "Explain Grammar", prefix: "/explain", desc: "Break down the last sentence." },
  { icon: Sparkles, label: "Improve Flow", prefix: "/improve", desc: "Ask for a more natural version." },
  { icon: MessageSquare, label: "New Scenario", prefix: "/scenarios", desc: "Switch practice situation." },
];

function commandToMessage(value: string) {
  if (value.startsWith("/explain")) return "Please explain the grammar in my last response and give me one clear correction.";
  if (value.startsWith("/improve")) return "Please improve the flow of my last response and show me a more natural spoken version.";
  return value;
}

import { FluviCharacter } from "@/components/fluvi/FluviCharacter";

export function FluentiaAnimatedChat({
  scenarioTitle,
  onSendMessage,
  canWrapUp,
  disabled,
  loading,
  onUnsafeInput,
}: FluentiaAnimatedChatProps) {
  const router = useRouter();
  const { setWarnings } = useAppState();
  const [value, setValue] = useState("");
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "recording" | "analyzing">("idle");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timeoutRef = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const inputDisabled = disabled || loading;

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  };

  const reportUnsafe = (message: string) => {
    const escalation = registerViolation();
    setWarnings(escalation.warningCount, escalation.cooldownUntil);
    onUnsafeInput?.(escalation.message || message);
  };

  const handleSendMessage = (options?: SendOptions) => {
    const trimmed = value.trim();
    if (!trimmed || inputDisabled) return;

    if (trimmed.startsWith("/scenarios")) {
      setValue("");
      setShowCommandPalette(false);
      router.push("/scenarios");
      return;
    }

    const outbound = commandToMessage(trimmed);
    const moderation = checkModeration(outbound);
    if (!moderation.safe) {
      reportUnsafe(moderation.warning ?? "Please rephrase respectfully.");
      return;
    }

    onSendMessage(outbound, options);
    setValue("");
    setShowCommandPalette(false);
    window.requestAnimationFrame(resizeTextarea);
  };

  const selectCommand = (prefix: string) => {
    if (prefix === "/scenarios") {
      setValue(prefix);
      setShowCommandPalette(false);
      router.push("/scenarios");
      return;
    }
    setValue(prefix);
    setShowCommandPalette(false);
    textareaRef.current?.focus();
    window.requestAnimationFrame(resizeTextarea);
  };

  const transcribe = async (blob: Blob) => {
    setVoiceStatus("analyzing");
    try {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");
      const response = await fetch("/api/transcribe", { method: "POST", body: formData });
      const data = (await response.json()) as { transcript?: string | null };
      if (data.transcript) {
        setValue(data.transcript);
        toast.success("Voice captured.");
        window.requestAnimationFrame(resizeTextarea);
      } else {
        toast.error("Voice transcription is unavailable right now. Please type your response.");
      }
    } catch {
      toast.error("Voice transcription is unavailable right now. Please type your response.");
    } finally {
      setVoiceStatus("idle");
    }
  };

  const stopRecording = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    recorderRef.current?.stop();
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("This browser does not support voice capture. Please type your response.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        void transcribe(new Blob(chunksRef.current, { type: "audio/webm" }));
      };
      recorderRef.current = recorder;
      recorder.start();
      setVoiceStatus("recording");
      timeoutRef.current = window.setTimeout(stopRecording, 30_000);
    } catch (error) {
      const message = error instanceof DOMException && error.name === "NotFoundError"
        ? "No microphone found. Please connect a mic."
        : error instanceof DOMException && error.name === "NotReadableError"
          ? "Microphone is already in use by another app."
          : "Microphone access blocked. Please type your response.";
      toast.error(message);
    }
  };

  return (
    <div className="lab-bg relative mx-auto w-full max-w-4xl">
      {/* Fluvi peeking near the interaction area */}
      <div className="absolute -top-[110px] -right-4 md:-right-8 z-20 pointer-events-none drop-shadow-2xl">
        <FluviCharacter size={100} />
      </div>
      <motion.div
        className="relative z-10 overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.04] shadow-2xl backdrop-blur-xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <AnimatePresence>
          {showCommandPalette ? (
            <motion.div
              className="absolute bottom-full left-4 right-4 z-50 mb-4 overflow-hidden rounded-xl border border-border bg-bg-primary/95 shadow-2xl"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="text-sm font-semibold text-text-primary">Learning commands</span>
                <button type="button" aria-label="Close command palette" onClick={() => setShowCommandPalette(false)} className="rounded-full p-1 text-text-secondary hover:text-text-primary">
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-1 p-2">
                {learningCommands.map((command, index) => {
                  const Icon = command.icon;
                  return (
                    <button
                      key={command.prefix}
                      type="button"
                      onMouseEnter={() => setActiveSuggestion(index)}
                      onClick={() => selectCommand(command.prefix)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 text-left transition",
                        activeSuggestion === index ? "bg-accent-primary/12 text-text-primary" : "text-text-secondary hover:bg-white/5",
                      )}
                    >
                      <Icon aria-hidden="true" className="h-4 w-4 text-accent-primary" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">{command.label}</span>
                        <span className="block truncate text-xs text-text-secondary">{command.desc}</span>
                      </span>
                      <span className="rounded-full border border-border px-2 py-1 text-xs text-text-secondary">{command.prefix}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="p-4">
          <textarea
            ref={textareaRef}
            value={value}
            disabled={inputDisabled}
            onChange={(event) => {
              setValue(event.target.value);
              resizeTextarea();
              setShowCommandPalette(event.target.value.trim().startsWith("/"));
            }}
            placeholder={`Message ${scenarioTitle}...`}
            rows={3}
            className="min-h-20 w-full resize-none border-none bg-transparent text-text-primary outline-none placeholder:text-text-secondary/45 disabled:cursor-not-allowed disabled:opacity-60"
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" && showCommandPalette) {
                event.preventDefault();
                setActiveSuggestion((current) => (current + 1) % learningCommands.length);
              }
              if (event.key === "ArrowUp" && showCommandPalette) {
                event.preventDefault();
                setActiveSuggestion((current) => (current - 1 + learningCommands.length) % learningCommands.length);
              }
              if (event.key === "Enter" && showCommandPalette) {
                event.preventDefault();
                selectCommand(learningCommands[activeSuggestion].prefix);
              } else if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSendMessage();
              }
              if (event.key === "/") setShowCommandPalette(true);
            }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-3">
          <div className="flex gap-2">
            <button
              type="button"
              aria-label={voiceStatus === "recording" ? "Stop voice recording" : "Start voice recording"}
              disabled={inputDisabled || voiceStatus === "analyzing"}
              onClick={() => (voiceStatus === "recording" ? stopRecording() : startRecording())}
              className={cn(
                "grid h-10 w-10 place-items-center rounded-full text-text-secondary transition hover:text-accent-primary disabled:opacity-50",
                voiceStatus === "recording" && "pulse-teal bg-error/20 text-error",
              )}
            >
              {voiceStatus === "analyzing" ? <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" /> : voiceStatus === "recording" ? <Square aria-hidden="true" className="h-5 w-5" /> : <Mic aria-hidden="true" className="h-5 w-5" />}
            </button>
            <button
              type="button"
              aria-label="Open learning commands"
              onClick={() => setShowCommandPalette((current) => !current)}
              className="grid h-10 w-10 place-items-center rounded-full text-text-secondary transition hover:text-accent-primary"
            >
              <CommandIcon aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            {canWrapUp ? (
              <button
                type="button"
                onClick={() => handleSendMessage({ requestWrapUp: true })}
                disabled={inputDisabled || !value.trim()}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-text-secondary transition hover:border-accent-primary/50 hover:text-text-primary disabled:opacity-50"
              >
                Wrap up
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={inputDisabled || !value.trim()}
              className="flex items-center gap-2 rounded-full bg-accent-primary px-5 py-2 text-sm font-bold text-bg-primary transition hover:bg-teal-300 disabled:opacity-50"
            >
              <span>Send</span>
              {loading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Zap aria-hidden="true" className="h-4 w-4 fill-current" />}
              <Send aria-hidden="true" className="sr-only" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
