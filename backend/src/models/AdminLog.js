const mongoose = require('mongoose');
const { ADMIN_LOG_TYPES } = require('../utils/constants');

const adminLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    adminName: {
      type: String,
      required: true,
    },
    targetUser: {
      type: String,
      default: '',
    },
    details: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ADMIN_LOG_TYPES,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        // Map createdAt to timestamp for frontend compatibility
        ret.timestamp = ret.createdAt;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

adminLogSchema.index({ createdAt: -1 });

const AdminLog = mongoose.model('AdminLog', adminLogSchema);

module.exports = AdminLog;
