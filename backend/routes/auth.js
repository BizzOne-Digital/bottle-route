const express = require('express');
const router = express.Router();
const { login, getMe, createFirstAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/setup', createFirstAdmin); // One-time setup only

module.exports = router;
