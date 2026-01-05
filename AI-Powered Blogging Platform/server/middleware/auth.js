import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

export const adminAuth = async (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin required.' });
    }
    next();
  });
};

export const premiumAuth = async (req, res, next) => {
  auth(req, res, () => {
    if (req.user.subscription.plan === 'free') {
      return res.status(403).json({ error: 'Premium subscription required.' });
    }
    next();
  });
};

export const checkAIUsage = async (req, res, next) => {
  try {
    const user = req.user;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Reset monthly usage if new month
    if (user.aiUsage.lastResetDate < monthStart) {
      user.aiUsage.monthlyRequests = 0;
      user.aiUsage.lastResetDate = now;
      await user.save();
    }

    // Check usage limits
    const limits = {
      free: process.env.FREE_PLAN_AI_LIMIT || 10,
      pro: process.env.PRO_PLAN_AI_LIMIT || 100,
      premium: process.env.PREMIUM_PLAN_AI_LIMIT || 500
    };

    const userLimit = limits[user.subscription.plan];
    if (user.aiUsage.monthlyRequests >= userLimit) {
      return res.status(429).json({ 
        error: 'AI usage limit exceeded for this month.',
        limit: userLimit,
        used: user.aiUsage.monthlyRequests
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Error checking AI usage.' });
  }
};