const libraryService = require('../services/libraryService');
const ApiResponse = require('../utils/apiResponse');

class LibraryController {
  async getLikedTracks(req, res, next) {
    try {
      const tracks = await libraryService.getLikedTracks(req.userId);
      return ApiResponse.success(res, { tracks });
    } catch (error) {
      next(error);
    }
  }

  async likeTrack(req, res, next) {
    try {
      const result = await libraryService.likeTrack(req.userId, req.params.trackId);
      return ApiResponse.success(res, result, 'Track liked');
    } catch (error) {
      next(error);
    }
  }

  async unlikeTrack(req, res, next) {
    try {
      const result = await libraryService.unlikeTrack(req.userId, req.params.trackId);
      return ApiResponse.success(res, result, 'Track unliked');
    } catch (error) {
      next(error);
    }
  }

  async getDownloadedTracks(req, res, next) {
    try {
      const tracks = await libraryService.getDownloadedTracks(req.userId);
      return ApiResponse.success(res, { tracks });
    } catch (error) {
      next(error);
    }
  }

  async downloadTrack(req, res, next) {
    try {
      const result = await libraryService.downloadTrack(req.userId, req.params.trackId);
      return ApiResponse.success(res, result, 'Track downloaded');
    } catch (error) {
      next(error);
    }
  }

  async removeDownload(req, res, next) {
    try {
      const result = await libraryService.removeDownload(req.userId, req.params.trackId);
      return ApiResponse.success(res, result, 'Download removed');
    } catch (error) {
      next(error);
    }
  }

  async clearAllDownloads(req, res, next) {
    try {
      const result = await libraryService.clearAllDownloads(req.userId);
      return ApiResponse.success(res, result, 'All offline data cleared');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LibraryController();
