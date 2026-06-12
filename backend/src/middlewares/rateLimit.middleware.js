const rateLimit = require('express-rate-limit');

// 1. General API — all routes fallback
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. Auth routes — strict (brute force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// 3. Project READ routes — moderate
const projectReadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: { success: false, message: 'Too many requests. Please slow down' },
  standardHeaders: true,
  legacyHeaders: false,
});

// 4. Project WRITE routes (create/update/delete) — very strict
const projectWriteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many write operations. Please wait' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiLimiter, authLimiter, projectReadLimiter, projectWriteLimiter };