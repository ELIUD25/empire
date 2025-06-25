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
      activeSignals
    ] = await Promise.all([
      User.countDocuments(),
      DepositRequest.countDocuments({ status: 'pending' }),
      WithdrawalRequest.countDocuments({ status: 'pending' }),
      TaskSubmission.countDocuments({ status: 'pending' }),
      BlogPost.countDocuments({ status: 'pending' }),
      Advertisement.countDocuments({ isActive: true }),
      Task.countDocuments({ isActive: true }),
      TradingSignal.countDocuments({ isActive: true })
    ]);

    const approvedDeposits = await DepositRequest.find({ status: 'approved' });
    const totalRevenue = approvedDeposits.reduce((sum, deposit) => sum + deposit.amount, 0);

    const pendingActivations = await User.countDocuments({ isActivated: false });

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
      activeSignals
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all pending items for admin review
router.get('/pending', adminAuth, async (req, res) => {
  try {
    const [
      pendingDeposits,
      pendingWithdrawals,
      pendingTasks,
      pendingBlogs
    ] = await Promise.all([
      DepositRequest.find({ status: 'pending' }).sort({ createdAt: -1 }),
      WithdrawalRequest.find({ status: 'pending' }).sort({ createdAt: -1 }),
      TaskSubmission.find({ status: 'pending' }).populate('taskId userId').sort({ createdAt: -1 }),
      BlogPost.find({ status: 'pending' }).sort({ createdAt: -1 })
    ]);

    res.json({
      deposits: pendingDeposits,
      withdrawals: pendingWithdrawals,
      tasks: pendingTasks,
      blogs: pendingBlogs
    });
  } catch (error) {
    console.error('Get pending items error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;