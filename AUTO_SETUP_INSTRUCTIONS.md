# 🚀 Automated Setup Instructions

I've verified your Supabase connection works! ✅

Since the CLI requires interactive login, here's the **fastest manual setup** (takes ~5 minutes):

## ⚡ Quick Setup (3 Steps)

### ✅ Step 1: Database Migration

**I've opened the SQL Editor for you.** If it didn't open, go to:
https://app.supabase.com/project/gdsblffnkiswaweqokcm/sql/new

1. **Copy** the entire contents of `supabase/migrations/001_initial_schema.sql`
2. **Paste** into the SQL Editor
3. Click **"Run"** (or press Cmd/Ctrl + Enter)
4. Wait for "Success. No rows returned"

**Quick copy command:**
```bash
cat supabase/migrations/001_initial_schema.sql | pbcopy
```
(This copies the SQL to your clipboard on Mac)

---

### ✅ Step 2: Deploy Edge Functions

**I've opened the Functions page for you.** If it didn't open, go to:
https://app.supabase.com/project/gdsblffnkiswaweqokcm/functions

#### Function 1: ticketmaster-proxy

1. Click **"Create a new function"**
2. **Name**: `ticketmaster-proxy`
3. **Copy** from: `supabase/functions/ticketmaster-proxy/index.ts`
   ```bash
   cat supabase/functions/ticketmaster-proxy/index.ts | pbcopy
   ```
4. **Paste** into editor
5. Click **"Deploy"**

#### Function 2: eventbrite-proxy

1. Click **"Create a new function"** again
2. **Name**: `eventbrite-proxy`
3. **Copy** from: `supabase/functions/eventbrite-proxy/index.ts`
   ```bash
   cat supabase/functions/eventbrite-proxy/index.ts | pbcopy
   ```
4. **Paste** into editor
5. Click **"Deploy"**

---

### ✅ Step 3: Set Secrets

1. In the **Edge Functions** page, click **"Settings"** tab
2. Under **"Secrets"**, click **"Add secret"**
3. Add first secret:
   - **Name**: `TICKETMASTER_API_KEY`
   - **Value**: `KQn9TlNEODUds0G80guxp9SAHnYF9jYg`
4. Click **"Add secret"** again:
   - **Name**: `EVENTBRITE_API_TOKEN`
   - **Value**: `XNQKAZVGU2ZB7AXITETR`

---

## ✅ Test It!

After completing all 3 steps:

```bash
npm run dev
```

Open the app and check:
- ✅ Console shows "✅ Supabase connected"
- ✅ No CORS errors
- ✅ Events loading successfully

---

## 📋 What Each Step Does

1. **Migration**: Creates database tables (profiles, events, tickets, etc.)
2. **Edge Functions**: Creates API proxies that solve CORS issues
3. **Secrets**: Stores API keys securely (not exposed to browser)

---

## 🎯 Status

- ✅ Supabase CLI installed
- ✅ Credentials configured
- ✅ Connection verified
- ✅ All files ready
- ⏳ **Waiting for you to complete the 3 steps above**

Once done, your app will be production-ready! 🚀
