const express = require('express');
const libraryController = require('../controllers/libraryController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticate);

// Liked tracks
router.get('/liked', libraryController.getLikedTracks);
router.post('/liked/:trackId', libraryController.likeTrack);
router.delete('/liked/:trackId', libraryController.unlikeTrack);

// Downloaded tracks
router.get('/downloads', libraryController.getDownloadedTracks);
router.post('/downloads/:trackId', libraryController.downloadTrack);
router.delete('/downloads/:trackId', libraryController.removeDownload);
router.delete('/downloads', libraryController.clearAllDownloads);

module.exports = router;
