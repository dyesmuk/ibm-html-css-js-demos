// ============================================================
// MODULE 10 — REST APIs & Mongoose
// MODULE 12 — Sorting, Pagination & Filtering
// routes/tasks.js
//
// Full CRUD for tasks, scoped to the authenticated user.
//
// GET /api/tasks supports:
//   ?completed=true|false
//   ?priority=low|medium|high
//   ?search=keyword          (case-insensitive regex on description)
//   ?sortBy=field:asc|desc   e.g. createdAt:desc
//   ?limit=10&page=2         (page-based pagination, capped at 100)
// ============================================================

import { Router } from 'express';
import Task from '../models/Task.js';
import requireAuth from '../middleware/auth.js';

const router = Router();

// All task routes require authentication
router.use(requireAuth);

// ── POST /api/tasks ────────────────────────────────────────
// Creates a task owned by the authenticated user
router.post('/', async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, owner: req.user._id });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/tasks ─────────────────────────────────────────
// Returns paginated, filtered, sorted tasks for the current user
router.get('/', async (req, res, next) => {
  try {
    const { completed, priority, sortBy, limit = 10, page = 1, search } =
      req.query;

    // Build filter — always scoped to the authenticated user
    const filter = { owner: req.user._id };
    if (completed !== undefined) filter.completed = completed === 'true';
    if (priority) filter.priority = priority;
    if (search) filter.description = { $regex: search, $options: 'i' };

    // Build sort object from "field:direction" query param
    const sort = {};
    if (sortBy) {
      const [field, direction] = sortBy.split(':');
      sort[field] = direction === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // default: newest first
    }

    // Pagination — page numbers, capped at 100 per page
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Run query and count in parallel for efficiency
    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sort).limit(limitNum).skip(skip),
      Task.countDocuments(filter),
    ]);

    res.json({
      data: tasks,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/tasks/:id ─────────────────────────────────────
// Fetch a single task — owner check prevents cross-user access
router.get('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// ── PATCH /api/tasks/:id ───────────────────────────────────
// Partial update — uses task.save() so validators and hooks run
router.patch('/:id', async (req, res, next) => {
  const allowed = ['description', 'completed', 'priority', 'dueDate', 'tags'];
  const updates = Object.keys(req.body);
  const isValid = updates.every((u) => allowed.includes(u));

  if (!isValid) {
    return res.status(400).json({ error: 'Invalid updates', allowed });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Apply each update field manually so pre-save hooks fire
    updates.forEach((key) => (task[key] = req.body[key]));
    await task.save();

    res.json(task);
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/tasks/:id ──────────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted', task });
  } catch (err) {
    next(err);
  }
});

export default router;

