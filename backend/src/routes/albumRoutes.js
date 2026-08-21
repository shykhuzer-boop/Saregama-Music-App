const express = require('express');
const albumController = require('../controllers/albumController');
const { authenticate } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(authenticate);

// GET /api/v1/albums
router.get('/', albumController.listAlbums);

// GET /api/v1/albums/:id
router.get('/:id', albumController.getAlbumById);

// POST /api/v1/albums (admin)
router.post('/', adminOnly, albumController.createAlbum);

// PUT /api/v1/albums/:id (admin)
router.put('/:id', adminOnly, albumController.updateAlbum);

// PUT /api/v1/albums/:id/poster (admin)
router.put('/:id/poster', adminOnly, albumController.updateAlbumPoster);

// DELETE /api/v1/albums/:id (admin)
router.delete('/:id', adminOnly, albumController.deleteAlbum);

module.exports = router;
