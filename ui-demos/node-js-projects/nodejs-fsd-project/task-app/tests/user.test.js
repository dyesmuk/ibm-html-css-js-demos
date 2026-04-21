// ============================================================
// MODULE 15 — Testing Node.js
// tests/user.test.js
//
// Integration tests for user profile endpoints.
// Covers:
//  GET    /api/users/me        — fetch profile
//  PATCH  /api/users/me        — update profile
//  DELETE /api/users/me        — delete account + cascade
// ============================================================

import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Task from '../src/models/Task.js';
import '../tests/setup.js';

let testUser, token;

beforeEach(async () => {
  testUser = await User.create({
    name: 'Test User',
    email: 'test@test.com',
    password: 'Password123',
  });
  token = await testUser.generateAuthToken();
});

// ── GET /api/users/me ──────────────────────────────────────
describe('GET /api/users/me', () => {
  test('should return the authenticated user profile', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.email).toBe('test@test.com');
    expect(res.body.password).toBeUndefined();
    expect(res.body.tokens).toBeUndefined();
  });

  test('should return 401 without a token', async () => {
    await request(app).get('/api/users/me').expect(401);
  });
});

// ── PATCH /api/users/me ────────────────────────────────────
describe('PATCH /api/users/me', () => {
  test('should update the user name', async () => {
    const res = await request(app)
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name' })
      .expect(200);

    expect(res.body.name).toBe('Updated Name');
  });

  test('should hash a new password on update', async () => {
    await request(app)
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: 'NewPassword99' })
      .expect(200);

    const user = await User.findById(testUser._id).select('+password');
    expect(user.password).not.toBe('NewPassword99');
    expect(user.password).toMatch(/^\$2[ab]\$/);
  });

  test('should return 400 for invalid field names', async () => {
    const res = await request(app)
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'admin' })
      .expect(400);

    expect(res.body.error).toMatch(/invalid updates/i);
  });
});

// ── DELETE /api/users/me ───────────────────────────────────
describe('DELETE /api/users/me', () => {
  test('should delete the user account', async () => {
    await request(app)
      .delete('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const user = await User.findById(testUser._id);
    expect(user).toBeNull();
  });

  test('should cascade-delete all tasks when the user is deleted', async () => {
    await Task.create([
      { description: 'Task A', owner: testUser._id },
      { description: 'Task B', owner: testUser._id },
    ]);

    await request(app)
      .delete('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const tasks = await Task.find({ owner: testUser._id });
    expect(tasks).toHaveLength(0);
  });
});
