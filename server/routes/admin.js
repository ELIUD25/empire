import express from 'express';
import User from '../models/User.js';
import BettingTip from '../models/BettingTip.js';
import TradingSignal from '../models/TradingSignal.js';
import BlogPost from '../models/BlogPost.js';
import Advertisement from '../models/Advertisement.js';
import Task from '../models/Task.js';
import TaskSubmission from '../models/TaskSubmission.js';
import DepositRequest from '../models/DepositRequest.js';
import WithdrawalRequest from '../models/WithdrawalRequest.js';
import MarketNews from '../models/MarketNews.js';
import MarketAnalysis from '../models/MarketAnalysis.js';
import TradingCourse from '../models/TradingCourse.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get admin dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      pendingDeposits,
      pendingWithdrawals,
      pendingTasks,
      pendingBlogs,
      activeAds,
      activeTasks,
      activeSignals,
    ] = await Promise.all([
      User.countDocuments(),
      DepositRequest.countDocuments({ status: 'pending' }),
      WithdrawalRequest.countDocuments({ status: 'pending' }),
      TaskSubmission.countDocuments({ status: 'pending' }),
      BlogPost.countDocuments({ status: 'pending' }),
      Advertisement.countDocuments({ isActive: true }),
      Task.countDocuments({ isActive: true }),
      TradingSignal.countDocuments({ isActive: true }),
    ]);

    const approvedDeposits = await DepositRequest.find({ status: 'approved' });
    const totalRevenue = approvedDeposits.reduce(
      (sum, deposit) => sum + deposit.amount,
      0
    );

    const pendingActivations = await User.countDocuments({
      isActivated: false,
    });

    res.json({
      totalUsers,
      totalRevenue,
      pendingActivations,
      pendingDeposits,
      pendingWithdrawals,
      pendingTasks,
      pendingBlogs,
      activeAds,
      activeTasks,
      activeSignals,
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all pending items for admin review
router.get('/pending', adminAuth, async (req, res) => {
  try {
    const [pendingDeposits, pendingWithdrawals, pendingTasks, pendingBlogs] =
      await Promise.all([
        DepositRequest.find({ status: 'pending' }).sort({ createdAt: -1 }),
        WithdrawalRequest.find({ status: 'pending' }).sort({ createdAt: -1 }),
        TaskSubmission.find({ status: 'pending' })
          .populate('taskId userId')
          .sort({ createdAt: -1 }),
        BlogPost.find({ status: 'pending' }).sort({ createdAt: -1 }),
      ]);

    res.json({
      deposits: pendingDeposits,
      withdrawals: pendingWithdrawals,
      tasks: pendingTasks,
      blogs: pendingBlogs,
    });
  } catch (error) {
    console.error('Get pending items error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User Management Routes
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/users/:id/ban', adminAuth, async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: true, banReason: reason },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/users/:id/unban', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: false, banReason: null },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Content Management Routes
router.get('/betting-tips', adminAuth, async (req, res) => {
  try {
    const tips = await BettingTip.find().sort({ createdAt: -1 });
    res.json(tips);
  } catch (error) {
    console.error('Get admin betting tips error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/trading-signals', adminAuth, async (req, res) => {
  try {
    const signals = await TradingSignal.find().sort({ createdAt: -1 });
    res.json(signals);
  } catch (error) {
    console.error('Get admin trading signals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/market-news', adminAuth, async (req, res) => {
  try {
    const news = await MarketNews.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    console.error('Get admin market news error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/market-analysis', adminAuth, async (req, res) => {
  try {
    const analysis = await MarketAnalysis.find().sort({ createdAt: -1 });
    res.json(analysis);
  } catch (error) {
    console.error('Get admin market analysis error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/trading-courses', adminAuth, async (req, res) => {
  try {
    const courses = await TradingCourse.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Get admin trading courses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
