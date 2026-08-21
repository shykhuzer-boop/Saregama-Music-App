const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const logger = require('../config/logger');

class AuthService {
  /**
   * Generate JWT token for a user
   */
  generateToken(userId) {
    return jwt.sign({ userId }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });
  }

  /**
   * Register a new user
   */
  async register({ name, email, password, isStudent = false, universityName = '', avatarUrl = '' }) {
    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const error = new Error('An account with this email already exists.');
      error.statusCode = 409;
      error.code = 'DUPLICATE_ENTRY';
      throw error;
    }

    // Determine plan based on student status (BR-004, BR-005)
    const userFields = {
      name,
      email: email.toLowerCase(),
      passwordHash: password, // Will be hashed by pre-save hook
      avatarUrl,
      isPro: isStudent,
      planName: isStudent ? 'Student 4-Year Pass' : 'Free Tier',
      role: 'user',
      status: 'active',
      offlineStorageUsedMB: 0,
      maxStorageMB: isStudent ? 32000 : 8000,
      audioQuality: isStudent ? 'Hi-Res Lossless (FLAC)' : 'High (320kbps)',
      downloadOnlyOnWifi: true,
      isStudentVerified: isStudent,
      universityName: isStudent ? universityName : '',
    };

    const user = await User.create(userFields);
    const token = this.generateToken(user._id);

    logger.info(`User registered: ${user.email} (${user.planName})`);

    return { user, token };
  }

  /**
   * Login with email and password.
   * Implements BR-001 (suspended blocking) and BR-012 (fallback creation).
   */
  async login({ email, password }) {
    const normalizedEmail = email.toLowerCase().trim();

    // Find user with password included
    let user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

    if (!user) {
      // BR-012: Fallback — auto-create user if valid email format
      if (normalizedEmail.includes('@')) {
        const fallbackName = normalizedEmail.split('@')[0].replace(/\./g, ' ').toUpperCase();
        user = await User.create({
          name: fallbackName,
          email: normalizedEmail,
          passwordHash: password,
          isPro: false,
          planName: 'Free Tier',
          role: 'user',
          status: 'active',
          maxStorageMB: 8000,
          audioQuality: 'High (320kbps)',
          downloadOnlyOnWifi: true,
        });

        const token = this.generateToken(user._id);
        logger.info(`Fallback user created and logged in: ${user.email}`);
        return { user, token };
      }

      const error = new Error('Account not found. Please check your email or click Sign Up.');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    // BR-001: Check suspended status
    if (user.status === 'suspended') {
      const error = new Error(
        'This account has been suspended by the Saregama Administrator. Please contact support.'
      );
      error.statusCode = 403;
      error.code = 'ACCOUNT_SUSPENDED';
      throw error;
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const token = this.generateToken(user._id);

    // Update last active
    user.updatedAt = new Date();
    await user.save({ validateModifiedOnly: true });

    logger.info(`User logged in: ${user.email}`);

    return { user, token };
  }

  /**
   * Get current user profile (from JWT)
   */
  async getMe(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }
    return user;
  }

  /**
   * Forgot password (simulated — DEC-006)
   */
  async forgotPassword(email) {
    const user = await User.findOne({ email: email.toLowerCase() });
    // Always return success to prevent email enumeration
    logger.info(`Password reset requested for: ${email}`);
    return { message: 'If an account exists with this email, a reset link has been sent.' };
  }
}

module.exports = new AuthService();
