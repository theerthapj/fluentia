type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type CooldownBucket = {
  warningCount: number;
  cooldownUntil: number | null;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

const rateBuckets = new Map<string, RateLimitBucket>();
const cooldownBuckets = new Map<string, CooldownBucket>();

const cooldownMessages = [
  "Please use respectful language. Try rephrasing.",
  "Repeated inappropriate language detected. Please keep this a safe learning space.",
  "Input is paused for 60 seconds. Please return with a respectful English practice sentence.",
];

export const API_GUARD_LIMITS = {
  conversationBodyBytes: 64 * 1024,
  conversationHistoryMessages: 30,
  conversationRateLimit: 30,
  conversationRateWindowMs: 60_000,
  conversationTimeoutMs: 20_000,
  transcriptionBodyBytes: 8 * 1024 * 1024,
  transcriptionRateLimit: 8,
  transcriptionRateWindowMs: 60_000,
  transcriptionTimeoutMs: 30_000,
};

export function getClientKey(request: Request, namespace: string) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const userAgent = request.headers.get("user-agent")?.slice(0, 80) ?? "unknown-agent";
  return `${namespace}:${forwardedFor || realIp || "local"}:${userAgent}`;
}

export function checkContentLength(request: Request, maxBytes: number) {
  const raw = request.headers.get("content-length");
  if (!raw) return { ok: true as const };
  const bytes = Number(raw);
  if (!Number.isFinite(bytes) || bytes < 0) return { ok: false as const, status: 400, message: "Invalid content length." };
  if (bytes > maxBytes) return { ok: false as const, status: 413, message: "Request body is too large." };
  return { ok: true as const };
}

export function checkRateLimit(key: string, limit: number, windowMs: number, now = Date.now()): RateLimitResult {
  const current = rateBuckets.get(key);
  const bucket = current && current.resetAt > now ? current : { count: 0, resetAt: now + windowMs };
  bucket.count += 1;
  rateBuckets.set(key, bucket);

  const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  return {
    allowed: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.resetAt,
    retryAfterSeconds,
  };
}

export function rateLimitHeaders(result: RateLimitResult) {
  return {
    "Retry-After": String(result.retryAfterSeconds),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
}

export function getServerCooldown(key: string, now = Date.now()) {
  const bucket = cooldownBuckets.get(key);
  if (!bucket?.cooldownUntil || bucket.cooldownUntil <= now) return { active: false as const, remainingSeconds: 0 };
  return {
    active: true as const,
    remainingSeconds: Math.ceil((bucket.cooldownUntil - now) / 1000),
    message: cooldownMessages[2],
  };
}

export function registerServerViolation(key: string, now = Date.now()) {
  const current = cooldownBuckets.get(key);
  const nextCount = (current?.warningCount ?? 0) + 1;
  const cooldownUntil = nextCount >= 3 ? now + 60_000 : null;
  const state = { warningCount: nextCount, cooldownUntil };
  cooldownBuckets.set(key, state);
  return {
    ...state,
    message: cooldownMessages[Math.min(nextCount - 1, cooldownMessages.length - 1)],
    remainingSeconds: cooldownUntil ? Math.ceil((cooldownUntil - now) / 1000) : 0,
  };
}

export function clearServerViolations(key: string) {
  cooldownBuckets.delete(key);
}

export async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export function resetRequestGuardsForTests() {
  rateBuckets.clear();
  cooldownBuckets.clear();
}
