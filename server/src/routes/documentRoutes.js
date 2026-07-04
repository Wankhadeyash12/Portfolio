const express = require('express');
const {
  getDocuments,
  createDocument,
  deleteDocument,
  downloadDocument,
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const { uploadDocument } = require('../middleware/uploadMiddleware');
const { handleUpload } = require('../middleware/handleUpload');

const router = express.Router();

// Documents (resume, offer letters, certificates) are managed and viewed
// only from the admin panel — not shown anywhere on the public site.
router.get('/', protect, getDocuments);
router.get('/:id/download', protect, downloadDocument);
router.post('/', protect, handleUpload(uploadDocument), createDocument);
router.delete('/:id', protect, deleteDocument);

module.exports = router;
