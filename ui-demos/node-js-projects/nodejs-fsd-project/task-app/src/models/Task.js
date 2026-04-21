// ============================================================
// MODULE 09 — MongoDB & Promises
// models/Task.js
//
// Demonstrates:
//  - Schema with validation and enum constraints
//  - Owner reference to User (enables populate())
//  - timestamps option
// ============================================================

import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: Date,
    tags: [String],
    // Foreign key — links task to the user who created it
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // enables Task.find(...).populate('owner')
    },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);
export default Task;
