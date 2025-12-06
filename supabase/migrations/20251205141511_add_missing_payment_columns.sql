-- Add missing columns to payments table for checkout flow
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS product_info TEXT,
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS customer_phone TEXT;
