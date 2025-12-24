const express = require('express');
const SleepLog = require('../models/SleepLog');
const HabitLog = require('../models/HabitLog');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Helper function to get week start and end dates
const getWeekDates = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDay();
  const diff = date.getDate() - day; // Get Monday
  const monday = new Date(date.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { start: monday, end: sunday };
};

// Helper function to calculate streak
const calculateStreak = (logs, isReverse = false) => {
  if (logs.length === 0) return 0;
  
  const sorted = [...logs].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return isReverse ? dateB - dateA : dateA - dateB;
  });

  let streak = 0;
  let currentDate = new Date(sorted[0].date);
  currentDate.setHours(0, 0, 0, 0);

  for (const log of sorted) {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);
    
    if (logDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() + (isReverse ? -1 : 1));
    } else {
      break;
    }
  }

  return streak;
};

// @route   GET /api/analytics/weekly/:userId
// @desc    Get weekly analytics report
// @access  Private
router.get('/weekly/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { week } = req.query; // Format: YYYY-MM-DD (any date in the week)

    // Verify user can only access their own data
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { start, end } = week ? getWeekDates(week) : getWeekDates(new Date().toISOString());

    // Get sleep logs for the week
    const sleepLogs = await SleepLog.find({
      userId,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    // Get habit logs for the week
    const habitLogs = await HabitLog.find({
      userId,
      date: { $gte: start, $lte: end },
    }).sort({ habitName: 1, date: 1 });

    // Calculate sleep analytics
    const sleepHours = sleepLogs.map(log => log.sleepHours);
    const avgSleepHours = sleepHours.length > 0
      ? sleepHours.reduce((a, b) => a + b, 0) / sleepHours.length
      : 0;

    const bestDay = sleepLogs.length > 0
      ? sleepLogs.reduce((best, current) => current.sleepHours > best.sleepHours ? current : best)
      : null;

    const worstDay = sleepLogs.length > 0
      ? sleepLogs.reduce((worst, current) => current.sleepHours < worst.sleepHours ? current : worst)
      : null;

    // Calculate sleep consistency (days with sleep logged / total days)
    const daysInWeek = 7;
    const sleepConsistency = (sleepLogs.length / daysInWeek) * 100;

    // Calculate habit completion percentages
    const habitNames = [...new Set(habitLogs.map(log => log.habitName))];
    const habitCompletion = habitNames.map(habitName => {
      const logs = habitLogs.filter(log => log.habitName === habitName);
      const completionRate = (logs.length / daysInWeek) * 100;
      return {
        habitName,
        completionRate: Math.round(completionRate * 100) / 100,
        completedDays: logs.length,
      };
    });

    // Calculate streaks
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const recentSleepLogs = await SleepLog.find({
      userId,
      date: { $lte: currentDate },
    }).sort({ date: -1 }).limit(31);

    const recentHabitLogs = await HabitLog.find({
      userId,
      date: { $lte: currentDate },
    }).sort({ date: -1 });

    const sleepStreak = calculateStreak(recentSleepLogs, true);
    
    const habitStreaks = habitNames.map(habitName => {
      const logs = recentHabitLogs
        .filter(log => log.habitName === habitName)
        .map(log => ({ date: log.date }));
      return {
        habitName,
        streak: calculateStreak(logs, true),
      };
    });

    res.json({
      period: { start, end },
      sleep: {
        averageHours: Math.round(avgSleepHours * 100) / 100,
        bestDay: bestDay ? { date: bestDay.date, hours: bestDay.sleepHours } : null,
        worstDay: worstDay ? { date: worstDay.date, hours: worstDay.sleepHours } : null,
        consistency: Math.round(sleepConsistency * 100) / 100,
        currentStreak: sleepStreak,
      },
      habits: {
        completionRates: habitCompletion,
        streaks: habitStreaks,
      },
    });
  } catch (error) {
    console.error('Weekly analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/monthly/:userId
// @desc    Get monthly analytics report
// @access  Private
router.get('/monthly/:userId', async (req, res) => {
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
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }

    const daysInMonth = endDate.getDate();

    // Get sleep logs for the month
    const sleepLogs = await SleepLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    // Get habit logs for the month
    const habitLogs = await HabitLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ habitName: 1, date: 1 });

    // Calculate sleep analytics
    const sleepHours = sleepLogs.map(log => log.sleepHours);
    const avgSleepDuration = sleepHours.length > 0
      ? sleepHours.reduce((a, b) => a + b, 0) / sleepHours.length
      : 0;

    // Calculate longest streak
    const longestStreak = calculateStreak(sleepLogs);

    // Calculate habit completion
    const habitNames = [...new Set(habitLogs.map(log => log.habitName))];
    const habitStats = habitNames.map(habitName => {
      const logs = habitLogs.filter(log => log.habitName === habitName);
      const completionRate = (logs.length / daysInMonth) * 100;
      return {
        habitName,
        completionRate: Math.round(completionRate * 100) / 100,
        completedDays: logs.length,
        streak: calculateStreak(logs),
      };
    });

    // Find most consistent habit
    const mostConsistentHabit = habitStats.length > 0
      ? habitStats.reduce((best, current) => 
          current.completionRate > best.completionRate ? current : best
        )
      : null;

    // Calculate productivity score (combination of sleep quality and habit completion)
    const sleepScore = (avgSleepDuration / 7) * 100; // Normalize to 7 hours
    const habitScore = habitStats.length > 0
      ? habitStats.reduce((sum, stat) => sum + stat.completionRate, 0) / habitStats.length
      : 0;
    const productivityScore = Math.round((sleepScore * 0.4 + habitScore * 0.6));

    // Find most productive day (day with most habits completed)
    const dayStats = {};
    habitLogs.forEach(log => {
      const day = new Date(log.date).getDate();
      if (!dayStats[day]) dayStats[day] = 0;
      dayStats[day]++;
    });
    
    const mostProductiveDay = Object.keys(dayStats).length > 0
      ? parseInt(Object.entries(dayStats).reduce((best, current) => 
          current[1] > best[1] ? current : best
        )[0])
      : null;

    // Generate insights
    const insights = [];
    if (avgSleepDuration < 6) {
      insights.push('Consider aiming for at least 6 hours of sleep for better productivity');
    }
    if (longestStreak >= 7) {
      insights.push(`Great job! You maintained a ${longestStreak}-day sleep streak`);
    }
    if (mostConsistentHabit) {
      insights.push(`${mostConsistentHabit.habitName} was your most consistent habit`);
    }

    res.json({
      period: { start: startDate, end: endDate },
      sleep: {
        averageDuration: Math.round(avgSleepDuration * 100) / 100,
        longestStreak,
        totalDaysLogged: sleepLogs.length,
      },
      habits: {
        stats: habitStats,
        mostConsistent: mostConsistentHabit,
        totalHabits: habitNames.length,
      },
      productivity: {
        score: productivityScore,
        mostProductiveDay,
        insights,
      },
    });
  } catch (error) {
    console.error('Monthly analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

