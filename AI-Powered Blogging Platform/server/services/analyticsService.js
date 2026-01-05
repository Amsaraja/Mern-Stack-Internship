import Analytics from '../models/Analytics.js';
import Blog from '../models/Blog.js';

class AnalyticsService {
  async trackEvent(blogId, userId, event, metadata = {}) {
    try {
      await Analytics.create({
        blog: blogId,
        user: userId,
        event,
        ...metadata,
        timestamp: new Date()
      });

      // Update blog stats
      if (event === 'view') {
        await Blog.findByIdAndUpdate(blogId, { $inc: { views: 1 } });
      } else if (event === 'like') {
        await Blog.findByIdAndUpdate(blogId, { $inc: { likes: 1 } });
      } else if (event === 'share') {
        await Blog.findByIdAndUpdate(blogId, { $inc: { shares: 1 } });
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  async getBlogAnalytics(blogId, timeRange = '30d') {
    const startDate = this.getStartDate(timeRange);
    
    const analytics = await Analytics.aggregate([
      {
        $match: {
          blog: blogId,
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$event',
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: '$user' }
        }
      }
    ]);

    const dailyViews = await Analytics.aggregate([
      {
        $match: {
          blog: blogId,
          event: 'view',
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          views: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return { analytics, dailyViews };
  }

  async getUserAnalytics(userId, timeRange = '30d') {
    const startDate = this.getStartDate(timeRange);
    
    const userBlogs = await Blog.find({ user: userId });
    const blogIds = userBlogs.map(blog => blog._id);

    const totalViews = await Analytics.countDocuments({
      blog: { $in: blogIds },
      event: 'view',
      timestamp: { $gte: startDate }
    });

    const topBlogs = await Analytics.aggregate([
      {
        $match: {
          blog: { $in: blogIds },
          event: 'view',
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$blog',
          views: { $sum: 1 }
        }
      },
      { $sort: { views: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'blogs',
          localField: '_id',
          foreignField: '_id',
          as: 'blog'
        }
      }
    ]);

    return { totalViews, topBlogs, totalBlogs: userBlogs.length };
  }

  getStartDate(timeRange) {
    const now = new Date();
    switch (timeRange) {
      case '7d': return new Date(now.setDate(now.getDate() - 7));
      case '30d': return new Date(now.setDate(now.getDate() - 30));
      case '90d': return new Date(now.setDate(now.getDate() - 90));
      case '1y': return new Date(now.setFullYear(now.getFullYear() - 1));
      default: return new Date(now.setDate(now.getDate() - 30));
    }
  }
}

export default new AnalyticsService();