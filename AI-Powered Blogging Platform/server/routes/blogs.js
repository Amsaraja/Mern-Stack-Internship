
import express from "express";
import Blog from "../models/Blog.js";
import { auth } from "../middleware/auth.js";
import checkAIUsage from "../middleware/checkAIUsage.js";
import aiService from "../services/aiService.js";
import analyticsService from "../services/analyticsService.js";
import User from "../models/User.js";

const r = express.Router();

// Create blog
r.post("/", auth, async (req, res) => {
  try {
    const { title, content, tags, category, status, isPremium } = req.body;
    
    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Calculate read time
    const readTime = aiService.calculateReadTime(content);
    
    const blog = await Blog.create({
      user: req.user._id,
      title,
      slug: `${slug}-${Date.now()}`,
      content,
      tags: tags || [],
      category,
      status: status || 'draft',
      isPremium: isPremium || false,
      readTime,
      publishedAt: status === 'published' ? new Date() : null
    });
    
    // Update user stats
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalBlogs: 1 } });
    
    res.json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all blogs with filters
r.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tags, search, status = 'published' } = req.query;
    
    let query = { status };
    
    if (category) query.category = category;
    if (tags) query.tags = { $in: tags.split(',') };
    if (search) {
      query.$text = { $search: search };
    }
    
    const blogs = await Blog.find(query)
      .populate('user', 'name avatar')
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-aiSuggestions');
    
    const total = await Blog.countDocuments(query);
    
    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Test AI Connection
r.get("/ai-status", auth, async (req, res) => {
  try {
    const status = await aiService.testConnection();
    res.json({
      available: status.success,
      error: status.error,
      model: status.model,
      message: status.success ? 'OpenAI API is working' : 'Using fallback mode'
    });
  } catch (error) {
    res.json({
      available: false,
      error: error.message,
      message: 'AI service error'
    });
  }
});

// Get single blog
r.get("/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate('user', 'name avatar bio website socialLinks');
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    // Track view
    await analyticsService.trackEvent(blog._id, req.user?._id, 'view', {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update blog
r.put("/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    if (blog.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const updates = { ...req.body, lastModified: new Date() };
    
    if (updates.content) {
      updates.readTime = aiService.calculateReadTime(updates.content);
    }
    
    if (updates.status === 'published' && blog.status !== 'published') {
      updates.publishedAt = new Date();
    }
    
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updatedBlog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete blog
r.delete("/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    if (blog.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await Blog.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalBlogs: -1 } });
    
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// AI Content Suggestions
r.post("/:id/ai-suggestions", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog || blog.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    const result = await aiService.generateContentSuggestions(blog.title, blog.content);
    
    res.json({
      suggestions: result.suggestions,
      source: result.source,
      message: result.message
    });
  } catch (error) {
    console.error('AI Suggestions Error:', error);
    res.json({
      suggestions: aiService.getFallbackSuggestions('Blog Post', ''),
      source: 'fallback',
      message: 'Error occurred, using basic suggestions'
    });
  }
});

// SEO Optimization
r.post("/:id/seo-optimize", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog || blog.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    const seoData = await aiService.optimizeSEO(blog.title, blog.content);
    
    // Update blog with SEO data
    await Blog.findByIdAndUpdate(req.params.id, {
      seoTitle: seoData.seoTitle,
      seoDescription: seoData.metaDescription,
      seoKeywords: seoData.keywords
    });
    
    res.json(seoData);
  } catch (error) {
    console.error('SEO Optimization Error:', error);
    res.status(500).json({ error: 'SEO optimization failed' });
  }
});

// Generate Tags
r.post("/:id/generate-tags", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog || blog.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    const tags = await aiService.generateTags(blog.title, blog.content);
    
    // Update blog with generated tags
    await Blog.findByIdAndUpdate(req.params.id, { tags });
    
    res.json({ tags, message: 'Tags generated successfully' });
  } catch (error) {
    console.error('Tag Generation Error:', error);
    res.status(500).json({ error: 'Tag generation failed' });
  }
});

// Get user's blogs
r.get("/user/:userId", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const blogs = await Blog.find({ 
      user: req.params.userId, 
      status: 'published' 
    })
      .populate('user', 'name avatar')
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    res.json(blogs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Like/Unlike blog
r.post("/:id/like", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    await analyticsService.trackEvent(blog._id, req.user._id, 'like');
    
    res.json({ message: 'Blog liked' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default r;
