import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { createAuthRouter } from './routes/authRoutes.js';
import { createLessonRouter } from './routes/lessonRoutes.js';
import { createInteractionRouter } from './routes/interactionRoutes.js';
import { createAdminRouter } from './routes/adminRoutes.js';
import { createPaymentRouter } from './routes/paymentRoutes.js';
import { createAnalyticsRouter } from './routes/analyticsRoutes.js';
import { createCreatorRouter } from './routes/creatorRoutes.js';
import { createHealthRouter } from './routes/healthRoutes.js';
import { rateLimiter, authRateLimiter } from './middleware/rateLimiter.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.includes('localhost') || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 200 }));

// MongoDB Client Setup
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function startServer() {
  try {
    await client.connect();
    const db = client.db("digital_life_lessons");

    const usersCollection = db.collection("users");
    const lessonsCollection = db.collection("lessons");
    const reportsCollection = db.collection("lessonsReports");
    const favoritesCollection = db.collection("favorites");
    const commentsCollection = db.collection("comments");

    console.log("✅ Connected successfully to MongoDB Atlas database: digital_life_lessons");

    // Root Health Check Route
    app.get('/', (req, res) => {
      res.json({
        status: 'OK',
        message: 'Digital Life Lessons API Server is running smoothly with MongoDB Atlas.',
        timestamp: new Date().toISOString()
      });
    });

    // Mount API Routers
    app.use('/api/auth', authRateLimiter, createAuthRouter(usersCollection));
    app.use('/api/lessons', createLessonRouter(lessonsCollection));
    app.use('/api/lessons', createInteractionRouter(lessonsCollection, favoritesCollection, commentsCollection, reportsCollection));
    app.use('/api/admin', createAdminRouter(usersCollection, lessonsCollection, reportsCollection));
    app.use('/api/analytics', createAnalyticsRouter(lessonsCollection, usersCollection));
    app.use('/api/creators', createCreatorRouter(lessonsCollection, usersCollection));
    app.use('/api/health', createHealthRouter(db));
    app.use('/api', createPaymentRouter(usersCollection));

    // Centralized 404 and Global Error Middlewares
    app.use(notFoundHandler);
    app.use(globalErrorHandler);

    app.listen(PORT, () => {
      console.log(`🚀 Digital Life Lessons Backend listening on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
}

startServer();
