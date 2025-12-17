/**
 * Custom error classes and error handling utilities
 */

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public fields?: Record<string, string[]>) {
    super(message, 400)
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401)
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404)
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429)
  }
}

/**
 * Handle API errors and return appropriate response
 * Don't expose internal error details to clients in production
 */
export function handleApiError(error: unknown): {
  message: string
  statusCode: number
  details?: any
} {
  // Known application errors
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      details: error instanceof ValidationError ? error.fields : undefined,
    }
  }

  // Zod validation errors
  if (error && typeof error === 'object' && 'issues' in error) {
    return {
      message: 'Validation failed',
      statusCode: 400,
      details: (error as any).issues,
    }
  }

  // Don't expose internal errors in production
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  if (isDevelopment) {
    console.error('API Error:', error)
    return {
      message: error instanceof Error ? error.message : 'An error occurred',
      statusCode: 500,
      details: error,
    }
  }

  // Production: log error but don't expose details
  console.error('Internal server error:', error)
  return {
    message: 'An error occurred. Please try again later.',
    statusCode: 500,
  }
}

