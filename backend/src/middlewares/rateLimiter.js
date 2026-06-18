// rateLimiter.js – simple global rate limiting
import rateLimit from 'express-rate-limit';

// 100 requests per 15 minutes per IP (default)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
