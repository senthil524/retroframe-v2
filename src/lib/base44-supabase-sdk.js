import { supabase, supabaseAdmin } from './supabase-client';

/**
 * Base44 to Supabase Migration SDK
 * Universal drop-in replacement for Base44 SDK
 * Maintains 100% API compatibility with Base44
 */

// Entity cache to avoid repeated table checks
const entityCache = new Map();

// Map Base44 entity names to Supabase table names
const entityToTableMap = {
  Photo: 'photos',
  Cart: 'carts',
  Order: 'orders',
  Payment: 'payments',
  Template: 'templates',
  OrderCounter: 'order_counters'
};

/**
 * Convert Base44 field names to Supabase column names
 * Handles common naming conventions
 */
function mapFieldName(fieldName) {
  // Base44 uses snake_case, Supabase typically uses snake_case too
  // But handle any special cases here
  const fieldMap = {
    // Add any specific field mappings if needed
  };
  return fieldMap[fieldName] || fieldName;
}

/**
 * Convert Supabase response to Base44 format
 */
function formatResponse(data, error) {
  if (error) {
    throw new Error(error.message || 'Database operation failed');
  }
  return data;
}

/**
 * Create an entity handler that mimics Base44 entity API
 */
function createEntityHandler(entityName) {
  const tableName = entityToTableMap[entityName] || entityName.toLowerCase();
  
  return {
    /**
     * List all records with optional ordering
     * @param {string} orderBy - Order by field (e.g., '-created_date' for descending)
     */
    async list(orderBy = null) {
      try {
        let query = supabase.from(tableName).select('*');
        
        if (orderBy) {
          const isDesc = orderBy.startsWith('-');
          const field = isDesc ? orderBy.substring(1) : orderBy;
          query = query.order(field, { ascending: !isDesc });
        }
        
        const { data, error } = await query;
        return formatResponse(data || [], error);
      } catch (err) {
        console.error(`Error listing ${entityName}:`, err);
        throw err;
      }
    },

    /**
     * Filter records by conditions
     * @param {object} conditions - Filter conditions (e.g., { order_number: '123' })
     */
    async filter(conditions = {}) {
      try {
        let query = supabase.from(tableName).select('*');
        
        // Apply filters
        Object.entries(conditions).forEach(([key, value]) => {
          const mappedKey = mapFieldName(key);
          if (value === null || value === undefined) {
            query = query.is(mappedKey, null);
          } else if (Array.isArray(value)) {
            query = query.in(mappedKey, value);
          } else {
            query = query.eq(mappedKey, value);
          }
        });
        
        const { data, error } = await query;
        return formatResponse(data || [], error);
      } catch (err) {
        console.error(`Error filtering ${entityName}:`, err);
        throw err;
      }
    },

    /**
     * Get a single record by ID
     * @param {string|number} id - Record ID
     */
    async get(id) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('id', id)
          .single();
        
        return formatResponse(data, error);
      } catch (err) {
        console.error(`Error getting ${entityName}:`, err);
        throw err;
      }
    },

    /**
     * Create a new record
     * @param {object} data - Record data
     */
    async create(data) {
      try {
        // Map field names if needed
        const mappedData = {};
        Object.entries(data).forEach(([key, value]) => {
          mappedData[mapFieldName(key)] = value;
        });

        // Special-case Cart: use upsert on cart_id to avoid duplicate key errors
        const queryBuilder = supabase.from(tableName);
        let query;

        if (entityName === 'Cart' && 'cart_id' in mappedData) {
          query = queryBuilder
            .upsert(mappedData, { onConflict: 'cart_id' })
            .select()
            .single();
        } else {
          query = queryBuilder.insert(mappedData).select().single();
        }

        const { data: result, error } = await query;
        
        return formatResponse(result, error);
      } catch (err) {
        console.error(`Error creating ${entityName}:`, err);
        throw err;
      }
    },

    /**
     * Update a record
     * @param {string|number} id - Record ID
     * @param {object} data - Update data
     */
    async update(id, data) {
      try {
        // Map field names if needed
        const mappedData = {};
        Object.entries(data).forEach(([key, value]) => {
          mappedData[mapFieldName(key)] = value;
        });
        
        const { data: result, error } = await supabase
          .from(tableName)
          .update(mappedData)
          .eq('id', id)
          .select()
          .single();
        
        return formatResponse(result, error);
      } catch (err) {
        console.error(`Error updating ${entityName}:`, err);
        throw err;
      }
    },

    /**
     * Delete a record
     * @param {string|number} id - Record ID
     */
    async delete(id) {
      try {
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return { success: true };
      } catch (err) {
        console.error(`Error deleting ${entityName}:`, err);
        throw err;
      }
    }
  };
}

/**
 * Create Base44-compatible client
 */
export function createClient(config = {}) {
  const { appId, requiresAuth = false } = config;
  
  // Entities handler - creates entity handlers on demand
  const entities = new Proxy({}, {
    get(target, entityName) {
      if (!entityCache.has(entityName)) {
        entityCache.set(entityName, createEntityHandler(entityName));
      }
      return entityCache.get(entityName);
    }
  });

  // Auth handler
  const auth = {
    /**
     * Check if user is authenticated
     */
    async isAuthenticated() {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    },

    /**
     * Get current user
     */
    async me() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      // Get user profile from users table if it exists
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        return profile || {
          id: user.id,
          email: user.email,
          role: user.user_metadata?.role || 'user',
          ...user.user_metadata
        };
      }
      return null;
    },

    /**
     * Login with email and password
     */
    async login(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    },

    /**
     * Sign up with email and password
     */
    async signUp(email, password, metadata = {}) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      if (error) throw error;
      return data;
    },

    /**
     * Logout
     */
    async logout(redirectTo = '/') {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      if (redirectTo && typeof window !== 'undefined') {
        window.location.href = redirectTo;
      }
    },

    /**
     * Redirect to login page
     */
    redirectToLogin(returnUrl = '/') {
      if (typeof window !== 'undefined') {
        // You can customize this to your login page
        const loginUrl = `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
        window.location.href = loginUrl;
      }
    },

    /**
     * Get current session
     */
    async getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  };

  // Functions handler
  const functions = {
    /**
     * PayU Hash Generation
     * WARNING: This should be moved to a backend function for security
     * The PayU merchant key and salt should NEVER be exposed in client-side code
     */
    async payuGenerateHash(paymentData) {
      try {
        const { data, error } = await supabase.functions.invoke('payu-generate-hash', {
          body: { paymentData }
        });

        if (error) throw error;
        return { data, error: null };
      } catch (err) {
        console.error('payuGenerateHash failed:', err);
        return {
          data: null,
          error: err.message || 'Failed to generate PayU hash'
        };
      }
    },

    /**
     * PayU Hash Verification (legacy - for client callback data)
     */
    async payuVerifyHash(params) {
      try {
        const { data, error } = await supabase.functions.invoke('payu-verify-hash', {
          body: { params }
        });

        if (error) throw error;
        return { data, error: null };
      } catch (err) {
        console.error('payuVerifyHash failed:', err);
        return {
          data: null,
          error: err.message || 'Failed to verify PayU hash'
        };
      }
    },

    /**
     * PayU Payment Status Check (server-to-server verification)
     * This calls PayU's verify_payment API directly - more reliable than client callback
     */
    async payuCheckStatus(txnid, orderNumber) {
      try {
        const { data, error } = await supabase.functions.invoke('payu-check-status', {
          body: { txnid, orderNumber }
        });

        if (error) throw error;
        return { data, error: null };
      } catch (err) {
        console.error('payuCheckStatus failed:', err);
        return {
          data: null,
          error: err.message || 'Failed to check payment status'
        };
      }
    },

    /**
     * Generate robots.txt content
     */
    async robotsTxt() {
      // This can be static or dynamic based on your needs
      const robotsContent = `User-agent: *
Allow: /
Sitemap: ${typeof window !== 'undefined' ? window.location.origin : ''}/sitemap.xml
`;
      
      return {
        data: robotsContent,
        error: null
      };
    },

    /**
     * Generate sitemap.xml content
     */
    async sitemapXml() {
      // TODO: Generate dynamic sitemap from your entities
      // For now, return a basic structure
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
      
      return {
        data: sitemap,
        error: null
      };
    },

    /**
     * Invoke a serverless function
     * This can call Supabase Edge Functions or your custom API endpoints
     */
    async invoke(functionName, options = {}) {
      const { params = {}, paymentData = null } = options;
      
      // Handle PayU hash functions (these need to be implemented as Supabase Edge Functions)
      // For now, we'll provide a client-side implementation that should be moved to backend
      if (functionName === 'payuGenerateHash' && paymentData) {
        return functions.payuGenerateHash(paymentData);
      }
      
      if (functionName === 'payuVerifyHash' && params) {
        return functions.payuVerifyHash(params);
      }

      if (functionName === 'payuCheckStatus') {
        const { txnid, orderNumber } = options;
        return functions.payuCheckStatus(txnid, orderNumber);
      }

      // Handle robots.txt and sitemap.xml (can be static or dynamic)
      if (functionName === 'robotsTxt') {
        return functions.robotsTxt();
      }
      
      if (functionName === 'sitemapXml') {
        return functions.sitemapXml();
      }
      
      // For other functions, try calling Supabase Edge Function
      try {
        const { data, error } = await supabase.functions.invoke(functionName, {
          body: params || paymentData || {}
        });
        
        if (error) throw error;
        
        return { data, error: null };
      } catch (err) {
        console.warn(`Function ${functionName} not found as Supabase Edge Function. Implement it or use API route.`);
        return {
          data: null,
          error: `Function ${functionName} not implemented. Please implement as Supabase Edge Function or API route.`
        };
      }
    }
  };

  // Integrations handler
  const integrations = {
    Core: {
      /**
       * Upload file to Supabase Storage
       */
      async UploadFile({ file, bucket = 'files', path = null }) {
        try {
          if (!file) throw new Error('File is required');
          
          const fileName = path || `${Date.now()}-${file.name}`;
          const filePath = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
          
          // Upload to Supabase Storage
          const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });
          
          if (error) throw error;
          
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);
          
          return {
            file_url: publicUrl,
            file_path: filePath
          };
        } catch (err) {
          console.error('Error uploading file:', err);
          throw err;
        }
      },

      /**
       * Create signed URL for private file
       */
      async CreateFileSignedUrl({ file_path, bucket = 'files', expiresIn = 3600 }) {
        try {
          const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(file_path, expiresIn);
          
          if (error) throw error;
          
          return {
            signed_url: data.signedUrl
          };
        } catch (err) {
          console.error('Error creating signed URL:', err);
          throw err;
        }
      },

      /**
       * Upload private file
       */
      async UploadPrivateFile({ file, bucket = 'private-files', path = null }) {
        return this.UploadFile({ file, bucket, path });
      },

      /**
       * Send email (placeholder - implement with Resend, SendGrid, etc.)
       */
      async SendEmail({ to, subject, body, from = null }) {
        console.warn('SendEmail called but not implemented. Implement with Resend, SendGrid, or similar service.');
        // TODO: Implement email sending
        return {
          success: true,
          message_id: 'mock-message-id'
        };
      },

      /**
       * Invoke LLM (placeholder - implement with OpenAI, etc.)
       */
      async InvokeLLM({ prompt, model = 'gpt-3.5-turbo', ...options }) {
        console.warn('InvokeLLM called but not implemented. Implement with OpenAI or similar service.');
        // TODO: Implement LLM invocation
        return {
          response: 'Mock LLM response - implement with OpenAI API',
          model
        };
      },

      /**
       * Generate image (placeholder - implement with DALL-E, etc.)
       */
      async GenerateImage({ prompt, ...options }) {
        console.warn('GenerateImage called but not implemented. Implement with DALL-E or similar service.');
        // TODO: Implement image generation
        return {
          image_url: 'mock-image-url',
          prompt
        };
      },

      /**
       * Extract data from uploaded file (placeholder - implement with OCR, etc.)
       */
      async ExtractDataFromUploadedFile({ file_url, ...options }) {
        console.warn('ExtractDataFromUploadedFile called but not implemented. Implement with OCR service.');
        // TODO: Implement OCR/data extraction
        return {
          extracted_data: {},
          file_url
        };
      }
    }
  };

  return {
    entities,
    auth,
    functions,
    integrations
  };
}

export default { createClient };

