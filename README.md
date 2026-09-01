# ⚡ Digital Life Lessons — Server Side API Engine

<div align="center">
  <h3>🛡️ High-Performance REST API Engine for Digital Life Lessons</h3>
  <p>Node.js & Express API connected to MongoDB Atlas with JWT token verification, dynamic aggregation pipelines, sliding-window rate limiting, and Stripe payment processing.</p>
  
  <p>
    <a href="https://digital-life-lessons-server-side.onrender.com" target="_blank">
      <img src="https://img.shields.io/badge/Live_API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render API" />
    </a>
    <a href="https://cloud.mongodb.com" target="_blank">
      <img src="https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Atlas" />
    </a>
  </p>
</div>

---

## 🛠️ Architecture & Core Components

### 1. Security & Middleware Pipeline
- **`middleware/auth.js`**: JWT / Admin header verification (`verifyToken` & `verifyAdmin`).
- **`middleware/rateLimiter.js`**: Sliding-window rate limiter protecting against DDoS and brute-force attacks (200 req / 15 min; Auth: 20 req / 15 min).
- **`middleware/validator.js`**: Schema validation & string sanitization for lesson creation payloads.
- **`middleware/errorHandler.js`**: Centralized 404 handler and global exception wrapper.

### 2. MongoDB Atlas Collections (`digital_life_lessons`)
- **`users`**: Member identity, role (`user` / `admin`), and lifetime `isPremium` status.
- **`lessons`**: Wisdom reflections with category, emotional tone, visibility (`Public`/`Private`), access level (`Free`/`Premium`), curated imagery, likes array, and engagement counters.
- **`lessonsReports`**: Flagged lesson moderation queue with reporter details, reason codes, and timestamps.
- **`favorites`**: Saved lesson bookmarks by user.
- **`comments`**: Threaded discussion reflections.

---

## 📡 REST API Specifications

### Public Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Root Health Check & MongoDB status |
| `GET` | `/api/lessons` | List public lessons (supports `?category=`, `?tone=`, `?search=`, `?sort=`) |
| `GET` | `/api/lessons/featured` | Fetch weekly editorial wisdom picks |
| `GET` | `/api/lessons/top-saved` | Fetch most bookmarked lessons |
| `GET` | `/api/lessons/:id` | Fetch full lesson details |
| `GET` | `/api/creators/:id` | Fetch author public profile & metrics |
| `GET` | `/api/health` | Memory usage & uptime diagnostics |

### Member Endpoints (Authenticated)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new member account |
| `POST` | `/api/auth/login` | Email/Password login |
| `POST` | `/api/auth/sync-user` | Google/Email login sync with MongoDB Atlas |
| `POST` | `/api/auth/upgrade-premium` | Upgrade member to Lifetime VIP in MongoDB |
| `POST` | `/api/lessons` | Publish a new life lesson |
| `PATCH` | `/api/lessons/:id` | Edit user authored lesson |
| `DELETE` | `/api/lessons/:id` | Delete user authored lesson |
| `POST` | `/api/lessons/:id/like` | Toggle like reaction |
| `POST` | `/api/lessons/:id/favorite` | Toggle bookmark in saved favorites |
| `POST` | `/api/lessons/:id/comments` | Post a comment / reflection |
| `POST` | `/api/lessons/:id/report` | Submit a moderation flag |
| `POST` | `/api/create-checkout-session` | Initialize Stripe payment session |

### Admin Moderation Endpoints (Admin Only)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/users` | List all platform members |
| `PATCH` | `/api/admin/users/:id/role` | Promote/Demote user role (`admin` / `user`) |
| `DELETE` | `/api/admin/users/:id` | Delete user account from database |
| `PATCH` | `/api/admin/lessons/:id/featured` | Toggle editorial featured status |
| `DELETE` | `/api/admin/lessons/:id` | Permanently remove a lesson |
| `GET` | `/api/admin/reports` | View flagged content queue |
| `DELETE` | `/api/admin/reports/:lessonId` | Clear moderation reports |

---

## 💻 Local Development Setup

### 1. Clone & Install
```bash
git clone https://github.com/ibtee12/digital-life-lessons-server-side-.git
cd digital-life-lessons-server-side-
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root of the server project:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/digital_life_lessons?retryWrites=true&w=majority
BETTER_AUTH_SECRET=your_32_character_jwt_secret_key_here
STRIPE_SECRET_KEY=sk_test_...
CLIENT_URL=http://localhost:5173
```

### 3. Seed Database with 12 Curated Lessons
```bash
npm run seed
```

### 4. Start Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```
Server will start on **[http://localhost:5000](http://localhost:5000)**.

---

## 🚢 Deployment to Render

1. Push your server repository to GitHub.
2. Go to **[Render](https://render.com)** ➔ **New Web Service**.
3. Select your repository.
4. **Build Command:** `npm install`
5. **Start Command:** `node index.js`
6. Add Environment Variables (`MONGODB_URI`, `CLIENT_URL`, `STRIPE_SECRET_KEY`, `BETTER_AUTH_SECRET`).
7. Click **Deploy Web Service**.

---

<div align="center">
  <sub>API Engine for Digital Life Lessons.</sub>
</div>
