import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const borderColors = {
  white: 'bg-white',
  black: 'bg-[#2B2B2B]',
  cream: 'bg-[#F5F1E8]',
  pink: 'bg-[#FFE5EE]',
  blue: 'bg-[#E3F2FD]',
  mint: 'bg-[#E8F5E9]',
  lavender: 'bg-[#F3E5F5]',
  peach: 'bg-[#FFE0B2]'
};

const textColors = {
  white: 'text-gray-600',
  black: 'text-white',
  cream: 'text-gray-700',
  pink: 'text-gray-700',
  blue: 'text-gray-700',
  mint: 'text-gray-700',
  lavender: 'text-gray-700',
  peach: 'text-gray-700'
};

const effects = {
  original: '',
  vintage: 'sepia-[0.3] contrast-[1.1] brightness-[1.05]',
  noir: 'grayscale contrast-[1.2]',
  vivid: 'saturate-[1.4] contrast-[1.1]',
  dramatic: 'contrast-[1.3] brightness-[0.95]'
};

/**
 * PhotoPreviewFrame - Renders a photo exactly like Studio/PhotoFrame component
 * Uses the same "cover" scaling and transform logic for perfect match
 */
export default function PhotoPreviewFrame({ photo, className = '' }) {
  const containerRef = useRef(null);
  const [fitDimensions, setFitDimensions] = useState({ width: 0, height: 0 });

  // Calculate fitDimensions using "cover" logic - SAME as PhotoFrame.jsx
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver(entries => {
      const { width: containerWidth, height: containerHeight } = entries[0].contentRect;
      
      if (containerWidth === 0 || containerHeight === 0 || 
          !photo.original_width || !photo.original_height) return;

      // "cover" logic: scale the image so it fills the container, maintaining aspect ratio
      const scale = Math.max(
        containerWidth / photo.original_width,
        containerHeight / photo.original_height
      );
      
      const width = photo.original_width * scale;
      const height = photo.original_height * scale;
      
      setFitDimensions({ width: Math.round(width), height: Math.round(height) });
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [photo.original_width, photo.original_height]);

  const zoom = photo.crop_data?.zoom ?? 1;
  const normalizedOffsetX = photo.crop_data?.offset?.x ?? 0;
  const normalizedOffsetY = photo.crop_data?.offset?.y ?? 0;
  
  // Convert normalized offsets back to pixels for this container
  const offsetX = normalizedOffsetX * fitDimensions.width;
  const offsetY = normalizedOffsetY * fitDimensions.height;

  const imageStyles = {
    transform: `scale(${zoom}) translate(${offsetX}px, ${offsetY}px)`,
    transformOrigin: 'center center',
    width: `${fitDimensions.width}px`,
    height: `${fitDimensions.height}px`,
    maxWidth: 'none',
    maxHeight: 'none',
    visibility: fitDimensions.width > 0 ? 'visible' : 'hidden',
  };

  return (
    <div 
      className={cn(
        'rounded-lg shadow-lg overflow-hidden',
        borderColors[photo.border_color || 'white'],
        className
      )}
      style={{ aspectRatio: '3.4 / 4' }}
    >
      <div className="w-full h-full flex flex-col" style={{ padding: '2.86%' }}>
        <div 
          ref={containerRef}
          className="w-full bg-gray-100 relative overflow-hidden flex items-center justify-center"
          style={{ aspectRatio: '3 / 3' }}
        >
          <img
            src={photo.image_url}
            alt="Photo"
            className={cn(
              'absolute pointer-events-none',
              effects[photo.effect || 'original']
            )}
            style={imageStyles}
            draggable={false}
            crossOrigin="anonymous"
          />
        </div>
        
        <div className="flex-1 flex items-center justify-center px-2 min-h-0">
          {photo.caption && (
            <p 
              className={cn(
                "w-full text-center text-xs truncate",
                textColors[photo.border_color || 'white']
              )}
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              {photo.caption.slice(0, 30)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}