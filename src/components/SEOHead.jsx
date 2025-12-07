import { useEffect } from 'react';

/**
 * SEO Head Component
 * Manages meta tags for SEO based on page type
 * 
 * @param {string} title - Page title
 * @param {string} description - Page description
 * @param {string} canonicalPath - Canonical URL path (e.g., "/Studio")
 * @param {string} indexing - "index" | "noindex" | "noindex-block"
 * @param {object} openGraph - Open Graph properties
 */
export default function SEOHead({
  title = "RetroFrame - Custom Retro Photo Prints",
  description = "Transform your digital memories into beautiful retro-style polaroid prints. Custom borders, effects & captions. Starting at ₹270 for 18 prints. Free shipping across India.",
  canonicalPath = "",
  indexing = "index", // "index" | "noindex" | "noindex-block"
  openGraph = {},
  keywords = "retro prints, polaroid prints, photo printing india, custom photo prints, vintage photo prints"
}) {
  const baseUrl = "https://retroframe.co";
  // For homepage (empty path), use root domain without trailing slash
  const fullCanonical = canonicalPath ? `${baseUrl}${canonicalPath}` : baseUrl;
  
  useEffect(() => {
    // Set document title
    document.title = title;
    
    // Helper to set or create meta tag
    const setMeta = (name, content, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    // Helper to set or create link tag
    const setLink = (rel, href) => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };
    
    // Basic meta tags
    setMeta('description', description);
    setMeta('keywords', keywords);
    
    // Robots meta tag based on indexing type
    let robotsContent = '';
    switch (indexing) {
      case 'noindex-block':
        robotsContent = 'noindex, nofollow, noarchive, nosnippet';
        break;
      case 'noindex':
        robotsContent = 'noindex, nofollow';
        break;
      default:
        robotsContent = 'index, follow';
    }
    setMeta('robots', robotsContent);
    setMeta('googlebot', robotsContent);
    
    // Canonical URL
    setLink('canonical', fullCanonical);
    
    // Open Graph tags
    setMeta('og:title', openGraph.title || title, true);
    setMeta('og:description', openGraph.description || description, true);
    setMeta('og:url', fullCanonical, true);
    setMeta('og:type', openGraph.type || 'website', true);
    setMeta('og:site_name', 'RetroFrame', true);
    setMeta('og:locale', 'en_IN', true);
    if (openGraph.image) {
      setMeta('og:image', openGraph.image, true);
      setMeta('og:image:width', '1200', true);
      setMeta('og:image:height', '630', true);
    }
    
    // Twitter Card tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', openGraph.title || title);
    setMeta('twitter:description', openGraph.description || description);
    if (openGraph.image) {
      setMeta('twitter:image', openGraph.image);
    }
    
    // Additional SEO tags
    setMeta('author', 'RetroFrame');
    setMeta('geo.region', 'IN');
    setMeta('geo.country', 'IN');
    
  }, [title, description, canonicalPath, indexing, openGraph, keywords, fullCanonical]);
  
  return null; // This component only manages head tags
}

/**
 * SITEMAP & ROBOTS.TXT SETUP INSTRUCTIONS
 * ========================================
 * 
 * Since Base44 doesn't support static file hosting at root paths,
 * you need to manually upload these files to your domain's hosting.
 * 
 * 1. ROBOTS.TXT - Upload to: https://retroframe.co/robots.txt
 * -----------------------------------------------------------
 * User-agent: *
 * Allow: /
 * Disallow: /Cart
 * Disallow: /Checkout
 * Disallow: /PhotoEditor
 * Disallow: /Confirmation
 * Disallow: /OrderTracking
 * Disallow: /PaymentCallback
 * Disallow: /Admin
 * Disallow: /OrderDetails
 * Disallow: /PrintA4
 * Disallow: /PrintFile
 * Disallow: /TemplateManager
 * Sitemap: https://retroframe.co/sitemap.xml
 * 
 * 2. SITEMAP.XML - Upload to: https://retroframe.co/sitemap.xml
 * -------------------------------------------------------------
 * <?xml version="1.0" encoding="UTF-8"?>
 * <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
 *   <url><loc>https://retroframe.co</loc><priority>1.0</priority><changefreq>weekly</changefreq></url>
 *   <url><loc>https://retroframe.co/Studio</loc><priority>0.9</priority><changefreq>weekly</changefreq></url>
 *   <url><loc>https://retroframe.co/ContactUs</loc><priority>0.6</priority><changefreq>monthly</changefreq></url>
 *   <url><loc>https://retroframe.co/Privacy</loc><priority>0.3</priority><changefreq>yearly</changefreq></url>
 *   <url><loc>https://retroframe.co/Terms</loc><priority>0.3</priority><changefreq>yearly</changefreq></url>
 *   <url><loc>https://retroframe.co/Refund</loc><priority>0.4</priority><changefreq>yearly</changefreq></url>
 * </urlset>
 * 
 * 3. SUBMIT TO GOOGLE SEARCH CONSOLE
 * - Add sitemap URL: https://retroframe.co/sitemap.xml
 * - Request indexing for main pages
 */

// SEO configuration for all pages
// Description max 155 chars, Title max 60 chars for optimal display
export const SEO_CONFIG = {
  // PUBLIC PAGES - indexable
  Home: {
    title: "RetroFrame - Premium Polaroid Prints Online India",
    description: "Order custom polaroid prints online. Vintage effects, 8 border colors & captions. ₹270 for 18 prints. Free shipping India.",
    canonicalPath: "", // Root domain for homepage
    indexing: "index",
    keywords: "retro prints, polaroid prints, photo printing india, custom photo prints, vintage photo prints, retro frame, photo gifts india"
  },
  Studio: {
    title: "Create Prints | RetroFrame Photo Studio",
    description: "Upload & customize retro prints with borders, effects and captions. Easy polaroid-style photo editor.",
    canonicalPath: "/Studio",
    indexing: "index",
    keywords: "photo editor, create prints, customize photos, polaroid maker, retro photo editor"
  },
  ContactUs: {
    title: "Contact Us | RetroFrame Support",
    description: "Get help with your RetroFrame orders. Contact our support team via email or phone.",
    canonicalPath: "/ContactUs",
    indexing: "index",
    keywords: "contact retroframe, customer support, photo print help"
  },
  Privacy: {
    title: "Privacy Policy | RetroFrame",
    description: "How RetroFrame collects, uses and protects your personal information and uploaded photos.",
    canonicalPath: "/Privacy",
    indexing: "index",
    keywords: "privacy policy, data protection, photo privacy"
  },
  Terms: {
    title: "Terms & Conditions | RetroFrame",
    description: "RetroFrame service terms, ordering policies and user agreements for photo printing.",
    canonicalPath: "/Terms",
    indexing: "index",
    keywords: "terms of service, conditions, user agreement"
  },
  Refund: {
    title: "Refund & Cancellation | RetroFrame",
    description: "RetroFrame refund policy. Learn about returns, refund eligibility and cancellation process.",
    canonicalPath: "/Refund",
    indexing: "index",
    keywords: "refund policy, cancellation, returns, money back"
  },
  
  // USER PAGES - noindex (private user content)
  Cart: {
    title: "Your Cart | RetroFrame",
    description: "Review your selected photos before checkout.",
    canonicalPath: "/Cart",
    indexing: "noindex"
  },
  Checkout: {
    title: "Checkout | RetroFrame",
    description: "Complete your order.",
    canonicalPath: "/Checkout",
    indexing: "noindex"
  },
  PhotoEditor: {
    title: "Edit Photo | RetroFrame",
    description: "Customize your photo.",
    canonicalPath: "/PhotoEditor",
    indexing: "noindex"
  },
  Confirmation: {
    title: "Order Confirmation | RetroFrame",
    description: "Your order details.",
    canonicalPath: "/Confirmation",
    indexing: "noindex"
  },
  OrderTracking: {
    title: "Track Order | RetroFrame",
    description: "Track your order status.",
    canonicalPath: "/OrderTracking",
    indexing: "noindex"
  },
  PaymentCallback: {
    title: "Processing Payment | RetroFrame",
    description: "Processing your payment.",
    canonicalPath: "/PaymentCallback",
    indexing: "noindex"
  },
  
  // ADMIN PAGES - fully blocked
  Admin: {
    title: "Admin | RetroFrame",
    description: "",
    canonicalPath: "/Admin",
    indexing: "noindex-block"
  },
  OrderDetails: {
    title: "Order Details | RetroFrame",
    description: "",
    canonicalPath: "/OrderDetails",
    indexing: "noindex-block"
  },
  PrintA4: {
    title: "Print | RetroFrame",
    description: "",
    canonicalPath: "/PrintA4",
    indexing: "noindex-block"
  },
  PrintFile: {
    title: "Print | RetroFrame",
    description: "",
    canonicalPath: "/PrintFile",
    indexing: "noindex-block"
  },
  TemplateManager: {
    title: "Templates | RetroFrame",
    description: "",
    canonicalPath: "/TemplateManager",
    indexing: "noindex-block"
  },
  Robots: {
    title: "robots.txt",
    description: "",
    canonicalPath: "/Robots",
    indexing: "noindex-block"
  },
  Sitemap: {
    title: "sitemap.xml",
    description: "",
    canonicalPath: "/Sitemap",
    indexing: "noindex-block"
  },
  AdminLogin: {
    title: "Admin Login | RetroFrame",
    description: "",
    canonicalPath: "/AdminLogin",
    indexing: "noindex-block"
  },
  Blog: {
    title: "Blog - Photo Printing Tips & Inspiration | RetroFrame",
    description: "Explore tips, ideas and inspiration for your polaroid prints. Photo display ideas, choosing photos, and more.",
    canonicalPath: "/blog",
    indexing: "index",
    keywords: "polaroid blog, photo printing tips, polaroid display ideas, photo wall inspiration, retro photography"
  },
  BlogPost: {
    // This is a placeholder - BlogPost sets its own SEO dynamically
    title: "Blog | RetroFrame",
    description: "Photo printing tips and inspiration.",
    canonicalPath: "/blog",
    indexing: "index"
  }
};