const express = require('express');
const router = express.Router();
const { assignTrainer, updateUserRole,updateSpecialization} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
router.put('/update-role', protect, updateUserRole);
router.put('/assign-trainer', protect, assignTrainer);
router.put('/update-specialization', protect, updateSpecialization);
router.get('/my-clients', protect, async (req, res) => {
    try {
        const clients = await User.find({ assignedTrainer: req.user._id }).select('-password');
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;