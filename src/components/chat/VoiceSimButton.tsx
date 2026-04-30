"use client";

import { useRef, useState } from "react";
import { Loader2, Mic, Square } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function VoiceSimButton({ id, fallbackText, onCapture }: { id: string; fallbackText: string; onCapture: (text: string) => void }) {
  const [status, setStatus] = useState<"idle" | "recording" | "analyzing">("idle");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timeoutRef = useRef<number | null>(null);

  const isSimulated = process.env.NEXT_PUBLIC_AI_MODE === "simulated";

  const showComingSoon = () => {
    toast.info("🎙️ Voice Input — Coming Soon!", {
      id: "voice-coming-soon",
      description: "Voice recording is not yet available. Please type your response for now.",
    });
  };

  const transcribe = async (blob: Blob) => {
    setStatus("analyzing");
    try {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");
      const response = await fetch("/api/transcribe", { method: "POST", body: formData });
      const data = (await response.json()) as { transcript?: string | null; fallback?: boolean };
      if (data.transcript) {
        onCapture(data.transcript);
        toast.success("Voice captured ✓");
      } else {
        toast.error("Could not transcribe audio. Please type your response.");
      }
    } catch {
      toast.error("Voice transcription unavailable. Please type your response.");
    } finally {
      setStatus("idle");
    }
  };

  const stopRecording = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    recorderRef.current?.stop();
  };

  const startRecording = async () => {
    if (isSimulated || !navigator.mediaDevices?.getUserMedia) {
      showComingSoon();
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
      setStatus("recording");
      timeoutRef.current = window.setTimeout(stopRecording, 30_000);
    } catch {
      toast.error("Microphone access denied. Please type your response.");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        id={id}
        aria-label={isSimulated ? "Voice input coming soon" : status === "recording" ? "Stop voice recording" : "Start voice recording"}
        type="button"
        onClick={() => (status === "recording" ? stopRecording() : startRecording())}
        disabled={status === "analyzing"}
        className={cn(
          "relative grid h-12 w-12 shrink-0 place-items-center rounded-full transition disabled:opacity-70",
          isSimulated
            ? "bg-white/10 text-text-secondary hover:bg-white/15"
            : status === "recording"
              ? "pulse-teal bg-error text-white"
              : "bg-accent-primary text-bg-primary hover:bg-teal-300",
        )}
      >
        {status === "analyzing" ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : status === "recording" ? <Square aria-hidden className="h-5 w-5" /> : <Mic aria-hidden className="h-5 w-5" />}
        {isSimulated ? (
          <span className="absolute -right-1 -top-1 rounded-full bg-accent-secondary px-1.5 py-0.5 text-[9px] font-bold leading-none text-white">
            SOON
          </span>
        ) : null}
      </button>
      {status !== "idle" ? <span className="hidden text-xs text-text-secondary sm:inline">{status === "recording" ? "Recording... tap to stop" : "Analyzing..."}</span> : null}
    </div>
  );
}

