const { body } = require('express-validator');
const { TICKET_CATEGORIES, TICKET_PRIORITIES } = require('../utils/constants');

const createTicketValidator = [
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ max: 200 }).withMessage('Subject cannot exceed 200 characters'),

  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(TICKET_CATEGORIES)
    .withMessage(`Category must be one of: ${TICKET_CATEGORIES.join(', ')}`),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
    .isLength({ max: 5000 }).withMessage('Message cannot exceed 5000 characters'),

  body('priority')
    .optional()
    .isIn(TICKET_PRIORITIES)
    .withMessage(`Priority must be one of: ${TICKET_PRIORITIES.join(', ')}`),
];

module.exports = { createTicketValidator };
