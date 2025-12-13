import React from 'react';
import { Link } from 'react-router-dom';
import { usePublishedLandingPages } from '@/lib/hooks/useLandingPage';
import SEO, { structuredData } from '@/components/seo/SEO';
import SEOBreadcrumb from '@/components/SEOBreadcrumb';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import Logo from '@/components/ui/Logo';
import {
  Sparkles,
  Heart,
  Gift,
  Star,
  ArrowRight,
  Cake,
  GraduationCap,
  Home,
  Baby,
  Users,
  Plane,
  Sun,
  Award,
  Briefcase,
  Calendar
} from 'lucide-react';

// Category icons mapping
const categoryIcons = {
  'anniversary-photo-gifts': Heart,
  'birthday-photo-gifts': Cake,
  'valentines-day-photo-gifts': Heart,
  'wedding-photo-gifts': Gift,
  'mothers-day-photo-gifts': Heart,
  'fathers-day-photo-gifts': Heart,
  'friendship-day-photo-gifts': Users,
  'raksha-bandhan-photo-gifts': Gift,
  'diwali-photo-gifts': Sun,
  'housewarming-photo-gifts': Home,
  'graduation-photo-gifts': GraduationCap,
  'baby-shower-photo-gifts': Baby,
  'new-year-photo-gifts': Calendar,
  'teachers-day-photo-gifts': Award,
  'farewell-photo-gifts': Briefcase,
  'long-distance-relationship-gifts': Plane
};

export default function Occasions() {
  // SWR hook for automatic caching
  const { data: occasions = [], isLoading } = usePublishedLandingPages('occasions');

  // Breadcrumbs
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Photo Gift Ideas by Occasion', url: '/occasions' }
  ];

  // Structured data
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://retroframe.co/occasions",
        "name": "Photo Gift Ideas by Occasion | RetroFrame",
        "description": "Find the perfect polaroid photo gift for every occasion - anniversaries, birthdays, weddings, festivals & more. Custom retro prints with free shipping across India.",
        "url": "https://retroframe.co/occasions",
        "isPartOf": { "@type": "WebSite", "name": "RetroFrame", "url": "https://retroframe.co" },
        "publisher": { "@type": "Organization", "name": "RetroFrame", "url": "https://retroframe.co" }
      },
      structuredData.breadcrumb(breadcrumbItems),
      {
        "@type": "ItemList",
        "itemListElement": occasions.map((occasion, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": occasion.h1_heading || occasion.title,
          "url": `https://retroframe.co/${occasion.slug}`
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-brand-warm">
      <SEO
        title="Photo Gift Ideas by Occasion | Polaroid Prints - RetroFrame"
        description="Find the perfect polaroid photo gift for every occasion - anniversaries, birthdays, weddings, festivals & more. Custom retro prints with free shipping across India."
        url="/occasions"
        type="website"
        keywords="photo gifts, polaroid prints, anniversary gift, birthday gift, wedding gift, diwali gift, occasion gifts india"
        structuredData={pageSchema}
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
        {/* Hero Section */}
        <section className="py-12 md:py-16 lg:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <SEOBreadcrumb items={breadcrumbItems} className="mb-6" />

            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-brand-coral/10 border border-brand-coral/20 px-4 py-2 rounded-full text-sm font-medium text-brand-coral mb-6">
                <Gift className="w-4 h-4" />
                Gift Ideas for Every Moment
              </div>

              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-normal leading-tight text-brand-dark mb-6"
                style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em' }}
              >
                Photo Gifts for Every Occasion
              </h1>

              <p className="text-lg md:text-xl text-brand-secondary max-w-3xl mx-auto leading-relaxed">
                From anniversaries to farewells, find the perfect way to turn your memories
                into beautiful retro polaroid prints. Because the best gifts come from the heart.
              </p>
            </div>

            {/* Occasions Grid */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-brand-coral border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {occasions.map((occasion) => {
                  const slugPart = occasion.slug.split('/')[1] || occasion.slug;
                  const IconComponent = categoryIcons[slugPart] || Gift;
                  // Derive simple name from slug (e.g., "anniversary-photo-gifts" -> "Anniversary Photo Gifts")
                  const cardTitle = slugPart.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

                  return (
                    <Link
                      key={occasion.id}
                      to={`/${occasion.slug}`}
                      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      {/* Image */}
                      <div className="aspect-[16/10] overflow-hidden relative">
                        {occasion.featured_image ? (
                          <img
                            src={occasion.featured_image}
                            alt={occasion.h1_heading || occasion.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-brand-coral/10 to-brand-warm flex items-center justify-center">
                            <IconComponent className="w-16 h-16 text-brand-coral/30" />
                          </div>
                        )}
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                        {/* Icon badge */}
                        <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md">
                          <IconComponent className="w-5 h-5 text-brand-coral" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 md:p-6">
                        <h2 className="text-lg md:text-xl font-semibold text-brand-dark mb-2 group-hover:text-brand-coral transition-colors">
                          {cardTitle}
                        </h2>
                        <p className="text-sm text-brand-secondary line-clamp-2 mb-4">
                          {occasion.meta_description?.slice(0, 100)}...
                        </p>
                        <div className="flex items-center text-brand-coral text-sm font-medium group-hover:gap-3 gap-2 transition-all">
                          Explore Ideas
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Why Polaroids Section */}
        <section className="py-12 md:py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2
                className="text-2xl md:text-3xl font-normal text-brand-dark mb-3"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Why Choose Polaroid Prints?
              </h2>
              <p className="text-brand-secondary max-w-2xl mx-auto">
                In a world of digital photos, there's something magical about holding a memory in your hands
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Heart,
                  title: 'Personal & Thoughtful',
                  description: 'Add custom captions, dates, and messages to make each photo uniquely meaningful'
                },
                {
                  icon: Gift,
                  title: 'Gift-Ready',
                  description: 'Beautiful packaging that\'s ready to gift - no wrapping needed'
                },
                {
                  icon: Star,
                  title: 'Premium Quality',
                  description: '270 GSM thick matte paper that looks and feels luxurious'
                }
              ].map((item, idx) => (
                <div key={idx} className="text-center p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-brand-coral/10 rounded-2xl flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-brand-coral" />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-dark mb-2">{item.title}</h3>
                  <p className="text-brand-secondary text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2
                    className="text-2xl md:text-3xl font-normal text-brand-dark mb-4"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    Simple, Transparent Pricing
                  </h2>
                  <p className="text-brand-secondary mb-6">
                    No hidden costs. Just beautiful prints delivered to your doorstep.
                  </p>
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-gray-400 line-through text-xl">₹399</span>
                    <span className="text-4xl md:text-5xl font-bold text-brand-dark">₹270</span>
                    <span className="text-brand-secondary">for 18 prints</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {['Free shipping across India', '270 GSM premium paper', 'Custom captions included', '8 border colors to choose'].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-brand-secondary">
                        <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xs">✓</span>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-center">
                  <Link to="/studio">
                    <Button
                      size="lg"
                      className="rounded-full px-10 py-7 text-white font-semibold text-lg shadow-xl"
                      style={{ background: 'linear-gradient(135deg, var(--color-coral) 0%, var(--color-coral-dark) 100%)' }}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Start Creating
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="text-2xl md:text-3xl font-normal text-brand-dark mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Can't Find What You're Looking For?
            </h2>
            <p className="text-brand-secondary mb-6">
              Our polaroid prints work for any occasion! Head to our studio and create something unique.
            </p>
            <Link to="/studio">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-white font-semibold"
                style={{ background: 'linear-gradient(135deg, var(--color-coral) 0%, var(--color-coral-dark) 100%)' }}
              >
                Create Custom Prints
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
