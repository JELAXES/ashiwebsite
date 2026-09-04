/**
 * In-memory, per-instance rate limiting. This is a structural placeholder — it resets on
 * redeploy and does not coordinate across serverless instances. Swap for a shared store
 * (e.g. Upstash Redis) before relying on this in a multi-instance production deployment.
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;

const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  bucket.count += 1;
  return true;
}
