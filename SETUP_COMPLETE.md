# 🚀 Supabase Setup - Ready to Complete

I've prepared everything for you! Here's what's ready:

## ✅ What's Done

1. **Supabase CLI installed** via Homebrew
2. **Credentials configured** in `.env.local`
3. **All files created**:
   - Database migration: `supabase/migrations/001_initial_schema.sql`
   - Edge Functions: `supabase/functions/ticketmaster-proxy/` and `eventbrite-proxy/`
   - Setup scripts ready

## 🎯 Quick Setup (Choose One)

### Option A: Automated Script (Recommended)

Run this interactive script - it will guide you through everything:

```bash
./scripts/complete-setup.sh
```

This script will:
1. Login to Supabase (opens browser)
2. Link your project
3. Run database migration
4. Deploy Edge Functions
5. Set API key secrets

**Just follow the prompts!**

### Option B: Manual Setup (If script doesn't work)

#### 1. Run Database Migration

1. Go to: https://app.supabase.com/project/gdsblffnkiswaweqokcm/sql/new
2. Open `supabase/migrations/001_initial_schema.sql` in your editor
3. Copy the entire contents
4. Paste into Supabase SQL Editor
5. Click **Run** (or Cmd/Ctrl + Enter)
6. Wait for "Success. No rows returned"

#### 2. Deploy Edge Functions

**Via Dashboard (Easiest):**

1. Go to: https://app.supabase.com/project/gdsblffnkiswaweqokcm/functions
2. Click **"Create a new function"**
3. Name: `ticketmaster-proxy`
4. Copy contents from: `supabase/functions/ticketmaster-proxy/index.ts`
5. Paste into editor
6. Click **Deploy**
7. Repeat for `eventbrite-proxy`

**Via CLI:**

```bash
# Login first
supabase login

# Link project
supabase link --project-ref gdsblffnkiswaweqokcm

# Deploy functions
supabase functions deploy ticketmaster-proxy --no-verify-jwt
supabase functions deploy eventbrite-proxy --no-verify-jwt
```

#### 3. Set Edge Function Secrets

**Via Dashboard:**

1. Go to: https://app.supabase.com/project/gdsblffnkiswaweqokcm/functions
2. Click **Settings** tab
3. Under **Secrets**, add:
   - `TICKETMASTER_API_KEY` = `KQn9TlNEODUds0G80guxp9SAHnYF9jYg`
   - `EVENTBRITE_API_TOKEN` = `XNQKAZVGU2ZB7AXITETR`

**Via CLI (after login):**

```bash
supabase secrets set TICKETMASTER_API_KEY=KQn9TlNEODUds0G80guxp9SAHnYF9jYg
supabase secrets set EVENTBRITE_API_TOKEN=XNQKAZVGU2ZB7AXITETR
```

## ✅ Test It

After completing setup:

```bash
npm run dev
```

Open the app and check:
- ✅ Console shows "✅ Supabase connected"
- ✅ No CORS errors
- ✅ Events loading successfully

## 📁 Files Created

- `lib/supabase.ts` - Supabase client configuration
- `supabase/migrations/001_initial_schema.sql` - Database schema
- `supabase/functions/ticketmaster-proxy/index.ts` - API proxy function
- `supabase/functions/eventbrite-proxy/index.ts` - API proxy function
- `supabase/functions/_shared/cors.ts` - CORS headers
- `scripts/complete-setup.sh` - Automated setup script
- `.env.local` - Your credentials (already configured)

## 🆘 Troubleshooting

**"Function not found" error:**
- Make sure Edge Functions are deployed
- Check function names: `ticketmaster-proxy` and `eventbrite-proxy`

**"Unauthorized" error:**
- Verify `.env.local` has correct Supabase URL and anon key
- Check Supabase project is active

**Still seeing CORS errors:**
- Verify Edge Functions are deployed
- Check Edge Function secrets are set
- Make sure functions are accessible (check Supabase dashboard)

## 🎉 You're Ready!

Run the setup script or follow the manual steps above. Once done, your app will have:
- ✅ No CORS errors
- ✅ Working API proxies
- ✅ Database ready for users/events
- ✅ Production-ready architecture
