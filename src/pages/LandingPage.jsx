import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getLandingPageByFullSlug } from '@/lib/landing-cache';
import SEO, { structuredData } from '@/components/seo/SEO';
import SEOBreadcrumb from '@/components/SEOBreadcrumb';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import Logo from '@/components/ui/Logo';
import {
  Sparkles,
  Heart,
  Gift,
  Truck,
  Star,
  Camera,
  Palette,
  Package,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  MapPin,
  Clock,
  Shield,
  Check,
  Image,
  PenTool,
  Sliders,
  Lightbulb,
  Quote,
  Calendar,
  Users,
  Home as HomeIcon
} from 'lucide-react';

// Icon mapping
const iconMap = {
  heart: Heart,
  gift: Gift,
  truck: Truck,
  star: Star,
  camera: Camera,
  palette: Palette,
  package: Package,
  mappin: MapPin,
  clock: Clock,
  shield: Shield,
  check: Check,
  sparkles: Sparkles,
  lightbulb: Lightbulb,
  pentool: PenTool,
  sliders: Sliders,
  calendar: Calendar,
  users: Users,
  home: HomeIcon
};

export default function LandingPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const pathParts = typeof window !== 'undefined' ? window.location.pathname.split('/').filter(Boolean) : [];
  const category = pathParts[0] || '';

  useEffect(() => {
    if (category && slug) {
      loadPage();
    }
  }, [category, slug]);

  const loadPage = async () => {
    const fullSlug = `${category}/${slug}`;
    const { data, error } = await getLandingPageByFullSlug(fullSlug);

    if (error || !data) {
      console.error('Error loading landing page:', error);
      navigate('/');
      setLoading(false);
      return;
    }

    setPage(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-warm">
        <div className="w-8 h-8 border-4 border-brand-coral border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-warm">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Page not found</p>
          <Link to="/" className="text-brand-coral hover:underline">Go Home</Link>
        </div>
      </div>
    );
  }

  const content = page.content || {};
  const hero = content.hero || {};
  const whyPolaroids = content.why_polaroids || [];
  const ideas = content.ideas || [];
  const testimonials = content.testimonials || [];
  const faq = content.faq || [];
  const cta = content.cta || {};

  // Breadcrumbs
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: page.category.charAt(0).toUpperCase() + page.category.slice(1), url: `/${page.category}` },
    { name: page.h1_heading || page.title, url: `/${page.slug}` }
  ];

  // Structured data
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://retroframe.co/${page.slug}`,
        "name": page.title,
        "description": page.meta_description,
        "url": `https://retroframe.co/${page.slug}`,
        "isPartOf": { "@type": "WebSite", "name": "RetroFrame", "url": "https://retroframe.co" },
        "publisher": { "@type": "Organization", "name": "RetroFrame", "url": "https://retroframe.co" },
        ...(page.featured_image && { "primaryImageOfPage": { "@type": "ImageObject", "url": page.featured_image } })
      },
      {
        "@type": "Product",
        "name": page.h1_heading || page.title,
        "description": page.meta_description,
        "image": page.featured_image || "https://retroframe.co/hero-images/hero-8.jpg",
        "brand": { "@type": "Brand", "name": "RetroFrame" },
        "offers": {
          "@type": "Offer",
          "url": "https://retroframe.co/studio",
          "priceCurrency": "INR",
          "price": 270,
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock",
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": { "@type": "MonetaryAmount", "value": 0, "currency": "INR" },
            "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "IN" }
          }
        },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": 4.9, "reviewCount": 20, "bestRating": 5 }
      },
      structuredData.breadcrumb(breadcrumbItems),
      ...(faq.length > 0 ? [{
        "@type": "FAQPage",
        "mainEntity": faq.map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": { "@type": "Answer", "text": item.answer }
        }))
      }] : [])
    ]
  };

  return (
    <div className="min-h-screen bg-brand-warm">
      <SEO
        title={page.title}
        description={page.meta_description}
        url={`/${page.slug}`}
        image={page.featured_image}
        type="website"
        keywords={page.keywords?.join(', ')}
        structuredData={pageSchema}
        noindex={page.status === 'unlisted'}
      />

      {/* Header */}
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
        {/* ==================== HERO SECTION ==================== */}
        <section className="py-8 md:py-12 lg:py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <SEOBreadcrumb items={breadcrumbItems} className="mb-6" />

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Content */}
              <div className="space-y-5 md:space-y-6 order-2 lg:order-1">
                {hero.badge && (
                  <div className="inline-flex items-center gap-2 bg-brand-coral/10 border border-brand-coral/20 px-4 py-2 rounded-full text-sm font-medium text-brand-coral">
                    <Heart className="w-4 h-4 fill-brand-coral" />
                    {hero.badge}
                  </div>
                )}

                <h1
                  className="text-3xl md:text-4xl lg:text-5xl font-normal leading-tight text-brand-dark"
                  style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em' }}
                >
                  {page.h1_heading || hero.headline}
                </h1>

                <p className="text-base md:text-lg text-brand-secondary leading-relaxed">
                  {hero.subheadline || page.meta_description}
                </p>

                {/* Pricing Card */}
                <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 inline-block">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-gray-400 line-through text-lg">₹399</span>
                    <span className="text-3xl md:text-4xl font-bold text-brand-dark">₹270</span>
                    <span className="text-brand-secondary">for 18 prints</span>
                  </div>
                  <div className="space-y-1.5 text-sm text-brand-secondary">
                    {(hero.features || ['Premium 270 GSM Paper', 'Free Shipping', '3-6 Days Delivery']).map((f, i) => (
                      <p key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {f}
                      </p>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/studio">
                    <Button
                      size="lg"
                      className="rounded-full text-base md:text-lg px-8 py-6 shadow-xl w-full sm:w-auto text-white font-semibold"
                      style={{ background: 'linear-gradient(135deg, var(--color-coral) 0%, var(--color-coral-dark) 100%)' }}
                    >
                      <Image className="w-5 h-5 mr-2" />
                      {cta.button_text || 'Create Your Gift'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                    <span className="text-sm text-brand-secondary ml-1">4.9/5 rating</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-brand-secondary">20+ happy customers</span>
                </div>
              </div>

              {/* Hero Image */}
              <div className="order-1 lg:order-2">
                <div className="relative">
                  {page.featured_image ? (
                    <img
                      src={page.featured_image}
                      alt={page.h1_heading || page.title}
                      className="rounded-2xl shadow-2xl w-full aspect-[4/3] object-cover"
                      loading="eager"
                    />
                  ) : (
                    <div className="rounded-2xl shadow-2xl w-full aspect-[4/3] bg-gradient-to-br from-brand-coral/20 to-brand-warm flex items-center justify-center">
                      <Camera className="w-20 h-20 text-brand-coral/30" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== WHY POLAROIDS SECTION ==================== */}
        {whyPolaroids.length > 0 && (
          <section className="py-12 md:py-16 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2
                  className="text-2xl md:text-3xl font-normal text-brand-dark mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {content.why_polaroids_title || 'Why Polaroid Prints Make the Perfect Gift'}
                </h2>
                <p className="text-brand-secondary max-w-2xl mx-auto">
                  {content.why_polaroids_subtitle || 'There\'s something magical about holding a physical photo in your hands'}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {whyPolaroids.map((item, idx) => {
                  const IconComponent = iconMap[item.icon] || Heart;
                  return (
                    <div key={idx} className="text-center p-6">
                      <div
                        className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-coral)', opacity: 0.1 }}
                      >
                        <IconComponent className="w-8 h-8 text-brand-coral" style={{ opacity: 1 }} />
                      </div>
                      <div className="w-16 h-16 mx-auto mb-4 -mt-16 rounded-2xl flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-brand-coral" />
                      </div>
                      <h3 className="text-lg font-semibold text-brand-dark mb-2">{item.title}</h3>
                      <p className="text-brand-secondary text-sm leading-relaxed">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ==================== IDEAS SECTION ==================== */}
        {ideas.length > 0 && (
          <section className="py-12 md:py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2
                  className="text-2xl md:text-3xl font-normal text-brand-dark mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {content.ideas_title || 'Creative Gift Ideas'}
                </h2>
                <p className="text-brand-secondary max-w-2xl mx-auto">
                  {content.ideas_subtitle || 'Get inspired with these beautiful ways to gift your polaroid prints'}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                {ideas.map((idea, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    {idea.image && (
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={idea.image}
                          alt={idea.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-5 md:p-6">
                      <h3 className="text-lg font-semibold text-brand-dark mb-2">{idea.title}</h3>
                      <p className="text-brand-secondary text-sm leading-relaxed">{idea.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA after ideas */}
              <div className="text-center mt-10">
                <Link to="/studio">
                  <Button
                    size="lg"
                    className="rounded-full px-8 py-6 text-white font-semibold"
                    style={{ background: 'linear-gradient(135deg, var(--color-coral) 0%, var(--color-coral-dark) 100%)' }}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create Your Own
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ==================== PRODUCT DETAILS SECTION ==================== */}
        <section className="py-12 md:py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2
                className="text-2xl md:text-3xl font-normal text-brand-dark mb-3"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                What You'll Get
              </h2>
              <p className="text-brand-secondary">Premium quality prints that feel as special as your memories</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Print Specs */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-warm rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-brand-coral" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-dark mb-1">Print Size</h3>
                    <p className="text-brand-secondary text-sm">3.5" × 4" classic polaroid size — perfect for wallets, frames, or wall displays</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-warm rounded-xl flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-brand-coral" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-dark mb-1">Premium Paper</h3>
                    <p className="text-brand-secondary text-sm">270 GSM thick matte finish — no flimsy prints, these feel luxurious</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-warm rounded-xl flex items-center justify-center flex-shrink-0">
                    <PenTool className="w-6 h-6 text-brand-coral" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-dark mb-1">Custom Captions</h3>
                    <p className="text-brand-secondary text-sm">Add dates, names, or love notes in beautiful handwritten-style font</p>
                  </div>
                </div>
              </div>

              {/* Color Swatches */}
              <div className="bg-brand-warm rounded-2xl p-6">
                <h3 className="font-semibold text-brand-dark mb-4">Choose Your Border Color</h3>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { name: 'White', color: '#FFFFFF', border: true },
                    { name: 'Black', color: '#2B2B2B' },
                    { name: 'Cream', color: '#F5F1E8' },
                    { name: 'Pink', color: '#FFE5EE' },
                    { name: 'Blue', color: '#E3F2FD' },
                    { name: 'Mint', color: '#E8F5E9' },
                    { name: 'Lavender', color: '#F3E5F5' },
                    { name: 'Peach', color: '#FFE0B2' }
                  ].map((c) => (
                    <div key={c.name} className="text-center">
                      <div
                        className={`w-12 h-12 rounded-xl mx-auto mb-1 shadow-sm ${c.border ? 'border border-gray-200' : ''}`}
                        style={{ backgroundColor: c.color }}
                      />
                      <span className="text-xs text-brand-secondary">{c.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-brand-secondary text-center">Mix different colors in the same order!</p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== DELIVERY TIMELINE SECTION ==================== */}
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2
                className="text-2xl md:text-3xl font-normal text-brand-dark mb-3"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Plan Your Surprise
              </h2>
              <p className="text-brand-secondary">Order ahead to ensure your gift arrives on time</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
              {/* Timeline Visual */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                {[
                  { day: 'Day 1', label: 'You Order', icon: Sparkles, active: true },
                  { day: 'Day 1-2', label: 'We Print', icon: Camera },
                  { day: 'Day 2-3', label: 'Shipped', icon: Package },
                  { day: 'Day 3-6', label: 'Delivered!', icon: Gift, highlight: true }
                ].map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 ${
                          step.highlight
                            ? 'bg-green-100'
                            : step.active
                              ? 'bg-brand-coral/10'
                              : 'bg-gray-100'
                        }`}
                      >
                        <step.icon className={`w-6 h-6 ${
                          step.highlight
                            ? 'text-green-600'
                            : step.active
                              ? 'text-brand-coral'
                              : 'text-gray-400'
                        }`} />
                      </div>
                      <span className="text-xs text-brand-secondary">{step.day}</span>
                      <span className={`text-sm font-medium ${step.highlight ? 'text-green-600' : 'text-brand-dark'}`}>
                        {step.label}
                      </span>
                    </div>
                    {idx < 3 && (
                      <div className="hidden md:block w-16 h-0.5 bg-gray-200" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Delivery Info */}
              <div className="bg-brand-warm rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-brand-coral" />
                  <div>
                    <p className="font-medium text-brand-dark">Free Shipping Across India</p>
                    <p className="text-sm text-brand-secondary">Delivered safely to your doorstep</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  3-6 Business Days
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== TESTIMONIALS SECTION ==================== */}
        {testimonials.length > 0 && (
          <section className="py-12 md:py-16 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2
                  className="text-2xl md:text-3xl font-normal text-brand-dark mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Real Stories from Happy Couples
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((t, idx) => (
                  <div
                    key={idx}
                    className="bg-brand-warm rounded-2xl p-6 relative"
                  >
                    <Quote className="w-10 h-10 text-brand-coral/10 absolute top-4 right-4" />
                    <div className="flex gap-1 mb-4">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-brand-dark mb-4 leading-relaxed">"{t.text}"</p>
                    <p className="font-semibold text-brand-coral text-sm">{t.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ==================== HOW IT WORKS (Minimal) ==================== */}
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2
                className="text-2xl md:text-3xl font-normal text-brand-dark mb-3"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Order in 3 Simple Steps
              </h2>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              {[
                { num: '1', title: 'Upload', desc: 'Select photos' },
                { num: '2', title: 'Customize', desc: 'Add borders & captions' },
                { num: '3', title: 'Receive', desc: '3-6 days delivery' }
              ].map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center text-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mb-2"
                      style={{ backgroundColor: 'var(--color-coral)' }}
                    >
                      {step.num}
                    </div>
                    <h3 className="font-semibold text-brand-dark">{step.title}</h3>
                    <p className="text-sm text-brand-secondary">{step.desc}</p>
                  </div>
                  {idx < 2 && (
                    <ArrowRight className="w-6 h-6 text-gray-300 hidden md:block" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== FAQ SECTION ==================== */}
        {faq.length > 0 && (
          <section className="py-12 md:py-16 px-4 bg-white">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2
                  className="text-2xl md:text-3xl font-normal text-brand-dark mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Common Questions
                </h2>
              </div>

              <div className="space-y-3">
                {faq.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-brand-warm rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left"
                    >
                      <span className="font-medium text-brand-dark pr-4">{item.question}</span>
                      {openFaqIndex === idx ? (
                        <ChevronUp className="w-5 h-5 text-brand-coral flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {openFaqIndex === idx && (
                      <div className="px-5 pb-4">
                        <p className="text-brand-secondary leading-relaxed">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ==================== FINAL CTA ==================== */}
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div
              className="rounded-2xl shadow-xl p-8 md:p-12 text-white text-center"
              style={{ background: 'linear-gradient(135deg, var(--color-coral) 0%, var(--color-coral-dark) 100%)' }}
            >
              <h2
                className="text-2xl md:text-3xl font-normal mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {cta.headline || 'Ready to Create Something Special?'}
              </h2>
              <p className="text-lg mb-6 opacity-90 max-w-xl mx-auto">
                {cta.subheadline || 'Turn your favorite memories into beautiful retro prints that will be cherished forever.'}
              </p>
              <Link to={cta.button_link || '/studio'}>
                <Button
                  size="lg"
                  className="bg-white hover:bg-gray-50 rounded-full px-8 py-6 font-semibold"
                  style={{ color: 'var(--color-coral)' }}
                >
                  <Image className="w-5 h-5 mr-2" />
                  {cta.button_text || 'Start Creating'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
