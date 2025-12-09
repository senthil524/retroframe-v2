import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { usePhotos } from '@/components/PhotoContext.jsx';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import StudioHeader from '../components/studio/StudioHeader';
import PhotoCard from '../components/studio/PhotoCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Palette, ImageIcon, Maximize2, Loader2, ArrowLeft, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import SEO, { structuredData } from '@/components/seo/SEO';
import SEOBreadcrumb, { breadcrumbConfigs } from '@/components/SEOBreadcrumb';
import { trackViewItem, trackAddToCart, trackRemoveFromCart, trackEngagement } from '@/lib/analytics';

// Pricing: ₹270 for first 18 prints, ₹15 for each additional
const BASE_PRICE = 270; // Discounted from ₹399
const BASE_PRINTS = 18;
const ADDITIONAL_PRICE = 15;
const MINIMUM_PRINTS = 18;

const borderOptions = [
{ value: 'white', label: 'White', color: '#FFFFFF' },
{ value: 'black', label: 'Black', color: '#2B2B2B' },
{ value: 'cream', label: 'Cream', color: '#F5F1E8' },
{ value: 'pink', label: 'Pink', color: '#FFE5EE' },
{ value: 'blue', label: 'Blue', color: '#E3F2FD' },
{ value: 'mint', label: 'Mint', color: '#E8F5E9' },
{ value: 'lavender', label: 'Lavender', color: '#F3E5F5' },
{ value: 'peach', label: 'Peach', color: '#FFE0B2' }];


const effectOptions = [
{ value: 'original', label: 'Original' },
{ value: 'vintage', label: 'Vintage' },
{ value: 'noir', label: 'Noir' },
{ value: 'vivid', label: 'Vivid' },
{ value: 'dramatic', label: 'Dramatic' }];


const effects = {
  original: '',
  vintage: 'sepia-[0.3] contrast-[1.1] brightness-[1.05]',
  noir: 'grayscale contrast-[1.2]',
  vivid: 'saturate-[1.4] contrast-[1.1]',
  dramatic: 'contrast-[1.3] brightness-[0.95]'
};

const sizeOptions = [
{ value: 'vintage', label: 'Classic', size: '3.4×4"', disabled: false },
{ value: 'mini', label: 'Mini', size: '2.4×2.8"', disabled: true },
{ value: 'wide', label: 'Wide', size: '3.4×4.3"', disabled: true }];


export default function Studio() {
  const navigate = useNavigate();
  const { photos, cartId, addPhotos, removePhoto, updatePhoto, bulkUpdatePhotos, getUploadStats, viewMode, viewOrderNumber, savePhotoToDatabase } = usePhotos();
  const [activeTool, setActiveTool] = useState(null);
  const fileInputRef = useRef(null);
  const [showUploadProgress, setShowUploadProgress] = useState(false);

  const uploadStats = getUploadStats();
  const isOrderView = viewMode === 'order';

  // Track view_item when Studio page loads (only once)
  useEffect(() => {
    if (!isOrderView) {
      trackViewItem();
    }
  }, [isOrderView]);

  // Show upload progress toast when uploads are in progress
  useEffect(() => {
    if (uploadStats.pending > 0) {
      setShowUploadProgress(true);
      const percentage = uploadStats.total > 0 ?
      Math.round(uploadStats.uploaded / uploadStats.total * 100) :
      0;

      toast.loading(
        `Uploading ${uploadStats.pending} photo${uploadStats.pending > 1 ? 's' : ''}... ${percentage}%`,
        { id: 'upload-progress' }
      );
    } else if (showUploadProgress && uploadStats.total > 0) {
      setShowUploadProgress(false);

      if (uploadStats.failed > 0) {
        toast.error(
          `${uploadStats.uploaded} uploaded, ${uploadStats.failed} failed`,
          { id: 'upload-progress' }
        );
      } else {
        toast.success('All photos uploaded!', { id: 'upload-progress' });
      }
    }
  }, [uploadStats.pending, uploadStats.uploaded, uploadStats.failed, uploadStats.total, showUploadProgress]);

  const getImageDimensions = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
        URL.revokeObjectURL(url);
      };

      img.onerror = () => {
        resolve({ width: 0, height: 0 });
        URL.revokeObjectURL(url);
      };

      img.src = url;
    });
  };

  const handleUpload = async (files) => {
    if (!cartId || files.length === 0) return;

    const newPhotos = [];

    for (let file of files) {
      const localUrl = URL.createObjectURL(file);
      const dimensions = await getImageDimensions(file);

      const photoId = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      newPhotos.push({
        id: photoId,
        cart_id: cartId,
        image_url: localUrl,
        file: file,
        border_color: 'white',
        effect: 'original',
        print_size: 'vintage',
        original_width: dimensions.width,
        original_height: dimensions.height,
        crop_data: { zoom: 1, offset: { x: 0, y: 0 } }
      });
    }

    addPhotos(newPhotos);
    toast.success(`Added ${files.length} photo${files.length > 1 ? 's' : ''} - uploading in background`);

    // Track add_to_cart event
    const newTotalPhotos = photos.length + files.length;
    trackAddToCart(newTotalPhotos);

    // Track first photo upload for engagement
    if (photos.length === 0 && files.length > 0) {
      trackEngagement.firstPhotoUpload();
    }
  };

  const handleRemovePhoto = (photoId) => {
    removePhoto(photoId);
    toast.success('Photo removed');
    // Track remove from cart
    trackRemoveFromCart(photos.length - 1);
  };

  const handleBulkUpdate = (field, value) => {
    if (photos.length === 0) {
      toast.error('No photos to update');
      return;
    }

    bulkUpdatePhotos(field, value);
    toast.success(`Applied to all photos`);
    setActiveTool(null);
  };

  const handleCartClick = () => {
    if (photos.length === 0) {
      toast.error('Add some photos first!');
      return;
    }

    if (photos.length < MINIMUM_PRINTS) {
      toast.error(`Minimum ${MINIMUM_PRINTS} prints required!`);
      return;
    }

    navigate(createPageUrl('Cart'));
  };

  const handleAddPhotosClick = () => {
    fileInputRef.current?.click();
  };

  // Calculate total: ₹270 for first 18, ₹15 for each additional
  const calculateTotal = (count) => {
    if (count <= BASE_PRINTS) return BASE_PRICE;
    return BASE_PRICE + (count - BASE_PRINTS) * ADDITIONAL_PRICE;
  };
  const totalAmount = calculateTotal(photos.length);
  const firstPhoto = photos[0];

  return (
    <div className="min-h-screen bg-brand-warm pb-28">
      <SEO
        title="Create Your Polaroid Prints"
        description="Upload your photos and create custom polaroid prints. Choose from 8 border colors, 5 vintage effects, and add custom captions. Starting at Rs.270 for 18 prints."
        keywords="create polaroid prints, custom photo prints, upload photos, retro print creator, polaroid maker online"
        url="/studio"
        structuredData={structuredData.product}
      />

      {/* Breadcrumbs for SEO */}
      {!isOrderView && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <SEOBreadcrumb items={breadcrumbConfigs.studio} />
        </div>
      )}

      {isOrderView ? (
        <header className="bg-white border-b border-brand sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to={createPageUrl('OrderDetails') + `?order_number=${viewOrderNumber}`}>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-brand-coral" />
                    <h1 className="text-xl font-semibold text-brand-dark">Viewing Order #{viewOrderNumber}</h1>
                  </div>
                  <p className="text-sm text-gray-500">{photos.length} photos • Edit positions and save changes</p>
                </div>
              </div>
              <Link to={createPageUrl('PrintA4') + `?order_number=${viewOrderNumber}`}>
                <Button className="rounded-full text-white" style={{ backgroundColor: 'var(--color-coral)' }}>
                  Generate PDF
                </Button>
              </Link>
            </div>
          </div>
        </header>
      ) : (
        <StudioHeader
          photoCount={photos.length}
          totalAmount={totalAmount}
          onCartClick={handleCartClick} />
      )}


      {/* Status Messages Container - Properly positioned for mobile */}
      <div className="fixed top-16 md:top-20 left-0 right-0 z-40 px-3 md:px-4 pointer-events-none">
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Minimum prints warning */}
          {photos.length > 0 && photos.length < MINIMUM_PRINTS &&
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-auto">

              <div className="bg-amber-50 border border-amber-200 rounded-xl md:rounded-full shadow-lg px-3 md:px-4 py-2 md:py-2 text-center">
                <span className="text-xs md:text-sm font-medium text-amber-800 block md:inline">
                  Add {MINIMUM_PRINTS - photos.length} more {MINIMUM_PRINTS - photos.length === 1 ? 'print' : 'prints'} 
                  <span className="hidden md:inline"> (minimum {MINIMUM_PRINTS})</span>
                </span>
              </div>
            </motion.div>
          }

          {/* Upload Progress Indicator */}
          {uploadStats.pending > 0 &&
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-auto">

              <div className="bg-white rounded-xl md:rounded-full shadow-lg px-3 md:px-4 py-2 md:py-2 border border-gray-200">
                <div className="flex items-center gap-2 md:gap-3">
                  <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" style={{ color: 'var(--color-coral)' }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs md:text-sm font-medium text-gray-700 truncate">
                        Uploading {uploadStats.pending} of {uploadStats.total}
                      </span>
                      <span className="text-xs md:text-sm font-semibold flex-shrink-0 text-brand-coral">
                        {uploadStats.total > 0 ? Math.round(uploadStats.uploaded / uploadStats.total * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                      className="h-full transition-all duration-300 rounded-full"
                      style={{
                        width: `${uploadStats.uploaded / uploadStats.total * 100}%`,
                        backgroundColor: 'var(--color-coral)'
                      }} />

                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          }
        </div>
      </div>

      <div className="pt-24 px-4 md:px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          {photos.length === 0 ?
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[70vh]">

              <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-20 w-20 md:h-24 md:w-24 text-gray-300 mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}>

                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="text-2xl md:text-3xl font-semibold text-brand-dark mb-3" style={{ fontFamily: 'var(--font-serif)' }}>Your Photo Memories</h2>
              <p className="text-brand-secondary mb-2 max-w-md text-center px-4">
                Select your favorite photos to create beautiful retro prints. They'll upload in the background!
              </p>
              <p className="text-sm text-gray-400 mb-8">Minimum {MINIMUM_PRINTS} prints • <span className="line-through text-gray-300">₹399</span> ₹{BASE_PRICE} • Free Shipping</p>
              <Button
              onClick={handleAddPhotosClick}
              size="lg"
              className="text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all px-8 md:px-10 py-5 md:py-6 text-base md:text-lg"
              style={{ background: 'linear-gradient(135deg, var(--color-coral) 0%, var(--color-coral-dark) 100%)' }}>

                <Plus className="w-5 h-5 mr-2" />
                Add Photos
              </Button>
            </motion.div> :

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
              {photos.map((photo) =>
            <PhotoCard
              key={photo.id}
              photo={photo}
              onRemove={handleRemovePhoto} />

            )}
            </div>
          }
        </div>
      </div>

      {photos.length > 0 &&
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none px-2 md:px-4 pb-3 md:pb-4">
          <div className="max-w-lg mx-auto">
            <AnimatePresence>
              {activeTool &&
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-2 pointer-events-auto">

                  <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-2.5 md:p-3">
                    <div className="flex items-center gap-2 md:gap-3 overflow-x-auto hide-scrollbar pb-1">
                      {activeTool === 'border' && borderOptions.map((option) =>
                  <button
                    key={option.value}
                    onClick={() => handleBulkUpdate('border_color', option.value)}
                    className="flex-shrink-0 flex flex-col items-center">

                          <div
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 shadow-md hover:scale-110 transition-all"
                      style={{ backgroundColor: option.color, borderColor: '#ddd' }} />

                          <p className="text-[10px] md:text-xs text-center mt-0.5">{option.label}</p>
                        </button>
                  )}

                      {activeTool === 'effect' && effectOptions.map((option) =>
                  <button
                    key={option.value}
                    onClick={() => handleBulkUpdate('effect', option.value)}
                    className="flex-shrink-0 text-center">

                          {firstPhoto ?
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden hover:scale-110 transition-all border-2 border-gray-200">
                              <img
                        src={firstPhoto.image_url}
                        alt={option.label}
                        className={cn('w-full h-full object-cover', effects[option.value])} />

                            </div> :

                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-200 rounded-xl hover:scale-110 transition-all flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                            </div>
                    }
                          <p className="text-[10px] md:text-xs mt-0.5">{option.label}</p>
                        </button>
                  )}

                      {activeTool === 'size' && sizeOptions.map((option) =>
                  <button
                    key={option.value}
                    onClick={() => !option.disabled && handleBulkUpdate('print_size', option.value)}
                    disabled={option.disabled}
                    className={cn(
                      "flex-shrink-0 text-center",
                      option.disabled && "opacity-40 cursor-not-allowed"
                    )}>

                          <div className={cn(
                      "w-14 h-16 md:w-16 md:h-20 bg-gray-100 rounded-lg border-2 transition-all flex items-center justify-center",
                      option.disabled ? "border-gray-200" : "border-gray-300 hover:scale-110"
                    )}
                    style={!option.disabled ? { '--hover-border-color': 'var(--color-coral)' } : {}}
                    onMouseEnter={(e) => !option.disabled && (e.currentTarget.style.borderColor = 'var(--color-coral)')}
                    onMouseLeave={(e) => !option.disabled && (e.currentTarget.style.borderColor = '')}>

                            <Maximize2 className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                          </div>
                          <p className="text-[10px] md:text-xs mt-0.5 font-medium">{option.label}</p>
                          <p className="text-[9px] md:text-xs text-gray-400">{option.size}</p>
                          {option.disabled && <p className="text-[9px] md:text-xs text-gray-400">Soon</p>}
                        </button>
                  )}
                    </div>
                  </div>
                </motion.div>
            }
            </AnimatePresence>

            <div className="pointer-events-auto">
              <div className="bg-white/95 mx-4 md:mx-8 p-1.5 rounded-2xl backdrop-blur-md shadow-2xl border border-gray-200 flex items-center justify-between">
                <button
                onClick={() => setActiveTool((prev) => prev === 'border' ? null : 'border')}
                className={cn(
                  'flex-1 h-12 md:h-14 flex flex-col items-center justify-center rounded-xl transition-all',
                  activeTool === 'border' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
                )}
                style={activeTool === 'border' ? { backgroundColor: 'var(--color-coral)' } : {}}>

                  <Palette className="w-4 h-4 md:w-4.5 md:h-4.5" />
                  <span className="text-[10px] md:text-xs mt-0.5 font-medium">Border</span>
                </button>

                <button
                onClick={() => setActiveTool((prev) => prev === 'effect' ? null : 'effect')}
                className={cn(
                  'flex-1 h-12 md:h-14 flex flex-col items-center justify-center rounded-xl transition-all',
                  activeTool === 'effect' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
                )}
                style={activeTool === 'effect' ? { backgroundColor: 'var(--color-coral)' } : {}}>

                  <ImageIcon className="w-4 h-4 md:w-4.5 md:h-4.5" />
                  <span className="text-[10px] md:text-xs mt-0.5 font-medium">Effect</span>
                </button>

                <button
                onClick={() => setActiveTool((prev) => prev === 'size' ? null : 'size')}
                className={cn(
                  'flex-1 h-12 md:h-14 flex flex-col items-center justify-center rounded-xl transition-all',
                  activeTool === 'size' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
                )}
                style={activeTool === 'size' ? { backgroundColor: 'var(--color-coral)' } : {}}>

                  <Maximize2 className="w-4 h-4 md:w-4.5 md:h-4.5" />
                  <span className="text-[10px] md:text-xs mt-0.5 font-medium">Size</span>
                </button>

                <div className="w-px h-7 md:h-9 bg-gray-200" />

                <button
                onClick={handleAddPhotosClick}
                className="flex-1 h-12 md:h-14 mx-1 flex flex-col items-center justify-center text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all active:scale-95">

                  <Plus className="w-5 h-5 md:w-5.5 md:h-5.5" />
                  <span className="text-[10px] md:text-xs mt-0.5 font-medium">Add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleUpload(Array.from(e.target.files || []))}
        className="hidden" />


      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>);

}