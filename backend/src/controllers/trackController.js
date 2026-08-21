const trackService = require('../services/trackService');
const ApiResponse = require('../utils/apiResponse');

class TrackController {
  async listTracks(req, res, next) {
    try {
      const { search, genre, language, page, limit } = req.query;
      const result = await trackService.listTracks({
        search, genre, language,
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 50,
      });
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getTrackById(req, res, next) {
    try {
      const track = await trackService.getTrackById(req.params.id);
      return ApiResponse.success(res, { track });
    } catch (error) {
      next(error);
    }
  }

  async createTrack(req, res, next) {
    try {
      const track = await trackService.createTrack(req.body);
      return ApiResponse.created(res, { track }, 'Track created successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateTrack(req, res, next) {
    try {
      const track = await trackService.updateTrack(req.params.id, req.body);
      return ApiResponse.success(res, { track }, 'Track updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteTrack(req, res, next) {
    try {
      await trackService.deleteTrack(req.params.id);
      return ApiResponse.success(res, null, 'Track deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TrackController();
