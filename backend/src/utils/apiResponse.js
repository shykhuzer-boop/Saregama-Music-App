/**
 * Standardized API response helpers.
 * All controllers should use these to ensure consistent response format.
 */

class ApiResponse {
  /**
   * Success response
   * @param {import('express').Response} res
   * @param {object} data
   * @param {string} message
   * @param {number} statusCode
   */
  static success(res, data = null, message = 'Success', statusCode = 200) {
    const response = {
      success: true,
      message,
    };
    if (data !== null) {
      response.data = data;
    }
    return res.status(statusCode).json(response);
  }

  /**
   * Created response (201)
   */
  static created(res, data = null, message = 'Created successfully') {
    return ApiResponse.success(res, data, message, 201);
  }

  /**
   * No content response (204)
   */
  static noContent(res) {
    return res.status(204).send();
  }

  /**
   * Error response
   * @param {import('express').Response} res
   * @param {string} message
   * @param {string} code
   * @param {number} statusCode
   * @param {Array} errors
   */
  static error(res, message = 'An error occurred', code = 'INTERNAL_ERROR', statusCode = 500, errors = []) {
    return res.status(statusCode).json({
      success: false,
      message,
      code,
      errors,
    });
  }

  static badRequest(res, message = 'Bad request', errors = []) {
    return ApiResponse.error(res, message, 'VALIDATION_ERROR', 400, errors);
  }

  static unauthorized(res, message = 'Unauthorized') {
    return ApiResponse.error(res, message, 'UNAUTHORIZED', 401);
  }

  static forbidden(res, message = 'Forbidden') {
    return ApiResponse.error(res, message, 'FORBIDDEN', 403);
  }

  static notFound(res, message = 'Resource not found') {
    return ApiResponse.error(res, message, 'NOT_FOUND', 404);
  }

  static conflict(res, message = 'Resource already exists') {
    return ApiResponse.error(res, message, 'DUPLICATE_ENTRY', 409);
  }
}

module.exports = ApiResponse;
