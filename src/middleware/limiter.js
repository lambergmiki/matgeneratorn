import rateLimit from 'express-rate-limit'

export const limiter = rateLimit({
  windowMs: 20 * 1000, // 20s
  limit: 5, // max 5 attempts within time frame
  // Error message is not user friendly, future TODO with error view/flash message.
  message: { error: 'Too many requests, please calm down with the generating.' },
  standardHeaders: true,
  legacyHeaders: false
})
