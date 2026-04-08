const express = require('express');
const router = express.Router();
const { assignTrainer, updateUserRole,updateSpecialization,updateTrainerSalary} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.put('/update-role', protect, updateUserRole);
router.put('/assign-trainer', protect, assignTrainer);
router.put('/update-specialization', protect, updateSpecialization);
router.put('/update-salary',protect,updateTrainerSalary);

module.exports = router;