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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// MongoDB Client Setup
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/digital_life_lessons";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db, usersCollection, lessonsCollection, reportsCollection, favoritesCollection, commentsCollection;

async function run() {
  try {
    await client.connect();
    db = client.db("digital_life_lessons");

    usersCollection = db.collection("users");
    lessonsCollection = db.collection("lessons");
    reportsCollection = db.collection("lessonsReports");
    favoritesCollection = db.collection("favorites");
    commentsCollection = db.collection("comments");

    console.log("Connected successfully to MongoDB Atlas database: digital_life_lessons");

    // Mount Routers
    app.use('/api/auth', createAuthRouter(usersCollection));
    app.use('/api/lessons', createLessonRouter(lessonsCollection));
    app.use('/api/lessons', createInteractionRouter(lessonsCollection, favoritesCollection, commentsCollection, reportsCollection));
    app.use('/api/admin', createAdminRouter(usersCollection, lessonsCollection, reportsCollection));
    app.use('/api', createPaymentRouter(usersCollection));

  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}
run().catch(console.dir);

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Digital Life Lessons API Server is running smoothly.',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
