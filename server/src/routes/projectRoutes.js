const express = require('express');
const {
  getProjects,
  getFeaturedProjects,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { uploadImage } = require('../middleware/uploadMiddleware');
const { handleUpload } = require('../middleware/handleUpload');

const router = express.Router();

router.get('/', getProjects);
router.get('/featured', getFeaturedProjects);
router.post('/', protect, handleUpload(uploadImage), createProject);
router.put('/:id', protect, handleUpload(uploadImage), updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
