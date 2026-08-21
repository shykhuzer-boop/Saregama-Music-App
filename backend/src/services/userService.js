const User = require('../models/User');
const AdminLog = require('../models/AdminLog');
const logger = require('../config/logger');

class UserService {
  /**
   * List all users with search and filtering (admin)
   */
  async listUsers({ search = '', filter = 'all', page = 1, limit = 50 }) {
    const query = {};

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter
    switch (filter) {
      case 'pro':
        query.isPro = true;
        break;
      case 'student':
        query.isStudentVerified = true;
        break;
      case 'suspended':
        query.status = 'suspended';
        break;
      case 'all':
      default:
        break;
    }

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(query),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
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
   * Update user profile (self or admin)
   */
  async updateUser(userId, updates, requestingUser) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Only allow self-edit or admin edit
    const isSelf = requestingUser._id.toString() === userId;
    const isAdmin = requestingUser.role === 'admin';

    if (!isSelf && !isAdmin) {
      const error = new Error('You can only update your own profile');
      error.statusCode = 403;
      throw error;
    }

    // Whitelist allowed fields for self-update
    const allowedSelfFields = ['name', 'avatarUrl', 'audioQuality', 'downloadOnlyOnWifi'];
    const allowedAdminFields = [...allowedSelfFields, 'isPro', 'planName', 'role', 'status', 'maxStorageMB', 'isStudentVerified', 'offlineStorageUsedMB'];

    const allowedFields = isAdmin ? allowedAdminFields : allowedSelfFields;

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        user[key] = updates[key];
      }
    });

    await user.save();

    logger.info(`User updated: ${user.email} by ${requestingUser.email}`);

    return user;
  }

  /**
   * Update user plan (admin only, BR-010, BR-011)
   */
  async updatePlan(userId, { planName, isPro, maxStorageMB }, adminUser) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    user.planName = planName;
    if (typeof isPro === 'boolean') user.isPro = isPro;
    if (typeof maxStorageMB === 'number') user.maxStorageMB = maxStorageMB;

    // BR-011: Pro upgrade defaults
    if (isPro && !maxStorageMB) {
      user.maxStorageMB = 64000;
    }

    await user.save();

    // BR-010: Audit log
    await AdminLog.create({
      action: 'Plan Change',
      adminName: adminUser.name,
      targetUser: user.name,
      details: `Plan updated to "${planName}". Pro: ${user.isPro}. Storage: ${user.maxStorageMB}MB.`,
      type: 'plan_change',
    });

    logger.info(`Plan updated for ${user.email}: ${planName} by ${adminUser.email}`);

    return user;
  }

  /**
   * Update user status (admin only, BR-010)
   */
  async updateStatus(userId, status, adminUser) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Cannot change own status
    if (user._id.toString() === adminUser._id.toString()) {
      const error = new Error('Cannot change your own account status');
      error.statusCode = 400;
      throw error;
    }

    user.status = status;
    await user.save();

    // BR-010: Audit log
    await AdminLog.create({
      action: status === 'suspended' ? 'Account Suspended' : 'Account Activated',
      adminName: adminUser.name,
      targetUser: user.name,
      details: `User status changed to "${status}".`,
      type: 'user_edit',
    });

    logger.info(`User ${user.email} status changed to ${status} by ${adminUser.email}`);

    return user;
  }

  /**
   * Soft delete user (admin only — sets status to suspended)
   */
  async deleteUser(userId, adminUser) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (user._id.toString() === adminUser._id.toString()) {
      const error = new Error('Cannot delete your own account');
      error.statusCode = 400;
      throw error;
    }

    user.status = 'suspended';
    await user.save();

    await AdminLog.create({
      action: 'User Deleted (Soft)',
      adminName: adminUser.name,
      targetUser: user.name,
      details: `User account soft-deleted (suspended).`,
      type: 'user_delete',
    });

    logger.info(`User soft-deleted: ${user.email} by ${adminUser.email}`);

    return user;
  }
}

module.exports = new UserService();
