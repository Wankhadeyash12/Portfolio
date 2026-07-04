const multer = require('multer');
const path = require('path');
const {
  imageStorage,
  documentStorage,
  avatarStorage,
  uploadsRoot,
} = require('../config/localStorage');

const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only jpg, png, and webp images are allowed'), false);
  }
};

const documentFilter = (req, file, cb) => {
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only pdf, doc, docx, jpg, and png files are allowed'), false);
  }
};

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
}).single('image');

const uploadDocument = multer({
  storage: documentStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: documentFilter,
}).single('file');

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: imageFilter,
}).single('photo');

// Profile form can submit an avatar photo AND/OR a resume file (PDF/DOC) together.
const profileFilesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === 'resume' ? 'documents' : 'avatars';
    cb(null, path.join(uploadsRoot, folder));
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const profileFilesFilter = (req, file, cb) => {
  if (file.fieldname === 'photo') return imageFilter(req, file, cb);
  if (file.fieldname === 'resume') return documentFilter(req, file, cb);
  cb(new Error('Unexpected field'), false);
};

const uploadProfileFiles = multer({
  storage: profileFilesStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: profileFilesFilter,
}).fields([
  { name: 'photo', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
]);

module.exports = { uploadImage, uploadDocument, uploadAvatar, uploadProfileFiles };
