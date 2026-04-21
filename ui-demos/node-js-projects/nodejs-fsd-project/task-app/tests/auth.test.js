// ============================================================
// MODULE 15 — Testing Node.js
// tests/auth.test.js
//
// Integration tests for the Auth API.
// Covers:
//  POST /api/auth/register  — valid, duplicate email, weak password
//  POST /api/auth/login     — valid, wrong password, unknown email
//  POST /api/auth/logout    — single device logout
//  POST /api/auth/logout-all — all devices logout
// ============================================================

import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import '../tests/setup.js';

const validUser = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  password: 'Password123',
};

// ── POST /api/auth/register ────────────────────────────────
describe('POST /api/auth/register', () => {
  test('should register a new user and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(validUser)
      .expect(201);

    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(validUser.email);
    // Password must never be returned
    expect(res.body.user.password).toBeUndefined();
  });

  test('should persist the user in the database', async () => {
    await request(app).post('/api/auth/register').send(validUser).expect(201);
    const user = await User.findOne({ email: validUser.email });
    expect(user).not.toBeNull();
    expect(user.name).toBe(validUser.name);
  });

  test('should hash the password before storing', async () => {
    await request(app).post('/api/auth/register').send(validUser).expect(201);
    const user = await User.findOne({ email: validUser.email }).select('+password');
    expect(user.password).not.toBe(validUser.password);
    expect(user.password).toMatch(/^\$2[ab]\$/); // bcrypt prefix
  });

  test('should return 409 for a duplicate email', async () => {
    await User.create(validUser);
    const res = await request(app)
      .post('/api/auth/register')
      .send(validUser)
      .expect(409);
    expect(res.body.error).toMatch(/already registered/i);
  });

  test('should return 400 for a weak password (no uppercase)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, password: 'password123' })
      .expect(400);
    expect(res.body.errors).toBeDefined();
  });

  test('should return 400 for a missing email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', password: 'Password123' })
      .expect(400);
    expect(res.body.errors).toBeDefined();
  });
});

// ── POST /api/auth/login ───────────────────────────────────
describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await User.create(validUser);
  });

  test('should login with valid credentials and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password })
      .expect(200);

    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(validUser.email);
  });

  test('should return 401 for a wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: 'WrongPass99' })
      .expect(401);

    expect(res.body.error).toMatch(/invalid credentials/i);
  });

  test('should return 401 for an unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: validUser.password })
      .expect(401);

    expect(res.body.error).toMatch(/invalid credentials/i);
  });
});

// ── POST /api/auth/logout ──────────────────────────────────
describe('POST /api/auth/logout', () => {
  test('should invalidate the current session token', async () => {
    const regRes = await request(app)
      .post('/api/auth/register')
      .send(validUser)
      .expect(201);

    const { token } = regRes.body;

    await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // Using the same token after logout should fail
    await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });
});

// ── POST /api/auth/logout-all ──────────────────────────────
describe('POST /api/auth/logout-all', () => {
  test('should invalidate all session tokens', async () => {
    // Simulate two logins (two devices)
    const res1 = await request(app)
      .post('/api/auth/register')
      .send(validUser)
      .expect(201);

    const res2 = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password })
      .expect(200);

    // Logout all using the first token
    await request(app)
      .post('/api/auth/logout-all')
      .set('Authorization', `Bearer ${res1.body.token}`)
      .expect(200);

    // Both tokens should now be invalid
    await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${res1.body.token}`)
      .expect(401);

    await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${res2.body.token}`)
      .expect(401);
  });
});
