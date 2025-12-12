import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Reordered: 8th→1st, 7th→2nd, 3rd→3rd, 4th→4th, rest as is
const heroImages = [
  {
    id: 1,
    src: '/hero-images/hero-8.webp',
    alt: 'Custom baby milestone retro polaroid prints India - RetroFrame'
  },
  {
    id: 2,
    src: '/hero-images/hero-7.webp',
    alt: 'Friends trip vintage polaroid prints flat lay - order online India'
  },
  {
    id: 3,
    src: '/hero-images/hero-3.webp',
    alt: 'Polaroid prints wall decor ideas with fairy lights - RetroFrame India'
  },
  {
    id: 4,
    src: '/hero-images/hero-4.webp',
    alt: 'Unboxing custom polaroid prints - premium packaging RetroFrame'
  },
  {
    id: 5,
    src: '/hero-images/hero-1.webp',
    alt: 'Custom retro polaroid prints online India - vintage photo printing'
  },
  {
    id: 6,
    src: '/hero-images/hero-2.webp',
    alt: 'Polaroid prints gift idea India - personalized photo prints'
  },
  {
    id: 7,
    src: '/hero-images/hero-5.webp',
    alt: 'Workspace desk polaroid prints decor - home office RetroFrame'
  },
  {
    id: 8,
    src: '/hero-images/hero-6.webp',
    alt: 'Couple memories retro polaroid prints - anniversary gift India'
  }
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Preload next image for smooth transitions
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % heroImages.length;
    const img = new Image();
    img.src = heroImages[nextIndex].src;
  }, [currentIndex]);

  // Preload first few images on mount
  useEffect(() => {
    heroImages.slice(0, 3).forEach((image) => {
      const img = new Image();
      img.src = image.src;
    });
  }, []);

  // Pause on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <div
      className="relative w-full max-w-[500px] mx-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main carousel container */}
      <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={heroImages[currentIndex].src}
            alt={heroImages[currentIndex].alt}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            loading={currentIndex === 0 ? "eager" : "lazy"}
            fetchpriority={currentIndex === 0 ? "high" : "auto"}
            width={800}
            height={800}
            decoding="async"
          />
        </AnimatePresence>

        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5 text-gray-800" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5 text-gray-800" />
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-3 -right-3 w-24 h-24 bg-brand-coral/10 rounded-full blur-2xl -z-10" />
      <div className="absolute -top-3 -left-3 w-20 h-20 bg-pink-200/30 rounded-full blur-xl -z-10" />
    </div>
  );
}
