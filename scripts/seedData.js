import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

const SAMPLE_USERS = [
  {
    uid: "admin-1",
    email: "admin@digitallife.com",
    name: "Platform Administrator",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    role: "admin",
    isPremium: true,
    premiumPurchasedAt: new Date("2026-08-01").toISOString(),
    createdAt: new Date("2026-08-01").toISOString(),
    updatedAt: new Date("2026-08-01").toISOString()
  },
  {
    uid: "user-marcus",
    email: "marcus.vance@example.com",
    name: "Marcus Vance",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    role: "user",
    isPremium: true,
    premiumPurchasedAt: new Date("2026-08-05").toISOString(),
    createdAt: new Date("2026-08-05").toISOString(),
    updatedAt: new Date("2026-08-05").toISOString()
  },
  {
    uid: "user-elena",
    email: "elena.rostova@example.com",
    name: "Dr. Elena Rostova",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    role: "user",
    isPremium: false,
    createdAt: new Date("2026-08-08").toISOString(),
    updatedAt: new Date("2026-08-08").toISOString()
  },
  {
    uid: "user-naval",
    email: "naval.k@example.com",
    name: "Naval K.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    role: "user",
    isPremium: true,
    premiumPurchasedAt: new Date("2026-08-02").toISOString(),
    createdAt: new Date("2026-08-02").toISOString(),
    updatedAt: new Date("2026-08-02").toISOString()
  },
  {
    uid: "user-sarah",
    email: "sarah.lin@example.com",
    name: "Sarah Lin",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    role: "user",
    isPremium: false,
    createdAt: new Date("2026-08-10").toISOString(),
    updatedAt: new Date("2026-08-10").toISOString()
  },
  {
    uid: "user-alex",
    email: "alex.chen@example.com",
    name: "Alex Chen",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    role: "user",
    isPremium: true,
    premiumPurchasedAt: new Date("2026-08-06").toISOString(),
    createdAt: new Date("2026-08-06").toISOString(),
    updatedAt: new Date("2026-08-06").toISOString()
  }
];

const SAMPLE_LESSONS = [
  {
    id: "lesson-1",
    title: "The Art of Saying No Without Feeling Guilty",
    description: "Boundaries are not walls to keep people out; they are bridges that define where you end and others begin.",
    content: "Early in my career, I agreed to every request, deadline, and project pushed my way. I believed that saying yes was the only way to demonstrate value and loyalty. But by constantly pleasing others, I was quietly sabotaging my own peace, energy, and work quality.\n\n### 1. Protect Your Core Energy\nYour time is a non-renewable resource. Every time you say yes to something non-essential, you are implicitly saying no to your primary goals, your health, or your loved ones.\n\n### 2. Standard Scripts for Graceful Refusal\n- Thank you for thinking of me! Right now, my focus is fully committed to X, so I won't be able to give this the attention it deserves.\n- I would love to help, but I cannot take on new commitments this month.\n\nRemember: A clear no up front is always kinder than a delayed, resentful yes.",
    category: "Personal Growth",
    emotionalTone: "Empowering",
    accessLevel: "Free",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isReviewed: true,
    createdAt: new Date("2026-08-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-08-01T10:00:00Z").toISOString(),
    creatorId: "user-marcus",
    creatorName: "Marcus Vance",
    creatorPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 8,
    likes: ["admin-1", "user-sarah"],
    likesCount: 142,
    favoritesCount: 89,
    viewsCount: 1250
  },
  {
    id: "lesson-2",
    title: "Mastering Emotional Agility Under High Stress",
    description: "Stress is not what happens to us; it is our emotional reaction to events that we often cannot control.",
    content: "When high-stakes deadlines hit, our primitive threat response triggers panic. Emotional agility is the ability to observe your thoughts and feelings without being hooked by them.\n\n### The 3-Second Cognitive Pause\n1. Notice physical tension\n2. Label the emotion ('I am noticing feelings of overwhelm')\n3. Align action with your ultimate values rather than immediate impulse.",
    category: "Mindset",
    emotionalTone: "Philosophical",
    accessLevel: "Free",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isReviewed: true,
    createdAt: new Date("2026-08-03T11:30:00Z").toISOString(),
    updatedAt: new Date("2026-08-03T11:30:00Z").toISOString(),
    creatorId: "user-elena",
    creatorName: "Dr. Elena Rostova",
    creatorPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 14,
    likes: ["admin-1"],
    likesCount: 238,
    favoritesCount: 110,
    viewsCount: 2400
  },
  {
    id: "lesson-3",
    title: "Compound Habits: The Invisible Math of 1% Daily Improvements",
    description: "Success is the product of daily habits—not once-in-a-lifetime transformations.",
    content: "We often convince ourselves that massive success requires massive action. Whether it is losing weight, building a business, or writing a book, we put pressure on ourselves to make some earth-shattering improvement that everyone will talk about.\n\nMeanwhile, improving by 1 percent isn't particularly notable— sometimes it isn't even noticeable—but it can be far more meaningful in the long run.",
    category: "Productivity",
    emotionalTone: "Motivational",
    accessLevel: "Free",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isReviewed: true,
    createdAt: new Date("2026-08-04T09:00:00Z").toISOString(),
    updatedAt: new Date("2026-08-04T09:00:00Z").toISOString(),
    creatorId: "user-marcus",
    creatorName: "Marcus Vance",
    creatorPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 8,
    likes: [],
    likesCount: 95,
    favoritesCount: 42,
    viewsCount: 890
  },
  {
    id: "lesson-4",
    title: "Executive Wealth Blueprint: Capital Allocation for Creators",
    description: "Deep dive into equity structures, automated investments, and royalty architectures for independent thinkers.",
    content: "Wealth is assets that earn while you sleep. Money is how we transfer time and wealth. Status is your place in the social hierarchy.\n\n### 1. Own Equity\nYou are not going to get rich renting out your time. You must own equity—a piece of a business—to gain your financial freedom.\n\n### 2. Specific Knowledge\nArm yourself with specific knowledge, accountability, and leverage. Specific knowledge is knowledge that you cannot be trained for. If society can train you, it can train someone else, and replace you.",
    category: "Career",
    emotionalTone: "Empowering",
    accessLevel: "Premium",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isReviewed: true,
    createdAt: new Date("2026-08-05T14:15:00Z").toISOString(),
    updatedAt: new Date("2026-08-05T14:15:00Z").toISOString(),
    creatorId: "user-naval",
    creatorName: "Naval K.",
    creatorPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 22,
    likes: ["user-sarah"],
    likesCount: 480,
    favoritesCount: 310,
    viewsCount: 5600
  },
  {
    id: "lesson-5",
    title: "Radical Candor in Remote Leadership Teams",
    description: "Care personally while challenging directly to build unbreakable high-trust engineering cultures.",
    content: "Radical Candor is the sweet spot between leaders who are obnoxiously aggressive and those who are ruinously empathetic.\n\nTo implement Radical Candor:\n1. Solicit feedback before giving it\n2. Give feedback immediately and privately\n3. Praise in public, criticize in private\n4. Make it about the work, never the person.",
    category: "Leadership",
    emotionalTone: "Reflective",
    accessLevel: "Premium",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isReviewed: true,
    createdAt: new Date("2026-08-06T16:45:00Z").toISOString(),
    updatedAt: new Date("2026-08-06T16:45:00Z").toISOString(),
    creatorId: "user-elena",
    creatorName: "Dr. Elena Rostova",
    creatorPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 14,
    likes: [],
    likesCount: 88,
    favoritesCount: 56,
    viewsCount: 1100
  },
  {
    id: "lesson-6",
    title: "The Cost of Sunk-Cost Fallacy: Knowing When to Quit",
    description: "Persisting on a dead-end path is not perseverance; it is self-deception disguised as virtue.",
    content: "Winners quit all the time. They just quit the right stuff at the right time. The sunk-cost fallacy convinces us to keep investing time and money into a failing venture simply because we have already spent so much.\n\n### The Strategic Quit Checklist:\n1. If you had zero time invested today, would you choose to start this?\n2. Is this hurdle temporary resistance or fundamental misalignment?\n3. What higher-leverage opportunity are you ignoring to keep this alive?",
    category: "Mistakes Learned",
    emotionalTone: "Cautious",
    accessLevel: "Free",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isReviewed: true,
    createdAt: new Date("2026-08-07T12:00:00Z").toISOString(),
    updatedAt: new Date("2026-08-07T12:00:00Z").toISOString(),
    creatorId: "user-alex",
    creatorName: "Alex Chen",
    creatorPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 12,
    likes: ["admin-1"],
    likesCount: 195,
    favoritesCount: 140,
    viewsCount: 2900
  },
  {
    id: "lesson-7",
    title: "The Antifragile Mindset: Gaining from Chaos & Uncertainty",
    description: "Some things benefit from shocks; they thrive and grow when exposed to volatility, randomness, and disorder.",
    content: "Fragility breaks under pressure. Resilience merely resists shocks and stays the same. Antifragility gets better.\n\n### Building Antifragility\n1. **Redundancy**: Never depend on a single point of failure in career or income.\n2. **Small Failures Early**: Embrace small, non-fatal mistakes to discover systemic blindspots.\n3. **Asymmetric Payoffs**: Position yourself where downside is capped and upside is limitless.",
    category: "Mindset",
    emotionalTone: "Empowering",
    accessLevel: "Premium",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isReviewed: true,
    createdAt: new Date("2026-08-10T08:30:00Z").toISOString(),
    updatedAt: new Date("2026-08-10T08:30:00Z").toISOString(),
    creatorId: "user-naval",
    creatorName: "Naval K.",
    creatorPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 22,
    likes: ["admin-1", "user-elena"],
    likesCount: 312,
    favoritesCount: 190,
    viewsCount: 3400
  },
  {
    id: "lesson-8",
    title: "The Deep Work Protocol: Protecting 4 Hours of Unbroken Focus",
    description: "The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy.",
    content: "Deep work is the superpower of the 21st century knowledge worker. In an age of notification overload, unbroken concentration yields exponential output.\n\n### The Morning Isolation Rule\n- No Slack, email, or social media for the first 3 hours of the day.\n- Work on your highest-leverage project in a dedicated distraction-free zone.\n- Treat focus like physical training: build stamina from 45 minutes up to 4 hours.",
    category: "Productivity",
    emotionalTone: "Motivational",
    accessLevel: "Free",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1507842229452-772d1c9f8021?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isReviewed: true,
    createdAt: new Date("2026-08-12T15:00:00Z").toISOString(),
    updatedAt: new Date("2026-08-12T15:00:00Z").toISOString(),
    creatorId: "user-sarah",
    creatorName: "Sarah Lin",
    creatorPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 19,
    likes: ["user-marcus"],
    likesCount: 245,
    favoritesCount: 165,
    viewsCount: 2750
  },
  {
    id: "lesson-9",
    title: "The Power of Asymmetric Opportunities: Never Risk Ruin for Ego",
    description: "Seek bets where downside is minimal and upside is extraordinary. Avoid vanity games.",
    content: "Most people spend their lives chasing linear rewards with catastrophic hidden downside (high debt, status games, reputation risk).\n\nTrue masters play positive-sum games with asymmetric upside: writing books, publishing open code, investing early in friends, and building compounding relationships.",
    category: "Career",
    emotionalTone: "Philosophical",
    accessLevel: "Free",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isReviewed: true,
    createdAt: new Date("2026-08-15T11:20:00Z").toISOString(),
    updatedAt: new Date("2026-08-15T11:20:00Z").toISOString(),
    creatorId: "user-alex",
    creatorName: "Alex Chen",
    creatorPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 12,
    likes: [],
    likesCount: 168,
    favoritesCount: 94,
    viewsCount: 1980
  },
  {
    id: "lesson-10",
    title: "The Art of Active Listening: Silence as a Leadership Superpower",
    description: "Most people do not listen with the intent to understand; they listen with the intent to reply.",
    content: "The best leaders spend 80% of meetings asking thoughtful questions and pausing. Silence invites the team to solve hard problems without fear.\n\n### Three Listening Filters:\n1. What is the emotional subtext beneath their words?\n2. What assumption are they taking for granted?\n3. How can I empower them to own the outcome?",
    category: "Leadership",
    emotionalTone: "Reflective",
    accessLevel: "Free",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isReviewed: true,
    createdAt: new Date("2026-08-18T09:45:00Z").toISOString(),
    updatedAt: new Date("2026-08-18T09:45:00Z").toISOString(),
    creatorId: "user-elena",
    creatorName: "Dr. Elena Rostova",
    creatorPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 14,
    likes: ["admin-1", "user-sarah"],
    likesCount: 270,
    favoritesCount: 155,
    viewsCount: 3100
  },
  {
    id: "lesson-11",
    title: "Overcoming the Perfectionism Trap: Why Done is Better Than Flawless",
    description: "Perfectionism is not the pursuit of excellence; it is the fear of judgment dressed in high standards.",
    content: "Waiting for perfect conditions is the most sophisticated form of procrastination. Ship imperfect work early, gather real feedback, and iterate relentlessly.\n\nAction creates clarity. Inaction creates doubt and anxiety.",
    category: "Personal Growth",
    emotionalTone: "Empowering",
    accessLevel: "Free",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isReviewed: true,
    createdAt: new Date("2026-08-20T14:00:00Z").toISOString(),
    updatedAt: new Date("2026-08-20T14:00:00Z").toISOString(),
    creatorId: "user-marcus",
    creatorName: "Marcus Vance",
    creatorPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 8,
    likes: [],
    likesCount: 182,
    favoritesCount: 103,
    viewsCount: 2200
  },
  {
    id: "lesson-12",
    title: "Post-Traumatic Growth: Turning Career Failures into Catalysts",
    description: "The obstacle in your path is not in your way; the obstacle IS the path.",
    content: "When a company fails, a partnership breaks, or a major launch collapses, grief is natural. But resilient creators reframe catastrophic setbacks into wisdom.\n\nWhat you learn in the aftermath of defeat is knowledge that cannot be bought in any classroom or textbook.",
    category: "Mistakes Learned",
    emotionalTone: "Motivational",
    accessLevel: "Premium",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isReviewed: true,
    createdAt: new Date("2026-08-24T16:30:00Z").toISOString(),
    updatedAt: new Date("2026-08-24T16:30:00Z").toISOString(),
    creatorId: "user-naval",
    creatorName: "Naval K.",
    creatorPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 22,
    likes: ["admin-1", "user-alex"],
    likesCount: 388,
    favoritesCount: 260,
    viewsCount: 4700
  }
];

async function seed() {
  if (!uri) {
    console.error("MONGODB_URI environment variable is missing in .env");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB Atlas Cluster.");

    const db = client.db('digital_life_lessons');

    // 1. Seed Users Collection
    const usersCol = db.collection('users');
    await usersCol.deleteMany({});
    const userInsertResult = await usersCol.insertMany(SAMPLE_USERS);
    console.log(`Seeded ${userInsertResult.insertedCount} users into 'users' collection.`);

    // 2. Seed Lessons Collection
    const lessonsCol = db.collection('lessons');
    await lessonsCol.deleteMany({});
    const lessonInsertResult = await lessonsCol.insertMany(SAMPLE_LESSONS);
    console.log(`Seeded ${lessonInsertResult.insertedCount} lessons into 'lessons' collection.`);

    // 3. Clear and initialize Reports Collection
    const reportsCol = db.collection('reports');
    await reportsCol.deleteMany({});
    console.log("Initialized clean 'reports' collection.");

    console.log("\nDatabase Seeding Completed Successfully! All 12 lessons with bespoke life lesson images are live.");
  } catch (err) {
    console.error("Seeding Error:", err);
  } finally {
    await client.close();
  }
}

seed();
