// ============================================================
// MODULE 09 — MongoDB & Promises
// db/connect.js
// Establishes and manages the Mongoose connection to MongoDB.
// ============================================================

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`DB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () =>
  console.warn('MongoDB disconnected')
);
mongoose.connection.on('error', (err) =>
  console.error('MongoDB error:', err)
);

export default connectDB;
