import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

/**
 * SEO-enhanced Breadcrumb component with Schema.org structured data
 * Wraps shadcn/ui Breadcrumb with JSON-LD markup for rich snippets
 *
 * @param {Array} items - Array of breadcrumb items: [{ name: string, url: string }]
 * @param {string} className - Additional CSS classes
 */
export default function SEOBreadcrumb({ items, className = '' }) {
  // Don't render if no items or only home
  if (!items || items.length <= 1) return null;

  // Generate JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://retroframe.co${item.url}`
    }))
  };

  return (
    <>
      {/* Structured data for SEO rich snippets */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Visual breadcrumb navigation */}
      <Breadcrumb className={className}>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isFirst = index === 0;

            return (
              <React.Fragment key={item.url}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="text-brand-dark font-medium">
                      {item.name}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        to={item.url}
                        className="flex items-center gap-1 hover:text-brand-coral transition-colors"
                      >
                        {isFirst && <Home className="w-4 h-4" />}
                        <span>{item.name}</span>
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}

/**
 * Common breadcrumb configurations
 */
export const breadcrumbConfigs = {
  studio: [
    { name: 'Home', url: '/' },
    { name: 'Create Prints', url: '/studio' }
  ],
  cart: [
    { name: 'Home', url: '/' },
    { name: 'Create Prints', url: '/studio' },
    { name: 'Cart', url: '/cart' }
  ],
  checkout: [
    { name: 'Home', url: '/' },
    { name: 'Create Prints', url: '/studio' },
    { name: 'Cart', url: '/cart' },
    { name: 'Checkout', url: '/checkout' }
  ],
  orderTracking: [
    { name: 'Home', url: '/' },
    { name: 'Track Order', url: '/order-tracking' }
  ],
  blog: [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' }
  ],
  contact: [
    { name: 'Home', url: '/' },
    { name: 'Contact Us', url: '/contact' }
  ],
  terms: [
    { name: 'Home', url: '/' },
    { name: 'Terms of Service', url: '/terms' }
  ],
  privacy: [
    { name: 'Home', url: '/' },
    { name: 'Privacy Policy', url: '/privacy' }
  ],
  refund: [
    { name: 'Home', url: '/' },
    { name: 'Refund Policy', url: '/refund' }
  ]
};

/**
 * Generate blog post breadcrumb
 */
export function getBlogPostBreadcrumb(postTitle) {
  return [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: postTitle, url: '#' }
  ];
}
