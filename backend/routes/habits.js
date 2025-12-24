const express = require('express');
const HabitLog = require('../models/HabitLog');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/habits/:userId
// @desc    Get habits and logs for a month
// @access  Private
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { month } = req.query; // Format: YYYY-MM

    // Verify user can only access their own data
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    let startDate, endDate;
    
    if (month) {
      const [year, monthNum] = month.split('-').map(Number);
      startDate = new Date(year, monthNum - 1, 1);
      endDate = new Date(year, monthNum, 0, 23, 59, 59);
    } else {
      // Default to current month
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }

    // Get all habit logs for the specified month (only completed ones)
    const habitLogs = await HabitLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
      completed: true // Only get completed logs
    }).sort({ habitName: 1, date: 1 });

    // Get ALL unique habit names for this user (from all months, any completion status)
    const allHabitLogs = await HabitLog.find({ userId }).select('habitName').lean();
    const habitNames = [...new Set(allHabitLogs.map(log => log.habitName))];

    // Organize logs by habit name (only completed logs from current month)
    const habitsData = habitNames.map(habitName => ({
      name: habitName,
      logs: habitLogs.filter(log => log.habitName === habitName && log.completed === true),
    }));

    res.json(habitsData);
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/habits/log
// @desc    Create or update habit log (toggle completion)
// @access  Private
router.post('/log', async (req, res) => {
  try {
    const { userId, habitName, date, completed } = req.body;

    // Verify user can only access their own data
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);

    // If completed is false, delete the log (toggle off)
    if (completed === false) {
      await HabitLog.findOneAndDelete({ userId, habitName, date: dateObj });
      return res.json({ message: 'Habit log removed', deleted: true });
    }

    // Otherwise, create or update the log
    const habitLog = await HabitLog.findOneAndUpdate(
      { userId, habitName, date: dateObj },
      { completed: true, date: dateObj },
      { new: true, upsert: true }
    );

    res.json(habitLog);
  } catch (error) {
    console.error('Create/update habit log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/habits
// @desc    Create a new habit (by creating a log entry)
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { userId, habitName } = req.body;

    // Verify user can only access their own data
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!habitName || typeof habitName !== 'string' || habitName.trim() === '') {
      return res.status(400).json({ message: 'Habit name is required and must be a non-empty string' });
    }

    const trimmedName = habitName.trim();
    
    // Check if habit already exists for this user (by checking if any logs exist)
    const existingHabit = await HabitLog.findOne({ userId, habitName: trimmedName });
    
    if (existingHabit) {
      return res.status(200).json({ message: 'Habit already exists', habitName: trimmedName });
    }

    // Don't create a placeholder - just return success
    // The habit will appear when getHabits is called (it returns all unique habit names)
    res.json({ message: 'Habit created', habitName: trimmedName });
  } catch (error) {
    console.error('Create habit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/habits/rename
// @desc    Rename a habit (update all logs with old name to new name)
// @access  Private
router.put('/rename', async (req, res) => {
  try {
    const { userId, oldName, newName } = req.body;

    // Verify user can only access their own data
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!oldName || !newName || newName.trim() === '') {
      return res.status(400).json({ message: 'Both old and new habit names are required' });
    }

    const result = await HabitLog.updateMany(
      { userId, habitName: oldName },
      { $set: { habitName: newName.trim() } }
    );

    res.json({ message: 'Habit renamed', updated: result.modifiedCount });
  } catch (error) {
    console.error('Rename habit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/habits
// @desc    Delete a habit (delete all logs for that habit)
// @access  Private
router.delete('/', async (req, res) => {
  try {
    const { userId, habitName } = req.body;

    // Verify user can only access their own data
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!habitName) {
      return res.status(400).json({ message: 'Habit name is required' });
    }

    const result = await HabitLog.deleteMany({ userId, habitName });

    res.json({ message: 'Habit deleted', deleted: result.deletedCount });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

