# 📍 Where to Add Edge Functions

## 🎯 Direct Link (I've opened this for you)

**Edge Functions Page**: https://app.supabase.com/project/gdsblffnkiswaweqokcm/functions

---

## 📝 Exact Steps

### 1. Go to Edge Functions Page

**Option A**: Click the link above  
**Option B**: 
1. Go to: https://app.supabase.com/project/gdsblffnkiswaweqokcm
2. In the **left sidebar**, find **"Edge Functions"** (under "Project" section)
3. Click it

### 2. Create the Function

1. You'll see a page with a list of functions (probably empty)
2. Click the **"Create a new function"** button (usually blue, top right)
3. A code editor will appear

### 3. Name It

1. At the **top of the editor**, you'll see a field for the function name
2. Type: `ticketmaster-proxy`
3. (Don't include `.ts` or any extension, just the name)

### 4. Paste the Code

1. The code is **already in your clipboard** ✅
2. **Delete** any default/template code in the editor
3. **Paste** your code (Cmd/Ctrl + V)
4. You should see code starting with `import { serve } from 'https://deno.land/...`

### 5. Deploy

1. Click the **"Deploy"** button (usually bottom right or top right)
2. Wait for "Deployed successfully" message

---

## 🔄 Repeat for Second Function

After `ticketmaster-proxy` is deployed:

1. Click **"Create a new function"** again
2. Name: `eventbrite-proxy`
3. Copy from: `supabase/functions/eventbrite-proxy/index.ts`
4. Paste and deploy

---

## 📸 What It Looks Like

```
┌─────────────────────────────────────────┐
│  Edge Functions                          │
│  [Create a new function] ← Click here    │
├─────────────────────────────────────────┤
│                                          │
│  Function name: [ticketmaster-proxy]     │
│                                          │
│  ┌─────────────────────────────────┐   │
│  │ import { serve } from ...        │   │
│  │ const corsHeaders = { ...        │   │
│  │ serve(async (req) => { ...       │   │
│  │   // Your code here              │   │
│  └─────────────────────────────────┘   │
│                                          │
│  [Deploy] ← Click to deploy             │
└─────────────────────────────────────────┘
```

---

## ✅ Quick Checklist

- [ ] Go to Edge Functions page
- [ ] Click "Create a new function"
- [ ] Name: `ticketmaster-proxy`
- [ ] Paste code (already in clipboard)
- [ ] Click "Deploy"
- [ ] Repeat for `eventbrite-proxy`

---

**Direct link**: https://app.supabase.com/project/gdsblffnkiswaweqokcm/functions

The code is ready in your clipboard! 🎯
