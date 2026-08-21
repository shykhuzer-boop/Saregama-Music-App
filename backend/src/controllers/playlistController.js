const playlistService = require('../services/playlistService');
const ApiResponse = require('../utils/apiResponse');

class PlaylistController {
  async listPlaylists(req, res, next) {
    try {
      const playlists = await playlistService.listPlaylists(req.userId);
      return ApiResponse.success(res, { playlists });
    } catch (error) {
      next(error);
    }
  }

  async getPlaylistById(req, res, next) {
    try {
      const playlist = await playlistService.getPlaylistById(req.params.id);
      return ApiResponse.success(res, { playlist });
    } catch (error) {
      next(error);
    }
  }

  async createPlaylist(req, res, next) {
    try {
      const { title, description, trackIds, coverUrl } = req.body;
      const playlist = await playlistService.createPlaylist(req.userId, {
        title, description, trackIds, coverUrl,
      });
      return ApiResponse.created(res, { playlist }, 'Playlist created successfully');
    } catch (error) {
      next(error);
    }
  }

  async updatePlaylist(req, res, next) {
    try {
      const playlist = await playlistService.updatePlaylist(
        req.params.id,
        req.body,
        req.userId,
        req.user.role === 'admin'
      );
      return ApiResponse.success(res, { playlist }, 'Playlist updated');
    } catch (error) {
      next(error);
    }
  }

  async updatePlaylistTracks(req, res, next) {
    try {
      const { action, trackId } = req.body;
      const playlist = await playlistService.updatePlaylistTracks(
        req.params.id,
        action,
        trackId,
        req.userId,
        req.user.role === 'admin'
      );
      return ApiResponse.success(res, { playlist }, `Track ${action}ed successfully`);
    } catch (error) {
      next(error);
    }
  }

  async deletePlaylist(req, res, next) {
    try {
      await playlistService.deletePlaylist(req.params.id, req.userId, req.user.role === 'admin');
      return ApiResponse.success(res, null, 'Playlist deleted');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PlaylistController();
