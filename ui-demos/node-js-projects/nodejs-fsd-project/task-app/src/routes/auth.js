// ============================================================
// MODULE 11 — Authentication & Security
// routes/auth.js
//
// Endpoints:
//  POST /api/auth/register   — create account + return JWT
//  POST /api/auth/login      — verify credentials + return JWT
//  POST /api/auth/logout     — invalidate current device token
//  POST /api/auth/logout-all — invalidate all device tokens
// ============================================================

import { Router } from 'express';
import Joi from 'joi';
import User from '../models/User.js';
import requireAuth from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { sendWelcomeEmail } from '../services/email.js';

const router = Router();

// ── Joi Schemas ────────────────────────────────────────────
const registerSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  email: Joi.string().email().required(),
  // Must contain at least one uppercase letter and one digit
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Z])(?=.*[0-9])/)
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain at least one uppercase letter and one number',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// ── POST /api/auth/register ────────────────────────────────
router.post('/register', validate(registerSchema), async (req, res, next) => {
  console.log(`register ${req.body}`); // PII data should not be logged 
  try {
    const user = await User.create(req.body);
    const token = await user.generateAuthToken();

    // Fire-and-forget welcome email (don't block response)
    sendWelcomeEmail(user.email, user.name).catch(console.error);

    res.status(201).json({ user, token });
  } catch (err) {
    // MongoDB duplicate key error (email already taken)
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    next(err);
  }
});

// ── POST /api/auth/login ───────────────────────────────────
router.post('/login', validate(loginSchema), async (req, res, next) => {
  console.log(`login ${req.body}`); // PII data should not be logged 
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.json({ user, token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// ── POST /api/auth/logout ──────────────────────────────────
// Removes only the token used in this request (single-device logout)
router.post('/logout', requireAuth, async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter((t) => t.token !== req.token);
    await req.user.save();
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/logout-all ──────────────────────────────
// Clears all stored tokens — logs out from every device
router.post('/logout-all', requireAuth, async (req, res, next) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.json({ message: 'Logged out from all devices' });
  } catch (err) {
    next(err);
  }
});

export default router;

