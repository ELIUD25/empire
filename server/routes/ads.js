import express from 'express';
import Advertisement from '../models/Advertisement.js';
import User from '../models/User.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all advertisements
router.get('/', auth, async (req, res) => {
  try {
    const ads = await Advertisement.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    console.error('Get advertisements error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Watch advertisement
router.post('/:id/watch', auth, async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }

    if (ad.currentViews >= ad.maxViews) {
      return res.status(400).json({ error: 'Advertisement has reached maximum views' });
    }

    // Update ad views
    ad.currentViews += 1;
    await ad.save();

    // Update user balance
    const user = await User.findById(req.user._id);
    user.balance += ad.reward;
    user.totalEarnings += ad.reward;
    await user.save();

    res.json({ 
      message: 'Advertisement watched successfully',
      reward: ad.reward,
      newBalance: user.balance
    });
  } catch (error) {
    console.error('Watch advertisement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create advertisement (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const ad = new Advertisement(req.body);
    await ad.save();
    res.status(201).json(ad);
  } catch (error) {
    console.error('Create advertisement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;