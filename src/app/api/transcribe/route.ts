import { NextResponse } from "next/server";

export async function POST(request: Request) {
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

  const formData = await request.formData();
  const audio = formData.get("audio");
  if (!(audio instanceof Blob) || audio.size === 0) {
    return NextResponse.json({ transcript: null, configured: true, error: "Missing audio blob." }, { status: 400 });
  }

  const upstream = new FormData();
  upstream.append("model", process.env.OPENAI_TRANSCRIPTION_MODEL?.trim() || "whisper-1");
  upstream.append("file", audio, "fluentia-recording.webm");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: upstream,
  });

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
