import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogPosts } from '@/lib/blog-cache';
import SEO, { structuredData } from '@/components/seo/SEO';
import SEOBreadcrumb, { breadcrumbConfigs } from '@/components/SEOBreadcrumb';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import Logo from '@/components/ui/Logo';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const { data, error } = await getAllBlogPosts();
    if (!error) {
      setPosts(data);
    }
    setLoading(false);
  };

  // Get unique categories
  const categories = ['all', ...new Set(posts.map(p => p.category).filter(Boolean))];

  // Filter posts by category
  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  // Combined structured data
  const pageStructuredData = [
    structuredData.collectionPage({
      title: 'Blog - Photo Printing Tips & Inspiration',
      description: 'Explore our blog for photo printing tips, polaroid display ideas, and creative inspiration for your memories.',
      url: '/blog'
    })
  ];

  return (
    <div className="min-h-screen bg-brand-warm">
      <SEO
        title="Blog - Photo Printing Tips & Inspiration"
        description="Explore our blog for photo printing tips, polaroid display ideas, and creative inspiration. Learn how to make the most of your polaroid prints."
        url="/blog"
        keywords="polaroid blog, photo printing tips, polaroid display ideas, photo wall inspiration, retro photography"
        structuredData={pageStructuredData}
      />

      {/* Site Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-brand sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <Link to={createPageUrl('Studio')}>
              <Button
                size="sm"
                className="text-xs md:text-sm text-white rounded-full px-4 md:px-6"
                style={{ backgroundColor: 'var(--color-coral)' }}>
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Create Prints
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <SEOBreadcrumb items={breadcrumbConfigs.blog} className="mb-6" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-normal text-brand-dark mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              RetroFrame Blog
            </h1>
            <p className="text-lg text-brand-secondary max-w-2xl mx-auto">
              Tips, inspiration, and ideas for making the most of your polaroid prints
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      {categories.length > 1 && (
        <section className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-[57px] md:top-[65px] z-40">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-brand-coral text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All Posts' : category}
                </button>
              ))}
            </div>
          </div>
          <style>{`
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-brand-coral border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 mb-2">No blog posts found</p>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-brand-coral hover:underline text-sm"
              >
                View all posts
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <Link to={`/blog/${post.slug}`}>
                  {/* Featured Image */}
                  <div className="aspect-video bg-gradient-to-br from-brand-warm to-brand-coral/20 relative overflow-hidden">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        width="400"
                        height="225"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl">📸</span>
                      </div>
                    )}
                    {post.category && (
                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-coral text-xs font-medium px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2
                      className="text-xl font-semibold text-brand-dark mb-2 line-clamp-2 group-hover:text-brand-coral transition-colors"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.published_at && format(new Date(post.published_at), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.reading_time || 5} min read
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-brand-coral group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2
            className="text-2xl md:text-3xl font-normal text-brand-dark mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Ready to Create Your Prints?
          </h2>
          <p className="text-brand-secondary mb-8">
            Turn your favorite memories into beautiful polaroid prints
          </p>
          <Link
            to="/studio"
            className="inline-flex items-center gap-2 bg-brand-coral hover:bg-brand-coral-dark text-white px-8 py-3 rounded-full font-medium transition-colors"
          >
            Start Creating
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
      </main>
    </div>
  );
}
