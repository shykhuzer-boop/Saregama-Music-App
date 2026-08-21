const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { registerValidator, loginValidator, forgotPasswordValidator } = require('../validators/authValidator');
const { validateRequest } = require('../middlewares/validateRequest');
const { authenticate } = require('../middlewares/authMiddleware');
const env = require('../config/env');

const router = express.Router();

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.AUTH_RATE_LIMIT_MAX,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
    code: 'RATE_LIMITED',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/v1/auth/register
router.post('/register', authLimiter, registerValidator, validateRequest, authController.register);

// POST /api/v1/auth/login
router.post('/login', authLimiter, loginValidator, validateRequest, authController.login);

// POST /api/v1/auth/forgot-password
router.post('/forgot-password', authLimiter, forgotPasswordValidator, validateRequest, authController.forgotPassword);

// GET /api/v1/auth/me (protected)
router.get('/me', authenticate, authController.getMe);

module.exports = router;
