const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');

// Import route modules
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const trackRoutes = require('./routes/trackRoutes');
const albumRoutes = require('./routes/albumRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const libraryRoutes = require('./routes/libraryRoutes');
const supportRoutes = require('./routes/supportRoutes');
const faqRoutes = require('./routes/faqRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Import middleware
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

// ===========================================
// SECURITY MIDDLEWARE
// ===========================================

// Security headers
app.use(helmet());

// CORS
const allowedOrigins = env.CORS_ORIGIN === '*'
  ? '*'
  : env.CORS_ORIGIN.includes(',')
    ? env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : env.CORS_ORIGIN;

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    code: 'RATE_LIMITED',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// ===========================================
// BODY PARSING
// ===========================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===========================================
// LOGGING
// ===========================================

if (env.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ===========================================
// HEALTH CHECK
// ===========================================

app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: 'Saregama API is running',
    data: {
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    },
  });
});

// ===========================================
// API ROUTES
// ===========================================

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tracks', trackRoutes);
app.use('/api/v1/albums', albumRoutes);
app.use('/api/v1/playlists', playlistRoutes);
app.use('/api/v1/library', libraryRoutes);
app.use('/api/v1/support', supportRoutes);
app.use('/api/v1/faqs', faqRoutes);
app.use('/api/v1/admin', adminRoutes);

// ===========================================
// ERROR HANDLING
// ===========================================

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
