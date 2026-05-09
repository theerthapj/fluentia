"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, Square } from "lucide-react";
import { toast } from "sonner";
import { useFluvi } from "@/context/FluviContext";
import { cn } from "@/lib/utils";

export function VoiceSimButton({
  id,
  onCapture,
  disabled,
}: {
  id: string;
  onCapture: (text: string) => void;
  disabled?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "recording" | "analyzing">("idle");
  const { startSpeaking, stopSpeaking, setVoiceAmplitude } = useFluvi();
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timeoutRef = useRef<number | null>(null);
  const amplitudeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (status !== "recording") {
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
      setVoiceAmplitude(0.25 + Math.random() * 0.7);
    }, 140);

    return () => {
      if (amplitudeTimerRef.current) {
        window.clearInterval(amplitudeTimerRef.current);
        amplitudeTimerRef.current = null;
      }
      setVoiceAmplitude(0);
      stopSpeaking();
    };
  }, [setVoiceAmplitude, startSpeaking, status, stopSpeaking]);

  const transcribe = async (blob: Blob) => {
    setStatus("analyzing");
    try {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");
      const response = await fetch("/api/transcribe", { method: "POST", body: formData });
      const data = (await response.json()) as { transcript?: string | null; fallback?: boolean };
      if (data.transcript) {
        onCapture(data.transcript);
        toast.success("Voice captured.");
      } else {
        toast.error("Voice transcription is unavailable right now. Please type your response.");
      }
    } catch {
      toast.error("Voice transcription is unavailable right now. Please type your response.");
    } finally {
      setStatus("idle");
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
      setStatus("recording");
      timeoutRef.current = window.setTimeout(stopRecording, 30_000);
    } catch (error) {
      console.error("Voice capture error:", error);
      let errorMessage = "Microphone access denied.";
      if (error instanceof DOMException) {
        if (error.name === "NotFoundError") errorMessage = "No microphone found. Please connect a mic.";
        else if (error.name === "NotReadableError") errorMessage = "Microphone is already in use by another app.";
        else if (error.name === "NotAllowedError") errorMessage = "Microphone access blocked by browser or OS.";
        else errorMessage = `Microphone error: ${error.message}`;
      } else if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }
      toast.error(`${errorMessage} Please type your response.`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        id={id}
        aria-label={status === "recording" ? "Stop voice recording" : "Start voice recording"}
        type="button"
        onClick={() => (status === "recording" ? stopRecording() : startRecording())}
        disabled={disabled || status === "analyzing"}
        className={cn(
          "relative grid h-12 w-12 shrink-0 place-items-center rounded-full transition disabled:opacity-70",
          status === "recording" ? "pulse-teal bg-error text-white" : "bg-accent-primary text-bg-primary hover:bg-teal-300",
        )}
      >
        {status === "analyzing" ? <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" /> : status === "recording" ? <Square aria-hidden="true" className="h-5 w-5" /> : <Mic aria-hidden="true" className="h-5 w-5" />}
      </button>
      {status !== "idle" ? <span className="hidden text-xs text-text-secondary sm:inline">{status === "recording" ? "Recording... tap to stop" : "Analyzing..."}</span> : null}
    </div>
  );
}
