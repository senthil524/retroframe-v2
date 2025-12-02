import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const PhotoContext = createContext();

export const usePhotos = () => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error('usePhotos must be used within PhotoProvider');
  }
  return context;
};

export const PhotoProvider = ({ children }) => {
  const [photos, setPhotos] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({ total: 0, uploaded: 0, failed: 0 });
  const blobUrlsToRevoke = useRef(new Set());

  const [viewMode, setViewMode] = useState(null); // null = normal, 'order' = viewing order
  const [viewOrderNumber, setViewOrderNumber] = useState(null);

  // Track current URL to detect changes
  const [currentUrl, setCurrentUrl] = useState(window.location.search);
  
  // Listen for URL changes (popstate for back/forward, custom event for programmatic navigation)
  useEffect(() => {
    const handleUrlChange = () => {
      setCurrentUrl(window.location.search);
    };
    
    window.addEventListener('popstate', handleUrlChange);
    
    // Also check URL periodically for SPA navigation
    const intervalId = setInterval(() => {
      if (window.location.search !== currentUrl) {
        setCurrentUrl(window.location.search);
      }
    }, 100);
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      clearInterval(intervalId);
    };
  }, [currentUrl]);

  // Initialize from localStorage or URL params (order viewing)
  useEffect(() => {
    const initializeCart = async () => {
      // Check if viewing an order via URL param
      const urlParams = new URLSearchParams(window.location.search);
      const orderNumber = urlParams.get('order');
      
      if (orderNumber) {
        const cleanOrderNumber = orderNumber.replace(/^#/, '');
        
        // Skip if already viewing this order
        if (viewMode === 'order' && viewOrderNumber === cleanOrderNumber) {
          return;
        }
        
        // Admin viewing an order - load photos from database
        try {
          const orderPhotos = await base44.entities.Photo.filter({ order_id: cleanOrderNumber });
          
          if (orderPhotos.length > 0) {
            const loadedPhotos = orderPhotos.map(photo => ({
              ...photo,
              cloud_url: photo.image_url,
              uploadStatus: 'uploaded'
            }));
            setPhotos(loadedPhotos);
            setViewMode('order');
            setViewOrderNumber(cleanOrderNumber);
            setCartId(`order_${cleanOrderNumber}`);
            return;
          } else {
            // No photos found for order
            setPhotos([]);
            setViewMode('order');
            setViewOrderNumber(cleanOrderNumber);
            setCartId(`order_${cleanOrderNumber}`);
            return;
          }
        } catch (error) {
          console.error('Failed to load order photos:', error);
        }
      } else {
        // Not viewing an order - reset to normal mode if we were in order mode
        if (viewMode === 'order') {
          setViewMode(null);
          setViewOrderNumber(null);
        }
      }

      // Normal cart initialization (only if not in order mode)
      if (!orderNumber) {
        const savedCartId = localStorage.getItem('retroframe_cart_id');
        const savedPhotos = localStorage.getItem('retroframe_photos');

        let currentCartId;
        if (savedCartId) {
          currentCartId = savedCartId;
          setCartId(savedCartId);
        } else {
          const newCartId = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          currentCartId = newCartId;
          setCartId(newCartId);
          localStorage.setItem('retroframe_cart_id', newCartId);
        }

        if (savedPhotos) {
          try {
            const parsed = JSON.parse(savedPhotos);
            
            // Clean up any photos with invalid blob URLs or no cloud URL
            const validPhotos = parsed.filter(photo => {
              // Only keep photos that have been successfully uploaded with cloud URLs
              if (photo.uploadStatus === 'uploaded' && photo.cloud_url) {
                return true;
              }
              
              // Remove photos with blob URLs (they're invalid after page reload)
              if (photo.image_url?.startsWith('blob:')) {
                return false;
              }
              
              return false;
            });
            
            setPhotos(validPhotos);
            
            // Show message if photos were cleaned up
            if (validPhotos.length < parsed.length) {
              const removed = parsed.length - validPhotos.length;
              console.log(`Cleaned up ${removed} stale photo(s)`);
            }
          } catch (error) {
            console.error('Failed to parse saved photos:', error);
            localStorage.removeItem('retroframe_photos');
          }
        }
      }
    };

    initializeCart();
  }, [currentUrl]);

  // Save to localStorage whenever photos change - only save uploaded photos (skip in order view mode)
  useEffect(() => {
    // Don't save to localStorage when viewing an order
    if (viewMode === 'order') return;

    // Only persist photos that have been successfully uploaded
    const photosToSave = photos.filter(photo => 
      photo.uploadStatus === 'uploaded' && photo.cloud_url
    );
    
    if (photosToSave.length > 0) {
      // Store only essential data, remove temporary fields
      const cleanedPhotos = photosToSave.map(photo => ({
        id: photo.id,
        cart_id: photo.cart_id,
        image_url: photo.cloud_url, // Use cloud URL, not blob URL
        cloud_url: photo.cloud_url,
        border_color: photo.border_color,
        effect: photo.effect,
        print_size: photo.print_size,
        caption: photo.caption,
        crop_data: photo.crop_data,
        original_width: photo.original_width,
        original_height: photo.original_height,
        uploadStatus: 'uploaded'
      }));
      
      localStorage.setItem('retroframe_photos', JSON.stringify(cleanedPhotos));
    } else {
      localStorage.removeItem('retroframe_photos');
    }
  }, [photos, viewMode]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      blobUrlsToRevoke.current.forEach(url => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          // Ignore errors
        }
      });
    };
  }, []);

  // Upload a single photo to cloud storage
  const uploadPhotoToCloud = useCallback(async (photo) => {
    if (!photo.file || photo.uploadStatus === 'uploaded') return photo;

    const oldBlobUrl = photo.image_url?.startsWith('blob:') ? photo.image_url : null;

    try {
      // Update status to uploading
      setPhotos(prev => prev.map(p => 
        p.id === photo.id ? { ...p, uploadStatus: 'uploading' } : p
      ));

      // Create a safe filename with timestamp to avoid server-side parsing errors
      const timestamp = Date.now();
      // Sanitize extension to alphanumeric only
      const extMatch = (photo.file.name.split('.').pop() || 'png').match(/^[a-zA-Z0-9]+/);
      const extension = extMatch ? extMatch[0] : 'png';
      const safeName = `photo_${timestamp}_${Math.random().toString(36).slice(2)}.${extension}`;
      const fileType = photo.file.type || 'image/png';
      
      // Create a fresh Blob and File to ensure clean metadata
      const blob = photo.file.slice(0, photo.file.size, fileType);
      const fileToUpload = new File([blob], safeName, { type: fileType });

      console.log(`Uploading: ${safeName} (${fileToUpload.size} bytes)`);

      // Upload to cloud
      const { file_url } = await base44.integrations.Core.UploadFile({ file: fileToUpload });

      // Update photo with cloud URL (replace blob URL) - ATOMIC UPDATE
      const updatedPhoto = {
        ...photo,
        image_url: file_url, // Replace blob URL with cloud URL
        cloud_url: file_url,
        uploadStatus: 'uploaded',
        file: null // Clear the file object to save memory
      };

      setPhotos(prev => prev.map(p => 
        p.id === photo.id ? updatedPhoto : p
      ));

      // Save photo record to database immediately after successful upload
      try {
        await base44.entities.Photo.create({
          cart_id: photo.cart_id,
          image_url: file_url,
          border_color: photo.border_color || 'white',
          effect: photo.effect || 'original',
          print_size: photo.print_size || 'vintage',
          caption: photo.caption || '',
          crop_data: photo.crop_data || { zoom: 1, offset: { x: 0, y: 0 } },
          original_width: photo.original_width || 0,
          original_height: photo.original_height || 0
        });
      } catch (dbError) {
        console.error('Failed to save photo to database:', dbError);
        // Photo is still uploaded to cloud, so don't fail the whole operation
      }

      // Delay blob URL cleanup to ensure React has re-rendered
      if (oldBlobUrl) {
        setTimeout(() => {
          try {
            URL.revokeObjectURL(oldBlobUrl);
            blobUrlsToRevoke.current.delete(oldBlobUrl);
          } catch (e) {
            // Ignore errors
          }
        }, 2000); // 2 second delay
      }

      setUploadProgress(prev => ({ ...prev, uploaded: prev.uploaded + 1 }));

      return updatedPhoto;
    } catch (error) {
      console.error('Upload failed for photo:', photo.id, error);
      
      setPhotos(prev => prev.map(p => 
        p.id === photo.id ? { ...p, uploadStatus: 'failed' } : p
      ));

      setUploadProgress(prev => ({ ...prev, failed: prev.failed + 1 }));

      return { ...photo, uploadStatus: 'failed' };
    }
  }, []);

  // Add photos and start uploading them
  const addPhotos = useCallback((newPhotos) => {
    const photosWithStatus = newPhotos.map(photo => {
      // Track blob URLs for cleanup
      if (photo.image_url?.startsWith('blob:')) {
        blobUrlsToRevoke.current.add(photo.image_url);
      }
      
      return {
        ...photo,
        uploadStatus: 'pending'
      };
    });

    setPhotos(prev => [...prev, ...photosWithStatus]);
    setUploadProgress(prev => ({ 
      ...prev, 
      total: prev.total + newPhotos.length 
    }));

    // Start uploading in the background with slight delay
    setTimeout(() => {
      photosWithStatus.forEach(photo => {
        uploadPhotoToCloud(photo);
      });
    }, 100);
  }, [uploadPhotoToCloud]);

  // Retry failed upload
  const retryUpload = useCallback((photoId) => {
    const photo = photos.find(p => p.id === photoId);
    if (photo && photo.uploadStatus === 'failed') {
      uploadPhotoToCloud(photo);
    }
  }, [photos, uploadPhotoToCloud]);

  const removePhoto = useCallback((photoId) => {
    const photo = photos.find(p => p.id === photoId);
    
    // Clean up blob URL if it exists
    if (photo?.image_url?.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(photo.image_url);
        blobUrlsToRevoke.current.delete(photo.image_url);
      } catch (e) {
        // Ignore errors
      }
    }

    setPhotos(prev => prev.filter(p => p.id !== photoId));

    // Update progress counters
    if (photo) {
      if (photo.uploadStatus === 'uploaded') {
        setUploadProgress(prev => ({ ...prev, total: prev.total - 1, uploaded: prev.uploaded - 1 }));
      } else if (photo.uploadStatus === 'failed') {
        setUploadProgress(prev => ({ ...prev, total: prev.total - 1, failed: prev.failed - 1 }));
      } else {
        setUploadProgress(prev => ({ ...prev, total: prev.total - 1 }));
      }
    }
  }, [photos]);

  const updatePhoto = useCallback((photoId, updates) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId ? { ...photo, ...updates } : photo
    ));
  }, []);

  const bulkUpdatePhotos = useCallback((field, value) => {
    setPhotos(prev => prev.map(photo => ({ ...photo, [field]: value })));
  }, []);

  const getPhotoById = useCallback((photoId) => {
    return photos.find(p => p.id === photoId);
  }, [photos]);

  const clearPhotos = useCallback(() => {
    // Clean up all blob URLs
    photos.forEach(photo => {
      if (photo.image_url?.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(photo.image_url);
          blobUrlsToRevoke.current.delete(photo.image_url);
        } catch (e) {
          // Ignore errors
        }
      }
    });

    setPhotos([]);
    setUploadProgress({ total: 0, uploaded: 0, failed: 0 });
    localStorage.removeItem('retroframe_photos');
    
    // Generate new cart ID
    const newCartId = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setCartId(newCartId);
    localStorage.setItem('retroframe_cart_id', newCartId);
  }, [photos]);

  // Check if all photos are uploaded
  const allPhotosUploaded = useCallback(() => {
    return photos.length > 0 && photos.every(p => p.uploadStatus === 'uploaded');
  }, [photos]);

  // Get upload statistics
  const getUploadStats = useCallback(() => {
    const pending = photos.filter(p => p.uploadStatus === 'pending' || p.uploadStatus === 'uploading').length;
    const uploaded = photos.filter(p => p.uploadStatus === 'uploaded').length;
    const failed = photos.filter(p => p.uploadStatus === 'failed').length;
    
    return { pending, uploaded, failed, total: photos.length };
  }, [photos]);

  // Save photo changes to database (for order viewing mode)
  const savePhotoToDatabase = useCallback(async (photoId, updates) => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;

    try {
      await base44.entities.Photo.update(photoId, updates);
      toast.success('Photo saved');
    } catch (error) {
      console.error('Failed to save photo:', error);
      toast.error('Failed to save changes');
    }
  }, [photos]);

  const value = {
    photos,
    cartId,
    uploadProgress,
    addPhotos,
    removePhoto,
    updatePhoto,
    bulkUpdatePhotos,
    getPhotoById,
    clearPhotos,
    retryUpload,
    allPhotosUploaded,
    getUploadStats,
    viewMode,
    viewOrderNumber,
    savePhotoToDatabase
  };

  return <PhotoContext.Provider value={value}>{children}</PhotoContext.Provider>;
};