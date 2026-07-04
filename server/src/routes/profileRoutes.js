const express = require('express');
const { getProfile, updateProfile, getResume } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const { uploadProfileFiles } = require('../middleware/uploadMiddleware');
const { handleUpload } = require('../middleware/handleUpload');

const router = express.Router();

router.get('/', getProfile);
router.get('/resume', getResume);
router.put('/', protect, handleUpload(uploadProfileFiles), updateProfile);

module.exports = router;
