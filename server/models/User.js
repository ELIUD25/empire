import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    banReason: {
      type: String,
      default: null,
    },
    balance: {
      type: Number,
      default: 0,
    },
    referralCode: {
      type: String,
      unique: true,
      required: true,
    },
    referrals: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    referredBy: {
      type: String,
      default: null,
    },
    referralLink: {
      type: String,
      required: true,
      unique: true,
    },
    activatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique referral code and link
userSchema.pre('save', async function (next) {
  try {
    if (!this.referralCode) { // Handle both new and existing documents
      let isUnique = false;
      let referralCode;
      let attempts = 0;
      const maxAttempts = 10;

      while (!isUnique && attempts < maxAttempts) {
        referralCode = 'EM' + Math.random().toString(36).substr(2, 6).toUpperCase();
        const existingUser = await mongoose.models.User.findOne({ referralCode }).exec();
        if (!existingUser) {
          isUnique = true;
        }
        attempts++;
      }

      if (!isUnique) {
        return next(new Error('Failed to generate unique referral code after multiple attempts'));
      }

      this.referralCode = referralCode;
      this.referralLink = `https://empire-eosin.vercel.app/register?ref=${referralCode}`;
    }

    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 12);
    }

    next();
  } catch (error) {
    console.error('pre(save) middleware error:', error);
    next(error);
  }
});

// Enforce validation on update operations
userSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function (next) {
  this.options.runValidators = true;
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);