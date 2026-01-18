# Supabase Quick Start

## 🚀 Quick Setup (5 minutes)

### 1. Get Your Supabase Credentials

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Create a new project (or use existing)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

### 2. Add to `.env.local`

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Run Database Migration

1. In Supabase dashboard → **SQL Editor**
2. Click "New query"
3. Copy/paste contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run"

### 4. Deploy Edge Functions

**Option A: Supabase Dashboard** (Easiest)
1. Go to **Edge Functions** → **Create function**
2. Name: `ticketmaster-proxy`
3. Copy/paste from `supabase/functions/ticketmaster-proxy/index.ts`
4. Click "Deploy"
5. Repeat for `eventbrite-proxy`

**Option B: Supabase CLI**
```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
supabase functions deploy ticketmaster-proxy
supabase functions deploy eventbrite-proxy
```

### 5. Set Edge Function Secrets

In Supabase dashboard → **Edge Functions** → **Settings**:
- Add `TICKETMASTER_API_KEY` = your key
- Add `EVENTBRITE_API_TOKEN` = your token

### 6. Test It!

```bash
npm run dev
```

Open the app - CORS errors should be gone! 🎉

## 📚 Full Guide

See `SUPABASE_SETUP.md` for detailed instructions.
