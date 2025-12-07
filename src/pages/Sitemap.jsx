import { useEffect, useState } from 'react';
import { getAllBlogPosts } from '@/lib/blog-cache';

export default function Sitemap() {
  const [sitemapXml, setSitemapXml] = useState('');

  useEffect(() => {
    generateSitemap();
  }, []);

  const generateSitemap = async () => {
    const today = new Date().toISOString().split('T')[0];

    // Static pages with their priorities and change frequencies
    const staticPages = [
      { path: '', priority: '1.0', changefreq: 'weekly' },
      { path: '/studio', priority: '0.9', changefreq: 'weekly' },
      { path: '/blog', priority: '0.8', changefreq: 'daily' },
      { path: '/order-tracking', priority: '0.6', changefreq: 'monthly' },
      { path: '/contact', priority: '0.6', changefreq: 'monthly' },
      { path: '/terms', priority: '0.3', changefreq: 'yearly' },
      { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
      { path: '/refund', priority: '0.4', changefreq: 'yearly' },
    ];

    // Fetch blog posts dynamically
    const { data: blogPosts } = await getAllBlogPosts();

    // Generate URL entries for static pages
    const staticUrls = staticPages.map(page => `
  <url>
    <loc>https://retroframe.co${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

    // Generate URL entries for blog posts
    const blogUrls = (blogPosts || []).map(post => {
      const lastmod = post.updated_at
        ? new Date(post.updated_at).toISOString().split('T')[0]
        : post.published_at
          ? new Date(post.published_at).toISOString().split('T')[0]
          : today;
      return `
  <url>
    <loc>https://retroframe.co/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls}${blogUrls}
</urlset>`;

    setSitemapXml(xml);

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
  };

  return null;
}
