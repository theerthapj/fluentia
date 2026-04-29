import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ transcript: null, fallback: true });

  const formData = await request.formData();
  const audio = formData.get("audio");
  if (!(audio instanceof Blob)) {
    return NextResponse.json({ transcript: null, fallback: true, error: "Missing audio blob." }, { status: 400 });
  }

  const upstream = new FormData();
  upstream.append("model", "whisper-1");
  upstream.append("file", audio, "fluentia-recording.webm");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: upstream,
  });

  if (!response.ok) return NextResponse.json({ transcript: null, fallback: true }, { status: 200 });
  const data = (await response.json()) as { text?: string };
  return NextResponse.json({ transcript: data.text ?? null, fallback: !data.text });
}
