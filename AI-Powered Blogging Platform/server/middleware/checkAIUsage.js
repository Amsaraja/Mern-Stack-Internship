import User from '../models/User.js';

const checkAIUsage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if we need to reset monthly usage
    const now = new Date();
    const lastReset = new Date(user.aiUsage.lastResetDate);
    const monthsDiff = (now.getFullYear() - lastReset.getFullYear()) * 12 + 
                      (now.getMonth() - lastReset.getMonth());

    if (monthsDiff >= 1) {
      // Reset monthly usage
      await User.findByIdAndUpdate(userId, {
        'aiUsage.monthlyRequests': 0,
        'aiUsage.lastResetDate': now
      });
      user.aiUsage.monthlyRequests = 0;
    }

    // Define limits based on subscription plan
    const limits = {
      free: parseInt(process.env.FREE_PLAN_AI_LIMIT) || 10,
      pro: parseInt(process.env.PRO_PLAN_AI_LIMIT) || 100,
      premium: parseInt(process.env.PREMIUM_PLAN_AI_LIMIT) || 500
    };

    const userLimit = limits[user.subscription.plan] || limits.free;

    if (user.aiUsage.monthlyRequests >= userLimit) {
      return res.status(429).json({ 
        error: 'AI usage limit exceeded for your plan',
        currentUsage: user.aiUsage.monthlyRequests,
        limit: userLimit,
        plan: user.subscription.plan
      });
    }

    // Increment usage count
    await User.findByIdAndUpdate(userId, {
      $inc: { 
        'aiUsage.monthlyRequests': 1,
        'aiUsage.totalRequests': 1
      }
    });

    req.user.aiUsage = {
      monthlyRequests: user.aiUsage.monthlyRequests + 1,
      limit: userLimit,
      plan: user.subscription.plan
    };

    next();
  } catch (error) {
    console.error('AI usage check error:', error);
    res.status(500).json({ error: 'Failed to check AI usage limits' });
  }
};

export default checkAIUsage;