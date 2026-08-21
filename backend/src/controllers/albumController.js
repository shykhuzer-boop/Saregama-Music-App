const albumService = require('../services/albumService');
const ApiResponse = require('../utils/apiResponse');

class AlbumController {
  async listAlbums(req, res, next) {
    try {
      const { search, page, limit } = req.query;
      const result = await albumService.listAlbums({
        search,
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 50,
      });
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getAlbumById(req, res, next) {
    try {
      const result = await albumService.getAlbumById(req.params.id);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async createAlbum(req, res, next) {
    try {
      const album = await albumService.createAlbum(req.body);
      return ApiResponse.created(res, { album }, 'Album created successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateAlbum(req, res, next) {
    try {
      const album = await albumService.updateAlbum(req.params.id, req.body);
      return ApiResponse.success(res, { album }, 'Album updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateAlbumPoster(req, res, next) {
    try {
      const { coverUrl, syncTracks } = req.body;
      const album = await albumService.updateAlbumPoster(
        req.params.id,
        coverUrl,
        syncTracks !== false
      );
      return ApiResponse.success(res, { album }, 'Album poster updated');
    } catch (error) {
      next(error);
    }
  }

  async deleteAlbum(req, res, next) {
    try {
      await albumService.deleteAlbum(req.params.id);
      return ApiResponse.success(res, null, 'Album deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AlbumController();
