import { NextResponse } from "next/server";
import {
  API_GUARD_LIMITS,
  checkContentLength,
  checkRateLimit,
  fetchWithTimeout,
  getClientKey,
  rateLimitHeaders,
} from "@/lib/server/request-guards";

export async function POST(request: Request) {
  const clientKey = getClientKey(request, "transcribe");
  const rate = checkRateLimit(clientKey, API_GUARD_LIMITS.transcriptionRateLimit, API_GUARD_LIMITS.transcriptionRateWindowMs);
  if (!rate.allowed) {
    return NextResponse.json(
      { transcript: null, configured: Boolean(process.env.OPENAI_API_KEY?.trim()), error: "Too many transcription requests. Please wait a moment before trying again." },
      { status: 429, headers: rateLimitHeaders(rate) },
    );
  }

  const size = checkContentLength(request, API_GUARD_LIMITS.transcriptionBodyBytes);
  if (!size.ok) {
    return NextResponse.json({ transcript: null, configured: Boolean(process.env.OPENAI_API_KEY?.trim()), error: size.message }, { status: size.status });
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      {
        transcript: null,
        configured: false,
        error: "OPENAI_API_KEY is not configured.",
      },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ transcript: null, configured: true, error: "Invalid audio upload." }, { status: 400 });
  }

  const audio = formData.get("audio");
  if (!(audio instanceof Blob) || audio.size === 0) {
    return NextResponse.json({ transcript: null, configured: true, error: "Missing audio blob." }, { status: 400 });
  }
  if (audio.size > API_GUARD_LIMITS.transcriptionBodyBytes) {
    return NextResponse.json({ transcript: null, configured: true, error: "Audio file is too large." }, { status: 413 });
  }

  const upstream = new FormData();
  const audioFileName = (audio as Blob & { name?: string }).name?.trim();
  const audioName = audioFileName || "fluentia-recording.webm";
  upstream.append("model", process.env.OPENAI_TRANSCRIPTION_MODEL?.trim() || "whisper-1");
  upstream.append("file", audio, audioName);

  let response: Response;
  try {
    response = await fetchWithTimeout(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: upstream,
      },
      API_GUARD_LIMITS.transcriptionTimeoutMs,
    );
  } catch {
    return NextResponse.json({ transcript: null, configured: true, error: "Transcription provider timed out." }, { status: 504 });
  }

  if (!response.ok) {
    return NextResponse.json(
      {
        transcript: null,
        configured: true,
        error: `Transcription failed with status ${response.status}.`,
      },
      { status: 502 },
    );
  }

  const data = (await response.json()) as { text?: string };
  const transcript = data.text?.trim() || null;
  return NextResponse.json({ transcript, configured: true });
}
