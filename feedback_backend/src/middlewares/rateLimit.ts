import { Context, Next } from 'hono'
import { Env } from '../types/env'

// Simple in-memory rate limiting (for production, use KV or Durable Objects)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export async function rateLimit(c: Context<{ Bindings: Env }>, next: Next) {
  const clientIP = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 20 // 20 requests per minute

  const key = `ratelimit:${clientIP}`
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    // Reset window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    })
  } else {
    // Increment count
    record.count++

    if (record.count > maxRequests) {
      return c.json(
        {
          success: false,
          message: 'Rate limit exceeded. Please try again later.',
        },
        429
      )
    }
  }

  // Cleanup old entries (simple memory management)
  if (rateLimitStore.size > 10000) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (now > v.resetTime) {
        rateLimitStore.delete(k)
      }
    }
  }

  await next()
}
