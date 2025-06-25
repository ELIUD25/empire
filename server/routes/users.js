import express from 'express';
import User from '../models/User.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Activate user account
router.put('/activate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user.balance < 500) {
      return res.status(400).json({ error: 'Insufficient balance for activation' });
    }
    
    user.balance -= 500;
    user.isActivated = true;
    user.activatedAt = new Date();
    await user.save();

    // Process referral bonuses
    if (user.referredBy) {
      await processReferralBonuses(user.referredBy, user._id);
    }

    res.json({
      message: 'Account activated successfully',
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
        referralLink: user.referralLink,
        activatedAt: user.activatedAt,
        registeredAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Process referral bonuses
async function processReferralBonuses(referralCode, newUserId) {
  try {
    // Level 1 referrer
    const level1Referrer = await User.findOne({ referralCode });
    if (level1Referrer) {
      level1Referrer.balance += 200;
      level1Referrer.referrals += 1;
      level1Referrer.totalEarnings += 200;
      await level1Referrer.save();

      // Level 2 referrer
      if (level1Referrer.referredBy) {
        const level2Referrer = await User.findOne({ referralCode: level1Referrer.referredBy });
        if (level2Referrer) {
          level2Referrer.balance += 150;
          level2Referrer.totalEarnings += 150;
          await level2Referrer.save();

          // Level 3 referrer
          if (level2Referrer.referredBy) {
            const level3Referrer = await User.findOne({ referralCode: level2Referrer.referredBy });
            if (level3Referrer) {
              level3Referrer.balance += 50;
              level3Referrer.totalEarnings += 50;
              await level3Referrer.save();
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Process referral bonuses error:', error);
  }
}

export default router;