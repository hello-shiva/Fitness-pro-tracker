const express = require('express');
const router = express.Router();
const { generateChatResponse ,generateFitnessPlan } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/',protect,generateChatResponse);
router.post('/generate-plan',protect,generateFitnessPlan);

module.exports = router;