import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const reviewsData = [
  {
    id: 1,
    name: 'Kaleesh',
    rating: 5,
    review: 'Absolutely blown away by the quality! These retro polaroid prints look so authentic and premium. The matte finish feels luxurious and the colors came out perfectly.',
    date: '2 weeks ago',
    avatar: 'K'
  },
  {
    id: 2,
    name: 'Karthika',
    rating: 5,
    review: 'Ordered 25 prints for my birthday party photo wall and they were the highlight! Everyone kept asking where I got them. Super fast delivery too.',
    date: '1 month ago',
    avatar: 'K'
  },
  {
    id: 3,
    name: 'Agila',
    rating: 4.5,
    review: 'The vintage effect transformed my photos into gorgeous art pieces. My memory wall looks straight out of Pinterest! Exceptional quality.',
    date: '3 weeks ago',
    avatar: 'A'
  },
  {
    id: 4,
    name: 'Lavanya',
    rating: 5,
    review: 'Gifted these to my parents for their anniversary with custom captions. They were so touched! The personal touch made it incredibly special.',
    date: '1 week ago',
    avatar: 'L'
  },
  {
    id: 5,
    name: 'Ganesh',
    rating: 5,
    review: 'As a photographer, I am very particular about print quality. RetroFrame exceeded my expectations! The 300 GSM paper is top-notch.',
    date: '5 days ago',
    avatar: 'G'
  },
  {
    id: 6,
    name: 'Vani',
    rating: 4.5,
    review: 'Created a beautiful travel memories collection with different border colors. The mint and lavender borders are so pretty! Love the customization.',
    date: '4 days ago',
    avatar: 'V'
  },
  {
    id: 7,
    name: 'Muthu',
    rating: 5,
    review: 'Best polaroid printing service in India! Ordered for my sister wedding and the prints arrived within 4 days. The noir effect looked stunning.',
    date: '3 days ago',
    avatar: 'M'
  },
  {
    id: 8,
    name: 'Swathi',
    rating: 5,
    review: 'Such a wonderful experience! The prints arrived beautifully packaged and the quality is amazing. Perfect for my room decor. Will definitely order again!',
    date: '1 week ago',
    avatar: 'S'
  }
];

// Shuffle reviews randomly
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const reviews = shuffleArray(reviewsData);

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => {
      const isFull = star <= Math.floor(rating);
      const isHalf = !isFull && star === Math.ceil(rating) && rating % 1 !== 0;
      
      return (
        <div key={star} className="relative">
          <Star className="w-4 h-4 fill-gray-200 text-gray-200" />
          {isFull && (
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 absolute inset-0" />
          )}
          {isHalf && (
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          )}
        </div>
      );
    })}
  </div>
);

export default function CustomerReviews() {
  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);
  
  return (
    <section className="py-12 md:py-16 lg:py-20 px-4 bg-brand-warm-light">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 
            className="text-2xl md:text-3xl lg:text-4xl font-normal text-brand-dark mb-3 md:mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            What Our Customers Say
          </h2>
          
          {/* Overall Rating */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 md:w-6 md:h-6 ${
                    star <= Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xl md:text-2xl font-bold text-brand-dark">{averageRating}</span>
          </div>
          <p className="text-sm md:text-base text-brand-secondary">
            Based on {reviews.length} reviews
          </p>
        </motion.div>

        {/* Horizontal Scrolling Reviews */}
        <div className="relative -mx-4 px-4">
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px] bg-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-md hover:shadow-lg transition-shadow snap-center"
              >
                {/* Quote Icon */}
                <Quote className="w-6 h-6 md:w-8 md:h-8 text-brand-coral/20 mb-3" />
                
                {/* Review Text */}
                <p className="text-sm md:text-base text-brand-secondary mb-4 leading-relaxed line-clamp-4">
                  "{review.review}"
                </p>
                
                {/* Rating */}
                <div className="mb-4 flex items-center gap-2">
                  <StarRating rating={review.rating} />
                  <span className="text-xs text-gray-500 font-medium">{review.rating}</span>
                </div>
                
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ backgroundColor: 'var(--color-coral)' }}
                  >
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-brand-dark text-sm md:text-base">{review.name}</p>
                    <p className="text-xs text-gray-400">{review.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    </section>
  );
}