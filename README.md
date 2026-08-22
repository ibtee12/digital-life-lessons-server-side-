# ⚡ Digital Life Lessons — Server Side API Engine

> Production Node.js & Express backend for **Digital Life Lessons** — a modern, editorial wisdom-sharing platform. Backed by MongoDB Atlas with JWT token verification, dynamic query pipelines, rate limiting, and Stripe payment webhooks.

---

## 🛠️ Architecture Overview

### 1. Security & Middleware Layer
- **`middleware/auth.js`**: JWT / Better Auth token verification (`verifyToken`) and administrative permission checks (`verifyAdmin`).
- **`middleware/rateLimiter.js`**: In-memory sliding-window rate limiting (`rateLimiter`: 200 req / 15 min; `authRateLimiter`: 20 auth attempts / 15 min with `Retry-After` header).
- **`middleware/validator.js`**: Payload validation and XSS string sanitization for lesson submissions.
- **`middleware/errorHandler.js`**: Centralized 404 handler and global exception wrapper.

### 2. MongoDB Atlas Collections
- **`users`**: User identity, roles (`user` / `admin`), and `isPremium` status.
- **`lessons`**: Wisdom entries with visibility (`Public` / `Private`), access level (`Free` / `Premium`), likes array, and engagement counters.
- **`lessonsReports`**: Community flags with reporter information, reasons, and timestamps.
- **`favorites`**: User bookmarked wisdom entries.
- **`comments`**: Threaded lesson reflections and discussions.

---

## 📡 Complete REST API Specifications

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | Public (Rate Limited) |
| `POST` | `/api/auth/login` | Login user & issue JWT token cookie | Public (Rate Limited) |
| `POST` | `/api/auth/logout` | Clear authentication session cookie | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Private (`verifyToken`) |
| `PATCH` | `/api/auth/profile` | Update user display name & photo | Private (`verifyToken`) |

### Life Lessons & Query Pipeline (`/api/lessons`)
| Method | Endpoint | Query / Body | Description | Access |
|---|---|---|---|---|
| `GET` | `/api/lessons` | `search`, `category`, `emotionalTone`, `sort`, `page`, `limit` | Search & filter public wisdom | Public |
| `GET` | `/api/lessons/:id` | `id` | Single lesson details + increment view | Public |
| `POST` | `/api/lessons` | `title`, `description`, `content`, `category`, `emotionalTone`, `accessLevel` | Create lesson (Free user gated to Free) | Private (`verifyToken`, `validateLessonPayload`) |
| `PUT` | `/api/lessons/:id` | `title`, `description`, etc. | Update existing lesson | Private (Owner/Admin) |
| `DELETE` | `/api/lessons/:id` | `id` | Delete lesson permanently | Private (Owner/Admin) |

### Interactions & Reactions (`/api/lessons`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/lessons/:id/like` | Toggle like (updates `likes[]` array & `likesCount`) | Private (`verifyToken`) |
| `POST` | `/api/lessons/:id/favorite` | Toggle bookmark in `favorites` collection | Private (`verifyToken`) |
| `GET` | `/api/lessons/user/favorites` | Fetch user's saved favorites list | Private (`verifyToken`) |
| `POST` | `/api/lessons/:id/comments` | Post reflection comment | Private (`verifyToken`) |
| `GET` | `/api/lessons/:id/comments` | Fetch discussion comments thread | Public |
| `POST` | `/api/lessons/:id/report` | Submit moderation report to `lessonsReports` | Private (`verifyToken`) |

### Analytics & Heatmap (`/api/analytics`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/analytics/streak` | Aggregated user streak & active journaling days | Private (`verifyToken`) |
| `GET` | `/api/analytics/weekly` | Weekly views and reflections time-series for Recharts | Private (`verifyToken`) |

### Public Creators (`/api/creators`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/creators/top` | Top 6 contributors sorted by lessons & likes | Public |
| `GET` | `/api/creators/:id` | Public author profile archive & stats | Public |

### Stripe Payments & Webhooks (`/api`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/create-checkout-session` | Stripe checkout for ৳1500 Lifetime Premium | Private (`verifyToken`) |
| `POST` | `/api/webhook` | Stripe event listener (sets `isPremium: true`) | Public (Stripe Signature) |

### Admin Moderation (`/api/admin`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/admin/users` | List all platform users | Admin (`verifyAdmin`) |
| `PATCH` | `/api/admin/users/:id/role` | Promote/demote user roles | Admin (`verifyAdmin`) |
| `DELETE` | `/api/admin/users/:id` | Delete user account | Admin (`verifyAdmin`) |
| `PATCH` | `/api/admin/lessons/:id/featured` | Toggle homepage Featured status | Admin (`verifyAdmin`) |
| `GET` | `/api/admin/reports` | List reported lessons with reason logs | Admin (`verifyAdmin`) |
| `DELETE` | `/api/admin/reports/:lessonId` | Clear reports for lesson (Ignore action) | Admin (`verifyAdmin`) |

### System Health (`/api/health`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/health` | Memory usage, uptime, Node version & DB status | Public |

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the server root:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/digital_life_lessons?retryWrites=true&w=majority
BETTER_AUTH_SECRET=a_random_32_character_secret_key_here
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Setup & Local Execution

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Seed sample data into MongoDB Atlas**:
   ```bash
   npm run seed
   ```

3. **Start development server with live watch**:
   ```bash
   npm run dev
   ```

4. **Start production server**:
   ```bash
   npm start
   ```
