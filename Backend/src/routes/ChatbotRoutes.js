const express = require('express');
const router = express.Router();
const ChatbotController = require('../controllers/ChatbotController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, ChatbotController.chat);

module.exports = router;
