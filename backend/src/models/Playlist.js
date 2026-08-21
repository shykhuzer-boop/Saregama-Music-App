const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Playlist title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    coverUrl: {
      type: String,
      default: '',
    },
    tracks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Track',
    }],
    isCustom: {
      type: Boolean,
      default: true,
    },
    isPro: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null = system playlist
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

playlistSchema.index({ createdBy: 1 });

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
