# 🔐 Set Edge Function Secrets

Your Edge Functions are deployed! ✅ Now set the API keys as secrets.

## 🎯 Direct Link

**Functions Settings**: https://app.supabase.com/project/gdsblffnkiswaweqokcm/functions

(I've opened this for you)

---

## 📝 Step-by-Step

### 1. Go to Functions Settings

1. Go to: https://app.supabase.com/project/gdsblffnkiswaweqokcm/functions
2. Click the **"Settings"** tab (at the top, next to "Functions")

### 2. Add First Secret

1. Scroll down to **"Secrets"** section
2. Click **"Add secret"** button
3. Enter:
   - **Name**: `TICKETMASTER_API_KEY`
   - **Value**: `KQn9TlNEODUds0G80guxp9SAHnYF9jYg`
4. Click **"Save"** or **"Add"**

### 3. Add Second Secret

1. Click **"Add secret"** again
2. Enter:
   - **Name**: `EVENTBRITE_API_TOKEN`
   - **Value**: `XNQKAZVGU2ZB7AXITETR`
3. Click **"Save"** or **"Add"**

---

## ✅ Verify

After setting secrets, the functions will automatically restart and use them.

You can test by running:
```bash
npm run dev
```

Then check the browser console - CORS errors should be gone! 🎉

---

## 📋 What Secrets Do

These secrets are stored securely on Supabase's servers and are:
- ✅ Not exposed to the browser
- ✅ Only accessible by Edge Functions
- ✅ Encrypted at rest

This is much more secure than putting API keys in your frontend code!

---

**Direct link**: https://app.supabase.com/project/gdsblffnkiswaweqokcm/functions

Click the "Settings" tab to add secrets! 🔐
