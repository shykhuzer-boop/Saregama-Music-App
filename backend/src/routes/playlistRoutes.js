const express = require('express');
const playlistController = require('../controllers/playlistController');
const { authenticate } = require('../middlewares/authMiddleware');
const { createPlaylistValidator, updatePlaylistTracksValidator } = require('../validators/playlistValidator');
const { validateRequest } = require('../middlewares/validateRequest');

const router = express.Router();

router.use(authenticate);

// GET /api/v1/playlists
router.get('/', playlistController.listPlaylists);

// GET /api/v1/playlists/:id
router.get('/:id', playlistController.getPlaylistById);

// POST /api/v1/playlists
router.post('/', createPlaylistValidator, validateRequest, playlistController.createPlaylist);

// PUT /api/v1/playlists/:id
router.put('/:id', playlistController.updatePlaylist);

// PUT /api/v1/playlists/:id/tracks
router.put('/:id/tracks', updatePlaylistTracksValidator, validateRequest, playlistController.updatePlaylistTracks);

// DELETE /api/v1/playlists/:id
router.delete('/:id', playlistController.deletePlaylist);

module.exports = router;
