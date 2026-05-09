import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  checkContentLength,
  checkRateLimit,
  clearServerViolations,
  fetchWithTimeout,
  getServerCooldown,
  registerServerViolation,
  resetRequestGuardsForTests,
} from "@/lib/server/request-guards";

describe("request guards", () => {
  beforeEach(() => {
    resetRequestGuardsForTests();
  });

  it("blocks requests after the configured rate limit", () => {
    expect(checkRateLimit("chat:local", 2, 60_000, 1000).allowed).toBe(true);
    expect(checkRateLimit("chat:local", 2, 60_000, 1001).allowed).toBe(true);
    const blocked = checkRateLimit("chat:local", 2, 60_000, 1002);

    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(60);
  });

  it("tracks moderation cooldown after repeated violations", () => {
    expect(registerServerViolation("speaker").warningCount).toBe(1);
    expect(registerServerViolation("speaker").warningCount).toBe(2);
    const third = registerServerViolation("speaker", 2000);

    expect(third.warningCount).toBe(3);
    expect(third.cooldownUntil).toBe(62_000);
    expect(getServerCooldown("speaker", 3000)).toMatchObject({ active: true, remainingSeconds: 59 });

    clearServerViolations("speaker");
    expect(getServerCooldown("speaker", 3000).active).toBe(false);
  });

  it("rejects invalid or oversized content lengths", () => {
    expect(checkContentLength(new Request("http://test.local", { headers: { "content-length": "10" } }), 20).ok).toBe(true);
    expect(checkContentLength(new Request("http://test.local", { headers: { "content-length": "21" } }), 20)).toMatchObject({ ok: false, status: 413 });
    expect(checkContentLength(new Request("http://test.local", { headers: { "content-length": "nope" } }), 20)).toMatchObject({ ok: false, status: 400 });
  });

  it("aborts slow fetch calls", async () => {
    vi.useFakeTimers();
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn((_input: RequestInfo | URL, init?: RequestInit) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")));
      }),
    ) as typeof fetch;

    const pending = fetchWithTimeout("http://test.local", {}, 25);
    const assertion = expect(pending).rejects.toThrow(/aborted/i);
    await vi.advanceTimersByTimeAsync(26);
    await assertion;

    globalThis.fetch = originalFetch;
    vi.useRealTimers();
  });
});
