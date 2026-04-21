// ============================================================
// MODULE 11 — Authentication & Security
// src/app.js
//
// Express application factory. Exported separately from server.js
// so it can be imported by tests without binding to a port.
//
// Security middleware applied:
//  helmet              — HTTP security headers (XSS, clickjacking…)
//  express-rate-limit  — brute-force protection on auth routes
//  express-mongo-sanitize — NoSQL injection prevention
//  hpp                 — HTTP parameter pollution prevention
//  cors                — Cross-Origin Resource Sharing
// ============================================================

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';

import authRouter from './routes/auth.js';
import tasksRouter from './routes/tasks.js';
import usersRouter from './routes/users.js';

const app = express();

// ── Security Middleware ────────────────────────────────────
app.use(helmet());           // Sets secure HTTP headers
app.use(mongoSanitize());    // Strips $-prefixed keys (NoSQL injection)
app.use(hpp());              // Removes duplicate query params
app.use(cors());             // Allow all origins; restrict in production

// Rate limit auth endpoints to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: 'Too many requests, please try again later' },
});

// ── Body Parsing ───────────────────────────────────────────
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/users', usersRouter);

// ── Health Check ───────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ── 404 Handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global Error Handler ───────────────────────────────────
// Must have 4 parameters for Express to treat it as error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ errors: messages });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

export default app;
