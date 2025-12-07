import { useEffect } from 'react';

export default function Robots() {
  useEffect(() => {
    const robotsTxt = `# RetroFrame Robots.txt
User-agent: *
Allow: /
Allow: /studio
Allow: /blog
Allow: /contact
Allow: /privacy
Allow: /terms
Allow: /refund
Allow: /order-tracking

# Block all internal/user pages
Disallow: /cart
Disallow: /checkout
Disallow: /photo-editor
Disallow: /confirmation
Disallow: /payment-callback
Disallow: /admin
Disallow: /admin-login
Disallow: /order-details
Disallow: /print-a4
Disallow: /print-file
Disallow: /template-manager

# Sitemaps
Sitemap: https://retroframe.co/sitemap.xml
Sitemap: https://retroframe.co/blog-sitemap.xml

Crawl-delay: 1`;

    document.body.innerHTML = `<pre style="font-family: monospace; white-space: pre-wrap;">${robotsTxt}</pre>`;
    document.body.style.margin = '0';
    document.body.style.padding = '20px';
    document.body.style.background = '#fff';

    // Set content type hint in title
    document.title = 'robots.txt';
  }, []);

  return null;
}
