const { body } = require('express-validator');
const { GENRES, AUDIO_PRESETS, LANGUAGES, RAGA_TIMES } = require('../utils/constants');

const createTrackValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Track title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),

  body('artist')
    .trim()
    .notEmpty().withMessage('Artist is required'),

  body('genre')
    .notEmpty().withMessage('Genre is required')
    .isIn(GENRES).withMessage(`Genre must be one of: ${GENRES.join(', ')}`),

  body('duration')
    .notEmpty().withMessage('Duration is required')
    .isInt({ min: 1 }).withMessage('Duration must be at least 1 second'),

  body('audioPreset')
    .notEmpty().withMessage('Audio preset is required')
    .isIn(AUDIO_PRESETS).withMessage(`Audio preset must be one of: ${AUDIO_PRESETS.join(', ')}`),

  body('album').optional().trim(),
  body('coverUrl').optional().trim(),
  body('isPro').optional().isBoolean(),
  body('binauralFreq').optional().isNumeric(),
  body('description').optional().trim(),
  body('language').optional().isIn(LANGUAGES),
  body('ragaTime').optional().isIn(RAGA_TIMES),
  body('moodTag').optional().trim(),
];

const updateTrackValidator = [
  body('title').optional().trim().isLength({ max: 200 }),
  body('artist').optional().trim(),
  body('genre').optional().isIn(GENRES),
  body('duration').optional().isInt({ min: 1 }),
  body('audioPreset').optional().isIn(AUDIO_PRESETS),
  body('album').optional().trim(),
  body('coverUrl').optional().trim(),
  body('isPro').optional().isBoolean(),
  body('binauralFreq').optional().isNumeric(),
  body('description').optional().trim(),
  body('language').optional().isIn(LANGUAGES),
  body('ragaTime').optional().isIn(RAGA_TIMES),
  body('moodTag').optional().trim(),
];

module.exports = { createTrackValidator, updateTrackValidator };
