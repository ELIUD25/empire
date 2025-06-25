import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, referralCode } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Validate referral code if provided (optional)
    let referrer = null;
    if (referralCode && referralCode.trim()) {
      referrer = await User.findOne({ referralCode });
      if (!referrer) {
        return res.status(400).json({ error: 'Invalid referral code' });
      }
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      referredBy: referralCode && referralCode.trim() ? referralCode : null
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActivated: user.isActivated,
        balance: user.balance,
        referralCode: user.referralCode,
        referrals: user.referrals,
        totalEarnings: user.totalEarnings,
        referredBy: user.referredBy,
        activatedAt: user.activatedAt,
        registeredAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActivated: user.isActivated,
        balance: user.balance,
        referralCode: user.referralCode,
        referrals: user.referrals,
        totalEarnings: user.totalEarnings,
        referredBy: user.referredBy,
        activatedAt: user.activatedAt,
        registeredAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isActivated: req.user.isActivated,
        balance: req.user.balance,
        referralCode: req.user.referralCode,
        referrals: req.user.referrals,
        totalEarnings: req.user.totalEarnings,
        referredBy: req.user.referredBy,
        activatedAt: req.user.activatedAt,
        registeredAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check referral code
router.post('/check-referral', async (req, res) => {
  try {
    const { referralCode } = req.body;
    
    if (!referralCode || !referralCode.trim()) {
      return res.json({ valid: true }); // Allow empty referral codes
    }
    
    const user = await User.findOne({ referralCode });
    res.json({ valid: !!user });
  } catch (error) {
    console.error('Check referral error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;