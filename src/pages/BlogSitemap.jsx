import { useEffect, useState } from 'react';
import { getAllBlogPosts } from '@/lib/blog-cache';

export default function BlogSitemap() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateBlogSitemap();
  }, []);

  const generateBlogSitemap = async () => {
    const today = new Date().toISOString().split('T')[0];

    // Fetch blog posts from database
    const { data: blogPosts } = await getAllBlogPosts();

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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://retroframe.co/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>${blogUrls}
</urlset>`;

    // Render as XML
    document.body.innerHTML = `<pre style="font-family: monospace; white-space: pre-wrap;">${xml.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
    document.body.style.margin = '0';
    document.body.style.padding = '20px';
    document.body.style.background = '#fff';

    document.title = 'blog-sitemap.xml';

    // Add noindex meta for the HTML version
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';

    setLoading(false);
  };

  if (loading) {
    return <div>Generating blog sitemap...</div>;
  }

  return null;
}
