/**
 * In-memory sliding window rate limiter for edge/serverless routes.
 * Prevents brute force, spam submissions, and resource exhaustion.
 */

interface RateLimitRecord {
  timestamps: number[]
}

const cache = new Map<string, RateLimitRecord>()

// Periodic garbage collection every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, record] of cache.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 600000)
      if (record.timestamps.length === 0) {
        cache.delete(key)
      }
    }
  }, 300000)
}

export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now()
  const windowStart = now - windowMs

  let record = cache.get(identifier)
  if (!record) {
    record = { timestamps: [] }
    cache.set(identifier, record)
  }

  // Keep only timestamps within window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart)

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0]
    const reset = Math.ceil((oldest + windowMs - now) / 1000)
    return { success: false, remaining: 0, reset }
  }

  record.timestamps.push(now)
  return {
    success: true,
    remaining: limit - record.timestamps.length,
    reset: Math.ceil(windowMs / 1000),
  }
}
