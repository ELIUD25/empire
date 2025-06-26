import mongoose from 'mongoose';

const bettingTipSchema = new mongoose.Schema(
  {
    match: {
      type: String,
      required: true,
    },
    league: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    prediction: {
      type: String,
      required: true,
    },
    odds: {
      type: String,
      required: true,
    },
    confidence: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      required: true,
    },
    analysis: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('BettingTip', bettingTipSchema);
