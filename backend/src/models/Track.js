const mongoose = require('mongoose');
const { GENRES, AUDIO_PRESETS, LANGUAGES, RAGA_TIMES } = require('../utils/constants');

const trackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Track title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    artist: {
      type: String,
      required: [true, 'Artist is required'],
      trim: true,
    },
    album: {
      type: String,
      default: '',
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      enum: GENRES,
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 second'],
    },
    coverUrl: {
      type: String,
      default: '',
    },
    isPro: {
      type: Boolean,
      default: false,
    },
    isDownloaded: {
      type: Boolean,
      default: false,
    },
    binauralFreq: {
      type: Number,
      default: null,
    },
    audioPreset: {
      type: String,
      required: [true, 'Audio preset is required'],
      enum: AUDIO_PRESETS,
    },
    description: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      enum: LANGUAGES,
      default: null,
    },
    ragaTime: {
      type: String,
      enum: RAGA_TIMES,
      default: null,
    },
    moodTag: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Text index for search
trackSchema.index({ title: 'text', artist: 'text', album: 'text', moodTag: 'text' });
trackSchema.index({ genre: 1 });
trackSchema.index({ language: 1 });

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;
