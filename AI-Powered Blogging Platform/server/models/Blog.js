
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
 user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
 title: { type: String, required: true, maxLength: 200 },
 slug: { type: String, unique: true, required: true },
 content: { type: String, required: true },
 excerpt: { type: String, maxLength: 300 },
 featuredImage: String,
 tags: [String],
 category: String,
 status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
 
 // SEO fields
 seoTitle: { type: String, maxLength: 60 },
 seoDescription: { type: String, maxLength: 160 },
 seoKeywords: [String],
 canonicalUrl: String,
 
 // Analytics
 views: { type: Number, default: 0 },
 likes: { type: Number, default: 0 },
 shares: { type: Number, default: 0 },
 readTime: Number, // in minutes
 
 // AI features
 aiSuggestions: [{
   type: { type: String, enum: ['title', 'content', 'seo', 'tags'] },
   suggestion: String,
   confidence: Number,
   applied: { type: Boolean, default: false }
 }],
 
 // Monetization
 isPremium: { type: Boolean, default: false },
 
 // Timestamps
 publishedAt: Date,
 lastModified: { type: Date, default: Date.now },
 createdAt: { type: Date, default: Date.now }
}, {
 timestamps: true
});

blogSchema.index({ title: 'text', content: 'text', tags: 'text' });
blogSchema.index({ user: 1, createdAt: -1 });
blogSchema.index({ status: 1, publishedAt: -1 });

export default mongoose.model("Blog", blogSchema);
