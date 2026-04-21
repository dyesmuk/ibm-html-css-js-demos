// ============================================================
// MODULE 15 — Testing Node.js
// tests/setup.js
//
// Jest global setup:
//  - Spins up an in-memory MongoDB instance (no real DB needed)
//  - Connects Mongoose before all tests
//  - Wipes all collections after each test for full isolation
//  - Disconnects and stops the server after all tests complete
// ============================================================

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

// Start in-memory MongoDB before any test file runs
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

// Stop everything after the full test suite completes
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clean every collection between individual tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
