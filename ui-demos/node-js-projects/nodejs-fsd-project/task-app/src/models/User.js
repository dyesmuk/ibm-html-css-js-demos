// ============================================================
// MODULE 09 — MongoDB & Promises
// models/User.js
//
// Demonstrates:
//  - Schema field validation (required, unique, match, enum)
//  - Virtual fields (taskCount)
//  - Instance methods (generateAuthToken, toJSON)
//  - Static methods (findByCredentials)
//  - Pre-save middleware (bcrypt password hashing)
//  - Cascade delete via pre('deleteOne') hook
//  - Multi-device token support (tokens array)
// ============================================================

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // never returned in queries by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: Buffer,
    // Multi-device sessions: each login stores its own token
    tokens: [
      {
        token: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// ── Virtual ────────────────────────────────────────────────
// Not stored in DB; computed on demand via .populate()
userSchema.virtual('taskCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
  count: true,
});

// ── Instance Method ────────────────────────────────────────
// Signs a JWT, persists it to the tokens array, returns it.
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    { _id: this._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

// ── toJSON Override ────────────────────────────────────────
// Controls what is sent to the client — strips sensitive fields.
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.tokens;
  delete user.__v;
  return user;
};

// ── Static Method ──────────────────────────────────────────
// Used by the login route; throws on bad credentials (same
// error message for both cases to avoid user enumeration).
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  return user;
};

// ── Pre-save Hook ──────────────────────────────────────────
// Only re-hashes when the password field was actually modified.
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// ── Cascade Delete ─────────────────────────────────────────
// When a user document is deleted, remove all their tasks too.
userSchema.pre('deleteOne', { document: true }, async function (next) {
  const Task = mongoose.model('Task');
  await Task.deleteMany({ owner: this._id });
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
