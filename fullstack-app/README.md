# 🗝️ NoteVault — Full-Stack Web Application

A production-ready full-stack web application built for **Round 2 Assignment** featuring:
- ✅ Real user authentication (JWT + bcrypt)
- ✅ Backend REST API (Node.js + Express)
- ✅ Database integration (SQLite with proper schema)
- ✅ Full CRUD for notes
- ✅ Deployment-ready configuration

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios, React Hot Toast |
| Backend | Node.js, Express.js |
| Database | SQLite (via better-sqlite3) |
| Auth | JWT (jsonwebtoken) + bcrypt password hashing |
| Security | Helmet, CORS, express-rate-limit, express-validator |

---

## 📁 Project Structure

```
nodevault-fullstack/
├── backend/
│   ├── src/
│   │   ├── database.js          # SQLite schema + connection
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT authentication middleware
│   │   └── routes/
│   │       ├── auth.js          # Signup, Login, Profile, Password
│   │       ├── notes.js         # Full CRUD for notes
│   │       └── users.js         # User management (admin)
│   ├── server.js                # Express app entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js   # Global auth state
│   │   ├── services/
│   │   │   └── api.js           # Axios API service
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   ├── Home.js          # Landing page
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── Dashboard.js     # Stats + recent notes
│   │   │   ├── Notes.js         # Full note management
│   │   │   └── Profile.js       # Edit profile + password
│   │   ├── App.js               # Router + layout
│   │   └── App.css              # Complete design system
│   └── package.json
├── render.yaml                  # Render.com deployment (backend)
├── vercel.json                  # Vercel deployment (frontend)
├── .gitignore
└── README.md
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js >= 18
- npm >= 9

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/nodevault-fullstack.git
cd nodevault-fullstack

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

### 2. Configure Environment

```bash
# In /backend directory
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
JWT_SECRET=your_super_secret_key_at_least_32_chars_long
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

```bash
# In /frontend directory
cp .env.example .env
```

Edit `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Run the App

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server starts at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
# App opens at http://localhost:3000
```

---

## 🌐 Deployment Guide

### Deploy Backend → Render.com (Free)

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Set **Root Directory**: `backend`
4. **Build Command**: `npm install`
5. **Start Command**: `node server.js`
6. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = (generate a secure 64-char string)
   - `JWT_EXPIRES_IN` = `7d`
   - `FRONTEND_URL` = your Vercel URL (add after frontend deploy)
7. Deploy → note your backend URL (e.g., `https://nodevault-api.onrender.com`)

### Deploy Frontend → Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set **Root Directory**: `frontend`
4. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://your-backend.onrender.com/api`
5. Deploy → note your frontend URL
6. Go back to Render → update `FRONTEND_URL` with your Vercel URL

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/signup` | No | Create account |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Get current user |
| PUT | `/api/auth/profile` | Yes | Update name/bio |
| PUT | `/api/auth/change-password` | Yes | Change password |

### Notes
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/notes` | Yes | Get all notes |
| POST | `/api/notes` | Yes | Create note |
| PUT | `/api/notes/:id` | Yes | Update note |
| DELETE | `/api/notes/:id` | Yes | Delete note |
| GET | `/api/notes/stats` | Yes | Get note stats |

### Health
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/health` | No | Server health check |

---

## 🔐 Security Features

- **bcrypt** password hashing (cost factor 12)
- **JWT** tokens with configurable expiry
- **Helmet** for HTTP security headers
- **Rate limiting**: 100 req/15min global, 20 req/15min for auth
- **Input validation** with express-validator
- **CORS** with whitelisted origins
- **SQL injection prevention** via parameterized queries
- **Foreign key constraints** in SQLite

---

## 📊 Database Schema

```sql
-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,      -- bcrypt hashed
  avatar TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user',    -- 'user' | 'admin'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Notes table
CREATE TABLE notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,    -- FK → users.id
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  color TEXT DEFAULT '#ffffff',
  is_pinned INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 👤 Author
  
**Stack**: React · Node.js · Express · SQLite · JWT

---

## 📄 License

MIT — free to use and modify.
