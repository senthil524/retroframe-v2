import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase-client';
import SEO, { structuredData } from '@/components/seo/SEO';
import SEOBreadcrumb, { getBlogPostBreadcrumb } from '@/components/SEOBreadcrumb';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag, Share2, Twitter, Facebook, Linkedin } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      // Load the current post
      const { data: postData, error: postError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (postError) throw postError;
      setPost(postData);

      // Load related posts (same category, different post)
      if (postData?.category) {
        const { data: relatedData } = await supabase
          .from('blog_posts')
          .select('id, slug, title, excerpt, featured_image, published_at, reading_time')
          .eq('published', true)
          .eq('category', postData.category)
          .neq('id', postData.id)
          .order('published_at', { ascending: false })
          .limit(3);

        setRelatedPosts(relatedData || []);
      }
    } catch (error) {
      console.error('Error loading blog post:', error);
      navigate('/Blog');
    }
    setLoading(false);
  };

  // Share functions
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post?.title || '';

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`, '_blank');
  };

  // Render markdown content (basic)
  const renderContent = (content) => {
    if (!content) return null;

    // Convert markdown to HTML (basic conversion)
    let html = content
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-brand-dark mt-8 mb-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-brand-dark mt-10 mb-4" style="font-family: var(--font-serif)">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-brand-dark mt-6 mb-6" style="font-family: var(--font-serif)">$1</h1>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^\- (.*$)/gim, '<li class="ml-4 mb-2">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-2 list-decimal">$1</li>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
      // Line breaks
      .replace(/\n/g, '<br/>');

    // Wrap list items
    html = html.replace(/(<li.*<\/li>)+/g, '<ul class="mb-6 list-disc">$&</ul>');

    return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: `<p class="mb-4 text-gray-700 leading-relaxed">${html}</p>` }} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-warm">
        <div className="w-8 h-8 border-4 border-brand-coral border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-warm">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Post not found</p>
          <Link to="/Blog" className="text-brand-coral hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Article structured data
  const articleSchema = structuredData.article({
    title: post.title,
    description: post.excerpt,
    image: post.featured_image,
    url: `/Blog/${post.slug}`,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: post.author,
    readingTime: post.reading_time
  });

  return (
    <div className="min-h-screen bg-brand-warm">
      <SEO
        title={post.title}
        description={post.excerpt}
        url={`/Blog/${post.slug}`}
        image={post.featured_image}
        type="article"
        keywords={post.tags?.join(', ')}
        structuredData={articleSchema}
      />

      {/* Article Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <SEOBreadcrumb items={getBlogPostBreadcrumb(post.title)} className="mb-6" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {post.category && (
              <span className="inline-block bg-brand-coral/10 text-brand-coral text-sm font-medium px-3 py-1 rounded-full mb-4">
                {post.category}
              </span>
            )}

            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-normal text-brand-dark mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.published_at && format(new Date(post.published_at), 'MMMM d, yyyy')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.reading_time || 5} min read
              </span>
              {post.author && (
                <span>By {post.author}</span>
              )}
            </div>
          </motion.div>
        </div>
      </header>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="max-w-5xl mx-auto px-4 -mt-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl overflow-hidden shadow-lg"
          >
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      )}

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-md p-6 md:p-10"
        >
          {renderContent(post.content)}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share this article
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={shareOnTwitter}
                className="rounded-full"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareOnFacebook}
                className="rounded-full"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareOnLinkedIn}
                className="rounded-full"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
            </div>
          </div>
        </motion.div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2
            className="text-2xl font-normal text-brand-dark mb-8 text-center"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Related Articles
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                to={`/Blog/${relatedPost.slug}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="aspect-video bg-gradient-to-br from-brand-warm to-brand-coral/20">
                  {relatedPost.featured_image && (
                    <img
                      src={relatedPost.featured_image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-brand-dark group-hover:text-brand-coral transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {relatedPost.reading_time || 5} min read
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Navigation */}
      <section className="max-w-4xl mx-auto px-4 py-8 border-t border-gray-200 bg-white">
        <div className="flex justify-between items-center">
          <Link
            to="/Blog"
            className="flex items-center gap-2 text-gray-600 hover:text-brand-coral transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </Link>
          <Link
            to="/Studio"
            className="flex items-center gap-2 bg-brand-coral hover:bg-brand-coral-dark text-white px-6 py-2 rounded-full transition-colors"
          >
            Create Prints
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
