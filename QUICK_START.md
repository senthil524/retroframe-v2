# Quick Start Guide 🚀

Your Supabase database is fully set up! Follow these steps to get your app running.

## Step 1: Set Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://eoxhwqyxxahvnfcvquoa.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVveGh3cXl4eGFodm5mY3ZxdW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODIzMTgsImV4cCI6MjA4MDI1ODMxOH0.Y3cE-qYe1f970-Grr7sFyjKDeUkNe97dcTsyonHu6I0
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Start Development Server

```bash
npm run dev
```

## Step 4: Set Up Storage (Required for File Uploads)

1. Go to: https://app.supabase.com/project/eoxhwqyxxahvnfcvquoa/storage/buckets
2. Click "New bucket"
3. Create bucket named: `files`
4. Make it **Public**
5. Set policies:
   - **Public read access**
   - **Authenticated write access**

## Step 5: Test Your App

1. Open http://localhost:5173 (or the port shown in terminal)
2. Try uploading a photo
3. Test the checkout flow

## ⚠️ Important: PayU Functions

Before accepting real payments, you **must** implement PayU hash functions as Supabase Edge Functions:

1. Install Supabase CLI: `npm install -g supabase`
2. Create Edge Functions for `payuGenerateHash` and `payuVerifyHash`
3. Store PayU credentials as Supabase secrets

See `MIGRATION_GUIDE.md` for detailed instructions.

## ✅ What's Already Done

- ✅ All database tables created
- ✅ Row Level Security (RLS) configured
- ✅ Indexes created for performance
- ✅ RLS policies optimized
- ✅ SDK migration complete

## 📚 Need Help?

- **Full Setup Guide**: See `MIGRATION_GUIDE.md`
- **Environment Setup**: See `ENV_SETUP.md`
- **Supabase Dashboard**: https://app.supabase.com/project/eoxhwqyxxahvnfcvquoa

---

**You're all set!** 🎉


