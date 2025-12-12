import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLatestBlogPosts } from '@/lib/blog-cache';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function LatestBlogPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const { data, error } = await getLatestBlogPosts(3);
    if (!error) {
      setPosts(data);
    }
    setLoading(false);
  };

  // Don't render if no posts or still loading
  if (loading || posts.length === 0) return null;

  return (
    <section className="py-12 md:py-16 lg:py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block bg-brand-coral/10 text-brand-coral text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            From Our Blog
          </span>
          <h2
            className="text-2xl md:text-4xl font-normal text-brand-dark mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Tips & Inspiration
          </h2>
          <p className="text-brand-secondary max-w-2xl mx-auto">
            Discover creative ideas for your polaroid prints and photo memories
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/blog/${post.slug}`} className="block">
                {/* Image */}
                <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-brand-warm to-brand-coral/20">
                  {post.featured_image ? (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      decoding="async"
                      width="400"
                      height="250"
                      fetchPriority="low"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl">📸</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div>
                  {post.category && (
                    <span className="text-xs font-medium text-brand-coral mb-2 block">
                      {post.category}
                    </span>
                  )}
                  <h3
                    className="text-lg font-semibold text-brand-dark mb-2 line-clamp-2 group-hover:text-brand-coral transition-colors"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.published_at && format(new Date(post.published_at), 'MMM d')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.reading_time || 5} min
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            to="/blog"
            className="group inline-flex items-center gap-2 text-brand-coral hover:text-brand-coral-dark font-medium transition-colors"
          >
            View All Articles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
