import express from 'express';
import User from '../models/User.js';
import { auth, adminAuth } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get all users (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Ban user (admin only)
router.put('/:id/ban', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isBanned = true;
    user.banReason = req.body.reason || 'No reason provided';
    await user.save();

    res.json({ ...user.toObject(), password: undefined });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Unban user (admin only)
router.put('/:id/unban', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isBanned = false;
    user.banReason = null;
    await user.save();

    res.json({ ...user.toObject(), password: undefined });
  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Activate user account
router.put('/activate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isBanned) {
      return res.status(403).json({ error: 'Account is banned' });
    }

    if (user.isActivated) {
      return res.status(400).json({ error: 'Account already activated' });
    }

    if (user.balance < 500) {
      return res
        .status(400)
        .json({ error: 'Insufficient balance for activation' });
    }

    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      user.balance -= 500;
      user.isActivated = true;
      user.activatedAt = new Date();
      await user.save({ session });

      // Process referral bonuses
      if (user.referredBy) {
        await processReferralBonuses(user.referredBy, user._id, session);
      }

      await session.commitTransaction();

      res.json({
        message: 'Account activated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActivated: user.isActivated,
          isBanned: user.isBanned,
          balance: user.balance,
          referralCode: user.referralCode,
          referrals: user.referrals,
          totalEarnings: user.totalEarnings,
          referredBy: user.referredBy,
          referralLink: user.referralLink,
          activatedAt: user.activatedAt,
          registeredAt: user.createdAt,
        },
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Process referral bonuses
async function processReferralBonuses(referralCode, newUserId, session) {
  try {
    const level1Referrer = await User.findOne({ referralCode }).session(session);
    if (level1Referrer) {
      level1Referrer.balance += 200;
      level1Referrer.referrals += 1;
      level1Referrer.totalEarnings += 200;
      await level1Referrer.save({ session });

      if (level1Referrer.referredBy) {
        const level2Referrer = await User.findOne({
          referralCode: level1Referrer.referredBy,
        }).session(session);
        if (level2Referrer) {
          level2Referrer.balance += 150;
          level2Referrer.totalEarnings += 150;
          await level2Referrer.save({ session });

          if (level2Referrer.referredBy) {
            const level3Referrer = await User.findOne({
              referralCode: level2Referrer.referredBy,
            }).session(session);
            if (level3Referrer) {
              level3Referrer.balance += 50;
              level3Referrer.totalEarnings += 50;
              await level3Referrer.save({ session });
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Process referral bonuses error:', error);
    throw error;
  }
}

export default router;