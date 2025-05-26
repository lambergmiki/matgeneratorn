import rateLimit from 'express-rate-limit'

/**
 * @file Rate limiter middleware using express-rate-limit.
 * Limits number of requests within a time window.
 * @module limiter
 */

export const limiter = rateLimit({
  windowMs: 20 * 1000, // 20s window
  limit: 5, // max 5 requests per window
  // Error message is not user friendly, TODO: error handler
  message: { error: 'Too many requests, please calm down with the generating.' },
  standardHeaders: true,
  legacyHeaders: false
})
