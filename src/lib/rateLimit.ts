/**
 * Fixed-window rate limiter, in memory.
 *
 * ⚠️ Per-instance. On Vercel each serverless instance keeps its own
 * counter, so the effective limit across a scaled-out deployment is
 * (limit × instances). That is fine for what this defends against —
 * a form being hammered from one browser — but it is NOT a hard
 * control. If you need one, put it in front of the route (Vercel
 * Firewall rate limiting, or Upstash Redis as a shared counter).
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/** Stop the map growing without bound on a long-lived instance. */
function sweep(now: number) {
  if (windows.size < 5000) return;
  for (const [key, w] of windows) {
    if (w.resetAt <= now) windows.delete(key);
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  sweep(now);

  const existing = windows.get(key);
  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Best-effort client IP. Vercel sets x-forwarded-for; the left-most
 * entry is the client. Falls back to a constant, which means an
 * unknown-IP flood shares one bucket rather than bypassing the limit.
 */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}
