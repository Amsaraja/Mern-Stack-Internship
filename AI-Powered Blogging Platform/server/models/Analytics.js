import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Event tracking
  event: { 
    type: String, 
    enum: ['view', 'like', 'share', 'comment', 'click'], 
    required: true 
  },
  
  // User data
  ipAddress: String,
  userAgent: String,
  referrer: String,
  country: String,
  device: String,
  
  // Engagement metrics
  timeSpent: Number, // in seconds
  scrollDepth: Number, // percentage
  
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true
});

analyticsSchema.index({ blog: 1, timestamp: -1 });
analyticsSchema.index({ event: 1, timestamp: -1 });

export default mongoose.model("Analytics", analyticsSchema);