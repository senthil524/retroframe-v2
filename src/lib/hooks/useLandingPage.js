import useSWR from 'swr';
import { supabase } from '../supabase-client';

// SWR config for landing pages - 10 min cache, no revalidation on focus
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 10 * 60 * 1000, // 10 minutes
};

/**
 * Fetch a single landing page by full slug
 * Usage: const { data, isLoading, error } = useLandingPage('occasions/anniversary-photo-gifts')
 */
export function useLandingPage(fullSlug) {
  return useSWR(
    fullSlug ? `landing:${fullSlug}` : null,
    async () => {
      const { data, error } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('slug', fullSlug)
        .in('status', ['published', 'unlisted'])
        .single();

      if (error) throw error;
      return data;
    },
    swrConfig
  );
}

/**
 * Fetch all landing pages by category
 * Usage: const { data, isLoading } = useLandingPagesByCategory('occasions')
 */
export function useLandingPagesByCategory(category) {
  return useSWR(
    category ? `landing-category:${category}` : null,
    async () => {
      const { data, error } = await supabase
        .from('landing_pages')
        .select('id, slug, category, title, h1_heading, featured_image, city, status')
        .eq('category', category)
        .in('status', ['published', 'unlisted'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    swrConfig
  );
}

/**
 * Fetch only published landing pages by category (for public display)
 * Usage: const { data, isLoading } = usePublishedLandingPages('occasions')
 */
export function usePublishedLandingPages(category) {
  return useSWR(
    category ? `landing-published:${category}` : null,
    async () => {
      const { data, error } = await supabase
        .from('landing_pages')
        .select('id, slug, category, title, h1_heading, featured_image, city')
        .eq('category', category)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    swrConfig
  );
}
