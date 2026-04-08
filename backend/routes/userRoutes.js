const express = require('express');
const router = express.Router();
// Humne sirf ek fee function (updateUserFee) import kiya hai taaki confusion na ho
const { registerUser, loginUser, getUsers, updateUserFee, deleteUser,getUserProfile,getTrainerProfile} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Sirf admin saare users dekh sakta hai
router.get('/', protect, admin, getUsers);
router.get('/me',protect,getUserProfile);
router.get('/trainer',protect,getTrainerProfile);

// 🟢 FIX 1: Sirf ek fee update route rakha hai
router.put('/:id/fee', protect, admin, updateUserFee);

// 🟢 FIX 2: Delete route mein 'admin' middleware add kiya hai extra security ke liye
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;