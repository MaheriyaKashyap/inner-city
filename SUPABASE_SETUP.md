# Supabase Setup Guide

This guide will help you set up Supabase for the Inner City app.

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: `inner-city` (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project to be created (2-3 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

1. Create a `.env.local` file in the project root (if it doesn't exist)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Also add your API keys (if you have them):

```env
TICKETMASTER_API_KEY=your_ticketmaster_key_here
EVENTBRITE_API_TOKEN=your_eventbrite_token_here
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

## Step 4: Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run" (or press Cmd/Ctrl + Enter)
5. Wait for the migration to complete

This creates:
- `profiles` table (user profiles)
- `cities` table
- `events` table
- `saved_events` table
- `tickets` table
- `chat_messages` table
- `notifications` table
- Row Level Security (RLS) policies
- Automatic profile creation on signup

## Step 5: Deploy Edge Functions

Edge Functions are serverless functions that run on Supabase's edge network. They solve CORS issues by proxying API calls.

### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   (Find your project ref in Settings → General → Reference ID)

4. Deploy functions:
   ```bash
   supabase functions deploy ticketmaster-proxy
   supabase functions deploy eventbrite-proxy
   ```

### Option B: Using Supabase Dashboard

1. Go to **Edge Functions** in your Supabase dashboard
2. Click "Create a new function"
3. Name it `ticketmaster-proxy`
4. Copy the contents of `supabase/functions/ticketmaster-proxy/index.ts`
5. Paste into the editor
6. Click "Deploy"
7. Repeat for `eventbrite-proxy`

## Step 6: Set Up Edge Function Secrets

Edge Functions need access to your API keys. Set them as secrets:

### Using Supabase CLI:
```bash
supabase secrets set TICKETMASTER_API_KEY=your_key_here
supabase secrets set EVENTBRITE_API_TOKEN=your_token_here
```

### Using Supabase Dashboard:
1. Go to **Edge Functions** → **Settings**
2. Add secrets:
   - `TICKETMASTER_API_KEY` = your Ticketmaster API key
   - `EVENTBRITE_API_TOKEN` = your Eventbrite API token

## Step 7: Test the Setup

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser
3. Check the browser console - you should see:
   - No CORS errors
   - Events loading from Ticketmaster/Eventbrite (if API keys are set)

## Step 8: Set Up Authentication (Optional)

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable providers you want:
   - **Email** (enabled by default)
   - **Google** (optional)
   - **Apple** (optional)
   - **GitHub** (optional)

3. Configure each provider with their OAuth credentials

## Step 9: Update Vercel Environment Variables

If deploying to Vercel, add your Supabase credentials:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
   - `TICKETMASTER_API_KEY` = your Ticketmaster key (for Edge Functions)
   - `EVENTBRITE_API_TOKEN` = your Eventbrite token (for Edge Functions)

**Note**: Edge Function secrets are set in Supabase, not Vercel.

## Troubleshooting

### CORS Errors Still Appearing
- Make sure Edge Functions are deployed
- Check that `VITE_SUPABASE_URL` is set correctly
- Verify Edge Functions are accessible (check Supabase dashboard)

### Edge Functions Returning Errors
- Check Edge Function logs in Supabase dashboard
- Verify secrets are set correctly
- Make sure API keys are valid

### Database Errors
- Verify migration ran successfully
- Check RLS policies are enabled
- Ensure user is authenticated (for protected operations)

## Next Steps

1. **Update store.tsx** to use Supabase for:
   - User authentication
   - Saved events
   - Notifications

2. **Add real-time features**:
   - Chat rooms using Supabase Realtime
   - Live notifications

3. **Set up file uploads**:
   - User avatars
   - Event images
   - Use Supabase Storage

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
