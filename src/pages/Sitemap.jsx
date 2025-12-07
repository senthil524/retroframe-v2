import { useEffect } from 'react';

export default function Sitemap() {
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];

    // Static pages with their priorities and change frequencies
    const staticPages = [
      { path: '', priority: '1.0', changefreq: 'weekly' },
      { path: '/studio', priority: '0.9', changefreq: 'weekly' },
      { path: '/order-tracking', priority: '0.6', changefreq: 'monthly' },
      { path: '/contact', priority: '0.6', changefreq: 'monthly' },
      { path: '/terms', priority: '0.3', changefreq: 'yearly' },
      { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
      { path: '/refund', priority: '0.4', changefreq: 'yearly' },
    ];

    // Generate URL entries for static pages
    const staticUrls = staticPages.map(page => `
  <url>
    <loc>https://retroframe.co${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls}
</urlset>`;

    // Render as XML
    document.body.innerHTML = `<pre style="font-family: monospace; white-space: pre-wrap;">${xml.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
    document.body.style.margin = '0';
    document.body.style.padding = '20px';
    document.body.style.background = '#fff';

    document.title = 'sitemap.xml';

    // Add noindex meta for the HTML version
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';
  }, []);

  return null;
}
