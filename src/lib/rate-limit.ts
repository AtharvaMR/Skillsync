// ============================================
// SKILLSYNC — Simple Sliding-Window Rate Limiter
// ============================================

interface BucketEntry {
  timestamps: number[];
}

const buckets = new Map<string, BucketEntry>();

export function checkRateLimit(
  key: string,
  limit: number = 25,
  windowMs: number = 15 * 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const cutoff = now - windowMs;
  const existing = buckets.get(key) || { timestamps: [] };
  const recent = existing.timestamps.filter((ts) => ts > cutoff);

  if (recent.length >= limit) {
    const oldest = recent[0] || now;
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    buckets.set(key, { timestamps: recent });
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  recent.push(now);
  buckets.set(key, { timestamps: recent });
  return { allowed: true, remaining: Math.max(0, limit - recent.length), retryAfterSeconds: 0 };
}
