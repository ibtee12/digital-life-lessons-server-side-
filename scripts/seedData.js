import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/digital_life_lessons";

const SAMPLE_LESSONS = [
  {
    title: "The Subtle Art of Protecting Your Deep Work Hours",
    description: "How learning to say no transformed my creative output and reduced burnout in early engineering leadership.",
    content: "When I first stepped into engineering leadership, I believed that being available meant being effective. My calendar was fragmented into 30-minute meetings, Slack pings dictated my focus, and my actual deep thinking happened late at night when exhaustion was setting in. It took a severe period of burnout to realize that responsiveness is not productivity. In this reflection, I share the asynchronous communication framework and time-blocking boundaries that restored my focus.",
    category: "Career",
    emotionalTone: "Realization",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
    accessLevel: "Free",
    visibility: "Public",
    isFeatured: true,
    isReviewed: true,
    createdAt: new Date("2026-08-01").toISOString(),
    updatedAt: new Date("2026-08-01").toISOString(),
    creatorId: "marcus-vance",
    creatorName: "Marcus Vance",
    creatorPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    likes: ["user-1", "user-2"],
    likesCount: 142,
    favoritesCount: 68,
    viewsCount: 1240,
    comments: [
      {
        id: "c1",
        userId: "david-k",
        userName: "David Kim",
        userPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
        text: "This completely resonates. Setting morning deep work blocks was a game-changer for my team as well.",
        createdAt: new Date("2026-08-02").toISOString()
      }
    ]
  },
  {
    title: "Embracing Stillness: What Silence Taught Me About Grief",
    description: "A deeply personal journey through loss, learning to sit with uncomfortable emotions without rushing to fix them.",
    content: "We live in a culture that treats sadness as an acute problem needing immediate resolution. When I lost someone dear, my instinct was to drown the silence with work, audiobooks, and constant activity. But grief doesn't dissipate through distraction; it only hides. Sitting in stillness each morning for twenty minutes taught me that grief is simply love with nowhere left to go.",
    category: "Personal Growth",
    emotionalTone: "Sad",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80",
    accessLevel: "Free",
    visibility: "Public",
    isFeatured: true,
    isReviewed: true,
    createdAt: new Date("2026-08-05").toISOString(),
    updatedAt: new Date("2026-08-05").toISOString(),
    creatorId: "elena-rostova",
    creatorName: "Elena Rostova",
    creatorPhoto: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    likes: ["user-3", "user-4", "user-5"],
    likesCount: 289,
    favoritesCount: 145,
    viewsCount: 2310,
    comments: []
  },
  {
    title: "The $100k Mistake: Why We Over-Engineered Our First MVP",
    description: "A cautionary retrospective on premature scaling, complex architectures, and ignoring early customer feedback.",
    content: "In 2024, our founding engineering team spent six months building microservices, Kubernetes clusters, and multi-region replication before onboarding our first ten paying customers. When we finally launched, we discovered that customers only cared about a simple export button that took two hours to code. Here are the 4 mental models we now use before writing a single line of architecture.",
    category: "Mistakes Learned",
    emotionalTone: "Motivational",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    accessLevel: "Premium",
    visibility: "Public",
    isFeatured: true,
    isReviewed: true,
    createdAt: new Date("2026-08-08").toISOString(),
    updatedAt: new Date("2026-08-08").toISOString(),
    creatorId: "alex-chen",
    creatorName: "Alex Chen",
    creatorPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    likes: ["user-1"],
    likesCount: 310,
    favoritesCount: 198,
    viewsCount: 3100,
    comments: []
  },
  {
    title: "Gratitude as an Antidote to Social Media Comparison",
    description: "Daily journaling rituals that shifted my baseline from inadequacy to deep appreciation for everyday moments.",
    content: "It is deceptively easy to measure your internal struggles against someone else's curated highlight reel. Whenever I caught myself feeling left behind, I started listing three mundane things I took for granted: hot water, quiet mornings, and honest conversations. Over 90 days, my brain rewired from scarcity to abundance.",
    category: "Mindset",
    emotionalTone: "Gratitude",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80",
    accessLevel: "Free",
    visibility: "Public",
    isFeatured: false,
    isReviewed: true,
    createdAt: new Date("2026-08-10").toISOString(),
    updatedAt: new Date("2026-08-10").toISOString(),
    creatorId: "priya-patel",
    creatorName: "Priya Patel",
    creatorPhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    likes: [],
    likesCount: 88,
    favoritesCount: 42,
    viewsCount: 650,
    comments: []
  }
];

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("digital_life_lessons");
    const lessonsCollection = db.collection("lessons");

    const existingCount = await lessonsCollection.countDocuments();
    if (existingCount === 0) {
      await lessonsCollection.insertMany(SAMPLE_LESSONS);
      console.log(`✅ Successfully seeded ${SAMPLE_LESSONS.length} life lessons into MongoDB Atlas.`);
    } else {
      console.log(`ℹ️ Lessons collection already contains ${existingCount} documents. Skipping seed.`);
    }
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
  } finally {
    await client.close();
  }
}

seed();
