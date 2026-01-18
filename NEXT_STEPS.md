# Next Steps for Supabase Setup

Your Supabase credentials have been added to `.env.local`. Now complete these steps:

## ✅ Step 1: Supabase Credentials ✓

Your Supabase credentials are configured:
- ✅ URL: `https://gdsblffnkiswaweqokcm.supabase.co`
- ✅ Anon Key: Configured (JWT token)

## ✅ Step 2: Run Database Migration

1. Go to your Supabase dashboard: https://app.supabase.com/project/gdsblffnkiswaweqokcm
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
5. Paste into the SQL editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Wait for "Success. No rows returned"

This creates all the database tables and security policies.

## ✅ Step 3: Deploy Edge Functions

Edge Functions solve the CORS problem by proxying API calls through Supabase.

### Option A: Using Supabase Dashboard (Easiest)

1. In Supabase dashboard, go to **Edge Functions**
2. Click **Create a new function**
3. Name it: `ticketmaster-proxy`
4. Copy the contents of `supabase/functions/ticketmaster-proxy/index.ts`
5. Paste into the editor
6. Click **Deploy**
7. Repeat for `eventbrite-proxy`

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project (get project ref from Settings → General)
supabase link --project-ref gdsblffnkiswaweqokcm

# Deploy functions
supabase functions deploy ticketmaster-proxy
supabase functions deploy eventbrite-proxy
```

## ✅ Step 4: Set Edge Function Secrets

Edge Functions need your API keys to work:

1. In Supabase dashboard → **Edge Functions** → **Settings**
2. Add these secrets:
   - **Name**: `TICKETMASTER_API_KEY`
     **Value**: `KQn9TlNEODUds0G80guxp9SAHnYF9jYg`
   - **Name**: `EVENTBRITE_API_TOKEN`
     **Value**: `XNQKAZVGU2ZB7AXITETR`

## ✅ Step 5: Test the Setup

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser
3. Check the console - you should see:
   - ✅ No CORS errors
   - ✅ Events loading successfully
   - ✅ Supabase connection working

## 🎯 What This Fixes

- ✅ **CORS Errors**: Edge Functions proxy API calls, eliminating CORS issues
- ✅ **Rate Limiting**: Better handling of API rate limits
- ✅ **Security**: API keys are stored server-side, not exposed to browser
- ✅ **Scalability**: Ready for production use

## 📝 Quick Checklist

- [ ] Verify Supabase anon key is correct (starts with `eyJ`)
- [ ] Run database migration (`001_initial_schema.sql`)
- [ ] Deploy `ticketmaster-proxy` Edge Function
- [ ] Deploy `eventbrite-proxy` Edge Function
- [ ] Set Edge Function secrets (TICKETMASTER_API_KEY, EVENTBRITE_API_TOKEN)
- [ ] Test the app - no CORS errors!

## 🆘 Troubleshooting

**"Function not found" error:**
- Make sure Edge Functions are deployed
- Check function names match exactly: `ticketmaster-proxy` and `eventbrite-proxy`

**"Unauthorized" error:**
- Verify your Supabase anon key is correct
- Check `.env.local` has the right values

**Still seeing CORS errors:**
- Make sure Edge Functions are deployed and secrets are set
- Check browser console for specific error messages

## 🚀 After Setup

Once everything is working:
1. Update `store.tsx` to use Supabase for user authentication
2. Replace localStorage with Supabase database
3. Add real-time features (chat, notifications)
4. Set up file uploads for avatars/images

Need help? Check `SUPABASE_SETUP.md` for detailed instructions.
