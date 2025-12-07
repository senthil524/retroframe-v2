import { supabase } from './supabase-client';

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// In-memory cache
let blogCache = {
  allPosts: null,
  allPostsTimestamp: 0,
  latestPosts: null,
  latestPostsTimestamp: 0,
  postsBySlug: new Map(),
  postsBySlugTimestamp: new Map()
};

/**
 * Check if cache is still valid
 */
const isCacheValid = (timestamp) => {
  return timestamp && (Date.now() - timestamp) < CACHE_TTL;
};

/**
 * Get all published blog posts (cached)
 * Used by Blog.jsx listing page
 */
export const getAllBlogPosts = async () => {
  // Return from cache if valid
  if (isCacheValid(blogCache.allPostsTimestamp) && blogCache.allPosts) {
    return { data: blogCache.allPosts, error: null, fromCache: true };
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;

    // Update cache
    blogCache.allPosts = data || [];
    blogCache.allPostsTimestamp = Date.now();

    return { data: blogCache.allPosts, error: null, fromCache: false };
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return { data: [], error, fromCache: false };
  }
};

/**
 * Get latest 3 blog posts (cached)
 * Used by LatestBlogPosts.jsx on Home page
 */
export const getLatestBlogPosts = async (limit = 3) => {
  // Return from cache if valid
  if (isCacheValid(blogCache.latestPostsTimestamp) && blogCache.latestPosts) {
    return { data: blogCache.latestPosts, error: null, fromCache: true };
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, category, featured_image, published_at, reading_time')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Update cache
    blogCache.latestPosts = data || [];
    blogCache.latestPostsTimestamp = Date.now();

    return { data: blogCache.latestPosts, error: null, fromCache: false };
  } catch (error) {
    console.error('Error loading latest blog posts:', error);
    return { data: [], error, fromCache: false };
  }
};

/**
 * Get a single blog post by slug (cached)
 * Used by BlogPost.jsx
 */
export const getBlogPostBySlug = async (slug) => {
  // Check cache
  const cachedTimestamp = blogCache.postsBySlugTimestamp.get(slug);
  if (isCacheValid(cachedTimestamp) && blogCache.postsBySlug.has(slug)) {
    return { data: blogCache.postsBySlug.get(slug), error: null, fromCache: true };
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) throw error;

    // Update cache
    blogCache.postsBySlug.set(slug, data);
    blogCache.postsBySlugTimestamp.set(slug, Date.now());

    return { data, error: null, fromCache: false };
  } catch (error) {
    console.error('Error loading blog post:', error);
    return { data: null, error, fromCache: false };
  }
};

/**
 * Get related posts by category (uses cached allPosts)
 */
export const getRelatedPosts = async (category, excludeId, limit = 3) => {
  // Try to use cached all posts first
  if (isCacheValid(blogCache.allPostsTimestamp) && blogCache.allPosts) {
    const related = blogCache.allPosts
      .filter(p => p.category === category && p.id !== excludeId)
      .slice(0, limit);
    return { data: related, error: null, fromCache: true };
  }

  // Fallback to direct query
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, featured_image, published_at, reading_time')
      .eq('published', true)
      .eq('category', category)
      .neq('id', excludeId)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data: data || [], error: null, fromCache: false };
  } catch (error) {
    console.error('Error loading related posts:', error);
    return { data: [], error, fromCache: false };
  }
};

/**
 * Clear all blog cache (call after admin updates blog posts)
 */
export const clearBlogCache = () => {
  blogCache = {
    allPosts: null,
    allPostsTimestamp: 0,
    latestPosts: null,
    latestPostsTimestamp: 0,
    postsBySlug: new Map(),
    postsBySlugTimestamp: new Map()
  };
};

/**
 * Preload blog cache (call on app initialization if needed)
 */
export const preloadBlogCache = async () => {
  await Promise.all([
    getAllBlogPosts(),
    getLatestBlogPosts()
  ]);
};

export default {
  getAllBlogPosts,
  getLatestBlogPosts,
  getBlogPostBySlug,
  getRelatedPosts,
  clearBlogCache,
  preloadBlogCache
};
