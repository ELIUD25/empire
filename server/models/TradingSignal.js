import mongoose from 'mongoose';

const tradingSignalSchema = new mongoose.Schema({
  pair: {
    type: String,
    required: true
  },
  signalType: {
    type: String,
    enum: ['BUY', 'SELL'],
    required: true
  },
  entryPrice: {
    type: Number,
    required: true
  },
  tp1: {
    type: Number,
    required: true
  },
  tp2: {
    type: Number,
    required: true
  },
  stopLoss: {
    type: Number,
    required: true
  },
  pips: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'hit_tp1', 'hit_tp2', 'stopped'],
    default: 'active'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('TradingSignal', tradingSignalSchema);