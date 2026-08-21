const express = require('express');
const supportController = require('../controllers/supportController');
const { optionalAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /api/v1/faqs — List FAQs (public, optional auth)
router.get('/', optionalAuth, supportController.listFAQs);

module.exports = router;
