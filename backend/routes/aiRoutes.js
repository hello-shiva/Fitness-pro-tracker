const express = require('express');
const router = express.Router();
const { generateChatResponse } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/',protect,generateChatResponse);

module.exports = router;