const express = require('express');
const trackController = require('../controllers/trackController');
const { authenticate } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');
const { createTrackValidator, updateTrackValidator } = require('../validators/trackValidator');
const { validateRequest } = require('../middlewares/validateRequest');

const router = express.Router();

router.use(authenticate);

// GET /api/v1/tracks
router.get('/', trackController.listTracks);

// GET /api/v1/tracks/:id
router.get('/:id', trackController.getTrackById);

// POST /api/v1/tracks (admin)
router.post('/', adminOnly, createTrackValidator, validateRequest, trackController.createTrack);

// PUT /api/v1/tracks/:id (admin)
router.put('/:id', adminOnly, updateTrackValidator, validateRequest, trackController.updateTrack);

// DELETE /api/v1/tracks/:id (admin)
router.delete('/:id', adminOnly, trackController.deleteTrack);

module.exports = router;
