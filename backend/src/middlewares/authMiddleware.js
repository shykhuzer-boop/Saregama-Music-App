const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

/**
 * JWT authentication middleware.
 * Extracts token from Authorization header, verifies it,
 * and attaches the user to req.user.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.unauthorized(res, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return ApiResponse.unauthorized(res, 'User not found. Token may be invalid.');
    }

    if (user.status === 'suspended') {
      return ApiResponse.error(
        res,
        'This account has been suspended by the Saregama Administrator.',
        'ACCOUNT_SUSPENDED',
        403
      );
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id.toString();

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.unauthorized(res, 'Token expired. Please login again.');
    }
    if (error.name === 'JsonWebTokenError') {
      return ApiResponse.unauthorized(res, 'Invalid token.');
    }
    next(error);
  }
};

/**
 * Optional authentication — does not block if no token,
 * but attaches user if token is present and valid.
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (user && user.status !== 'suspended') {
      req.user = user;
      req.userId = user._id.toString();
    }

    next();
  } catch {
    // Invalid token — proceed without auth
    next();
  }
};

module.exports = { authenticate, optionalAuth };
