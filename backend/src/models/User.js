const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { USER_ROLES, USER_STATUSES, AUDIO_QUALITIES } = require('../utils/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,   // creates the index automatically
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Never returned in queries by default
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    isPro: {
      type: Boolean,
      default: false,
    },
    planName: {
      type: String,
      default: 'Free Tier',
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUSES),
      default: USER_STATUSES.ACTIVE,
    },
    offlineStorageUsedMB: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxStorageMB: {
      type: Number,
      default: 8000,
    },
    audioQuality: {
      type: String,
      enum: AUDIO_QUALITIES,
      default: 'High (320kbps)',
    },
    downloadOnlyOnWifi: {
      type: Boolean,
      default: true,
    },
    isStudentVerified: {
      type: Boolean,
      default: false,
    },
    universityName: {
      type: String,
      default: '',
    },
    likedTrackIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Track',
    }],
    downloadedTrackIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Track',
    }],
  },
  {
    timestamps: true, // createdAt = joinedDate, updatedAt = lastActive
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

// unique: true on email field already creates the index — explicit index removed to avoid duplicate warning

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Virtual for joinedDate (frontend compatibility)
userSchema.virtual('joinedDate').get(function () {
  return this.createdAt ? this.createdAt.toISOString().split('T')[0] : '';
});

// Virtual for lastActive (frontend compatibility)
userSchema.virtual('lastActive').get(function () {
  if (!this.updatedAt) return '';
  const diff = Date.now() - this.updatedAt.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
});

userSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
