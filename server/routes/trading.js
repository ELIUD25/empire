import express from 'express';
import TradingSignal from '../models/TradingSignal.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all trading signals
router.get('/signals', auth, async (req, res) => {
  try {
    const signals = await TradingSignal.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(signals);
  } catch (error) {
    console.error('Get trading signals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create trading signal (admin only)
router.post('/signals', adminAuth, async (req, res) => {
  try {
    const signal = new TradingSignal(req.body);
    await signal.save();
    res.status(201).json(signal);
  } catch (error) {
    console.error('Create trading signal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update trading signal (admin only)
router.put('/signals/:id', adminAuth, async (req, res) => {
  try {
    const signal = await TradingSignal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!signal) {
      return res.status(404).json({ error: 'Trading signal not found' });
    }
    res.json(signal);
  } catch (error) {
    console.error('Update trading signal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete trading signal (admin only)
router.delete('/signals/:id', adminAuth, async (req, res) => {
  try {
    const signal = await TradingSignal.findByIdAndDelete(req.params.id);
    if (!signal) {
      return res.status(404).json({ error: 'Trading signal not found' });
    }
    res.json({ message: 'Trading signal deleted successfully' });
  } catch (error) {
    console.error('Delete trading signal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;