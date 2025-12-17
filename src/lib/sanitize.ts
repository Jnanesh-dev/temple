/**
 * Input sanitization utilities
 * For production, consider using:
 * - DOMPurify for HTML sanitization
 * - validator.js for string validation
 */

/**
 * Sanitize HTML content - removes potentially dangerous tags and attributes
 * In production, use DOMPurify: npm install isomorphic-dompurify
 */
export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  // TODO: Install and use DOMPurify for production
  // import DOMPurify from 'isomorphic-dompurify'
  // return DOMPurify.sanitize(html, { ALLOWED_TAGS: ['p', 'br', 'strong', 'em'] })
  
  // Temporary basic sanitization
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .trim()
}

/**
 * Sanitize plain text string
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .substring(0, 10000) // Max length limit
}

/**
 * Sanitize and validate email address
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return ''
  }
  
  const trimmed = email.trim().toLowerCase()
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    return ''
  }
  
  return trimmed.substring(0, 255) // Max email length
}

/**
 * Sanitize URL
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') {
    return ''
  }
  
  const trimmed = url.trim()
  
  // Only allow http and https protocols
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return ''
  }
  
  // Basic URL validation
  try {
    const urlObj = new URL(trimmed)
    // Only allow http and https
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return ''
    }
    return trimmed.substring(0, 2048) // Max URL length
  } catch {
    return ''
  }
}

/**
 * Sanitize phone number (keep only digits, +, and spaces)
 */
export function sanitizePhone(phone: string): string {
  if (typeof phone !== 'string') {
    return ''
  }
  
  return phone
    .replace(/[^\d+\s-]/g, '') // Keep only digits, +, spaces, and hyphens
    .trim()
    .substring(0, 20) // Max phone length
}

/**
 * Sanitize numeric input
 */
export function sanitizeNumber(input: string | number): number | null {
  if (typeof input === 'number') {
    return isNaN(input) || !isFinite(input) ? null : input
  }
  
  if (typeof input !== 'string') {
    return null
  }
  
  const num = parseFloat(input.trim())
  return isNaN(num) || !isFinite(num) ? null : num
}

/**
 * Sanitize object keys (prevent prototype pollution)
 */
export function sanitizeObject(obj: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(obj)) {
    // Prevent prototype pollution
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue
    }
    
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value)
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value)
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized
}

