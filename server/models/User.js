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

// Generate referral code before saving
userSchema.pre('save', async function (next) {
  if (this.isNew && !this.referralCode) {
    this.referralCode =
      'EM' + Math.random().toString(36).substr(2, 6).toUpperCase();
    this.referralLink = `https://empire-eosin.vercel.app/register?ref=${this.referralCode}`;
  }

  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
