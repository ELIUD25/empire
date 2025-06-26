import express from 'express';
import TradingSignal from '../models/TradingSignal.js';
import TradingCourse from '../models/TradingCourse.js';
import MarketNews from '../models/MarketNews.js';
import MarketAnalysis from '../models/MarketAnalysis.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all trading signals
router.get('/signals', auth, async (req, res) => {
  try {
    const signals = await TradingSignal.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.json(signals);
  } catch (error) {
    console.error('Get trading signals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all trading courses
router.get('/courses', auth, async (req, res) => {
  try {
    const courses = await TradingCourse.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.json(courses);
  } catch (error) {
    console.error('Get trading courses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get market news
router.get('/news', auth, async (req, res) => {
  try {
    const news = await MarketNews.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.json(news);
  } catch (error) {
    console.error('Get market news error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get market analysis
router.get('/analysis', auth, async (req, res) => {
  try {
    const analysis = await MarketAnalysis.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.json(analysis);
  } catch (error) {
    console.error('Get market analysis error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin routes for trading signals
router.post('/signals', adminAuth, async (req, res) => {
  try {
    const signal = new TradingSignal(req.body);
    await signal.save();
    res.status(201).json(signal);
  } catch (error) {
    console.error('Create trading signal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/signals/:id', adminAuth, async (req, res) => {
  try {
    const signal = await TradingSignal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!signal) {
      return res.status(404).json({ error: 'Trading signal not found' });
    }
    res.json(signal);
  } catch (error) {
    console.error('Update trading signal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/signals/:id', adminAuth, async (req, res) => {
  try {
    const signal = await TradingSignal.findByIdAndDelete(req.params.id);
    if (!signal) {
      return res.status(404).json({ error: 'Trading signal not found' });
    }
    res.json({ message: 'Trading signal deleted successfully' });
  } catch (error) {
    console.error('Delete trading signal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin routes for trading courses
router.post('/courses', adminAuth, async (req, res) => {
  try {
    const course = new TradingCourse(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    console.error('Create trading course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/courses/:id', adminAuth, async (req, res) => {
  try {
    const course = await TradingCourse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ error: 'Trading course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Update trading course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/courses/:id', adminAuth, async (req, res) => {
  try {
    const course = await TradingCourse.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Trading course not found' });
    }
    res.json({ message: 'Trading course deleted successfully' });
  } catch (error) {
    console.error('Delete trading course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin routes for market news
router.post('/news', adminAuth, async (req, res) => {
  try {
    const news = new MarketNews(req.body);
    await news.save();
    res.status(201).json(news);
  } catch (error) {
    console.error('Create market news error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/news/:id', adminAuth, async (req, res) => {
  try {
    const news = await MarketNews.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!news) {
      return res.status(404).json({ error: 'Market news not found' });
    }
    res.json(news);
  } catch (error) {
    console.error('Update market news error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/news/:id', adminAuth, async (req, res) => {
  try {
    const news = await MarketNews.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ error: 'Market news not found' });
    }
    res.json({ message: 'Market news deleted successfully' });
  } catch (error) {
    console.error('Delete market news error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin routes for market analysis
router.post('/analysis', adminAuth, async (req, res) => {
  try {
    const analysis = new MarketAnalysis(req.body);
    await analysis.save();
    res.status(201).json(analysis);
  } catch (error) {
    console.error('Create market analysis error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/analysis/:id', adminAuth, async (req, res) => {
  try {
    const analysis = await MarketAnalysis.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!analysis) {
      return res.status(404).json({ error: 'Market analysis not found' });
    }
    res.json(analysis);
  } catch (error) {
    console.error('Update market analysis error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/analysis/:id', adminAuth, async (req, res) => {
  try {
    const analysis = await MarketAnalysis.findByIdAndDelete(req.params.id);
    if (!analysis) {
      return res.status(404).json({ error: 'Market analysis not found' });
    }
    res.json({ message: 'Market analysis deleted successfully' });
  } catch (error) {
    console.error('Delete market analysis error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
