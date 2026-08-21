const userService = require('../services/userService');
const ApiResponse = require('../utils/apiResponse');

class UserController {
  /**
   * GET /api/v1/users
   */
  async listUsers(req, res, next) {
    try {
      const { search, filter, page, limit } = req.query;
      const result = await userService.listUsers({
        search,
        filter,
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 50,
      });
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/users/:id
   */
  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      return ApiResponse.success(res, { user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/users/:id
   */
  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.body, req.user);
      return ApiResponse.success(res, { user }, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/users/:id/plan
   */
  async updatePlan(req, res, next) {
    try {
      const { planName, isPro, maxStorageMB } = req.body;
      const user = await userService.updatePlan(req.params.id, { planName, isPro, maxStorageMB }, req.user);
      return ApiResponse.success(res, { user }, 'Plan updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/users/:id/status
   */
  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const user = await userService.updateStatus(req.params.id, status, req.user);
      return ApiResponse.success(res, { user }, 'Status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/users/:id
   */
  async deleteUser(req, res, next) {
    try {
      await userService.deleteUser(req.params.id, req.user);
      return ApiResponse.success(res, null, 'User suspended successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
