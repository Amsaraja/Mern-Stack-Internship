
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import blogRoutes from "./routes/blogs.js";
import payRoutes from "./routes/pay.js";
import analyticsRoutes from "./routes/analytics.js";
import commentRoutes from "./routes/comments.js";

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// AI-specific rate limiting
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 AI requests per hour
  message: 'AI request limit exceeded, please try again later.'
});
app.use('/api/blogs/*/ai-', aiLimiter);
app.use('/api/blogs/*/seo-', aiLimiter);
app.use('/api/blogs/*/generate-', aiLimiter);

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  dbName: "ai_blog_platform"
}).then(() => {
  console.log("✅ Database Connected");
}).catch(err => {
  console.error("❌ Database Connection Error:", err);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/comments", commentRoutes);

// Stripe webhook needs raw body, so it comes before express.json()
app.use("/api/pay/webhook", express.raw({ type: 'application/json' }));
app.use("/api/pay", payRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
