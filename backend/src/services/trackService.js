const Track = require('../models/Track');

class TrackService {
  /**
   * List tracks with search, genre filter, and pagination
   */
  async listTracks({ search = '', genre = '', language = '', page = 1, limit = 50 }) {
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } },
        { album: { $regex: search, $options: 'i' } },
        { moodTag: { $regex: search, $options: 'i' } },
      ];
    }

    if (genre) {
      query.genre = genre;
    }

    if (language) {
      query.language = language;
    }

    const skip = (page - 1) * limit;
    const [tracks, total] = await Promise.all([
      Track.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Track.countDocuments(query),
    ]);

    return {
      tracks,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  /**
   * Get a single track by ID
   */
  async getTrackById(trackId) {
    const track = await Track.findById(trackId);
    if (!track) {
      const error = new Error('Track not found');
      error.statusCode = 404;
      throw error;
    }
    return track;
  }

  /**
   * Create a new track (admin)
   */
  async createTrack(data) {
    const track = await Track.create(data);
    return track;
  }

  /**
   * Update a track (admin)
   */
  async updateTrack(trackId, updates) {
    const track = await Track.findByIdAndUpdate(trackId, updates, {
      new: true,
      runValidators: true,
    });

    if (!track) {
      const error = new Error('Track not found');
      error.statusCode = 404;
      throw error;
    }

    return track;
  }

  /**
   * Delete a track (admin)
   */
  async deleteTrack(trackId) {
    const track = await Track.findByIdAndDelete(trackId);
    if (!track) {
      const error = new Error('Track not found');
      error.statusCode = 404;
      throw error;
    }
    return track;
  }
}

module.exports = new TrackService();
