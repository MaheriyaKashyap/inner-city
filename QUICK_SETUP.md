# ⚡ Quick Supabase Setup

Since the CLI requires interactive login, here's the fastest way to complete setup:

## 🎯 3 Steps to Complete

### Step 1: Database Migration (2 minutes)

1. **Open SQL Editor**: https://app.supabase.com/project/gdsblffnkiswaweqokcm/sql/new

2. **Copy the SQL** from `supabase/migrations/001_initial_schema.sql` (or see below)

3. **Paste and Run** (Cmd/Ctrl + Enter)

4. **Wait for**: "Success. No rows returned"

---

### Step 2: Deploy Edge Functions (5 minutes)

**For ticketmaster-proxy:**

1. Go to: https://app.supabase.com/project/gdsblffnkiswaweqokcm/functions
2. Click **"Create a new function"**
3. **Name**: `ticketmaster-proxy`
4. **Copy** contents from: `supabase/functions/ticketmaster-proxy/index.ts`
5. **Paste** into editor
6. Click **"Deploy"**

**For eventbrite-proxy:**

1. Click **"Create a new function"** again
2. **Name**: `eventbrite-proxy`
3. **Copy** contents from: `supabase/functions/eventbrite-proxy/index.ts`
4. **Paste** into editor
5. Click **"Deploy"**

---

### Step 3: Set Secrets (1 minute)

1. In **Edge Functions** page, click **"Settings"** tab
2. Under **"Secrets"**, click **"Add secret"**
3. Add:
   - **Name**: `TICKETMASTER_API_KEY`
   - **Value**: `KQn9TlNEODUds0G80guxp9SAHnYF9jYg`
4. Click **"Add secret"** again:
   - **Name**: `EVENTBRITE_API_TOKEN`
   - **Value**: `XNQKAZVGU2ZB7AXITETR`

---

## ✅ Test

```bash
npm run dev
```

Open the app - CORS errors should be gone! 🎉

---

## 📋 Direct Links

- **SQL Editor**: https://app.supabase.com/project/gdsblffnkiswaweqokcm/sql/new
- **Edge Functions**: https://app.supabase.com/project/gdsblffnkiswaweqokcm/functions
- **Project Settings**: https://app.supabase.com/project/gdsblffnkiswaweqokcm/settings/api

---

## 📝 Migration SQL

The full SQL is in `supabase/migrations/001_initial_schema.sql`. Here's a preview:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  ...
);
```

**Copy the entire file** and paste into SQL Editor.

---

That's it! Once these 3 steps are done, your app will work without CORS errors.
