import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/transcribe/route";
import { resetRequestGuardsForTests } from "@/lib/server/request-guards";

function uploadRequest(formData: FormData, userAgent = "vitest-agent") {
  return new Request("http://test.local/api/transcribe", {
    method: "POST",
    headers: { "user-agent": userAgent },
    body: formData,
  });
}

describe("/api/transcribe", () => {
  beforeEach(() => {
    resetRequestGuardsForTests();
    vi.unstubAllEnvs();
  });

  it("returns a clear unavailable response when OpenAI is not configured", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");
    const body = new FormData();
    body.append("audio", new Blob(["audio"], { type: "audio/webm" }), "recording.webm");

    const response = await POST(uploadRequest(body));

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      transcript: null,
      configured: false,
      error: "OPENAI_API_KEY is not configured.",
    });
  });

  it("rejects missing audio before contacting the provider", async () => {
    vi.stubEnv("OPENAI_API_KEY", "test-key");

    const response = await POST(uploadRequest(new FormData(), "missing-audio"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ transcript: null, configured: true, error: "Missing audio blob." });
  });

  it("rejects oversized audio blobs", async () => {
    vi.stubEnv("OPENAI_API_KEY", "test-key");
    const request = new Request("http://test.local/api/transcribe", {
      method: "POST",
      headers: {
        "content-length": String(8 * 1024 * 1024 + 1),
        "user-agent": "large-audio",
      },
      body: new FormData(),
    });

    const response = await POST(request);

    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toMatchObject({ transcript: null, configured: true, error: "Request body is too large." });
  });
});
