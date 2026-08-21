const express = require('express');
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');
const { updateProfileValidator, updatePlanValidator, updateStatusValidator } = require('../validators/userValidator');
const { validateRequest } = require('../middlewares/validateRequest');

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// GET /api/v1/users — Admin: list all users
router.get('/', adminOnly, userController.listUsers);

// GET /api/v1/users/:id — Get user by ID
router.get('/:id', userController.getUserById);

// PUT /api/v1/users/:id — Update user profile
router.put('/:id', updateProfileValidator, validateRequest, userController.updateUser);

// PUT /api/v1/users/:id/plan — Admin: change user plan
router.put('/:id/plan', adminOnly, updatePlanValidator, validateRequest, userController.updatePlan);

// PUT /api/v1/users/:id/status — Admin: activate/suspend user
router.put('/:id/status', adminOnly, updateStatusValidator, validateRequest, userController.updateStatus);

// DELETE /api/v1/users/:id — Admin: soft-delete user
router.delete('/:id', adminOnly, userController.deleteUser);

module.exports = router;
