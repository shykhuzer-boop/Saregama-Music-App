const adminService = require('../services/adminService');
const ApiResponse = require('../utils/apiResponse');

class AdminController {
  async getStats(req, res, next) {
    try {
      const stats = await adminService.getStats();
      return ApiResponse.success(res, stats, 'Dashboard stats loaded');
    } catch (error) {
      next(error);
    }
  }

  async getLogs(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await adminService.getLogs({
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 50,
      });
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async impersonateUser(req, res, next) {
    try {
      const result = await adminService.impersonateUser(req.params.userId, req.user);
      return ApiResponse.success(res, result, 'Impersonation token generated');
    } catch (error) {
      next(error);
    }
  }

  async generateArtwork(req, res, next) {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return ApiResponse.badRequest(res, 'Prompt is required');
      }
      const result = await adminService.generateArtwork(prompt);
      return ApiResponse.success(res, result, 'Artwork generated');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
