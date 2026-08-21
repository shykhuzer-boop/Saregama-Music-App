const express = require('express');
const supportController = require('../controllers/supportController');
const { authenticate } = require('../middlewares/authMiddleware');
const { createTicketValidator } = require('../validators/supportValidator');
const { validateRequest } = require('../middlewares/validateRequest');

const router = express.Router();

// POST /api/v1/support/tickets — Submit a support ticket (authenticated)
router.post('/tickets', authenticate, createTicketValidator, validateRequest, supportController.createTicket);

// GET /api/v1/support/tickets — Get user's own tickets (authenticated)
router.get('/tickets', authenticate, supportController.getUserTickets);

module.exports = router;
