import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Connect to database
(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
    process.exit(1);
  }
})();

const app = express();

// CORS configuration for production
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? [
          'https://empire-eosin.vercel.app',
          'https://www.empire-eosin.vercel.app',
        ]
      : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import bettingRoutes from './routes/betting.js';
import tradingRoutes from './routes/trading.js';
import blogRoutes from './routes/blog.js';
import adsRoutes from './routes/ads.js';
import tasksRoutes from './routes/tasks.js';
import financialRoutes from './routes/financial.js';
import uploadRoutes from './routes/upload.js';
import adminRoutes from './routes/admin.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/betting', bettingRoutes);
app.use('/api/trading', tradingRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/ads', adsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Empire Mine API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Empire Mine API Server',
    version: '1.0.0',
    status: 'running',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error:
      process.env.NODE_ENV === 'production'
        ? 'Something went wrong!'
        : err.message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

export default app;
