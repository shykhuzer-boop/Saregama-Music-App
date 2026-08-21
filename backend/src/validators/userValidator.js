const { body, param } = require('express-validator');
const { AUDIO_QUALITIES, USER_STATUSES } = require('../utils/constants');

const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),

  body('avatarUrl')
    .optional()
    .trim(),

  body('audioQuality')
    .optional()
    .isIn(AUDIO_QUALITIES).withMessage(`Audio quality must be one of: ${AUDIO_QUALITIES.join(', ')}`),

  body('downloadOnlyOnWifi')
    .optional()
    .isBoolean().withMessage('downloadOnlyOnWifi must be a boolean'),
];

const updatePlanValidator = [
  param('id')
    .isMongoId().withMessage('Invalid user ID'),

  body('planName')
    .notEmpty().withMessage('Plan name is required')
    .trim(),

  body('isPro')
    .optional()
    .isBoolean().withMessage('isPro must be a boolean'),

  body('maxStorageMB')
    .optional()
    .isInt({ min: 0 }).withMessage('maxStorageMB must be a positive integer'),
];

const updateStatusValidator = [
  param('id')
    .isMongoId().withMessage('Invalid user ID'),

  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(Object.values(USER_STATUSES))
    .withMessage(`Status must be one of: ${Object.values(USER_STATUSES).join(', ')}`),
];

module.exports = {
  updateProfileValidator,
  updatePlanValidator,
  updateStatusValidator,
};
