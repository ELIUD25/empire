import express from 'express';
import BettingTip from '../models/BettingTip.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all betting tips
router.get('/tips', auth, async (req, res) => {
  try {
    const tips = await BettingTip.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(tips);
  } catch (error) {
    console.error('Get betting tips error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create betting tip (admin only)
router.post('/tips', adminAuth, async (req, res) => {
  try {
    const tip = new BettingTip(req.body);
    await tip.save();
    res.status(201).json(tip);
  } catch (error) {
    console.error('Create betting tip error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update betting tip (admin only)
router.put('/tips/:id', adminAuth, async (req, res) => {
  try {
    const tip = await BettingTip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tip) {
      return res.status(404).json({ error: 'Betting tip not found' });
    }
    res.json(tip);
  } catch (error) {
    console.error('Update betting tip error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete betting tip (admin only)
router.delete('/tips/:id', adminAuth, async (req, res) => {
  try {
    const tip = await BettingTip.findByIdAndDelete(req.params.id);
    if (!tip) {
      return res.status(404).json({ error: 'Betting tip not found' });
    }
    res.json({ message: 'Betting tip deleted successfully' });
  } catch (error) {
    console.error('Delete betting tip error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;