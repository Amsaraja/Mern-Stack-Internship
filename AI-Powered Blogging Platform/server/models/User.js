
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
 name: { type: String, required: true },
 email: { type: String, required: true, unique: true },
 password: { type: String, required: true },
 avatar: String,
 bio: { type: String, maxLength: 500 },
 website: String,
 socialLinks: {
   twitter: String,
   linkedin: String,
   github: String
 },
 
 role: { type: String, enum: ['user', 'admin', 'editor'], default: 'user' },
 
 // Subscription & Monetization
 subscription: {
   plan: { type: String, enum: ['free', 'pro', 'premium'], default: 'free' },
   status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
   stripeCustomerId: String,
   subscriptionId: String,
   currentPeriodEnd: Date,
   cancelAtPeriodEnd: { type: Boolean, default: false }
 },
 
 // Analytics & Preferences
 preferences: {
   emailNotifications: { type: Boolean, default: true },
   theme: { type: String, enum: ['light', 'dark'], default: 'light' },
   language: { type: String, default: 'en' }
 },
 
 // AI Usage Tracking
 aiUsage: {
   monthlyRequests: { type: Number, default: 0 },
   lastResetDate: { type: Date, default: Date.now },
   totalRequests: { type: Number, default: 0 }
 },
 
 // Security
 emailVerified: { type: Boolean, default: false },
 emailVerificationToken: String,
 passwordResetToken: String,
 passwordResetExpires: Date,
 lastLogin: Date,
 
 // Stats
 totalBlogs: { type: Number, default: 0 },
 totalViews: { type: Number, default: 0 },
 followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
 following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
 timestamps: true
});

userSchema.index({ email: 1 });
userSchema.index({ 'subscription.plan': 1 });

export default mongoose.model("User", userSchema);
