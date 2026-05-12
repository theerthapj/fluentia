"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Command as CommandIcon, Languages, Loader2, Mic, MessageSquare, Send, Sparkles, Square, X, Zap } from "lucide-react";
import { toast } from "sonner";
import { useAppState } from "@/components/providers/AppStateProvider";
import { useFluvi } from "@/context/FluviContext";
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

type SpeechRecognitionResultItem = {
  isFinal: boolean;
  0: { transcript: string };
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: {
    length: number;
    item?: (index: number) => SpeechRecognitionResultItem;
    [index: number]: SpeechRecognitionResultItem;
  };
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

const learningCommands = [
  { icon: Languages, label: "Explain Grammar", prefix: "/explain", desc: "Break down the last sentence." },
  { icon: Sparkles, label: "Improve Flow", prefix: "/improve", desc: "Ask for a more natural version." },
  { icon: MessageSquare, label: "New Scenario", prefix: "/scenarios", desc: "Switch practice situation." },
];

const quickPrompts = [
  "Correct my grammar.",
  "Make this more natural.",
  "Give me a harder follow-up.",
  "Show a simpler version.",
];

function commandToMessage(value: string) {
  if (value.startsWith("/explain")) return "Please explain the grammar in my last response and give me one clear correction.";
  if (value.startsWith("/improve")) return "Please improve the flow of my last response and show me a more natural spoken version.";
  return value;
}

export function FluentiaAnimatedChat({
  scenarioTitle,
  onSendMessage,
  canWrapUp,
  disabled,
  loading,
  onUnsafeInput,
}: FluentiaAnimatedChatProps) {
  const router = useRouter();
  const { state, setWarnings } = useAppState();
  const { startSpeaking, stopSpeaking, setVoiceAmplitude, triggerWarning } = useFluvi();
  const [value, setValue] = useState("");
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "recording" | "analyzing">("idle");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timeoutRef = useRef<number | null>(null);
  const amplitudeTimerRef = useRef<number | null>(null);
  const voiceBaseValueRef = useRef("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const commandPaletteRef = useRef<HTMLDivElement | null>(null);
  const commandButtonRef = useRef<HTMLButtonElement | null>(null);

  const inputDisabled = disabled || loading;
  const prefersVoice = state.preferences.preferredInputMode === "voice";

  useEffect(() => {
    if (voiceStatus !== "recording") {
      if (amplitudeTimerRef.current) {
        window.clearInterval(amplitudeTimerRef.current);
        amplitudeTimerRef.current = null;
      }
      setVoiceAmplitude(0);
      stopSpeaking();
      return;
    }

    startSpeaking();
    amplitudeTimerRef.current = window.setInterval(() => {
      setVoiceAmplitude(0.28 + Math.random() * 0.68);
    }, 140);

    return () => {
      if (amplitudeTimerRef.current) {
        window.clearInterval(amplitudeTimerRef.current);
        amplitudeTimerRef.current = null;
      }
      setVoiceAmplitude(0);
      stopSpeaking();
    };
  }, [setVoiceAmplitude, startSpeaking, stopSpeaking, voiceStatus]);

  useEffect(() => {
    if (!showCommandPalette) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (commandPaletteRef.current?.contains(target) || commandButtonRef.current?.contains(target)) return;
      setShowCommandPalette(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowCommandPalette(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showCommandPalette]);

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  };

  const setInputValue = (nextValue: string) => {
    setValue(nextValue);
    window.requestAnimationFrame(resizeTextarea);
  };

  const mergeVoiceText = (baseText: string, transcript: string) => {
    const cleanBase = baseText.trimEnd();
    const cleanTranscript = transcript.trim();
    if (!cleanTranscript) return cleanBase;
    return cleanBase ? `${cleanBase} ${cleanTranscript}` : cleanTranscript;
  };

  const reportUnsafe = (message: string) => {
    const escalation = registerViolation();
    setWarnings(escalation.warningCount, escalation.cooldownUntil);
    triggerWarning();
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

  const openCommandPalette = () => {
    setActiveSuggestion((current) => (current >= 0 ? current : 0));
    setShowCommandPalette(true);
  };

  const sendQuickPrompt = (prompt: string, options?: SendOptions) => {
    if (inputDisabled) return;
    const moderation = checkModeration(prompt);
    if (!moderation.safe) {
      reportUnsafe(moderation.warning ?? "Please rephrase respectfully.");
      return;
    }
    onSendMessage(prompt, options);
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
    setValue(`${prefix} `);
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
      const data = (await response.json()) as { transcript?: string | null; configured?: boolean; error?: string };
      if (data.transcript) {
        setInputValue(mergeVoiceText(voiceBaseValueRef.current, data.transcript));
        toast.success("Voice captured.");
      } else if (data.configured === false) {
        toast.error("Add OPENAI_API_KEY in .env.local, then restart the dev server to enable voice transcription.");
      } else {
        toast.error(data.error ?? "Whisper transcription is unavailable right now. Please type your response.");
      }
    } catch {
      toast.error("Whisper transcription is unavailable right now. Please type your response.");
    } finally {
      setVoiceStatus("idle");
    }
  };

  const stopRecording = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      return;
    }

    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      return;
    }

    setVoiceStatus("idle");
    toast.error("Whisper transcription is unavailable right now. Please type your response.");
  };

  const startSpeechRecognition = (SpeechRecognition: new () => SpeechRecognitionLike) => {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    speechRecognitionRef.current = recognition;
    setVoiceStatus("recording");
    recognition.onresult = (event) => {
      const transcripts: string[] = [];
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results.item?.(index) ?? event.results[index];
        if (result?.[0]?.transcript) transcripts.push(result[0].transcript);
      }
      if (transcripts.length) {
        setInputValue(mergeVoiceText(voiceBaseValueRef.current, transcripts.join(" ")));
      }
    };
    recognition.onerror = () => {
      speechRecognitionRef.current = null;
      setVoiceStatus("idle");
      toast.error("Voice transcription is unavailable right now. Please type your response.");
    };
    recognition.onend = () => {
      speechRecognitionRef.current = null;
      setVoiceStatus("idle");
    };
    recognition.start();
    timeoutRef.current = window.setTimeout(stopRecording, 30_000);
  };

  const startRecording = async () => {
    voiceBaseValueRef.current = value;

    if (!navigator.mediaDevices?.getUserMedia) {
      const SpeechRecognition = (window as SpeechRecognitionWindow).SpeechRecognition ?? (window as SpeechRecognitionWindow).webkitSpeechRecognition;
      if (SpeechRecognition) {
        startSpeechRecognition(SpeechRecognition);
        return;
      }
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
        recorderRef.current = null;
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
      <motion.div
        className="relative overflow-visible rounded-3xl border border-white/[0.08] bg-white/[0.04] shadow-2xl backdrop-blur-xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <AnimatePresence>
          {showCommandPalette ? (
            <motion.div
              id="learning-command-palette"
              ref={commandPaletteRef}
              role="menu"
              aria-label="Learning commands"
              className="absolute bottom-[calc(100%+0.75rem)] left-2 right-2 z-50 max-h-72 overflow-hidden rounded-2xl border border-border bg-bg-primary/95 shadow-2xl backdrop-blur-xl sm:left-4 sm:right-4 sm:max-h-80"
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
              <div className="grid max-h-56 gap-1 overflow-y-auto p-2">
                {learningCommands.map((command, index) => {
                  const Icon = command.icon;
                  return (
                    <button
                      key={command.prefix}
                      type="button"
                      role="menuitem"
                      onMouseEnter={() => setActiveSuggestion(index)}
                      onClick={() => selectCommand(command.prefix)}
                      className={cn(
                        "flex min-w-0 items-center gap-3 rounded-xl px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/70",
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

        <div className="flex gap-2 overflow-x-auto border-b border-border px-4 py-3">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={inputDisabled}
              onClick={() => sendQuickPrompt(prompt)}
              className="shrink-0 rounded-full border border-border bg-white/[0.04] px-3 py-2 text-xs font-semibold text-text-secondary transition hover:border-accent-primary/50 hover:text-text-primary disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
          {canWrapUp ? (
            <button
              type="button"
              disabled={inputDisabled}
              onClick={() => sendQuickPrompt("Please wrap up this session and give me final feedback.", { requestWrapUp: true })}
              className="shrink-0 rounded-full border border-accent-primary/40 bg-accent-primary/10 px-3 py-2 text-xs font-semibold text-accent-primary transition hover:bg-accent-primary hover:text-bg-primary disabled:opacity-50"
            >
              End session
            </button>
          ) : null}
        </div>

        <div className="p-4">
          <textarea
            id="chat-input"
            ref={textareaRef}
            value={value}
            disabled={inputDisabled}
            onChange={(event) => {
              const nextValue = event.target.value;
              setValue(nextValue);
              resizeTextarea();
              if (nextValue.trim().startsWith("/")) openCommandPalette();
              else setShowCommandPalette(false);
            }}
            placeholder={prefersVoice ? `Use voice or type for ${scenarioTitle}...` : `Message ${scenarioTitle}...`}
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
              if (event.key === "/") openCommandPalette();
            }}
            onFocus={() => {
              if (value.trim().startsWith("/")) openCommandPalette();
            }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-3">
          <div className="flex gap-2">
            <button
              id="chat-voice-button"
              type="button"
              aria-label={voiceStatus === "recording" ? "Stop voice recording" : "Start voice recording"}
              disabled={inputDisabled || voiceStatus === "analyzing"}
              onClick={() => (voiceStatus === "recording" ? stopRecording() : startRecording())}
              className={cn(
                "grid h-10 w-10 place-items-center rounded-full text-text-secondary transition hover:text-accent-primary disabled:opacity-50",
                prefersVoice && "bg-accent-primary/15 text-accent-primary ring-1 ring-accent-primary/40",
                voiceStatus === "recording" && "pulse-teal bg-error/20 text-error",
              )}
            >
              {voiceStatus === "analyzing" ? <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" /> : voiceStatus === "recording" ? <Square aria-hidden="true" className="h-5 w-5" /> : <Mic aria-hidden="true" className="h-5 w-5" />}
            </button>
            <button
              id="chat-command-button"
              ref={commandButtonRef}
              type="button"
              aria-label="Open learning commands"
              aria-controls="learning-command-palette"
              aria-expanded={showCommandPalette}
              title="Open learning commands"
              onClick={() => {
                setShowCommandPalette((current) => {
                  const next = !current;
                  if (next) setActiveSuggestion(0);
                  return next;
                });
              }}
              className={cn(
                "grid h-10 w-10 place-items-center rounded-full text-text-secondary transition hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/70",
                showCommandPalette && "bg-accent-primary/15 text-accent-primary ring-1 ring-accent-primary/40",
              )}
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
              id="chat-send-button"
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
