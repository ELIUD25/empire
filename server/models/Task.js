import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['survey', 'task', 'bidding', 'transcription'],
    required: true
  },
  reward: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  maxResponses: {
    type: Number,
    default: null
  },
  currentResponses: {
    type: Number,
    default: 0
  },
  maxBidders: {
    type: Number,
    default: null
  },
  currentBidders: {
    type: Number,
    default: 0
  },
  deadline: {
    type: String,
    default: null
  },
  canRedo: {
    type: Boolean,
    default: false
  },
  questions: [{
    type: {
      type: String,
      enum: ['multiple', 'text']
    },
    question: String,
    options: [String]
  }],
  instructions: {
    type: String,
    default: null
  },
  attachments: [String],
  audioUrl: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Task', taskSchema);