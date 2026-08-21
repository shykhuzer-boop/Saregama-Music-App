const { USER_ROLES } = require('../utils/constants');
const ApiResponse = require('../utils/apiResponse');

/**
 * Role-based authorization middleware.
 * Must be used AFTER authenticate middleware.
 *
 * @param  {...string} roles - Allowed roles (e.g., 'admin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, 'Authentication required.');
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.forbidden(
        res,
        'You do not have permission to perform this action.'
      );
    }

    next();
  };
};

/**
 * Admin-only shorthand
 */
const adminOnly = authorize(USER_ROLES.ADMIN);

module.exports = { authorize, adminOnly };
