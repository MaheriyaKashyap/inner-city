# ⚠️ Important: Two Different Things!

You're setting up **two separate things** that use **different code**:

## 1️⃣ Database Migration (SQL Editor)

**File**: `supabase/migrations/001_initial_schema.sql`  
**Location**: SQL Editor in Supabase Dashboard  
**Content**: SQL code (starts with `CREATE EXTENSION`, `CREATE TABLE`, etc.)

**Steps:**
1. Go to: https://app.supabase.com/project/gdsblffnkiswaweqokcm/sql/new
2. Copy from: `supabase/migrations/001_initial_schema.sql` ✅ (Just copied to clipboard!)
3. Paste into SQL Editor
4. Click "Run"

**This creates the database tables.**

---

## 2️⃣ Edge Functions (Functions Editor)

**Files**: 
- `supabase/functions/ticketmaster-proxy/index.ts`
- `supabase/functions/eventbrite-proxy/index.ts`

**Location**: Edge Functions page in Supabase Dashboard  
**Content**: TypeScript/Deno code (starts with `import { serve }`)

**Steps:**
1. Go to: https://app.supabase.com/project/gdsblffnkiswaweqokcm/functions
2. Click "Create a new function"
3. Name: `ticketmaster-proxy`
4. Copy from: `supabase/functions/ticketmaster-proxy/index.ts`
5. Paste into Functions editor (NOT SQL Editor!)
6. Click "Deploy"

**This creates the API proxies.**

---

## ❌ Common Mistake

**DON'T paste Edge Function code (TypeScript) into SQL Editor!**

- SQL Editor = Only SQL code
- Functions Editor = TypeScript/Deno code

---

## ✅ Correct Order

1. **First**: Run SQL migration in SQL Editor
2. **Second**: Deploy Edge Functions in Functions page
3. **Third**: Set secrets in Functions Settings

---

The migration SQL is now in your clipboard - paste it into the SQL Editor! 🎯
