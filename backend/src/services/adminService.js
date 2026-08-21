const AdminLog = require('../models/AdminLog');
const User = require('../models/User');
const Track = require('../models/Track');
const Album = require('../models/Album');
const Playlist = require('../models/Playlist');
const SupportTicket = require('../models/SupportTicket');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const logger = require('../config/logger');

class AdminService {
  /**
   * Get platform statistics for admin dashboard
   */
  async getStats() {
    const [
      totalUsers,
      proUsers,
      suspendedUsers,
      studentUsers,
      totalTracks,
      totalAlbums,
      totalPlaylists,
      openTickets,
      recentLogs,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isPro: true }),
      User.countDocuments({ status: 'suspended' }),
      User.countDocuments({ isStudentVerified: true }),
      Track.countDocuments(),
      Album.countDocuments(),
      Playlist.countDocuments(),
      SupportTicket.countDocuments({ status: 'open' }),
      AdminLog.find().sort({ createdAt: -1 }).limit(5),
    ]);

    return {
      users: {
        total: totalUsers,
        pro: proUsers,
        student: studentUsers,
        suspended: suspendedUsers,
        free: totalUsers - proUsers,
      },
      content: {
        tracks: totalTracks,
        albums: totalAlbums,
        playlists: totalPlaylists,
      },
      support: {
        openTickets,
      },
      recentActivity: recentLogs,
    };
  }

  /**
   * Get audit logs with pagination
   */
  async getLogs({ page = 1, limit = 50 }) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      AdminLog.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      AdminLog.countDocuments(),
    ]);

    return {
      logs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  /**
   * Impersonate a user — generates a JWT for the target user (BR-006)
   */
  async impersonateUser(targetUserId, adminUser) {
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const token = jwt.sign({ userId: targetUser._id }, env.JWT_SECRET, {
      expiresIn: '1h', // Short-lived impersonation token
    });

    // Audit log
    await AdminLog.create({
      action: 'User Impersonation',
      adminName: adminUser.name,
      targetUser: targetUser.name,
      details: `Admin impersonated user session for debugging. Token expires in 1 hour.`,
      type: 'system',
    });

    logger.info(`Admin ${adminUser.email} impersonating ${targetUser.email}`);

    return { user: targetUser, token };
  }

  /**
   * Proxy Gemini AI artwork generation (DEC-007)
   */
  async generateArtwork(prompt) {
    if (!env.GEMINI_API_KEY) {
      const error = new Error('Gemini API key not configured');
      error.statusCode = 503;
      throw error;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
          }),
        }
      );

      if (!response.ok) {
        const errBody = await response.text();
        logger.error('Gemini API error:', errBody);
        const error = new Error('Artwork generation failed');
        error.statusCode = 502;
        throw error;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error.statusCode) throw error;
      logger.error('Gemini API request failed:', error.message);
      const err = new Error('Artwork generation service unavailable');
      err.statusCode = 503;
      throw err;
    }
  }
}

module.exports = new AdminService();
