# 📍 Where to Add Edge Functions in Supabase

## 🎯 Direct Link

**Edge Functions Page**: https://app.supabase.com/project/gdsblffnkiswaweqokcm/functions

(I've opened this for you)

---

## 📝 Step-by-Step

### Step 1: Go to Edge Functions

1. Go to your Supabase dashboard: https://app.supabase.com/project/gdsblffnkiswaweqokcm
2. In the left sidebar, click **"Edge Functions"** (under "Project" section)
3. Or use direct link: https://app.supabase.com/project/gdsblffnkiswaweqokcm/functions

### Step 2: Create New Function

1. Click the **"Create a new function"** button (usually top right)
2. You'll see a code editor appear

### Step 3: Name Your Function

1. At the top, you'll see a function name field
2. Type: `ticketmaster-proxy` (for the first function)
3. Or: `eventbrite-proxy` (for the second function)

### Step 4: Paste the Code

1. Copy the contents from:
   - `supabase/functions/ticketmaster-proxy/index.ts` (for ticketmaster-proxy)
   - `supabase/functions/eventbrite-proxy/index.ts` (for eventbrite-proxy)
2. Paste into the code editor
3. Click **"Deploy"** button

---

## 🎯 Visual Guide

```
Supabase Dashboard
├── Project Settings
├── Database
├── Authentication
├── Storage
├── Edge Functions  ← CLICK HERE!
│   ├── [Create a new function] button
│   └── Functions list (after creation)
├── Logs
└── Settings
```

---

## ✅ Quick Copy Commands

**For ticketmaster-proxy:**
```bash
cat supabase/functions/ticketmaster-proxy/index.ts | pbcopy
```

**For eventbrite-proxy:**
```bash
cat supabase/functions/eventbrite-proxy/index.ts | pbcopy
```

---

## 📋 What You'll See

After clicking "Create a new function", you'll see:
- A code editor (like VS Code)
- Function name field at the top
- "Deploy" button
- Default Deno/TypeScript template

Just replace the template code with your function code!

---

**Direct link again**: https://app.supabase.com/project/gdsblffnkiswaweqokcm/functions
