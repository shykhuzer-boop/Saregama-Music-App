const Album = require('../models/Album');
const Track = require('../models/Track');

class AlbumService {
  async listAlbums({ search = '', page = 1, limit = 50 }) {
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } },
        { genre: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [albums, total] = await Promise.all([
      Album.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Album.countDocuments(query),
    ]);

    return {
      albums,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getAlbumById(albumId) {
    const album = await Album.findById(albumId);
    if (!album) {
      const error = new Error('Album not found');
      error.statusCode = 404;
      throw error;
    }

    // Get associated tracks
    const tracks = await Track.find({ album: album.title });

    return { album, tracks };
  }

  async createAlbum(data) {
    const album = await Album.create(data);
    return album;
  }

  async updateAlbum(albumId, updates) {
    const album = await Album.findByIdAndUpdate(albumId, updates, {
      new: true,
      runValidators: true,
    });
    if (!album) {
      const error = new Error('Album not found');
      error.statusCode = 404;
      throw error;
    }
    return album;
  }

  /**
   * Update album poster and optionally sync to associated tracks
   * (mirrors handleUpdateAlbumPoster in App.tsx)
   */
  async updateAlbumPoster(albumId, newCoverUrl, syncTracks = true) {
    const album = await Album.findById(albumId);
    if (!album) {
      const error = new Error('Album not found');
      error.statusCode = 404;
      throw error;
    }

    album.coverUrl = newCoverUrl;
    await album.save();

    if (syncTracks) {
      await Track.updateMany(
        { album: album.title },
        { $set: { coverUrl: newCoverUrl } }
      );
    }

    return album;
  }

  async deleteAlbum(albumId) {
    const album = await Album.findByIdAndDelete(albumId);
    if (!album) {
      const error = new Error('Album not found');
      error.statusCode = 404;
      throw error;
    }
    return album;
  }
}

module.exports = new AlbumService();
