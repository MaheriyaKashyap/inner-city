# Inner City - Production Architecture Guide

## Current Limitations

The current setup uses:
- **Frontend-only deployment** (Vercel) - No backend API
- **localStorage** for all data persistence
- **Direct API calls** from browser (CORS issues with Ticketmaster)
- **Mock data** for most features

This won't scale for production. Here's the proper architecture:

---

## Recommended Architecture

### Option 1: Full-Stack with Backend API (Recommended)

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React/Vite)                      │
│  - Vercel/Netlify (Static Hosting)                           │
│  - PWA Support                                                │
└──────────────────────┬────────────────────────────────────────┘
                       │
                       │ HTTPS/REST API
                       │ WebSocket (Real-time)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND API SERVER                              │
│  Options:                                                     │
│  • Node.js + Express/Fastify                                 │
│  • Python + FastAPI/Django                                   │
│  • Go + Gin/Echo                                              │
│  • Rust + Actix/Axum                                          │
│                                                               │
│  Deployment:                                                  │
│  • Railway.app (easiest)                                      │
│  • Render.com                                                 │
│  • Fly.io                                                     │
│  • AWS EC2/ECS                                                │
│  • Google Cloud Run                                           │
│  • DigitalOcean App Platform                                  │
└──────────────────────┬────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   DATABASE   │ │  FILE STORAGE │ │  CACHE/REDIS │
│  PostgreSQL  │ │  S3/Cloudinary│ │  Redis/Upstash│
│  or MongoDB  │ │  or Supabase  │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```

### Option 2: Serverless/Backend-as-a-Service (Easier Setup)

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                        │
└──────────────────────┬────────────────────────────────────────┘
                       │
                       │ HTTPS/REST API
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   SUPABASE   │ │   FIREBASE   │ │   AWS AMPLIFY│
│  (Recommended)│ │              │ │              │
│              │ │              │ │              │
│ • PostgreSQL │ │ • Firestore  │ │ • AppSync    │
│ • Auth       │ │ • Auth       │ │ • Cognito    │
│ • Storage    │ │ • Storage    │ │ • S3         │
│ • Realtime   │ │ • Realtime   │ │ • Lambda     │
│ • Edge Funcs │ │ • Functions  │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## Core Components Needed

### 1. **Backend API Server**

**Purpose**: Proxy API calls, handle business logic, authentication

**Key Endpoints**:
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/refresh
GET    /api/user/profile
PUT    /api/user/profile
GET    /api/events?city=Berlin&category=music
GET    /api/events/:id
POST   /api/events/:id/save
DELETE /api/events/:id/save
GET    /api/events/:id/chat
POST   /api/events/:id/chat/messages
GET    /api/tickets
POST   /api/tickets/purchase
GET    /api/notifications
PUT    /api/notifications/:id/read
```

**API Proxy Endpoints** (to avoid CORS):
```
GET    /api/proxy/ticketmaster/events?city=Berlin
GET    /api/proxy/eventbrite/events?city=Berlin
```

**Recommended Stack**:
- **Node.js + Express** (easiest, most common)
- **Python + FastAPI** (great for data processing)
- **Go** (high performance, low latency)

**Deployment Options**:
1. **Railway.app** ⭐ (Recommended - easiest)
   - Free tier available
   - Auto-deploy from GitHub
   - Built-in PostgreSQL
   - Simple pricing

2. **Render.com**
   - Free tier for hobby projects
   - Auto-deploy from GitHub
   - Built-in PostgreSQL

3. **Fly.io**
   - Global edge deployment
   - Great for low latency
   - Free tier available

4. **AWS/GCP/Azure**
   - More complex setup
   - Better for scale
   - More expensive

---

### 2. **Database**

**Purpose**: Store users, events, tickets, chat messages, saved events

**Schema Overview**:
```sql
-- Users
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  username VARCHAR UNIQUE,
  display_name VARCHAR,
  avatar_url TEXT,
  bio TEXT,
  interests TEXT[],
  home_city VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Events (from Ticketmaster/Eventbrite + user-created)
events (
  id UUID PRIMARY KEY,
  source VARCHAR, -- 'ticketmaster', 'eventbrite', 'user'
  external_id VARCHAR, -- ID from Ticketmaster/Eventbrite
  city_id VARCHAR,
  title VARCHAR,
  description TEXT,
  start_at TIMESTAMP,
  end_at TIMESTAMP,
  venue_name VARCHAR,
  address TEXT,
  lat DECIMAL,
  lng DECIMAL,
  image_url TEXT,
  ticket_url TEXT,
  tier VARCHAR, -- 'official', 'community', 'underground'
  created_at TIMESTAMP
)

-- Saved Events (user favorites)
saved_events (
  user_id UUID REFERENCES users(id),
  event_id UUID REFERENCES events(id),
  saved_at TIMESTAMP,
  PRIMARY KEY (user_id, event_id)
)

-- Tickets
tickets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  event_id UUID REFERENCES events(id),
  source VARCHAR, -- 'native', 'ticketmaster'
  status VARCHAR, -- 'active', 'used', 'cancelled'
  qr_secret VARCHAR,
  purchased_at TIMESTAMP
)

-- Chat Messages
chat_messages (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  user_id UUID REFERENCES users(id),
  message TEXT,
  created_at TIMESTAMP
)

-- Notifications
notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR, -- 'event_reminder', 'new_message', etc.
  title VARCHAR,
  body TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP
)
```

**Database Options**:

1. **PostgreSQL** ⭐ (Recommended)
   - Most robust, feature-rich
   - Great for complex queries
   - Free tiers: Railway, Render, Supabase, Neon

2. **MongoDB**
   - Flexible schema
   - Good for rapid development
   - Free tier: MongoDB Atlas

3. **Supabase** (PostgreSQL + Extras)
   - Built-in auth, storage, realtime
   - Free tier: 500MB database
   - Auto-generated REST API

---

### 3. **Authentication**

**Purpose**: Secure user login, registration, session management

**Options**:

1. **Supabase Auth** ⭐ (Recommended - easiest)
   - Built-in email/password, OAuth (Google, Apple, etc.)
   - JWT tokens
   - Row-level security
   - Free tier: Unlimited users

2. **Clerk**
   - Beautiful UI components
   - Social logins
   - User management dashboard
   - Free tier: 10,000 MAU

3. **Auth0**
   - Enterprise-grade
   - Complex setup
   - Free tier: 7,000 MAU

4. **Custom (JWT + bcrypt)**
   - Full control
   - More work to implement
   - Use libraries: `jsonwebtoken`, `bcrypt`

---

### 4. **File Storage**

**Purpose**: Store user avatars, event images, QR codes

**Options**:

1. **Supabase Storage** ⭐ (Recommended)
   - Built-in with Supabase
   - Free tier: 1GB

2. **Cloudinary**
   - Image optimization built-in
   - Free tier: 25GB

3. **AWS S3**
   - Industry standard
   - Free tier: 5GB for 12 months

4. **Cloudflare R2**
   - S3-compatible
   - No egress fees
   - Free tier: 10GB

---

### 5. **Real-time Features**

**Purpose**: Chat rooms, live notifications, event updates

**Options**:

1. **Supabase Realtime** ⭐ (Recommended)
   - Built-in PostgreSQL subscriptions
   - WebSocket-based
   - Free tier: 200 concurrent connections

2. **Socket.io**
   - Most popular WebSocket library
   - Need to host your own server
   - Free (self-hosted)

3. **Pusher**
   - Managed WebSocket service
   - Free tier: 200k messages/day

4. **Ably**
   - Enterprise-grade
   - Free tier: 3M messages/month

---

### 6. **Caching**

**Purpose**: Cache API responses, reduce database load

**Options**:

1. **Redis** (Upstash) ⭐ (Recommended)
   - Serverless Redis
   - Free tier: 10k commands/day
   - Great for API response caching

2. **Vercel KV**
   - Redis-compatible
   - Integrated with Vercel
   - Free tier: Limited

3. **Cloudflare Workers KV**
   - Edge caching
   - Free tier: 100k reads/day

---

## Recommended Tech Stack (Easiest Path)

### **Option A: Supabase + Vercel** ⭐ (Best for getting started)

```
Frontend:  Vercel (React/Vite)
Backend:   Supabase (PostgreSQL + Auth + Storage + Realtime)
API Proxy: Supabase Edge Functions or Vercel Serverless Functions
Cache:     Upstash Redis (optional)
```

**Why**:
- ✅ Supabase handles: Database, Auth, Storage, Realtime
- ✅ Vercel handles: Frontend hosting
- ✅ Minimal setup, free tiers generous
- ✅ Auto-scaling
- ✅ Great documentation

**Setup Steps**:
1. Create Supabase project (free)
2. Set up database schema
3. Configure authentication
4. Create Edge Functions for API proxy
5. Update frontend to use Supabase client

---

### **Option B: Railway + PostgreSQL + Custom Backend**

```
Frontend:  Vercel (React/Vite)
Backend:   Railway (Node.js/Express)
Database:  Railway PostgreSQL
Auth:      Custom JWT or Clerk
Storage:   Cloudinary or S3
Cache:     Upstash Redis
```

**Why**:
- ✅ Full control over backend
- ✅ Railway is very easy to deploy
- ✅ Can use any database/tech
- ✅ Good for learning

**Setup Steps**:
1. Create Railway account
2. Deploy Node.js backend
3. Set up PostgreSQL database
4. Configure environment variables
5. Deploy frontend to Vercel

---

## Migration Path from Current Setup

### Phase 1: Backend API Proxy (Immediate)
1. Set up Supabase or Railway backend
2. Create API proxy endpoints for Ticketmaster/Eventbrite
3. Update frontend to call your API instead of direct calls
4. **Result**: CORS issues solved

### Phase 2: Authentication
1. Set up Supabase Auth or Clerk
2. Replace localStorage user with real auth
3. Add login/register screens
4. **Result**: Real user accounts

### Phase 3: Database Migration
1. Create database schema
2. Migrate mock data to database
3. Update frontend to fetch from database
4. **Result**: Persistent data

### Phase 4: Real-time Features
1. Set up Supabase Realtime or Socket.io
2. Implement chat rooms
3. Add live notifications
4. **Result**: Real-time updates

### Phase 5: Advanced Features
1. Add file upload for avatars/event images
2. Implement ticket purchasing flow
3. Add payment processing (Stripe)
4. **Result**: Full production app

---

## Cost Estimates (Monthly)

### **Supabase + Vercel** (Recommended)
- Supabase Free: $0 (up to 500MB DB, 1GB storage)
- Vercel Free: $0 (hobby projects)
- **Total: $0/month** (for small scale)

### **Railway + Vercel**
- Railway Hobby: $5/month (includes PostgreSQL)
- Vercel Free: $0
- **Total: $5/month**

### **Production Scale** (10k+ users)
- Supabase Pro: $25/month
- Vercel Pro: $20/month
- Upstash Redis: $10/month
- **Total: ~$55/month**

---

## Quick Start: Supabase Setup

1. **Create Supabase Project**
   ```bash
   # Go to https://supabase.com
   # Create new project
   # Note your project URL and anon key
   ```

2. **Install Supabase Client**
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Create Supabase Client**
   ```typescript
   // lib/supabase.ts
   import { createClient } from '@supabase/supabase-js'
   
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
   
   export const supabase = createClient(supabaseUrl, supabaseAnonKey)
   ```

4. **Create API Proxy Function**
   ```typescript
   // supabase/functions/ticketmaster-proxy/index.ts
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
   
   serve(async (req) => {
     const { city, category } = await req.json()
     
     const response = await fetch(
       `https://app.ticketmaster.com/discovery/v2/events.json?` +
       `apikey=${Deno.env.get('TICKETMASTER_API_KEY')}&` +
       `city=${city}&classificationName=${category}`
     )
     
     const data = await response.json()
     return new Response(JSON.stringify(data), {
       headers: { 'Content-Type': 'application/json' }
     })
   })
   ```

5. **Update Frontend**
   ```typescript
   // services/ticketmaster.ts
   export async function searchEventsByCity(cityName: string, ...) {
     const { data } = await supabase.functions.invoke('ticketmaster-proxy', {
       body: { city: cityName, category: 'music' }
     })
     return data
   }
   ```

---

## Next Steps

1. **Choose your stack** (Supabase recommended for fastest setup)
2. **Set up backend** (API proxy first to solve CORS)
3. **Migrate authentication** (replace localStorage)
4. **Set up database** (migrate mock data)
5. **Add real-time features** (chat, notifications)

Need help implementing any of these? Let me know which option you'd like to pursue!
