import express from "express";
import Comment from "../models/Comment.js";
import { auth } from "../middleware/auth.js";

const r = express.Router();

// Get comments for a blog
r.get("/blog/:blogId", async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const comments = await Comment.find({ 
      blog: req.params.blogId, 
      parentComment: null,
      status: 'approved'
    })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Comment.countDocuments({ 
      blog: req.params.blogId, 
      parentComment: null,
      status: 'approved'
    });
    
    res.json({
      comments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create comment
r.post("/", auth, async (req, res) => {
  try {
    const { blogId, content, parentCommentId } = req.body;
    
    const comment = await Comment.create({
      blog: blogId,
      user: req.user._id,
      content,
      parentComment: parentCommentId || null
    });
    
    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'name avatar');
    
    res.json(populatedComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default r;