import { NextRequest } from 'next/server'

interface RateLimitRecord {
  count: number
  resetTime: number
}

// Simple in-memory rate limiter
// For production, use Redis-based solution like @upstash/ratelimit
const rateLimitMap = new Map<string, RateLimitRecord>()

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
}

/**
 * Rate limit function
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param maxRequests - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns Rate limit result
 */
export function rateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute default
): RateLimitResult {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  // No record or window expired
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return {
      success: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
    }
  }

  // Rate limit exceeded
  if (record.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: record.resetTime,
    }
  }

  // Increment count
  record.count++
  return {
    success: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  }
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: NextRequest): string {
  // Check for forwarded IP (from proxy/load balancer)
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim()
  }

  // Check for real IP header
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP.trim()
  }

  // Fallback (shouldn't happen in production with proper proxy setup)
  return request.ip || 'unknown'
}

/**
 * Rate limit middleware helper for API routes
 */
export function checkRateLimit(
  request: NextRequest,
  maxRequests: number = 10,
  windowMs: number = 60000
): RateLimitResult {
  const ip = getClientIP(request)
  return rateLimit(ip, maxRequests, windowMs)
}

