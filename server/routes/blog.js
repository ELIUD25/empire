import express from 'express';
import BlogPost from '../models/BlogPost.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all blog posts
router.get('/posts', auth, async (req, res) => {
  try {
    const posts = await BlogPost.find({ status: 'published' }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's blog posts
router.get('/my-posts', auth, async (req, res) => {
  try {
    const posts = await BlogPost.find({ authorId: req.user._id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Get user blog posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create blog post
router.post('/posts', auth, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    
    const post = new BlogPost({
      title,
      content,
      category,
      author: req.user.name,
      authorId: req.user._id
    });
    
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve blog post (admin only)
router.put('/posts/:id/approve', adminAuth, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { status: 'published' },
      { new: true }
    );
    
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Approve blog post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reject blog post (admin only)
router.put('/posts/:id/reject', adminAuth, async (req, res) => {
  try {
    const { feedback } = req.body;
    
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', feedback },
      { new: true }
    );
    
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Reject blog post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;