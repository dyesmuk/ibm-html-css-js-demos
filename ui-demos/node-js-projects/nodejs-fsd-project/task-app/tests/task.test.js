// ============================================================
// MODULE 15 — Testing Node.js
// tests/task.test.js
//
// Integration tests for the Task API using Supertest.
// Tests cover:
//  POST /api/tasks  — create task (happy path, no auth, bad input)
//  GET  /api/tasks  — list tasks (all, filter by completed)
//  GET  /api/tasks/:id  — fetch single task
//  PATCH /api/tasks/:id — update task
//  DELETE /api/tasks/:id — delete task
// ============================================================

import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Task from '../src/models/Task.js';
import '../tests/setup.js';

let testUser, token;

// Create a fresh test user before each test
beforeEach(async () => {
  testUser = await User.create({
    name: 'Test User',
    email: 'test@test.com',
    password: 'Password123',
  });
  token = await testUser.generateAuthToken();
});

// ── POST /api/tasks ────────────────────────────────────────
describe('POST /api/tasks', () => {
  test('should create a task for an authenticated user', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Buy groceries' })
      .expect(201);

    expect(res.body.description).toBe('Buy groceries');
    expect(res.body.completed).toBe(false);
    expect(res.body.priority).toBe('medium');

    // Verify task was actually saved in the DB
    const task = await Task.findById(res.body._id);
    expect(task).not.toBeNull();
    expect(task.owner.toString()).toBe(testUser._id.toString());
  });

  test('should return 401 without an auth token', async () => {
    await request(app)
      .post('/api/tasks')
      .send({ description: 'Buy groceries' })
      .expect(401);
  });

  test('should return 400 for an empty description', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ description: '' })
      .expect(400);

    expect(res.body.errors || res.body.error).toBeDefined();
  });

  test('should create a task with all optional fields', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Submit assignment',
        priority: 'high',
        tags: ['work', 'urgent'],
        dueDate: '2025-12-31',
      })
      .expect(201);

    expect(res.body.priority).toBe('high');
    expect(res.body.tags).toContain('work');
  });
});

// ── GET /api/tasks ─────────────────────────────────────────
describe('GET /api/tasks', () => {
  beforeEach(async () => {
    await Task.create([
      { description: 'Task 1', completed: false, owner: testUser._id },
      { description: 'Task 2', completed: true, owner: testUser._id },
      { description: 'Task 3', completed: false, priority: 'high', owner: testUser._id },
    ]);
  });

  test('should return all tasks for the authenticated user', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data).toHaveLength(3);
    expect(res.body.pagination.total).toBe(3);
  });

  test('should filter by completed=true', async () => {
    const res = await request(app)
      .get('/api/tasks?completed=true')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].description).toBe('Task 2');
  });

  test('should filter by completed=false', async () => {
    const res = await request(app)
      .get('/api/tasks?completed=false')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data).toHaveLength(2);
  });

  test('should filter by priority', async () => {
    const res = await request(app)
      .get('/api/tasks?priority=high')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].description).toBe('Task 3');
  });

  test('should paginate results', async () => {
    const res = await request(app)
      .get('/api/tasks?limit=2&page=1')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data).toHaveLength(2);
    expect(res.body.pagination.totalPages).toBe(2);
    expect(res.body.pagination.hasNext).toBe(true);
  });

  test('should not return tasks from another user', async () => {
    const otherUser = await User.create({
      name: 'Other',
      email: 'other@test.com',
      password: 'Password123',
    });
    const otherToken = await otherUser.generateAuthToken();

    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(200);

    expect(res.body.data).toHaveLength(0);
  });
});

// ── GET /api/tasks/:id ─────────────────────────────────────
describe('GET /api/tasks/:id', () => {
  test('should fetch a single task by id', async () => {
    const task = await Task.create({
      description: 'Read a book',
      owner: testUser._id,
    });

    const res = await request(app)
      .get(`/api/tasks/${task._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.description).toBe('Read a book');
  });

  test('should return 404 for a task owned by another user', async () => {
    const otherUser = await User.create({
      name: 'Other',
      email: 'other2@test.com',
      password: 'Password123',
    });
    const task = await Task.create({
      description: 'Private task',
      owner: otherUser._id,
    });

    await request(app)
      .get(`/api/tasks/${task._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});

// ── PATCH /api/tasks/:id ───────────────────────────────────
describe('PATCH /api/tasks/:id', () => {
  test('should update allowed fields', async () => {
    const task = await Task.create({
      description: 'Original',
      owner: testUser._id,
    });

    const res = await request(app)
      .patch(`/api/tasks/${task._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ completed: true, description: 'Updated' })
      .expect(200);

    expect(res.body.completed).toBe(true);
    expect(res.body.description).toBe('Updated');
  });

  test('should return 400 for invalid field names', async () => {
    const task = await Task.create({
      description: 'Test',
      owner: testUser._id,
    });

    await request(app)
      .patch(`/api/tasks/${task._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ owner: 'hacked' })
      .expect(400);
  });
});

// ── DELETE /api/tasks/:id ──────────────────────────────────
describe('DELETE /api/tasks/:id', () => {
  test('should delete a task', async () => {
    const task = await Task.create({
      description: 'Delete me',
      owner: testUser._id,
    });

    await request(app)
      .delete(`/api/tasks/${task._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const found = await Task.findById(task._id);
    expect(found).toBeNull();
  });
});
