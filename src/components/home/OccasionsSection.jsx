import React from 'react';
import { Link } from 'react-router-dom';
import { usePublishedLandingPages } from '@/lib/hooks/useLandingPage';
import { ArrowRight, Gift } from 'lucide-react';

export default function OccasionsSection() {
  const { data: occasions, isLoading } = usePublishedLandingPages('occasions');

  if (isLoading || !occasions || occasions.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-normal text-brand-dark mb-3 md:mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Photo Gifts for Every Occasion
          </h2>
          <p className="text-base md:text-lg text-brand-secondary max-w-2xl mx-auto">
            Create personalized polaroid prints for birthdays, anniversaries, and special moments
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {occasions.map((occasion) => {
            // Derive simple name from slug (e.g., "occasions/anniversary-photo-gifts" -> "Anniversary Photo Gifts")
            const slugPart = occasion.slug.split('/')[1] || occasion.slug;
            const cardTitle = slugPart.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

            return (
              <Link
                key={occasion.id}
                to={`/${occasion.slug}`}
                className="group block bg-brand-warm rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {occasion.featured_image ? (
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={occasion.featured_image}
                      alt={cardTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      width="400"
                      height="300"
                      decoding="async"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-brand-coral/10 flex items-center justify-center">
                    <Gift className="w-12 h-12 text-brand-coral/40" />
                  </div>
                )}
                <div className="p-5 md:p-6">
                  <h3 className="text-lg md:text-xl font-semibold text-brand-dark group-hover:text-brand-coral transition-colors mb-2">
                    {cardTitle}
                  </h3>
                  <p className="text-sm text-brand-secondary flex items-center gap-1">
                    Explore gift ideas
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8 md:mt-10">
          <Link
            to="/occasions"
            className="inline-flex items-center gap-2 text-brand-coral font-medium hover:gap-3 transition-all text-base md:text-lg"
          >
            View All Occasions
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
