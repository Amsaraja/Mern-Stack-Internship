import express from "express";
import { auth, adminAuth } from "../middleware/auth.js";
import analyticsService from "../services/analyticsService.js";
import Analytics from "../models/Analytics.js";
import Blog from "../models/Blog.js";
import User from "../models/User.js";

const r = express.Router();

// Get blog analytics
r.get("/blog/:blogId", auth, async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    const blog = await Blog.findById(req.params.blogId);
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    if (blog.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const analytics = await analyticsService.getBlogAnalytics(req.params.blogId, timeRange);
    res.json(analytics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user analytics dashboard
r.get("/dashboard", auth, async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    const analytics = await analyticsService.getUserAnalytics(req.user._id, timeRange);
    res.json(analytics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get popular blogs
r.get("/popular", async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Track custom event
r.post("/track", async (req, res) => {
  try {
    const { blogId, event, metadata } = req.body;
    await analyticsService.trackEvent(blogId, req.user?._id, event, metadata);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default r;