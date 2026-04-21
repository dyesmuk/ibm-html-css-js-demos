// ============================================================
// MODULE 13 — File Uploads
// routes/users.js
//
// User profile management + avatar upload/serve/delete.
//
// GET    /api/users/me           — get own profile
// PATCH  /api/users/me           — update profile fields
// DELETE /api/users/me           — delete account (cascade-deletes tasks)
// POST   /api/users/me/avatar    — upload & process avatar with sharp
// GET    /api/users/:id/avatar   — serve avatar as image/png
// DELETE /api/users/me/avatar    — remove avatar
// ============================================================

import { Router } from 'express';
import sharp from 'sharp';
import User from '../models/User.js';
import requireAuth from '../middleware/auth.js';
import { uploadAvatar } from '../middleware/upload.js';
import { sendCancellationEmail } from '../services/email.js';

const router = Router();

// ── GET /api/users/me ──────────────────────────────────────
router.get('/me', requireAuth, async (req, res) => {
  // req.user is already populated by requireAuth middleware
  res.json(req.user);
});

// ── PATCH /api/users/me ────────────────────────────────────
router.patch('/me', requireAuth, async (req, res, next) => {
  const allowed = ['name', 'email', 'password'];
  const updates = Object.keys(req.body);
  const isValid = updates.every((u) => allowed.includes(u));

  if (!isValid) {
    return res.status(400).json({ error: 'Invalid updates', allowed });
  }

  try {
    updates.forEach((key) => (req.user[key] = req.body[key]));
    await req.user.save(); // triggers pre-save hook (password hashing)
    res.json(req.user);
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/users/me ───────────────────────────────────
// Deletes user account; pre('deleteOne') hook cascades to tasks
router.delete('/me', requireAuth, async (req, res, next) => {
  try {
    await req.user.deleteOne();
    sendCancellationEmail(req.user.email, req.user.name).catch(console.error);
    res.json({ message: 'Account deleted' });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/users/me/avatar ──────────────────────────────
// Multer buffers the file in memory, sharp resizes it to 200×200 PNG
router.post(
  '/me/avatar',
  requireAuth,
  uploadAvatar,
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Resize and normalise to PNG regardless of input format
      const processed = await sharp(req.file.buffer)
        .resize(200, 200)
        .png()
        .toBuffer();

      req.user.avatar = processed;
      await req.user.save();
      res.json({ message: 'Avatar uploaded successfully' });
    } catch (err) {
      next(err);
    }
  },
  // Multer error handler (e.g. file too large, wrong type)
  (err, req, res, next) => {
    res.status(400).json({ error: err.message });
  }
);

// ── GET /api/users/:id/avatar ──────────────────────────────
// Public endpoint — serves the stored Buffer with correct headers
router.get('/:id/avatar', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user?.avatar) {
      return res.status(404).json({ error: 'No avatar found' });
    }
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=86400'); // cache 24 h
    res.send(user.avatar);
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/users/me/avatar ────────────────────────────
router.delete('/me/avatar', requireAuth, async (req, res, next) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.json({ message: 'Avatar removed' });
  } catch (err) {
    next(err);
  }
});

export default router;
