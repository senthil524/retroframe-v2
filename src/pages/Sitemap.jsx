import { useEffect } from 'react';

export default function Sitemap() {
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://retroframe.co</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://retroframe.co/Studio</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://retroframe.co/ContactUs</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://retroframe.co/Privacy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://retroframe.co/Terms</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://retroframe.co/Refund</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
</urlset>`;

    document.body.innerHTML = `<pre style="font-family: monospace; white-space: pre-wrap;">${sitemapXml.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
    document.body.style.margin = '0';
    document.body.style.padding = '20px';
    document.body.style.background = '#fff';
    
    document.title = 'sitemap.xml';
    
    // Add noindex meta
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