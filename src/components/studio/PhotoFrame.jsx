import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, Loader2, AlertTriangle } from 'lucide-react';

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

export default function PhotoFrame({ 
  photo, 
  onClick, 
  isSelected = false,
  className = '',
  hideCaption = false
}) {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [fitDimensions, setFitDimensions] = useState({ width: 0, height: 0 });

  // Calculate fitDimensions when container size or image dimensions change
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver(entries => {
      const { width: containerWidth, height: containerHeight } = entries[0].contentRect;
      
      if (containerWidth === 0 || containerHeight === 0 || 
          photo.original_width === 0 || photo.original_height === 0) return;

      // "cover" logic: scale the image so it fills the container, maintaining aspect ratio
      const scale = Math.max(
        containerWidth / photo.original_width,
        containerHeight / photo.original_height
      );
      
      const width = photo.original_width * scale;
      const height = photo.original_height * scale;
      
      setFitDimensions({ width: Math.round(width), height: Math.round(height) });
      setContainerSize({ width: Math.round(containerWidth), height: Math.round(containerHeight) });
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [photo.original_width, photo.original_height]);

  const handleClick = (e) => {
    if (e.target.closest('.selection-indicator')) {
      return;
    }
    onClick?.();
  };

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

  const isUploading = photo.uploadStatus === 'pending' || photo.uploadStatus === 'uploading';
  const isFailed = photo.uploadStatus === 'failed';

  return (
    <div className="relative">
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="selection-indicator absolute -top-2 -right-2 z-10 w-8 h-8 bg-[#FF6B9D] rounded-full flex items-center justify-center shadow-lg"
        >
          <Check className="w-5 h-5 text-white" />
        </motion.div>
      )}

      {/* Upload status indicator */}
      {isUploading && (
        <div className="absolute inset-0 z-20 bg-black/40 rounded-lg flex items-center justify-center">
          <div className="bg-white rounded-full p-2 shadow-lg">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          </div>
        </div>
      )}
      
      {isFailed && (
        <div className="absolute inset-0 z-20 bg-red-900/40 rounded-lg flex items-center justify-center">
          <div className="bg-white rounded-full p-2 shadow-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
        </div>
      )}

      <motion.div
        layout
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className={cn(
          'cursor-pointer transition-all duration-300',
          isSelected && 'ring-4 ring-[#FF6B9D] ring-offset-2',
          className
        )}
      >
        <div 
          className={cn(
            'rounded-lg shadow-lg overflow-hidden',
            borderColors[photo.border_color || 'white']
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
              />
            </div>
            
            <div className="flex-1 flex items-center justify-center px-2 min-h-0">
              {photo.caption ? (
                <p 
                  className={cn(
                    "w-full text-center text-[10px] md:text-xs truncate",
                    textColors[photo.border_color || 'white']
                  )}
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  {photo.caption.slice(0, 30)}
                </p>
              ) : !hideCaption && (
                <p className={cn(
                  "text-[10px] md:text-xs italic opacity-50",
                  textColors[photo.border_color || 'white']
                )}>
                  Tap to add caption
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}