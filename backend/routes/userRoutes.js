const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, updateUserFee, deleteUser, getUserProfile, getTrainerProfile } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);
router.get('/trainer', protect, getTrainerProfile);
router.get('/', protect, admin, getUsers);
router.put('/:id/fee', protect, admin, updateUserFee);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;