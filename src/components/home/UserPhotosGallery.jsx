import React from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

const userPhotos = [
{
  id: 1,
  url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&q=80',
  borderColor: 'bg-white'
},
{
  id: 2,
  url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&q=80',
  borderColor: 'bg-[#FFE5EE]'
},
{
  id: 3,
  url: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=300&q=80',
  borderColor: 'bg-[#E3F2FD]'
},
{
  id: 4,
  url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&q=80',
  borderColor: 'bg-white'
},
{
  id: 5,
  url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80',
  borderColor: 'bg-[#F5F1E8]'
},
{
  id: 6,
  url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80',
  borderColor: 'bg-[#E8F5E9]'
}];


export default function UserPhotosGallery() {
  // Hidden for now - uncomment to show customer gallery
  return null;

  return (
    <section className="py-12 md:py-16 lg:py-20 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12">

          <div className="flex items-center justify-center gap-2 mb-3">
            <Camera className="w-5 h-5 md:w-6 md:h-6 text-brand-coral" />
            <span className="text-sm md:text-base font-semibold text-brand-coral uppercase tracking-wide">
              Customer Gallery
            </span>
          </div>
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-normal text-brand-dark mb-3"
            style={{ fontFamily: 'var(--font-serif)' }}>

            Prints Our Customers Love
          </h2>
          <p className="text-sm md:text-base text-brand-secondary max-w-2xl mx-auto">
            Real retro prints created by our happy customers. Your memories could be next!
          </p>
        </motion.div>

        {/* Photo Gallery - Scrollable on mobile */}
        <div className="relative">
          <div className="pt-3 pb-6 flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 overflow-x-auto md:overflow-visible md:pb-0 snap-x snap-mandatory">
            {userPhotos.map((photo, index) =>
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20, rotate: index % 2 === 0 ? -3 : 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -3 : 3 }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-auto snap-center cursor-pointer">

                <div
                className={`${photo.borderColor} rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-shadow`}
                style={{ padding: '6%' }}>

                  <div
                  className="w-full bg-gray-100 rounded overflow-hidden"
                  style={{ aspectRatio: '1 / 1' }}>

                    <img
                    src={photo.url}
                    alt="Customer print"
                    className="w-full h-full object-cover"
                    loading="lazy" />

                  </div>
                  <div className="h-4 md:h-6" />
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Scroll indicator for mobile */}
          <div className="flex md:hidden justify-center gap-1 mt-4">
            {userPhotos.map((_, i) =>
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            )}
          </div>
        </div>
      </div>
    </section>);

}