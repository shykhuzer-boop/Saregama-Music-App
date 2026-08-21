const { body } = require('express-validator');

const createPlaylistValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Playlist title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),

  body('trackIds')
    .optional()
    .isArray().withMessage('trackIds must be an array'),

  body('trackIds.*')
    .optional()
    .isMongoId().withMessage('Each track ID must be a valid ID'),

  body('coverUrl')
    .optional()
    .trim(),
];

const updatePlaylistTracksValidator = [
  body('action')
    .notEmpty().withMessage('Action is required')
    .isIn(['add', 'remove']).withMessage('Action must be "add" or "remove"'),

  body('trackId')
    .notEmpty().withMessage('Track ID is required')
    .isMongoId().withMessage('Track ID must be a valid ID'),
];

module.exports = { createPlaylistValidator, updatePlaylistTracksValidator };
