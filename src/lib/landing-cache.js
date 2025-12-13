import { supabase } from './supabase-client';

// Cache configuration
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes in milliseconds

// In-memory cache
let landingCache = {
  pagesBySlug: new Map(),
  pagesBySlugTimestamp: new Map(),
  pagesByCategory: new Map(),
  pagesByCategoryTimestamp: new Map()
};

/**
 * Check if cache is still valid
 */
const isCacheValid = (timestamp) => {
  return timestamp && (Date.now() - timestamp) < CACHE_TTL;
};

/**
 * Get a landing page by category and slug (cached)
 * Used by LandingPage.jsx
 */
export const getLandingPage = async (category, slug) => {
  const cacheKey = `${category}/${slug}`;

  // Check cache
  const cachedTimestamp = landingCache.pagesBySlugTimestamp.get(cacheKey);
  if (isCacheValid(cachedTimestamp) && landingCache.pagesBySlug.has(cacheKey)) {
    return { data: landingCache.pagesBySlug.get(cacheKey), error: null, fromCache: true };
  }

  try {
    const { data, error } = await supabase
      .from('landing_pages')
      .select('*')
      .eq('category', category)
      .eq('slug', slug)
      .in('status', ['published', 'unlisted'])
      .single();

    if (error) throw error;

    // Update cache
    landingCache.pagesBySlug.set(cacheKey, data);
    landingCache.pagesBySlugTimestamp.set(cacheKey, Date.now());

    return { data, error: null, fromCache: false };
  } catch (error) {
    console.error('Error loading landing page:', error);
    return { data: null, error, fromCache: false };
  }
};

/**
 * Get a landing page by full slug (e.g., "occasions/anniversary-photo-gifts")
 */
export const getLandingPageByFullSlug = async (fullSlug) => {
  // Check cache
  const cachedTimestamp = landingCache.pagesBySlugTimestamp.get(fullSlug);
  if (isCacheValid(cachedTimestamp) && landingCache.pagesBySlug.has(fullSlug)) {
    return { data: landingCache.pagesBySlug.get(fullSlug), error: null, fromCache: true };
  }

  try {
    const { data, error } = await supabase
      .from('landing_pages')
      .select('*')
      .eq('slug', fullSlug)
      .in('status', ['published', 'unlisted'])
      .single();

    if (error) throw error;

    // Update cache
    landingCache.pagesBySlug.set(fullSlug, data);
    landingCache.pagesBySlugTimestamp.set(fullSlug, Date.now());

    return { data, error: null, fromCache: false };
  } catch (error) {
    console.error('Error loading landing page:', error);
    return { data: null, error, fromCache: false };
  }
};

/**
 * Get all published landing pages by category (cached)
 */
export const getLandingPagesByCategory = async (category) => {
  // Check cache first
  const cachedTimestamp = landingCache.pagesByCategoryTimestamp.get(category);
  if (isCacheValid(cachedTimestamp) && landingCache.pagesByCategory.has(category)) {
    return { data: landingCache.pagesByCategory.get(category), error: null, fromCache: true };
  }

  try {
    const { data, error } = await supabase
      .from('landing_pages')
      .select('id, slug, category, title, h1_heading, featured_image, city, status')
      .eq('category', category)
      .in('status', ['published', 'unlisted'])
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Update cache
    landingCache.pagesByCategory.set(category, data || []);
    landingCache.pagesByCategoryTimestamp.set(category, Date.now());

    return { data: data || [], error: null, fromCache: false };
  } catch (error) {
    console.error('Error loading landing pages by category:', error);
    return { data: [], error, fromCache: false };
  }
};

/**
 * Clear landing page cache
 */
export const clearLandingCache = () => {
  landingCache = {
    pagesBySlug: new Map(),
    pagesBySlugTimestamp: new Map(),
    pagesByCategory: new Map(),
    pagesByCategoryTimestamp: new Map()
  };
};

export default {
  getLandingPage,
  getLandingPageByFullSlug,
  getLandingPagesByCategory,
  clearLandingCache
};
