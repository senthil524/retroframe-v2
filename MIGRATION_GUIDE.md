# Base44 to Supabase Migration Guide

This project has been migrated from Base44 to Supabase Cloud. This guide will help you complete the setup.

## ✅ What's Been Done

1. **SDK Migration**: Created a Base44-compatible SDK wrapper that uses Supabase
2. **API Compatibility**: All existing Base44 API calls will work without code changes
3. **Client Setup**: Updated `base44Client.js` to use the new Supabase SDK

## 📋 Setup Steps

### 1. Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Create a new project (or use an existing one)
3. Wait for the project to be fully provisioned

### 2. Get Your Supabase Credentials

1. Go to your Supabase project settings
2. Navigate to **Settings** → **API**
3. Copy the following:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`
   - **service_role key** → `VITE_SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### 3. Set Up Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials in `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

### 4. Create Database Tables

You need to create tables in Supabase that match your Base44 entities. Based on your code, you need these tables:

#### Required Tables:

1. **photos** - For photo storage and editing
2. **carts** - For shopping cart management
3. **orders** - For order management
4. **payments** - For payment tracking
5. **templates** - For photo frame templates
6. **order_counters** - For generating unique order numbers
7. **users** - For user profiles (optional, Supabase Auth handles authentication)

#### Example SQL for Creating Tables:

Run these in your Supabase SQL Editor:

```sql
-- Photos table
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id TEXT,
  order_id TEXT,
  image_url TEXT,
  cloud_url TEXT,
  border_color TEXT DEFAULT 'white',
  effect TEXT DEFAULT 'original',
  print_size TEXT DEFAULT 'vintage',
  caption TEXT,
  crop_data JSONB,
  original_width INTEGER,
  original_height INTEGER,
  upload_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Carts table
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id TEXT UNIQUE NOT NULL,
  session_started TIMESTAMP WITH TIME ZONE,
  total_items INTEGER,
  total_price DECIMAL(10, 2),
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  cart_id TEXT,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  delivery_address JSONB,
  total_items INTEGER,
  subtotal DECIMAL(10, 2),
  shipping_cost DECIMAL(10, 2),
  total_price DECIMAL(10, 2),
  order_status TEXT,
  payment_status TEXT,
  payment_method TEXT,
  payment_id UUID,
  estimated_delivery DATE,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT,
  cart_id TEXT,
  txnid TEXT UNIQUE,
  amount DECIMAL(10, 2),
  mihpayid TEXT,
  txn_status TEXT,
  unmapped_status TEXT,
  payment_status TEXT,
  payment_mode TEXT,
  card_category TEXT,
  bank_ref_num TEXT,
  bankcode TEXT,
  pg_type TEXT,
  error_code TEXT,
  error_message TEXT,
  card_num TEXT,
  name_on_card TEXT,
  net_amount_debit DECIMAL(10, 2),
  discount DECIMAL(10, 2),
  payu_response_hash TEXT,
  hash_verified BOOLEAN,
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  frame_type TEXT,
  border_color TEXT,
  effect TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  preview_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order counters table
CREATE TABLE IF NOT EXISTS order_counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  counter_name TEXT UNIQUE NOT NULL,
  current_value INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial order counter
INSERT INTO order_counters (counter_name, current_value) 
VALUES ('order_number', 0)
ON CONFLICT (counter_name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_photos_cart_id ON photos(cart_id);
CREATE INDEX IF NOT EXISTS idx_photos_order_id ON photos(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_cart_id ON orders(cart_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_number ON payments(order_number);
CREATE INDEX IF NOT EXISTS idx_payments_txnid ON payments(txnid);
CREATE INDEX IF NOT EXISTS idx_payments_cart_id ON payments(cart_id);
CREATE INDEX IF NOT EXISTS idx_carts_cart_id ON carts(cart_id);
```

### 5. Set Up Row Level Security (RLS)

Enable RLS on your tables and create policies. Here's a basic setup:

```sql
-- Enable RLS on all tables
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_counters ENABLE ROW LEVEL SECURITY;

-- Example: Allow public read access to templates
CREATE POLICY "Allow public read on templates" ON templates
  FOR SELECT USING (true);

-- Example: Allow authenticated users to manage their own orders
CREATE POLICY "Users can manage their own orders" ON orders
  FOR ALL USING (auth.uid()::text = customer_email);

-- Add more policies based on your security requirements
```

### 6. Set Up Supabase Storage

1. Go to **Storage** in your Supabase dashboard
2. Create buckets:
   - **files** - For public file uploads
   - **private-files** - For private file uploads (optional)
3. Set bucket policies:
   - **files**: Public read, authenticated write
   - **private-files**: Authenticated read/write

### 7. Implement PayU Functions (Required for Payments)

The PayU hash generation and verification functions need to be implemented as Supabase Edge Functions for security.

#### Option A: Supabase Edge Functions

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Initialize Supabase in your project:
   ```bash
   supabase init
   ```

3. Create Edge Functions:
   ```bash
   supabase functions new payu-generate-hash
   supabase functions new payu-verify-hash
   ```

4. Implement the functions with your PayU merchant key and salt (stored as secrets)

#### Option B: API Routes

Alternatively, you can create API routes in your backend that handle PayU hash generation/verification.

### 8. Test Your Migration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test key functionality:
   - User authentication
   - Entity CRUD operations
   - File uploads
   - Payment flow (after implementing PayU functions)

## 9. Edge Functions in Repo

The PayU Edge Functions now live inside this repo under `supabase/functions`, so you can edit and redeploy them without scaffolding anything manually:

- `supabase/functions/payu-generate-hash/index.ts`
- `supabase/functions/payu-verify-hash/index.ts`

Each function reads `PAYU_MERCHANT_KEY` and `PAYU_MERCHANT_SALT` from Supabase secrets, but also falls back to the values you supplied so development works immediately. To override with secrets (recommended for production):

```bash
supabase secrets set PAYU_MERCHANT_KEY=your_key PAYU_MERCHANT_SALT=your_salt
supabase functions deploy payu-generate-hash
supabase functions deploy payu-verify-hash
```

## 🔧 Customization

### Field Name Mapping

If your Supabase table columns don't match Base44 field names exactly, update the `mapFieldName` function in `src/lib/base44-supabase-sdk.js`.

### Authentication

The SDK uses Supabase Auth. To customize authentication:
- Update the `auth` object in `src/lib/base44-supabase-sdk.js`
- Configure authentication providers in Supabase dashboard

### Integrations

The following integrations need implementation:
- **SendEmail**: Implement with Resend, SendGrid, or similar
- **InvokeLLM**: Implement with OpenAI or similar
- **GenerateImage**: Implement with DALL-E or similar
- **ExtractDataFromUploadedFile**: Implement with OCR service

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## ⚠️ Important Notes

1. **PayU Functions**: The PayU hash functions MUST be implemented on the backend. Never expose your PayU merchant key and salt in client-side code.

2. **Service Role Key**: Keep `VITE_SUPABASE_SERVICE_ROLE_KEY` secret. Only use it in server-side code or Supabase Edge Functions.

3. **Data Migration**: If you have existing data in Base44, you'll need to export it and import it into Supabase.

4. **Testing**: Thoroughly test all functionality, especially payment flows, before deploying to production.

## 🆘 Troubleshooting

### "Missing Supabase environment variables" error
- Make sure your `.env` file exists and has the correct variable names
- Restart your development server after adding environment variables

### "relation does not exist" error
- Make sure you've created all required tables in Supabase
- Check that table names match (they should be lowercase)

### Authentication not working
- Check your Supabase Auth settings
- Verify RLS policies allow the operations you're trying to perform

### File uploads failing
- Make sure Storage buckets are created
- Check bucket policies allow uploads
- Verify the bucket name matches in your code

## 📞 Support

For issues with the migration SDK, refer to:
- [Base44 to Supabase SDK Repository](https://github.com/Ai-Automators/base44-to-supabase-sdk)

For Supabase-specific issues:
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub Discussions](https://github.com/supabase/supabase/discussions)

