const express = require('express');
const SleepLog = require('../models/SleepLog');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/sleep/:userId
// @desc    Get sleep logs for a month
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

    const sleepLogs = await SleepLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    res.json(sleepLogs);
  } catch (error) {
    console.error('Get sleep logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/sleep
// @desc    Create or update sleep log
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { userId, date, sleepHours } = req.body;

    // Verify user can only access their own data
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (![4, 5, 6, 7].includes(sleepHours)) {
      return res.status(400).json({ message: 'Invalid sleep hours' });
    }

    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);

    // Use upsert to create or update
    const sleepLog = await SleepLog.findOneAndUpdate(
      { userId, date: dateObj },
      { sleepHours, date: dateObj },
      { new: true, upsert: true }
    );

    res.json(sleepLog);
  } catch (error) {
    console.error('Create/update sleep log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/sleep/:userId/:date
// @desc    Delete sleep log
// @access  Private
router.delete('/:userId/:date', async (req, res) => {
  try {
    const { userId, date } = req.params;

    // Verify user can only access their own data
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);

    await SleepLog.findOneAndDelete({ userId, date: dateObj });

    res.json({ message: 'Sleep log deleted' });
  } catch (error) {
    console.error('Delete sleep log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

