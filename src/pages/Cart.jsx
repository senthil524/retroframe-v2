import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { usePhotos } from '@/components/PhotoContext.jsx';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, ShoppingBag, Truck, Plus, ChevronDown, ChevronUp, Loader2, AlertTriangle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import PhotoFrame from '../components/studio/PhotoFrame';

// Pricing: ₹270 for first 18 prints, ₹15 for each additional
const BASE_PRICE = 270; // Discounted from ₹399
const ORIGINAL_PRICE = 399;
const BASE_PRINTS = 18;
const ADDITIONAL_PRICE = 15;
const MINIMUM_PRINTS = 18;
const SHIPPING_COST = 0; // Free shipping

export default function Cart() {
  const navigate = useNavigate();
  const { photos, removePhoto, getUploadStats, retryUpload } = usePhotos();
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  
  const uploadStats = getUploadStats();
  const hasUploading = uploadStats.pending > 0;
  const hasFailed = uploadStats.failed > 0;

  const handleRemovePhoto = (photoId) => {
    const photo = photos.find((p) => p.id === photoId);
    if (photo?.image_url?.startsWith('blob:')) {
      URL.revokeObjectURL(photo.image_url);
    }
    removePhoto(photoId);
    toast.success('Photo removed');
  };

  // Calculate total: ₹270 for first 18, ₹15 for each additional
  const calculateTotal = (count) => {
    if (count <= BASE_PRINTS) return BASE_PRICE;
    return BASE_PRICE + (count - BASE_PRINTS) * ADDITIONAL_PRICE;
  };
  const subtotal = calculateTotal(photos.length);
  const shipping = SHIPPING_COST; // Always free
  const total = subtotal + shipping;

  const canCheckout = photos.length >= MINIMUM_PRINTS && !hasUploading && !hasFailed;

  // Calculate savings
  const originalPrice = photos.length <= BASE_PRINTS ? ORIGINAL_PRICE : ORIGINAL_PRICE + (photos.length - BASE_PRINTS) * ADDITIONAL_PRICE;
  const savings = originalPrice - subtotal;

  return (
    <div className="min-h-screen bg-brand-warm">
      {/* Header */}
      <header className="bg-white border-b border-brand sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full">

              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-brand-dark" style={{ fontFamily: 'var(--font-serif)' }}>Your Cart</h1>
              <p className="text-sm text-gray-500">{photos.length} items</p>
            </div>
          </div>
        </div>
      </header>

      {/* Upload Status Banner */}
      {photos.length > 0 && (hasUploading || hasFailed) && (
        <div className="max-w-6xl mx-auto px-4 pt-4">
          {hasUploading && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4"
            >
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-blue-800">
                    Uploading {uploadStats.pending} photo{uploadStats.pending > 1 ? 's' : ''}...
                  </p>
                  <p className="text-sm text-blue-600">Please wait before checkout</p>
                  <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden mt-2">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${uploadStats.total > 0 ? (uploadStats.uploaded / uploadStats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {hasFailed && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-red-800">
                    {uploadStats.failed} photo{uploadStats.failed > 1 ? 's' : ''} failed to upload
                  </p>
                  <p className="text-sm text-red-600">Go back to Studio to retry or remove them</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(createPageUrl('Studio'))}
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  Fix Issues
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {photos.length === 0 ?
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20">

            <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Add some photos to get started</p>
            <Button
            onClick={() => navigate(createPageUrl('Studio'))}
            className="rounded-full px-8 text-white font-semibold"
            style={{ backgroundColor: 'var(--color-coral)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-coral-dark)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-coral)'}>

              Start Creating
            </Button>
          </motion.div> :

        <div className="pb-32 md:pb-8">
            {/* Photo Strip - Horizontal Scroll */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-brand-dark">Your Photos ({photos.length})</h2>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(createPageUrl('Studio'))}
                className="text-brand-coral hover:text-brand-coral-dark hover:bg-brand-coral/5">

                  <Plus className="w-4 h-4 mr-1" />
                  Add More
                </Button>
              </div>

              <AnimatePresence mode="wait">
                {!showAllPhotos ?
              <motion.div
                key="strip"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative">

                    {/* Horizontal Scrollable Strip */}
                    <div className="py-5 flex gap-3 overflow-x-auto hide-scrollbar">
                      {photos.slice(0, 6).map((photo) =>
                  <div key={photo.id} className="relative group flex-shrink-0">
                          <div className="w-28 h-32 md:w-36 md:h-40 pointer-events-none">
                            <PhotoFrame photo={photo} hideCaption />
                          </div>
                          <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePhoto(photo.id);
                      }}
                      className="absolute -top-2 -right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg pointer-events-auto">

                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                  )}
                      {photos.length > 6 &&
                  <button
                    onClick={() => setShowAllPhotos(true)}
                    className="flex-shrink-0 w-28 h-32 md:w-36 md:h-40 bg-brand-warm-light border-2 border-dashed border-brand-coral rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-brand-coral/5 transition-colors">

                          <div className="text-2xl font-bold text-brand-coral">+{photos.length - 6}</div>
                          <span className="text-xs text-brand-coral font-medium">View All</span>
                        </button>
                  }
                    </div>
                  </motion.div> :

              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative">

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                      {photos.map((photo) =>
                  <div key={photo.id} className="relative group">
                          <div className="w-full aspect-[3/4] pointer-events-none">
                            <PhotoFrame photo={photo} hideCaption />
                          </div>
                          <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePhoto(photo.id);
                      }}
                      className="absolute -top-2 -right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg pointer-events-auto">

                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                  )}
                    </div>
                    <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllPhotos(false)}
                  className="mt-4 mx-auto flex items-center text-gray-600 hover:text-brand-coral">

                      <ChevronUp className="w-4 h-4 mr-1" />
                      Show Less
                    </Button>
                  </motion.div>
              }
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">

              <h2 className="text-xl font-semibold text-brand-dark mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-gray-600">
                  <div>
                    <span className="text-sm">{photos.length} prints</span>
                    {photos.length <= BASE_PRINTS && (
                      <span className="text-xs text-gray-400 ml-2">(₹{BASE_PRICE} for {BASE_PRINTS})</span>
                    )}
                    {photos.length > BASE_PRINTS && (
                      <span className="text-xs text-gray-400 ml-2">(₹{BASE_PRICE} + {photos.length - BASE_PRINTS} × ₹{ADDITIONAL_PRICE})</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 line-through text-xs mr-2">₹{originalPrice}</span>
                    <span className="font-semibold">₹{subtotal}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-gray-600">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    <span className="text-sm">Shipping</span>
                  </div>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>

                {savings > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-green-700 leading-relaxed">
                      You're saving <span className="font-bold">₹{savings}</span> on this order!
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t-2 border-gray-100">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-lg font-semibold text-brand-dark">Total</span>
                    <span className="text-3xl font-bold text-brand-coral">₹{total}</span>
                  </div>
                  <p className="text-xs text-gray-500 text-right">Including all taxes</p>
                </div>
              </div>
            </motion.div>

            {/* Minimum prints warning */}
            {photos.length < MINIMUM_PRINTS &&
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center mb-6">

                <p className="text-amber-800 font-medium">
                  Add {MINIMUM_PRINTS - photos.length} more {MINIMUM_PRINTS - photos.length === 1 ? 'print' : 'prints'} to checkout (minimum {MINIMUM_PRINTS} prints)
                </p>
              </motion.div>
          }
          </div>
        }
      </div>

      {/* Fixed Bottom Checkout Button */}
      {photos.length > 0 &&
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-brand-coral">₹{total}</p>
              </div>
              
              <Button
              size="lg"
              onClick={() => navigate(createPageUrl('Checkout'))}
              disabled={!canCheckout}
              className="rounded-full text-lg px-10 py-6 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold shadow-lg"
              style={{ backgroundColor: 'var(--color-coral)' }}
              onMouseEnter={(e) => !canCheckout ? null : e.currentTarget.style.backgroundColor = 'var(--color-coral-dark)'}
              onMouseLeave={(e) => !canCheckout ? null : e.currentTarget.style.backgroundColor = 'var(--color-coral)'}>

                {hasUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Uploading...
                  </>
                ) : hasFailed ? (
                  'Fix Upload Errors'
                ) : photos.length < MINIMUM_PRINTS ? (
                  `Add ${MINIMUM_PRINTS - photos.length} More`
                ) : (
                  'Checkout'
                )}
              </Button>
            </div>
          </div>
        </div>
      }

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>);

}