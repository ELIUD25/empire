import express from 'express';
import DepositRequest from '../models/DepositRequest.js';
import WithdrawalRequest from '../models/WithdrawalRequest.js';
import User from '../models/User.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Submit deposit request
router.post('/deposit', auth, async (req, res) => {
  try {
    const { amount, mpesaMessage } = req.body;

    const depositRequest = new DepositRequest({
      userId: req.user._id,
      userName: req.user.name,
      amount,
      mpesaMessage,
    });

    await depositRequest.save();
    res.status(201).json(depositRequest);
  } catch (error) {
    console.error('Submit deposit request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit withdrawal request
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount, method, details } = req.body;

    if (req.user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const withdrawalRequest = new WithdrawalRequest({
      userId: req.user._id,
      userName: req.user.name,
      amount,
      method,
      details,
    });

    await withdrawalRequest.save();
    res.status(201).json(withdrawalRequest);
  } catch (error) {
    console.error('Submit withdrawal request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all deposit requests (admin only)
router.get('/admin/deposits', adminAuth, async (req, res) => {
  try {
    const deposits = await DepositRequest.find().sort({ createdAt: -1 });
    res.json(deposits);
  } catch (error) {
    console.error('Get admin deposits error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all withdrawal requests (admin only)
router.get('/admin/withdrawals', adminAuth, async (req, res) => {
  try {
    const withdrawals = await WithdrawalRequest.find().sort({ createdAt: -1 });
    res.json(withdrawals);
  } catch (error) {
    console.error('Get admin withdrawals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve deposit (admin only)
router.put('/deposit/:id/approve', adminAuth, async (req, res) => {
  try {
    const deposit = await DepositRequest.findById(req.params.id);
    if (!deposit) {
      return res.status(404).json({ error: 'Deposit request not found' });
    }

    if (deposit.status !== 'pending') {
      return res.status(400).json({ error: 'Deposit already processed' });
    }

    deposit.status = 'approved';
    await deposit.save();

    // Update user balance
    const user = await User.findById(deposit.userId);
    user.balance += deposit.amount;
    await user.save();

    res.json(deposit);
  } catch (error) {
    console.error('Approve deposit error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reject deposit (admin only)
router.put('/deposit/:id/reject', adminAuth, async (req, res) => {
  try {
    const deposit = await DepositRequest.findById(req.params.id);
    if (!deposit) {
      return res.status(404).json({ error: 'Deposit request not found' });
    }

    if (deposit.status !== 'pending') {
      return res.status(400).json({ error: 'Deposit already processed' });
    }

    deposit.status = 'rejected';
    await deposit.save();

    res.json(deposit);
  } catch (error) {
    console.error('Reject deposit error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve withdrawal (admin only)
router.put('/withdraw/:id/approve', adminAuth, async (req, res) => {
  try {
    const withdrawal = await WithdrawalRequest.findById(req.params.id);
    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal request not found' });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ error: 'Withdrawal already processed' });
    }

    withdrawal.status = 'approved';
    await withdrawal.save();

    // Deduct from user balance
    const user = await User.findById(withdrawal.userId);
    user.balance -= withdrawal.amount;
    await user.save();

    res.json(withdrawal);
  } catch (error) {
    console.error('Approve withdrawal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reject withdrawal (admin only)
router.put('/withdraw/:id/reject', adminAuth, async (req, res) => {
  try {
    const withdrawal = await WithdrawalRequest.findById(req.params.id);
    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal request not found' });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ error: 'Withdrawal already processed' });
    }

    withdrawal.status = 'rejected';
    await withdrawal.save();

    res.json(withdrawal);
  } catch (error) {
    console.error('Reject withdrawal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
