/**
 * In-memory rate limiter — no external dependencies.
 * Suitable for single-instance deployments (Vercel serverless per-region).
 * For multi-region production, replace the store with Redis/Vercel KV.
 *
 * Usage:
 *   const limiter = createRateLimiter({ windowMs: 60_000, max: 5 });
 *   const result = limiter.check(ip);
 *   if (!result.allowed) return 429;
 */

interface Entry {
  count: number;
  resetAt: number;
}

interface RateLimiter {
  check(key: string): { allowed: boolean; remaining: number; resetAt: number };
}

export function createRateLimiter(opts: {
  windowMs: number; // sliding window in ms
  max: number;      // max requests per window
}): RateLimiter {
  const store = new Map<string, Entry>();

  // Prune stale entries periodically to avoid memory leaks
  // Only runs in Node environments (not Edge)
  if (typeof setInterval !== "undefined") {
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of store.entries()) {
        if (entry.resetAt < now) store.delete(key);
      }
    }, opts.windowMs * 2).unref?.();
  }

  return {
    check(key: string) {
      const now = Date.now();
      const existing = store.get(key);

      if (!existing || existing.resetAt < now) {
        // New window
        const entry: Entry = { count: 1, resetAt: now + opts.windowMs };
        store.set(key, entry);
        return { allowed: true, remaining: opts.max - 1, resetAt: entry.resetAt };
      }

      existing.count++;
      const allowed = existing.count <= opts.max;
      return {
        allowed,
        remaining: Math.max(0, opts.max - existing.count),
        resetAt: existing.resetAt,
      };
    },
  };
}

// ── Shared limiters ───────────────────────────────────────────────────────────

/** Login: 10 attempts per 15 minutes per IP */
export const loginLimiter = createRateLimiter({ windowMs: 15 * 60_000, max: 10 });

/** Lead form: 5 submissions per 10 minutes per IP */
export const leadLimiter = createRateLimiter({ windowMs: 10 * 60_000, max: 5 });

/** Media upload: 30 uploads per 5 minutes per user */
export const uploadLimiter = createRateLimiter({ windowMs: 5 * 60_000, max: 30 });
