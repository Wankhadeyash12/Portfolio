const path = require('path');
const fs = require('fs');
const multer = require('multer');

const uploadsRoot = path.join(__dirname, '../../uploads');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

['images', 'documents', 'avatars'].forEach((folder) => {
  ensureDir(path.join(uploadsRoot, folder));
});

const createStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(uploadsRoot, folder));
    },
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname);
      cb(null, `${unique}${ext}`);
    },
  });

module.exports = {
  uploadsRoot,
  imageStorage: createStorage('images'),
  documentStorage: createStorage('documents'),
  avatarStorage: createStorage('avatars'),
};
