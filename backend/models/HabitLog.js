const mongoose = require('mongoose');

const habitLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  habitName: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  completed: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Ensure one habit log per user per habit per day
habitLogSchema.index({ userId: 1, habitName: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HabitLog', habitLogSchema);

