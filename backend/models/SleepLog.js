const mongoose = require('mongoose');

const sleepLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
  },
  sleepHours: {
    type: Number,
    required: true,
    enum: [4, 5, 6, 7],
  },
}, {
  timestamps: true,
});

// Ensure one sleep log per user per day
sleepLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('SleepLog', sleepLogSchema);

