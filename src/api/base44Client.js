// Migrated from Base44 to Supabase
// This is a drop-in replacement that maintains 100% API compatibility
import { createClient } from '@/lib/base44-supabase-sdk';

// Create a client with authentication required
// The appId is kept for compatibility but not used with Supabase
export const base44 = createClient({
  appId: "6910e083dc994964b8c23d88", 
  requiresAuth: true // Ensure authentication is required for all operations
});
