import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { usePhotos } from '@/components/PhotoContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Check, Image as ImageIcon, Maximize2, Palette, Type, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const borderOptions = [
  { value: 'white', label: 'White', color: '#FFFFFF', textColor: 'text-gray-600' },
  { value: 'black', label: 'Black', color: '#2B2B2B', textColor: 'text-white' },
  { value: 'cream', label: 'Cream', color: '#F5F1E8', textColor: 'text-gray-700' },
  { value: 'pink', label: 'Pink', color: '#FFE5EE', textColor: 'text-gray-700' },
  { value: 'blue', label: 'Blue', color: '#E3F2FD', textColor: 'text-gray-700' },
  { value: 'mint', label: 'Mint', color: '#E8F5E9', textColor: 'text-gray-700' },
  { value: 'lavender', label: 'Lavender', color: '#F3E5F5', textColor: 'text-gray-700' },
  { value: 'peach', label: 'Peach', color: '#FFE0B2', textColor: 'text-gray-700' }
];

const effectOptions = [
  { value: 'original', label: 'Original' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'noir', label: 'Noir' },
  { value: 'vivid', label: 'Vivid' },
  { value: 'dramatic', label: 'Dramatic' }
];

const effects = {
  original: '',
  vintage: 'sepia-[0.3] contrast-[1.1] brightness-[1.05]',
  noir: 'grayscale contrast-[1.2]',
  vivid: 'saturate-[1.4] contrast-[1.1]',
  dramatic: 'contrast-[1.3] brightness-[0.95]'
};

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

export default function PhotoEditor() {
  const navigate = useNavigate();
  const { getPhotoById, updatePhoto, removePhoto, viewMode, viewOrderNumber, savePhotoToDatabase } = usePhotos();
  const [editedPhoto, setEditedPhoto] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [fitDimensions, setFitDimensions] = useState({ width: 0, height: 0 });
  
  const [initialPanState, setInitialPanState] = useState(null);
  const dragStartRef = useRef(null);
  const pinchStartRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  // Image loading state for smooth transitions
  const [displayUrl, setDisplayUrl] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const photoId = urlParams.get('photo_id');

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (photoId) {
      const photo = getPhotoById(photoId);
      if (photo) {
        setEditedPhoto({ ...photo });
        // Set initial display URL - prefer blob URL if available (faster)
        const initialUrl = photo.image_url;
        setDisplayUrl(initialUrl);
        setImageLoading(true);
        setImageLoaded(false);
      } else {
        toast.error('Photo not found');
        navigate(createPageUrl('Studio'));
      }
    }
  }, [photoId, getPhotoById, navigate]);

  // Handle smooth transition when photo URL changes (blob -> cloud)
  useEffect(() => {
    if (!editedPhoto) return;
    
    const newUrl = editedPhoto.cloud_url || editedPhoto.image_url;
    
    // If URL hasn't changed, skip
    if (newUrl === displayUrl) return;
    
    // If we have a working image, preload the new one before switching
    if (imageLoaded && displayUrl) {
      const img = new Image();
      img.onload = () => {
        setDisplayUrl(newUrl);
        // Don't reset imageLoaded - keep showing current image
      };
      img.onerror = () => {
        // If cloud URL fails, keep using current URL
        console.warn('Failed to load new URL, keeping current');
      };
      img.src = newUrl;
    } else {
      // No image loaded yet, just set the URL
      setDisplayUrl(newUrl);
    }
  }, [editedPhoto?.image_url, editedPhoto?.cloud_url, displayUrl, imageLoaded]);

  useEffect(() => {
    if (!containerRef.current || !editedPhoto) return;
    
    const observer = new ResizeObserver(entries => {
      const { width: containerWidth, height: containerHeight } = entries[0].contentRect;
      
      if (containerWidth === 0 || containerHeight === 0 || 
          editedPhoto.original_width === 0 || editedPhoto.original_height === 0) return;

      const scale = Math.max(
        containerWidth / editedPhoto.original_width,
        containerHeight / editedPhoto.original_height
      );
      
      const width = editedPhoto.original_width * scale;
      const height = editedPhoto.original_height * scale;
      
      setFitDimensions({ width: Math.round(width), height: Math.round(height) });
      setContainerSize({ width: Math.round(containerWidth), height: Math.round(containerHeight) });
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [editedPhoto?.original_width, editedPhoto?.original_height]);

  const handleUpdate = (field, value) => {
    setEditedPhoto(prev => ({ ...prev, [field]: value }));
    setActiveTool(null);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this photo?')) {
      removePhoto(photoId);
      toast.success('Photo deleted');
      navigate(createPageUrl('Studio'));
    }
  };

  const handleSave = async () => {
    if (saving || !editedPhoto) return;
    
    setSaving(true);
    
    const zoom = editedPhoto.crop_data?.zoom ?? 1;
    const offsetX = editedPhoto.crop_data?.offset?.x ?? 0;
    const offsetY = editedPhoto.crop_data?.offset?.y ?? 0;
    
    const normalizedOffsetX = fitDimensions.width > 0 ? (offsetX / fitDimensions.width) : 0;
    const normalizedOffsetY = fitDimensions.height > 0 ? (offsetY / fitDimensions.height) : 0;
    
    const updates = {
      border_color: editedPhoto.border_color,
      effect: editedPhoto.effect,
      caption: editedPhoto.caption || '',
      crop_data: { 
        zoom, 
        offset: { 
          x: normalizedOffsetX, 
          y: normalizedOffsetY 
        } 
      }
    };
    
    updatePhoto(photoId, updates);
    
    // If viewing an order, also save to database
    if (viewMode === 'order') {
      await savePhotoToDatabase(photoId, updates);
      navigate(createPageUrl('Studio') + `?order=${viewOrderNumber}`);
    } else {
      toast.success('Photo saved!');
      navigate(createPageUrl('Studio'));
    }
  };

  const getClampedOffset = useCallback((offset, zoom) => {
    if (!containerSize.width || !fitDimensions.width) return { x: 0, y: 0 };

    const scaledWidth = fitDimensions.width * zoom;
    const scaledHeight = fitDimensions.height * zoom;

    const maxPanX = Math.max(0, (scaledWidth - containerSize.width) / 2);
    const maxPanY = Math.max(0, (scaledHeight - containerSize.height) / 2);

    return {
      x: Math.max(-maxPanX, Math.min(maxPanX, offset.x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, offset.y))
    };
  }, [containerSize, fitDimensions]);

  const updateZoom = useCallback((newZoomValue, currentOffset) => {
    const clampedZoom = Math.max(1, Math.min(5, newZoomValue));
    const newOffset = getClampedOffset(currentOffset, clampedZoom);
    return { newZoom: clampedZoom, newOffset };
  }, [getClampedOffset]);

  const enterAdjustMode = () => {
    const currentCrop = editedPhoto.crop_data || { zoom: 1, offset: { x: 0, y: 0 } };
    setInitialPanState({ zoom: currentCrop.zoom ?? 1, offset: currentCrop.offset || { x: 0, y: 0 } });
    setIsAdjusting(true);
    setActiveTool(null);
  };

  const handleConfirmAdjust = () => {
    setIsAdjusting(false);
    setInitialPanState(null);
  };

  const handleCancelAdjust = () => {
    if (initialPanState) {
      setEditedPhoto(prev => ({
        ...prev,
        crop_data: { zoom: initialPanState.zoom, offset: initialPanState.offset }
      }));
    }
    setIsAdjusting(false);
    setInitialPanState(null);
  };

  const handleDoubleClick = () => {
    if (!isAdjusting) enterAdjustMode();
  };

  const handleWheel = (e) => {
    if (isAdjusting && !isTouchDevice) {
      e.preventDefault();
      const currentZoom = editedPhoto.crop_data?.zoom ?? 1;
      const currentOffset = editedPhoto.crop_data?.offset || { x: 0, y: 0 };
      const newZoom = currentZoom - e.deltaY * 0.005;
      const { newZoom: updatedZoom, newOffset } = updateZoom(newZoom, currentOffset);
      setEditedPhoto(prev => ({
        ...prev,
        crop_data: { zoom: updatedZoom, offset: newOffset }
      }));
    }
  };

  const handleDragStart = (clientX, clientY) => {
    if (!isAdjusting || !fitDimensions.width) return;
    setIsDragging(true);
    const currentOffset = editedPhoto.crop_data?.offset || { x: 0, y: 0 };
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      offsetX: currentOffset.x,
      offsetY: currentOffset.y
    };
  };

  const handleDragMove = (clientX, clientY) => {
    if (!dragStartRef.current) return;

    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;

    const newOffsetX = dragStartRef.current.offsetX + dx;
    const newOffsetY = dragStartRef.current.offsetY + dy;

    const currentZoom = editedPhoto.crop_data?.zoom ?? 1;
    const clampedOffset = getClampedOffset({ x: newOffsetX, y: newOffsetY }, currentZoom);
    setEditedPhoto(prev => ({
      ...prev,
      crop_data: { zoom: currentZoom, offset: clampedOffset }
    }));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    dragStartRef.current = null;
    pinchStartRef.current = null;
  };

  const handleMouseDown = (e) => {
    if (isAdjusting) {
      e.preventDefault();
      e.stopPropagation();
      handleDragStart(e.clientX, e.clientY);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
  };

  const handleMouseMove = (e) => handleDragMove(e.clientX, e.clientY);
  
  const handleMouseUp = () => {
    handleDragEnd();
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    if (!isAdjusting) return;
    e.stopPropagation();
    
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const currentZoom = editedPhoto.crop_data?.zoom ?? 1;
      pinchStartRef.current = { distance, zoom: currentZoom };
      dragStartRef.current = null;
    }
  };

  const handleTouchMove = (e) => {
    if (!isAdjusting) return;
    e.preventDefault();
    e.stopPropagation();

    if (e.touches.length === 1 && dragStartRef.current) {
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2 && pinchStartRef.current) {
      const newDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = newDistance / pinchStartRef.current.distance;
      const newZoomValue = pinchStartRef.current.zoom * scale;
      const currentOffset = editedPhoto.crop_data?.offset || { x: 0, y: 0 };
      const { newZoom, newOffset } = updateZoom(newZoomValue, currentOffset);
      setEditedPhoto(prev => ({
        ...prev,
        crop_data: { zoom: newZoom, offset: newOffset }
      }));
    }
  };

  const handleTouchEnd = () => handleDragEnd();

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    // If cloud URL fails, try falling back to original image_url
    if (displayUrl !== editedPhoto?.image_url && editedPhoto?.image_url) {
      setDisplayUrl(editedPhoto.image_url);
    }
  };

  if (!editedPhoto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-warm">
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-coral)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const tools = [
    { id: 'border', label: 'Border', icon: Palette },
    { id: 'effect', label: 'Effect', icon: ImageIcon },
    { id: 'adjust', label: 'Adjust', icon: Maximize2 },
    { id: 'caption', label: 'Caption', icon: Type }
  ];

  const currentBorderOption = borderOptions.find(opt => opt.value === editedPhoto.border_color) || borderOptions[0];
  
  const zoom = editedPhoto.crop_data?.zoom ?? 1;
  const offsetX = editedPhoto.crop_data?.offset?.x ?? 0;
  const offsetY = editedPhoto.crop_data?.offset?.y ?? 0;

  const isActivelyMoving = isDragging || pinchStartRef.current !== null;

  const imageStyles = {
    transform: `scale(${zoom}) translate(${offsetX}px, ${offsetY}px)`,
    transformOrigin: 'center center',
    width: `${fitDimensions.width}px`,
    height: `${fitDimensions.height}px`,
    maxWidth: 'none',
    maxHeight: 'none',
    opacity: imageLoaded && fitDimensions.width > 0 ? 1 : 0,
    transition: isActivelyMoving ? 'opacity 0.3s' : 'transform 0.2s, opacity 0.3s',
  };

  return (
    <div className="min-h-screen bg-brand-warm pb-36">
      <div 
        className="flex items-center justify-center p-4 md:p-8 min-h-[60vh] md:min-h-[70vh]"
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-sm md:max-w-md"
        >
          <div 
            className={cn(
              'rounded-lg shadow-2xl overflow-hidden',
              borderColors[editedPhoto.border_color || 'white']
            )}
            style={{ aspectRatio: '3.4 / 4' }}
          >
            <div className="w-full h-full flex flex-col" style={{ padding: '2.86%' }}>
              <div 
                ref={containerRef}
                className={cn(
                  'w-full bg-gray-100 relative flex items-center justify-center',
                  isAdjusting ? 'overflow-visible' : 'overflow-hidden'
                )}
                style={{ 
                  aspectRatio: '3 / 3',
                  cursor: isAdjusting ? (isDragging ? 'grabbing' : 'grab') : 'default',
                  touchAction: isAdjusting ? 'none' : 'auto'
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Loading indicator */}
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-coral)' }} />
                      <span className="text-xs text-gray-500">Loading photo...</span>
                    </div>
                  </div>
                )}
                
                <img
                  key={displayUrl}
                  src={displayUrl}
                  alt="Photo"
                  className={cn(
                    'absolute pointer-events-none',
                    effects[editedPhoto.effect || 'original']
                  )}
                  style={imageStyles}
                  draggable={false}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
                
                {isAdjusting && (
                  <>
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{ boxShadow: 'rgb(30 30 30 / 60%) 0px 0px 0px 9999px' }}
                    />
                    <div className="absolute inset-0 z-20 pointer-events-none">
                      <button 
                        onClick={handleCancelAdjust}
                        className="absolute top-2 left-2 bg-white/90 text-gray-800 rounded-full w-9 h-9 md:w-10 md:h-10 flex items-center justify-center shadow-lg hover:bg-white transition-colors pointer-events-auto"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={handleConfirmAdjust}
                        className="absolute top-2 right-2 text-white rounded-full w-9 h-9 md:w-10 md:h-10 flex items-center justify-center shadow-lg transition-colors pointer-events-auto"
                        style={{ backgroundColor: 'var(--color-coral)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-coral-dark)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-coral)'}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex-1 flex items-center justify-center px-2 min-h-0">
                {editedPhoto.caption ? (
                  <p 
                    className={cn(
                      "w-full text-center text-sm md:text-base truncate",
                      currentBorderOption.textColor
                    )}
                    style={{ fontFamily: "'Caveat', cursive" }}
                  >
                    {editedPhoto.caption.slice(0, 30)}
                  </p>
                ) : (
                  <p className={cn("text-sm md:text-base italic", currentBorderOption.textColor, "opacity-50")}>No caption</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {!isAdjusting && (
        <p className="text-center text-xs md:text-sm text-gray-400 mb-4 px-4">
          {isTouchDevice ? 'Double-tap to adjust crop' : 'Double-click to adjust • Scroll to zoom'}
        </p>
      )}

      {isAdjusting && (
        <p className="text-center text-xs md:text-sm text-gray-500 font-semibold mb-4 px-4">
          {isTouchDevice ? 'Pinch to zoom • Drag to reposition' : 'Scroll to zoom • Drag to reposition'}
        </p>
      )}

      {!isAdjusting && (
        <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none px-2 md:px-4 pb-3 md:pb-4">
          <div className="max-w-lg mx-auto">
            <AnimatePresence>
              {activeTool && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mb-2 pointer-events-auto"
                >
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-2.5 md:p-3">
                    <div className="flex items-center gap-2 md:gap-3 overflow-x-auto hide-scrollbar pb-1">
                      {activeTool === 'border' && borderOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleUpdate('border_color', option.value)}
                          className="flex-shrink-0 flex flex-col items-center"
                        >
                          <div 
                           className={cn(
                             'w-10 h-10 md:w-12 md:h-12 rounded-full border-2 shadow-md transition-all',
                             editedPhoto.border_color === option.value 
                               ? 'ring-2 ring-offset-2 scale-110' 
                               : 'border-gray-300'
                           )}
                           style={{ 
                             backgroundColor: option.color,
                             borderColor: editedPhoto.border_color === option.value ? 'var(--color-coral)' : '',
                             '--tw-ring-color': 'var(--color-coral)'
                           }}
                          />
                          <p className="text-[10px] md:text-xs mt-0.5">{option.label}</p>
                        </button>
                      ))}

                      {activeTool === 'effect' && effectOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleUpdate('effect', option.value)}
                          className={cn(
                            'flex-shrink-0 rounded-xl overflow-hidden transition-all',
                            editedPhoto.effect === option.value && 'ring-2 ring-offset-2'
                          )}
                          style={editedPhoto.effect === option.value ? { '--tw-ring-color': 'var(--color-coral)' } : {}}
                        >
                          <div className="w-14 h-14 md:w-16 md:h-16 relative">
                            <img
                              src={editedPhoto.image_url}
                              alt={option.label}
                              className={cn('w-full h-full object-cover', effects[option.value])}
                            />
                          </div>
                          <p className="text-[10px] md:text-xs text-center mt-0.5 font-medium">{option.label}</p>
                        </button>
                      ))}

                      {activeTool === 'caption' && (
                        <Input
                          placeholder="Add a caption..."
                          value={editedPhoto.caption || ''}
                          onChange={(e) => setEditedPhoto(prev => ({ ...prev, caption: e.target.value.slice(0, 30) }))}
                          className="flex-1 mx-2"
                          style={{ fontFamily: "'Caveat', cursive" }}
                          maxLength={30}
                          autoFocus
                        />
                      )}
                    </div>
                    
                    <button
                      onClick={() => setActiveTool(null)}
                      className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-coral)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = ''}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pointer-events-auto">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-1.5 flex items-center justify-between gap-1">
                {tools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      if (tool.id === 'adjust') {
                        enterAdjustMode();
                      } else {
                        setActiveTool(prev => prev === tool.id ? null : tool.id);
                      }
                    }}
                    className={cn(
                      'flex-1 h-12 md:h-14 flex flex-col items-center justify-center rounded-xl transition-all',
                      activeTool === tool.id 
                        ? 'text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    )}
                    style={activeTool === tool.id ? { backgroundColor: 'var(--color-coral)' } : {}}
                  >
                    <tool.icon className="w-4 h-4 md:w-4.5 md:h-4.5" />
                    <span className="text-[10px] md:text-xs mt-0.5 font-medium">{tool.label}</span>
                  </button>
                ))}
                
                <div className="w-px h-7 md:h-9 bg-gray-200" />
                
                <button
                  onClick={handleDelete}
                  className="flex-1 h-12 md:h-14 flex flex-col items-center justify-center text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4 md:w-4.5 md:h-4.5" />
                  <span className="text-[10px] md:text-xs mt-0.5 font-medium">Delete</span>
                </button>
                
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 h-12 md:h-14 flex flex-col items-center justify-center text-white rounded-xl transition-colors disabled:opacity-50 active:scale-95"
                  style={{ backgroundColor: 'var(--color-coral)' }}
                  onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = 'var(--color-coral-dark)')}
                  onMouseLeave={(e) => !saving && (e.currentTarget.style.backgroundColor = 'var(--color-coral)')}
                >
                  <Check className="w-4 h-4 md:w-4.5 md:h-4.5" />
                  <span className="text-[10px] md:text-xs mt-0.5 font-medium">{saving ? 'Saving...' : 'Done'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}