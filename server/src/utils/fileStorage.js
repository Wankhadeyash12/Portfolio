const fs = require('fs');
const path = require('path');
const { uploadsRoot } = require('../config/localStorage');

const serverUrl = () => process.env.SERVER_URL || 'http://localhost:5000';

const buildFileMeta = (file, folder) => {
  const relativePath = `${folder}/${file.filename}`;
  return {
    url: `${serverUrl()}/uploads/${relativePath}`,
    publicId: relativePath,
  };
};

const deleteStoredFile = async (publicId) => {
  if (!publicId) return;

  const filePath = path.join(uploadsRoot, publicId);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = { buildFileMeta, deleteStoredFile, serverUrl, uploadsRoot };
