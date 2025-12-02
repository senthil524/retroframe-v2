import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { usePhotos } from '@/components/PhotoContext.jsx';

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

export default function PhotoCard({ photo, onRemove }) {
  const navigate = useNavigate();
  const { retryUpload, viewMode, viewOrderNumber } = usePhotos();
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  // Use best available URL: prefer cloud_url when uploaded, fallback to image_url (blob)
  const bestUrl = photo.cloud_url || photo.image_url;
  const [displayUrl, setDisplayUrl] = useState(bestUrl);
  const [pendingUrl, setPendingUrl] = useState(null);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [fitDimensions, setFitDimensions] = useState({ width: 0, height: 0 });

  const rotation = ((photo.id.charCodeAt(0) % 4) - 2);

  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Smooth transition: preload new URL before switching
  useEffect(() => {
    const newBestUrl = photo.cloud_url || photo.image_url;
    
    // Skip if URL hasn't changed
    if (newBestUrl === displayUrl || newBestUrl === pendingUrl) return;
    
    // If we already have a loaded image, preload new one in background
    if (imageLoaded && displayUrl) {
      setPendingUrl(newBestUrl);
      const img = new Image();
      img.onload = () => {
        // New image ready, switch to it smoothly
        setDisplayUrl(newBestUrl);
        setPendingUrl(null);
        // Keep imageLoaded true for smooth transition
      };
      img.onerror = () => {
        // Failed to load new URL, keep current
        setPendingUrl(null);
        console.warn('Failed to preload new image URL');
      };
      img.src = newBestUrl;
    } else {
      // No image loaded yet, just set URL directly
      setDisplayUrl(newBestUrl);
    }
  }, [photo.image_url, photo.cloud_url, displayUrl, imageLoaded, pendingUrl]);

  // Calculate fitDimensions when container size or image dimensions change
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver(entries => {
      const { width: containerWidth, height: containerHeight } = entries[0].contentRect;
      
      if (containerWidth === 0 || containerHeight === 0 || 
          photo.original_width === 0 || photo.original_height === 0) return;

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

  const handleClick = () => {
    if (photo.uploadStatus === 'uploading' || photo.uploadStatus === 'pending') return;
    
    // If viewing an order, pass order param to maintain context
    if (viewMode === 'order' && viewOrderNumber) {
      navigate(createPageUrl('PhotoEditor') + `?photo_id=${photo.id}&order=${viewOrderNumber}`);
      return;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const cartId = urlParams.get('cart_id') || photo.cart_id;
    
    navigate(createPageUrl('PhotoEditor') + `?photo_id=${photo.id}&cart_id=${cartId}`);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove(photo.id);
  };

  const handleRetry = (e) => {
    e.stopPropagation();
    retryUpload(photo.id);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    console.error('Image failed to load:', displayUrl);
    setImageError(true);
  };

  const zoom = photo.crop_data?.zoom ?? 1;
  const normalizedOffsetX = photo.crop_data?.offset?.x ?? 0;
  const normalizedOffsetY = photo.crop_data?.offset?.y ?? 0;
  
  const offsetX = normalizedOffsetX * fitDimensions.width;
  const offsetY = normalizedOffsetY * fitDimensions.height;

  const imageStyles = {
    transform: `scale(${zoom}) translate(${offsetX}px, ${offsetY}px)`,
    transformOrigin: 'center center',
    width: `${fitDimensions.width}px`,
    height: `${fitDimensions.height}px`,
    maxWidth: 'none',
    maxHeight: 'none',
    opacity: fitDimensions.width > 0 && imageLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
  };

  const uploadStatus = photo.uploadStatus || 'uploaded';
  const isUploading = uploadStatus === 'uploading' || uploadStatus === 'pending';
  const isFailed = uploadStatus === 'failed';
  const isUploaded = uploadStatus === 'uploaded';

  return (
    <div
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      className={cn(
        "relative group transform transition-all duration-300",
        isUploading || isFailed ? "cursor-default" : "cursor-pointer hover:scale-105 hover:z-10 active:scale-95"
      )}
      style={{
        rotate: isHovered && !isUploading && !isFailed ? '0deg' : `${rotation}deg`
      }}
      onClick={handleClick}
    >
      {/* Upload Status Indicator */}
      {isUploading && (
        <div className="absolute -top-2 -right-2 z-20 w-7 h-7 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
          <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-white animate-spin" />
        </div>
      )}
      
      {isFailed && (
        <button
          onClick={handleRetry}
          className="absolute -top-2 -right-2 z-20 w-7 h-7 md:w-8 md:h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
          title="Retry upload"
        >
          <RefreshCw className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
        </button>
      )}

      {/* Desktop: show X on hover only */}
      {isUploaded && !isMobile && isHovered && (
        <button
          onClick={handleRemove}
          className="absolute -top-2 -right-2 z-20 bg-white text-gray-600 rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center shadow-lg border border-gray-200 hover:text-white hover:rotate-90 transition-all duration-200"
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-coral)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
        >
          <X className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      )}

      <div 
        className={cn(
          'rounded-lg shadow-lg overflow-hidden transition-shadow duration-300',
          borderColors[photo.border_color || 'white'],
          isHovered && !isUploading && !isFailed && 'shadow-2xl',
          (isUploading || isFailed) && 'opacity-80'
        )}
        style={{ aspectRatio: '3.4 / 4' }}
      >
        <div className="w-full h-full flex flex-col" style={{ padding: '2.86%' }}>
          <div 
            ref={containerRef}
            className="w-full bg-gray-100 relative overflow-hidden flex items-center justify-center"
            style={{ aspectRatio: '3 / 3' }}
          >
            {/* Loading placeholder - show when image not yet loaded */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <Loader2 className="w-5 h-5 md:w-6 md:h-6 text-gray-400 animate-spin" />
              </div>
            )}

            {/* Image */}
            <img
              key={displayUrl}
              src={displayUrl}
              alt="Photo"
              className={cn(
                'absolute pointer-events-none',
                effects[photo.effect || 'original']
              )}
              style={imageStyles}
              draggable={false}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            
            {/* Upload overlay */}
            {(isUploading || isFailed) && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                {isUploading && (
                  <div className="text-center px-2">
                    <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-white animate-spin mx-auto mb-1 md:mb-2" />
                    <p className="text-white text-[10px] md:text-xs font-medium">Uploading...</p>
                  </div>
                )}
                {isFailed && (
                  <div className="text-center px-2">
                    <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-white mx-auto mb-1 md:mb-2" />
                    <p className="text-white text-[10px] md:text-xs font-medium">Failed</p>
                    <p className="text-white text-[9px] md:text-xs">Tap to retry</p>
                  </div>
                )}
              </div>
            )}

            {/* Error state */}
            {imageError && !isUploading && !isFailed && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-gray-400" />
              </div>
            )}
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
            ) : (
              <p className={cn(
                "text-[10px] md:text-xs italic opacity-50",
                textColors[photo.border_color || 'white']
              )}>
                {isUploading ? 'Uploading...' : isFailed ? 'Failed' : 'Tap to edit'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}