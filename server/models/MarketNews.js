import mongoose from 'mongoose';

const marketNewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    impact: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
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

export default mongoose.model('MarketNews', marketNewsSchema);
