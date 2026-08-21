const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');

const router = express.Router();

// All admin routes require auth + admin role
router.use(authenticate);
router.use(adminOnly);

// GET /api/v1/admin/stats
router.get('/stats', adminController.getStats);

// GET /api/v1/admin/logs
router.get('/logs', adminController.getLogs);

// POST /api/v1/admin/impersonate/:userId
router.post('/impersonate/:userId', adminController.impersonateUser);

// POST /api/v1/admin/artwork/generate
router.post('/artwork/generate', adminController.generateArtwork);

module.exports = router;
