import React from 'react';
import { motion } from 'framer-motion';

const samplePhotos = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80',
    caption: 'Friends forever',
    rotation: -4,
    delay: 0.2
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    caption: 'Mountain escape',
    rotation: 2,
    delay: 0.25
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80',
    caption: 'Love & memories',
    rotation: -2,
    delay: 0.3
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80',
    caption: 'Nature vibes',
    rotation: 3,
    delay: 0.35
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    caption: 'Beautiful day',
    rotation: -3,
    delay: 0.4
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=400&q=80',
    caption: 'Sweet moments',
    rotation: 2,
    delay: 0.45
  }
];

export default function HeroPhotoStack() {
  return (
    <div className="relative w-full max-w-[320px] sm:max-w-[380px] md:max-w-[450px] lg:max-w-[500px] mx-auto">
      {/* 3x2 Grid layout */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        {samplePhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, rotate: photo.rotation }}
            transition={{ 
              delay: index * 0.05, 
              duration: 0.25
            }}
            whileHover={{ 
              scale: 1.04, 
              rotate: 0, 
              zIndex: 20
            }}
            className="cursor-pointer"
          >
            <div 
              className="bg-white rounded-md sm:rounded-lg md:rounded-xl shadow-md hover:shadow-xl transition-shadow"
              style={{ padding: '7%' }}
            >
              {/* Photo area */}
              <div 
                className="w-full bg-gray-100 rounded-sm sm:rounded overflow-hidden"
                style={{ aspectRatio: '1 / 1' }}
              >
                <img
                  src={photo.url}
                  alt={`Retro polaroid print - ${photo.caption}`}
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchpriority={index === 0 ? "high" : "auto"}
                  decoding={index < 3 ? "sync" : "async"}
                  width={400}
                  height={400}
                />
              </div>
              
              {/* Caption area */}
              <div className="pt-1.5 sm:pt-2 md:pt-2.5 pb-0.5">
                <p 
                  className="text-[7px] sm:text-[9px] md:text-[11px] text-gray-500 italic text-center truncate"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  {photo.caption}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}