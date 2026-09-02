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
    emotionalTone: "Realization",
    accessLevel: "Free",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isReviewed: true,
    createdAt: "2026-08-01T10:00:00Z",
    updatedAt: "2026-08-01T10:00:00Z",
    creatorId: "user-marcus",
    creatorName: "Marcus Vance",
    creatorPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 8,
    likes: ["user-current", "user-sarah"],
    likesCount: 142,
    favoritesCount: 89,
    viewsCount: 1250,
    comments: [
      {
        id: "c-1",
        userId: "user-sarah",
        userName: "Sarah Lin",
        userPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        text: "This transformed how I handle client scope creep. The standard scripts are gold!",
        createdAt: "2026-08-02T14:20:00Z"
      }
    ]
  },
  {
    id: "lesson-2",
    title: "Mastering Emotional Agility Under High Stress",
    description: "Stress is not what happens to us; it is our emotional reaction to events that we often cannot control.",
    content: "When high-stakes deadlines hit, our primitive threat response triggers panic. Emotional agility is the ability to observe your thoughts and feelings without being hooked by them.\n\n### The 3-Second Cognitive Pause\n1. Notice physical tension\n2. Label the emotion ('I am noticing feelings of overwhelm')\n3. Align action with your ultimate values rather than immediate impulse.",
    category: "Mindset",
    emotionalTone: "Motivational",
    accessLevel: "Free",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isReviewed: true,
    createdAt: "2026-08-03T11:30:00Z",
    updatedAt: "2026-08-03T11:30:00Z",
    creatorId: "user-elena",
    creatorName: "Dr. Elena Rostova",
    creatorPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 6,
    likes: ["user-naval"],
    likesCount: 98,
    favoritesCount: 64,
    viewsCount: 910,
    comments: []
  },
  {
    id: "lesson-3",
    title: "Compound Habits: The Invisible Math of 1% Daily Improvements",
    description: "Breakthrough moments are often the delayed result of many previous actions that build up the potential for a major change.",
    content: "If you get 1% better each day for one year, you'll end up thirty-seven times better by the time you're done. Habits are the compound interest of self-improvement.",
    category: "Personal Growth",
    emotionalTone: "Motivational",
    accessLevel: "Free",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isReviewed: true,
    createdAt: "2026-08-05T09:15:00Z",
    updatedAt: "2026-08-05T09:15:00Z",
    creatorId: "user-naval",
    creatorName: "Naval K.",
    creatorPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 12,
    likes: ["user-current", "user-marcus", "user-alex"],
    likesCount: 230,
    favoritesCount: 156,
    viewsCount: 2100,
    comments: []
  },
  {
    id: "lesson-4",
    title: "Executive Wealth Blueprint: Capital Allocation for Creators",
    description: "Earning money is a craftsman's skill. Retaining and multiplying capital without sacrificing peace of mind is an art.",
    content: "Most high earners fail not from lack of income, but from lack of financial discipline. In this premium breakdown, we explore barbell risk strategies, building asymmetric upside, and tax-efficient cash reserves.",
    category: "Career",
    emotionalTone: "Realization",
    accessLevel: "Premium",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isReviewed: true,
    createdAt: "2026-08-07T16:45:00Z",
    updatedAt: "2026-08-07T16:45:00Z",
    creatorId: "user-naval",
    creatorName: "Naval K.",
    creatorPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 12,
    likes: ["user-current"],
    likesCount: 312,
    favoritesCount: 204,
    viewsCount: 3400,
    comments: []
  },
  {
    id: "lesson-5",
    title: "Radical Candor in Remote Leadership Teams",
    description: "Care personally while challenging directly. How to give constructive, high-velocity feedback without destroying morale.",
    content: "Polite silence is the most expensive operational defect in distributed engineering and product organizations. True empathy demands clarity, honesty, and rapid feedback loops.",
    category: "Career",
    emotionalTone: "Realization",
    accessLevel: "Premium",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isReviewed: true,
    createdAt: "2026-08-09T14:10:00Z",
    updatedAt: "2026-08-09T14:10:00Z",
    creatorId: "user-marcus",
    creatorName: "Marcus Vance",
    creatorPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 8,
    likes: ["user-elena"],
    likesCount: 175,
    favoritesCount: 110,
    viewsCount: 1680,
    comments: []
  },
  {
    id: "lesson-6",
    title: "The Cost of Sunk-Cost Fallacy: Knowing When to Quit",
    description: "Quitting is not failure; quitting what is no longer serving your higher purpose is the ultimate act of strategic courage.",
    content: "We cling to sinking ships because of the blood, tears, and capital already poured into the hull. The rational decision maker looks only at future expected value, never past sunken investments.",
    category: "Mistakes Learned",
    emotionalTone: "Realization",
    accessLevel: "Free",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isReviewed: true,
    createdAt: "2026-08-11T08:20:00Z",
    updatedAt: "2026-08-11T08:20:00Z",
    creatorId: "user-sarah",
    creatorName: "Sarah Lin",
    creatorPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 5,
    likes: ["user-current", "user-alex"],
    likesCount: 189,
    favoritesCount: 135,
    viewsCount: 1890,
    comments: []
  },
  {
    id: "lesson-7",
    title: "The Antifragile Mindset: Gaining from Chaos & Uncertainty",
    description: "Some things benefit from shocks; they thrive and grow when exposed to volatility, randomness, disorder, and stressors.",
    content: "Resilience merely resists shocks and stays the same. Antifragility gets better. Learn how to structure your personal life and career so that unexpected disruptions fuel your advancement.",
    category: "Mindset",
    emotionalTone: "Motivational",
    accessLevel: "Free",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isReviewed: true,
    createdAt: "2026-08-13T10:00:00Z",
    updatedAt: "2026-08-13T10:00:00Z",
    creatorId: "user-naval",
    creatorName: "Naval K.",
    creatorPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 12,
    likes: ["user-marcus", "user-sarah"],
    likesCount: 265,
    favoritesCount: 198,
    viewsCount: 2890,
    comments: []
  },
  {
    id: "lesson-8",
    title: "The Deep Work Protocol: Protecting 4 Hours of Unbroken Focus",
    description: "The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable.",
    content: "Shallow work keeps you busy; deep work produces masterworks. Establish a monastic morning ritual, eliminate context switching, and guard your cognitive peak hours vigorously.",
    category: "Personal Growth",
    emotionalTone: "Motivational",
    accessLevel: "Premium",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isReviewed: true,
    createdAt: "2026-08-15T12:00:00Z",
    updatedAt: "2026-08-15T12:00:00Z",
    creatorId: "user-alex",
    creatorName: "Alex Chen",
    creatorPhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 4,
    likes: ["user-current"],
    likesCount: 154,
    favoritesCount: 92,
    viewsCount: 1420,
    comments: []
  },
  {
    id: "lesson-9",
    title: "The Power of Asymmetric Opportunities: Never Risk Ruin for Ego",
    description: "Look for decisions where the downside is strictly capped, but the upside is virtually unlimited.",
    content: "Whether investing capital, picking career projects, or choosing collaborators, seek situations where you can afford to fail twenty times, but winning once changes the entire trajectory.",
    category: "Career",
    emotionalTone: "Realization",
    accessLevel: "Free",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isReviewed: true,
    createdAt: "2026-08-17T15:30:00Z",
    updatedAt: "2026-08-17T15:30:00Z",
    creatorId: "user-naval",
    creatorName: "Naval K.",
    creatorPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 12,
    likes: ["user-elena"],
    likesCount: 220,
    favoritesCount: 145,
    viewsCount: 2150,
    comments: []
  },
  {
    id: "lesson-10",
    title: "The Art of Active Listening: Silence as a Leadership Superpower",
    description: "Most people do not listen with the intent to understand; they listen with the intent to reply.",
    content: "When you allow a 3-second silence before answering, people open up their genuine motivations. Listening deeply is the rarest gift you can offer colleagues, partners, and family.",
    category: "Relationships",
    emotionalTone: "Gratitude",
    accessLevel: "Free",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isReviewed: true,
    createdAt: "2026-08-19T09:00:00Z",
    updatedAt: "2026-08-19T09:00:00Z",
    creatorId: "user-elena",
    creatorName: "Dr. Elena Rostova",
    creatorPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 6,
    likes: ["user-sarah", "user-current"],
    likesCount: 198,
    favoritesCount: 130,
    viewsCount: 1750,
    comments: []
  },
  {
    id: "lesson-11",
    title: "Overcoming the Perfectionism Trap: Why Done is Better Than Flawless",
    description: "Perfectionism is rarely about high standards; it is almost always an insidious mask for fear of judgment.",
    content: "Shipping an imperfect product teaches you real market lessons. Hoarding an unreleased masterpiece in your drafts folder only feeds ego and anxiety. Ship, gather reality, iterate.",
    category: "Mindset",
    emotionalTone: "Realization",
    accessLevel: "Free",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isReviewed: true,
    createdAt: "2026-08-21T11:45:00Z",
    updatedAt: "2026-08-21T11:45:00Z",
    creatorId: "user-marcus",
    creatorName: "Marcus Vance",
    creatorPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 8,
    likes: ["user-alex"],
    likesCount: 167,
    favoritesCount: 112,
    viewsCount: 1530,
    comments: []
  },
  {
    id: "lesson-12",
    title: "Post-Traumatic Growth: Turning Career Failures into Catalysts",
    description: "Rock bottom became the solid foundation upon which I rebuilt my life and true calling.",
    content: "When your startup fails, your role is eliminated, or a venture falls apart, the identity crisis is agonizing. But stripped of prestige, you finally discover what you are genuinely built of.",
    category: "Mistakes Learned",
    emotionalTone: "Motivational",
    accessLevel: "Premium",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isReviewed: true,
    createdAt: "2026-08-23T14:20:00Z",
    updatedAt: "2026-08-23T14:20:00Z",
    creatorId: "user-sarah",
    creatorName: "Sarah Lin",
    creatorPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 5,
    likes: ["user-current", "user-marcus"],
    likesCount: 280,
    favoritesCount: 215,
    viewsCount: 3100,
    comments: []
  },
  {
    id: "lesson-13",
    title: "The Quiet Grief of Growing Apart from Childhood Friends",
    description: "No fight happened. No dramatic falling out occurred. Just silence, busy calendars, and the slow realization that you are now strangers with shared history.",
    content: "In our twenties and thirties, we experience a quiet, unacknowledged heartbreak: the gentle drift of friendships that once felt permanent.\n\n### Why Unspoken Distance Hurts Most\nWhen a friendship ends in conflict, there is closure—a reason you can point to. But when it fades through diverging career paths, geography, or changing worldviews, you are left mourning someone who is still alive and well on social media.\n\n### 1. Give People Permission to Have Been a Season\nNot every connection is designed to last fifty years. Some people were the ideal companions for high school, college, or your first startup. That does not diminish the purity of what you shared.\n\n### 2. The Clean Heart Principle\nWish them quiet joy whenever their name crosses your mind. Reaching out once in a while without expectation of a return to the past is the highest form of mature affection.",
    category: "Relationships",
    emotionalTone: "Sad",
    accessLevel: "Free",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isReviewed: true,
    createdAt: "2026-08-25T10:15:00Z",
    updatedAt: "2026-08-25T10:15:00Z",
    creatorId: "user-elena",
    creatorName: "Dr. Elena Rostova",
    creatorPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 6,
    likes: ["user-current", "user-sarah"],
    likesCount: 318,
    favoritesCount: 245,
    viewsCount: 4200,
    comments: [
      {
        id: "c-13",
        userId: "user-marcus",
        userName: "Marcus Vance",
        userPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        text: "This brought tears to my eyes. Exactly what I needed to read to make peace with an old friend's silence.",
        createdAt: "2026-08-26T09:12:00Z"
      }
    ]
  },
  {
    id: "lesson-14",
    title: "What the Empty Chair Taught Me About Postponing Love",
    description: "I kept telling myself I would visit next weekend, next month, when this project finished. Then next time never came.",
    content: "We live under the seductive illusion that our loved ones will be here indefinitely. We sacrifice dinners, family walks, and phone calls at the altar of 'grind' and professional urgency.\n\n### The Ledger of Regret\nWhen someone dies, nobody wishes they answered five more emails or spent forty more minutes tweaking a slide deck. The questions that echo are:\n- Why didn't I sit with them on the porch ten minutes longer?\n- Why did I rush off that phone call?\n\n### Protect What Cannot Be Replaced\nYour company will replace you in a job posting within forty-eight hours. The people around your dinner table never will. Treat every goodbye with the reverence of a final encounter.",
    category: "Mistakes Learned",
    emotionalTone: "Sad",
    accessLevel: "Free",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isReviewed: true,
    createdAt: "2026-08-26T14:30:00Z",
    updatedAt: "2026-08-26T14:30:00Z",
    creatorId: "user-marcus",
    creatorName: "Marcus Vance",
    creatorPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 8,
    likes: ["user-current", "user-naval", "user-elena"],
    likesCount: 420,
    favoritesCount: 310,
    viewsCount: 5120,
    comments: []
  },
  {
    id: "lesson-15",
    title: "Mourning the Version of Yourself You Had to Kill to Survive",
    description: "Becoming strong often requires leaving behind the gentler, trusting person you were before the betrayal.",
    content: "Resilience is celebrated everywhere, but few talk about the cost of armor. The hyper-vigilance, the emotional detachment, and the cynicism that once protected you from trauma often prevent you from experiencing warmth and tenderness later in life.\n\n### Unlearning Defensive Habits\n1. Acknowledge that the armor saved your life when you were vulnerable.\n2. Recognize that you are no longer in that battlefield.\n3. Gently permit yourself to lay down the weapons and trust again.",
    category: "Personal Growth",
    emotionalTone: "Sad",
    accessLevel: "Premium",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isReviewed: true,
    createdAt: "2026-08-27T08:50:00Z",
    updatedAt: "2026-08-27T08:50:00Z",
    creatorId: "user-sarah",
    creatorName: "Sarah Lin",
    creatorPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 5,
    likes: ["user-current"],
    likesCount: 275,
    favoritesCount: 184,
    viewsCount: 3600,
    comments: []
  },
  {
    id: "lesson-16",
    title: "The Spotlight Fallacy: Nobody is Watching You as Closely as You Fear",
    description: "We spend years paralyzed by social anxiety and imposter syndrome, until one day we understand: everyone else is just worrying about themselves.",
    content: "When you stumble over your words in a presentation, wear an awkward outfit, or launch a side project with zero fanfare, you feel exposed under an imaginary stadium spotlight.\n\n### The Cognitive Awakening\nPsychological research proves the Spotlight Effect: humans overestimate how much other people notice their flaws by over 50%. The truth is both humbling and deeply liberating: nobody cares as much as you think. They are entirely consumed by their own fears, bills, and insecurities.\n\n### Your License to Create\nOnce you internalize that the audience isn't keeping a scorecard, you are finally free to experiment, fail in public, and build without shame.",
    category: "Mindset",
    emotionalTone: "Realization",
    accessLevel: "Free",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isReviewed: true,
    createdAt: "2026-08-28T11:20:00Z",
    updatedAt: "2026-08-28T11:20:00Z",
    creatorId: "user-naval",
    creatorName: "Naval K.",
    creatorPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 12,
    likes: ["user-current", "user-marcus"],
    likesCount: 389,
    favoritesCount: 278,
    viewsCount: 4600,
    comments: []
  },
  {
    id: "lesson-17",
    title: "You Can Win Every Argument and Still Lose the Relationship",
    description: "It took me three broken partnerships to realize being right is a hollow trophy if the person you love feels humiliated and unheard.",
    content: "In domestic life and close collaborations, intellectual superiority is an emotional poison. You can dismantle someone's logic with surgical precision, cite every date and text message, and watch them concede defeat—and go to bed feeling completely alienated.\n\n### Victory vs. Intimacy\nAsk yourself in the heat of tension: 'Do I want to win this point, or do I want to protect this bridge?' When you choose connection over vindication, the need to dominate instantly dissolves.",
    category: "Relationships",
    emotionalTone: "Realization",
    accessLevel: "Free",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isReviewed: true,
    createdAt: "2026-08-29T13:40:00Z",
    updatedAt: "2026-08-29T13:40:00Z",
    creatorId: "user-elena",
    creatorName: "Dr. Elena Rostova",
    creatorPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 6,
    likes: ["user-current", "user-sarah"],
    likesCount: 295,
    favoritesCount: 190,
    viewsCount: 3800,
    comments: []
  },
  {
    id: "lesson-18",
    title: "The Golden Handcuffs: Why High Salary Without Freedom is Just a Prettier Cage",
    description: "Climbing to senior leadership made me realize that more money cannot buy back Saturdays spent in anxiety or years given away to someone else's dream.",
    content: "Lifestyle inflation is the silent thief of sovereignty. As bonuses grew, expenses matched pace: luxury leases, designer watches, and expensive dinners. Suddenly, quitting a soul-draining executive post became impossible because the overhead demanded the paycheck.\n\n### The Real Definition of Wealth\nTrue wealth is not measured in luxury goods; it is measured in the number of hours you control on an ordinary Tuesday morning.",
    category: "Career",
    emotionalTone: "Realization",
    accessLevel: "Premium",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isReviewed: true,
    createdAt: "2026-08-30T16:00:00Z",
    updatedAt: "2026-08-30T16:00:00Z",
    creatorId: "user-alex",
    creatorName: "Alex Chen",
    creatorPhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 4,
    likes: ["user-current", "user-naval"],
    likesCount: 350,
    favoritesCount: 260,
    viewsCount: 4300,
    comments: []
  },
  {
    id: "lesson-19",
    title: "The Sacred Simplicity of Ordinary Tuesdays",
    description: "We chase peak experiences—promotions, exotic holidays, viral wins—while true peace was always sitting quietly in morning sunlight and warm tea.",
    content: "For a decade, I operated as if life hadn't started yet. I believed life would truly begin once the company exited, once the house was bought, once the next milestone was crossed.\n\n### Finding the Gold in the Ordinary\nOne quiet autumn morning, watching steam rise from my mug while the world was still asleep, a profound stillness washed over me. This was it. This ordinary, unremarkable morning is the pinnacle of existence.\n\n### The Daily Practice\nNotice three unspectacular miracles every single day: the aroma of fresh bread, the sound of rain on the roof, or the steady rhythm of your own breath. When you are grateful for the baseline, anxiety loses its grip.",
    category: "Mindset",
    emotionalTone: "Gratitude",
    accessLevel: "Free",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isReviewed: true,
    createdAt: "2026-08-31T07:30:00Z",
    updatedAt: "2026-08-31T07:30:00Z",
    creatorId: "user-marcus",
    creatorName: "Marcus Vance",
    creatorPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 8,
    likes: ["user-current", "user-elena", "user-sarah"],
    likesCount: 512,
    favoritesCount: 388,
    viewsCount: 6200,
    comments: [
      {
        id: "c-19",
        userId: "user-naval",
        userName: "Naval K.",
        userPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        text: "Peace is not the absence of desire; it is the gratitude for the present moment just as it is.",
        createdAt: "2026-08-31T12:00:00Z"
      }
    ]
  },
  {
    id: "lesson-20",
    title: "A Letter to the People Who Believed in Me When I Had Nothing to Show",
    description: "Success has many friends, but true gratitude belongs to the mentor, parent, or partner who gave you courage when your track record was zero.",
    content: "When you have achievements, awards, and a thriving company, people line up to collaborate and praise you. But the real debt of gratitude belongs to the few who saw potential when you were broke, confused, and questioning your own sanity.\n\n### Paying the Debt Forward\nGratitude is not just a polite 'thank you'. It is an active obligation to extend that same unconditional belief to a struggling beginner today.",
    category: "Personal Growth",
    emotionalTone: "Gratitude",
    accessLevel: "Free",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isReviewed: true,
    createdAt: "2026-09-01T09:15:00Z",
    updatedAt: "2026-09-01T09:15:00Z",
    creatorId: "user-sarah",
    creatorName: "Sarah Lin",
    creatorPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 5,
    likes: ["user-current", "user-alex"],
    likesCount: 340,
    favoritesCount: 225,
    viewsCount: 4100,
    comments: []
  },
  {
    id: "lesson-21",
    title: "Finding Grace in the Detours: Thanking the Closed Doors",
    description: "Every rejection letter, missed promotion, and broken engagement stung at the time. Years later, they are the very detours I am most thankful for.",
    content: "We spend enormous emotional energy fighting the natural redirection of our lives. When a door slams shut in your face, human instinct interprets it as defeat or punishment.\n\n### The Perspective of Retrospect\nEvery detour that broke my heart also saved me from a career, marriage, or venture that would have crushed my spirit. Learn to thank the closed doors; they forced you into the hallway where your real destination was waiting.",
    category: "Mistakes Learned",
    emotionalTone: "Gratitude",
    accessLevel: "Premium",
    visibility: "Public",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isReviewed: true,
    createdAt: "2026-09-02T15:00:00Z",
    updatedAt: "2026-09-02T15:00:00Z",
    creatorId: "user-naval",
    creatorName: "Naval K.",
    creatorPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    creatorLessonsCount: 12,
    likes: ["user-current", "user-marcus", "user-elena"],
    likesCount: 460,
    favoritesCount: 340,
    viewsCount: 5800,
    comments: []
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

    // 1. Seed 'users' Collection
    const usersCol = db.collection('users');
    await usersCol.deleteMany({});
    const userInsertResult = await usersCol.insertMany(SAMPLE_USERS);
    console.log(`Seeded ${userInsertResult.insertedCount} users into 'users' collection.`);

    // 2. Seed 'lessons' Collection
    const lessonsCol = db.collection('lessons');
    await lessonsCol.deleteMany({});
    const lessonInsertResult = await lessonsCol.insertMany(SAMPLE_LESSONS);
    console.log(`Seeded ${lessonInsertResult.insertedCount} lessons into 'lessons' collection.`);

    // 3. Seed 'lessonsReports' Collection
    const reportsCol = db.collection('lessonsReports');
    await reportsCol.deleteMany({});
    console.log("Initialized clean 'lessonsReports' collection.");

    // 4. Seed 'favorites' Collection
    const favoritesCol = db.collection('favorites');
    await favoritesCol.deleteMany({});
    const sampleFavorites = [
      { userId: "user-marcus", lessonId: "lesson-1", savedAt: new Date().toISOString() },
      { userId: "user-marcus", lessonId: "lesson-2", savedAt: new Date().toISOString() },
      { userId: "user-sarah", lessonId: "lesson-4", savedAt: new Date().toISOString() }
    ];
    await favoritesCol.insertMany(sampleFavorites);
    console.log("Seeded 'favorites' collection.");

    // 5. Seed 'comments' Collection
    const commentsCol = db.collection('comments');
    await commentsCol.deleteMany({});
    const sampleComments = [
      {
        lessonId: "lesson-1",
        userId: "user-sarah",
        userName: "Sarah Lin",
        userPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        text: "This transformed how I handle client scope creep. The standard scripts are gold!",
        createdAt: new Date("2026-08-02T14:20:00Z").toISOString()
      },
      {
        lessonId: "lesson-4",
        userId: "user-marcus",
        userName: "Marcus Vance",
        userPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        text: "Owning equity is the ultimate unlock. Essential wisdom for modern creators.",
        createdAt: new Date("2026-08-06T10:15:00Z").toISOString()
      }
    ];
    await commentsCol.insertMany(sampleComments);
    console.log("Seeded 'comments' collection.");

    console.log("\nDatabase Seeding Completed Successfully! All 12 lessons with bespoke life lesson images are live.");
  } catch (err) {
    console.error("Seeding Error:", err);
  } finally {
    await client.close();
  }
}

seed();
