const Playlist = require('../models/Playlist');
const Track = require('../models/Track');

class PlaylistService {
  /**
   * List playlists — system playlists + user's custom playlists
   */
  async listPlaylists(userId) {
    const playlists = await Playlist.find({
      $or: [
        { isCustom: false },      // System playlists
        { createdBy: userId },     // User's custom playlists
      ],
    })
      .populate('tracks')
      .sort({ createdAt: -1 });

    return playlists;
  }

  /**
   * Get playlist by ID with populated tracks
   */
  async getPlaylistById(playlistId) {
    const playlist = await Playlist.findById(playlistId).populate('tracks');
    if (!playlist) {
      const error = new Error('Playlist not found');
      error.statusCode = 404;
      throw error;
    }
    return playlist;
  }

  /**
   * Create a custom playlist (BR-008)
   */
  async createPlaylist(userId, { title, description = '', trackIds = [], coverUrl = '' }) {
    // Resolve tracks
    let tracks = [];
    if (trackIds.length > 0) {
      tracks = await Track.find({ _id: { $in: trackIds } });
    }

    // Use first track cover as default if no cover provided
    const finalCoverUrl = coverUrl || (tracks.length > 0 ? tracks[0].coverUrl : '');

    const playlist = await Playlist.create({
      title,
      description,
      coverUrl: finalCoverUrl,
      tracks: tracks.map((t) => t._id),
      isCustom: true,
      createdBy: userId,
    });

    // Populate tracks for response
    await playlist.populate('tracks');

    return playlist;
  }

  /**
   * Update playlist (owner or admin only, BR-008)
   */
  async updatePlaylist(playlistId, updates, userId, isAdmin) {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      const error = new Error('Playlist not found');
      error.statusCode = 404;
      throw error;
    }

    // Check ownership
    if (!isAdmin && (!playlist.isCustom || playlist.createdBy?.toString() !== userId)) {
      const error = new Error('You can only modify your own custom playlists');
      error.statusCode = 403;
      throw error;
    }

    if (updates.title) playlist.title = updates.title;
    if (updates.description !== undefined) playlist.description = updates.description;
    if (updates.coverUrl) playlist.coverUrl = updates.coverUrl;

    await playlist.save();
    await playlist.populate('tracks');

    return playlist;
  }

  /**
   * Add or remove a track from a playlist
   */
  async updatePlaylistTracks(playlistId, action, trackId, userId, isAdmin) {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      const error = new Error('Playlist not found');
      error.statusCode = 404;
      throw error;
    }

    if (!isAdmin && (!playlist.isCustom || playlist.createdBy?.toString() !== userId)) {
      const error = new Error('You can only modify your own custom playlists');
      error.statusCode = 403;
      throw error;
    }

    if (action === 'add') {
      // Verify track exists
      const track = await Track.findById(trackId);
      if (!track) {
        const error = new Error('Track not found');
        error.statusCode = 404;
        throw error;
      }

      if (!playlist.tracks.includes(trackId)) {
        playlist.tracks.push(trackId);
      }
    } else if (action === 'remove') {
      playlist.tracks = playlist.tracks.filter((t) => t.toString() !== trackId);
    }

    await playlist.save();
    await playlist.populate('tracks');

    return playlist;
  }

  /**
   * Delete a playlist (owner or admin, BR-008)
   */
  async deletePlaylist(playlistId, userId, isAdmin) {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      const error = new Error('Playlist not found');
      error.statusCode = 404;
      throw error;
    }

    if (!isAdmin && (!playlist.isCustom || playlist.createdBy?.toString() !== userId)) {
      const error = new Error('You can only delete your own custom playlists');
      error.statusCode = 403;
      throw error;
    }

    await Playlist.findByIdAndDelete(playlistId);
    return playlist;
  }
}

module.exports = new PlaylistService();
