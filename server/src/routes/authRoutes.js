const express = require('express');
const { setup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/setup', setup);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
