import { useEffect } from 'react';

export default function Robots() {
  useEffect(() => {
    const robotsTxt = `# RetroFrame Robots.txt
User-agent: *
Allow: /$
Allow: /Home
Allow: /Studio
Allow: /ContactUs
Allow: /Privacy
Allow: /Terms
Allow: /Refund

# Block all internal/user pages
Disallow: /Cart
Disallow: /Checkout
Disallow: /PhotoEditor
Disallow: /Confirmation
Disallow: /OrderTracking
Disallow: /PaymentCallback
Disallow: /Admin
Disallow: /OrderDetails
Disallow: /PrintA4
Disallow: /PrintFile
Disallow: /TemplateManager
Disallow: /Robots
Disallow: /Sitemap

Sitemap: https://retroframe.co/Sitemap

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