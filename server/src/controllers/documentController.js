const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');
const { buildFileMeta, deleteStoredFile, uploadsRoot, serverUrl } = require('../utils/fileStorage');

const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find().sort({ uploadedAt: -1 });
    const safeDocuments = documents.map((document) => ({
      ...document.toObject(),
      fileUrl: `${serverUrl()}/api/documents/${document._id}/download`,
    }));
    res.json(safeDocuments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const fileMeta = buildFileMeta(req.file, 'documents');

    const document = await Document.create({
      name: req.body.name || req.file.originalname,
      category: req.body.category || 'Other',
      fileUrl: fileMeta.url,
      publicId: fileMeta.publicId,
      fileType: req.file.mimetype,
    });

    document.fileUrl = `${serverUrl()}/api/documents/${document._id}/download`;
    await document.save();

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const filePath = path.join(uploadsRoot, document.publicId);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.setHeader('Content-Type', document.fileType || 'application/octet-stream');
    res.download(filePath, document.name);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.publicId) {
      await deleteStoredFile(document.publicId);
    }

    await document.deleteOne();
    res.json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDocuments, createDocument, deleteDocument, downloadDocument };
