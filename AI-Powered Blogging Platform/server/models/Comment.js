import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxLength: 1000 },
  
  // Nested comments
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  
  // Moderation
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  
  // Engagement
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Metadata
  isEdited: { type: Boolean, default: false },
  editedAt: Date
}, {
  timestamps: true
});

commentSchema.index({ blog: 1, createdAt: -1 });
commentSchema.index({ user: 1 });

export default mongoose.model("Comment", commentSchema);