const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Album title is required'],
      trim: true,
    },
    artist: {
      type: String,
      required: [true, 'Artist is required'],
      trim: true,
    },
    coverUrl: {
      type: String,
      default: '',
    },
    trackCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPro: {
      type: Boolean,
      default: false,
    },
    isDownloaded: {
      type: Boolean,
      default: false,
    },
    genre: {
      type: String,
      default: '',
    },
    year: {
      type: Number,
      default: new Date().getFullYear(),
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

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
