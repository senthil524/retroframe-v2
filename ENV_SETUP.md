# Environment Variables Setup

Create a `.env` file in the root of your project with the following variables:

```env
# Supabase Configuration
# Get these values from your Supabase project settings: https://app.supabase.com/project/_/settings/api

# Your Supabase project URL
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Your Supabase anonymous/public key (safe to expose in client-side code)
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Your Supabase service role key (KEEP THIS SECRET - only use in server-side code)
# This is optional but recommended for admin operations
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# PayU Configuration (for payment functions)
# These should be stored securely and used in Supabase Edge Functions, not in client code
# PAYU_MERCHANT_KEY=your-payu-merchant-key
# PAYU_MERCHANT_SALT=your-payu-merchant-salt
```

## How to Get Your Supabase Credentials

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy the values:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon public** key → Use for `VITE_SUPABASE_ANON_KEY`
   - **service_role** key → Use for `VITE_SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Important Security Notes

- ✅ **Safe to expose**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` can be exposed in client-side code
- ⚠️ **Keep secret**: `VITE_SUPABASE_SERVICE_ROLE_KEY` should NEVER be exposed in client-side code
- ⚠️ **PayU credentials**: Should only be used in Supabase Edge Functions or backend API routes

## After Setting Up

1. Restart your development server after adding/changing environment variables
2. Make sure `.env` is in your `.gitignore` file (don't commit secrets!)

