const authService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');

class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  async register(req, res, next) {
    try {
      const { name, email, password, isStudent, universityName, avatarUrl } = req.body;

      const { user, token } = await authService.register({
        name,
        email,
        password,
        isStudent,
        universityName,
        avatarUrl,
      });

      return ApiResponse.created(res, { user, token }, 'Account created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const { user, token } = await authService.login({ email, password });

      return ApiResponse.success(res, { user, token }, `Welcome back, ${user.name}!`);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/auth/me
   */
  async getMe(req, res, next) {
    try {
      const user = await authService.getMe(req.userId);
      return ApiResponse.success(res, { user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/forgot-password
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      return ApiResponse.success(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
