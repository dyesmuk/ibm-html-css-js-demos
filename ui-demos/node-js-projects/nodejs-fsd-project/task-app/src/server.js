// ============================================================
// src/server.js
// Entry point — loads env, connects DB, starts Express server.
// ============================================================

import 'dotenv/config';
import app from './app.js';
import connectDB from './db/connect.js';

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Task App server running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
};

start();
