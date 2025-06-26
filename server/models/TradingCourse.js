import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['video', 'text', 'exam'],
    required: true,
  },
  content: {
    type: String,
    default: null,
  },
  videoUrl: {
    type: String,
    default: null,
  },
  examQuestions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number,
    },
  ],
  order: {
    type: Number,
    required: true,
  },
});

const tradingCourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    lessons: [lessonSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('TradingCourse', tradingCourseSchema);
