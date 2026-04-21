// ============================================================
// MODULE 13 — File Uploads
// middleware/upload.js
//
// Multer configuration for:
//  - Avatar uploads  (single file, 2 MB, images only)
//  - Document uploads (up to 5 files, 10 MB each)
//
// Files are held in memory (Buffer) so sharp can process them
// before writing to MongoDB.
// ============================================================

import multer from 'multer';

// Store in memory as a Buffer (not on disk)
const storage = multer.memoryStorage();

// Only allow common image MIME types
const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
  }
};

// Single avatar upload — 2 MB limit
export const uploadAvatar = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: imageFilter,
}).single('avatar');

// Multiple document upload — 10 MB each, max 5 files
export const uploadDocuments = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).array('documents', 5);
