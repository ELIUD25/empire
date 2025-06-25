import express from 'express';
import Task from '../models/Task.js';
import TaskSubmission from '../models/TaskSubmission.js';
import User from '../models/User.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit task
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { response } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user already submitted this task
    const existingSubmission = await TaskSubmission.findOne({
      taskId: req.params.id,
      userId: req.user._id
    });

    if (existingSubmission) {
      return res.status(400).json({ error: 'Task already submitted' });
    }

    const submission = new TaskSubmission({
      taskId: req.params.id,
      userId: req.user._id,
      response
    });

    await submission.save();

    // Update task response count
    if (task.type === 'bidding' || task.type === 'transcription') {
      task.currentBidders += 1;
    } else {
      task.currentResponses += 1;
    }
    await task.save();

    res.status(201).json(submission);
  } catch (error) {
    console.error('Submit task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's task submissions
router.get('/my-submissions', auth, async (req, res) => {
  try {
    const submissions = await TaskSubmission.find({ userId: req.user._id })
      .populate('taskId')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error('Get task submissions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve task submission (admin only)
router.put('/submissions/:id/approve', adminAuth, async (req, res) => {
  try {
    const submission = await TaskSubmission.findById(req.params.id).populate('taskId');
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    submission.status = 'approved';
    await submission.save();

    // Update user balance
    const user = await User.findById(submission.userId);
    user.balance += submission.taskId.reward;
    user.totalEarnings += submission.taskId.reward;
    await user.save();

    res.json(submission);
  } catch (error) {
    console.error('Approve task submission error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;