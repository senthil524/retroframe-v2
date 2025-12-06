# Supabase Setup Complete ✅

Your Supabase database has been fully configured! Here are your credentials and setup details.

## 🔑 Supabase Credentials

**Project URL:**
```
https://eoxhwqyxxahvnfcvquoa.supabase.co
```

**Anon Key (Public):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVveGh3cXl4eGFodm5mY3ZxdW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODIzMTgsImV4cCI6MjA4MDI1ODMxOH0.Y3cE-qYe1f970-Grr7sFyjKDeUkNe97dcTsyonHu6I0
```

## 📝 Environment Variables

Add these to your `.env` file:

```env
VITE_SUPABASE_URL=https://eoxhwqyxxahvnfcvquoa.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVveGh3cXl4eGFodm5mY3ZxdW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODIzMTgsImV4cCI6MjA4MDI1ODMxOH0.Y3cE-qYe1f970-Grr7sFyjKDeUkNe97dcTsyonHu6I0
```

**Note:** The service role key should be kept secret and only used in server-side code or Supabase Edge Functions. Get it from your Supabase dashboard: Settings → API → service_role key.

## ✅ Database Tables Created

All required tables have been created:

1. ✅ **photos** - Photo storage and editing data
2. ✅ **carts** - Shopping cart management
3. ✅ **orders** - Order management
4. ✅ **payments** - Payment tracking
5. ✅ **templates** - Photo frame templates
6. ✅ **order_counters** - Order number generation

## 🔒 Row Level Security (RLS)

RLS has been enabled on all tables with the following policies:

- **Templates**: Public read access, authenticated users can manage
- **Photos**: Open access (can be restricted based on your needs)
- **Carts**: Open access (session-based)
- **Orders**: Users can view their own orders, public creation allowed
- **Payments**: Users can view their own payments, public creation/updates allowed
- **Order Counters**: Authenticated users can manage

## 📦 Storage Buckets Setup

You need to create storage buckets manually:

1. Go to your Supabase dashboard: https://app.supabase.com/project/eoxhwqyxxahvnfcvquoa/storage/buckets
2. Create the following buckets:

   **`files`** (Public):
   - Public bucket for uploaded photos
   - Policy: Public read, authenticated write

   **`private-files`** (Optional):
   - Private bucket for sensitive files
   - Policy: Authenticated read/write

## 🚀 Next Steps

1. **Set up environment variables:**
   ```bash
   # Create .env file
   cp ENV_SETUP.md .env
   # Edit .env with the credentials above
   ```

2. **Create storage buckets** (see above)

3. **Implement PayU Edge Functions:**
   - Create Supabase Edge Functions for `payuGenerateHash` and `payuVerifyHash`
   - Store PayU credentials as Supabase secrets
   - See MIGRATION_GUIDE.md for details

4. **Test your application:**
   ```bash
   npm run dev
   ```

## 🔍 Verify Setup

You can verify your setup by:

1. Checking tables in Supabase dashboard
2. Testing entity operations in your app
3. Checking RLS policies are working correctly

## 📚 Resources

- Supabase Dashboard: https://app.supabase.com/project/eoxhwqyxxahvnfcvquoa
- API Documentation: https://eoxhwqyxxahvnfcvquoa.supabase.co/docs
- Migration Guide: See `MIGRATION_GUIDE.md`

## ⚠️ Important Notes

1. **Service Role Key**: Keep this secret! Only use in server-side code or Edge Functions.
2. **RLS Policies**: Review and adjust RLS policies based on your security requirements.
3. **Storage**: Make sure to set up storage buckets before testing file uploads.
4. **PayU Functions**: These MUST be implemented as Edge Functions for security.

## ✅ Performance Optimizations

RLS policies have been optimized for better performance:
- All `auth.role()` calls use subquery pattern `(SELECT auth.role())` to avoid re-evaluation
- Policies are optimized to reduce query overhead

**Note:** The "unused index" warnings are normal - indexes will be used once your app starts running queries.

## ⚙️ PayU Edge Functions

Two Supabase Edge Functions are deployed and wired into the app:

- `payu-generate-hash`
- `payu-verify-hash`

Before using them, set the required secrets (replace placeholders with your real credentials):

```bash
supabase secrets set PAYU_MERCHANT_KEY=your_key PAYU_MERCHANT_SALT=your_salt
```

Both the checkout page and the payment callback now call these Edge Functions via the new SDK, so no additional frontend changes are needed once the secrets are configured.

---

**Setup completed on:** 2025-01-02  
**Migrations applied:** 8 migrations successfully applied

