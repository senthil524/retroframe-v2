/**
 * Google Analytics 4 & Google Ads Event Tracking
 *
 * This module provides helpers to track ecommerce events for:
 * - Google Analytics 4 (GA4)
 * - Google Ads Conversion Tracking
 *
 * Events tracked:
 * - view_item: When user views the Studio page
 * - add_to_cart: When user uploads/adds a photo
 * - remove_from_cart: When user removes a photo
 * - begin_checkout: When user starts checkout
 * - add_shipping_info: When user submits shipping address
 * - add_payment_info: When user proceeds to payment
 * - purchase: When payment is successful
 *
 * @see https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */

// Product configuration
const PRODUCT = {
  item_id: 'RETRO-POLAROID-PRINT',
  item_name: 'Retro Polaroid Print',
  item_brand: 'RetroFrame',
  item_category: 'Photo Prints',
  item_category2: 'Polaroid Prints',
  item_variant: '3.4x4 inch',
  price: 15, // Price per print (for additional prints)
  currency: 'INR'
};

// Base pricing
const BASE_PRICE = 270;
const BASE_PRINTS = 18;
const ADDITIONAL_PRICE = 15;

/**
 * Check if gtag is available
 */
const isGtagAvailable = () => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

/**
 * Safe gtag call with error handling
 */
const safeGtag = (...args) => {
  try {
    if (isGtagAvailable()) {
      window.gtag(...args);
      console.log('[Analytics]', args[0], args[1], args[2]);
    }
  } catch (error) {
    console.warn('[Analytics] Error:', error);
  }
};

/**
 * Calculate total price based on print count
 */
const calculateTotal = (count) => {
  if (count <= BASE_PRINTS) return BASE_PRICE;
  return BASE_PRICE + (count - BASE_PRINTS) * ADDITIONAL_PRICE;
};

/**
 * Generate items array for ecommerce events
 */
const generateItems = (photoCount, options = {}) => {
  const items = [];

  // Base package (18 prints)
  items.push({
    item_id: 'RETRO-POLAROID-BASE',
    item_name: 'Retro Polaroid Prints - Base Pack (18)',
    item_brand: 'RetroFrame',
    item_category: 'Photo Prints',
    item_category2: 'Polaroid Prints',
    item_variant: options.borderColor || 'white',
    price: BASE_PRICE,
    quantity: 1
  });

  // Additional prints if any
  if (photoCount > BASE_PRINTS) {
    const additionalCount = photoCount - BASE_PRINTS;
    items.push({
      item_id: 'RETRO-POLAROID-EXTRA',
      item_name: 'Additional Polaroid Print',
      item_brand: 'RetroFrame',
      item_category: 'Photo Prints',
      item_category2: 'Polaroid Prints',
      item_variant: options.borderColor || 'white',
      price: ADDITIONAL_PRICE,
      quantity: additionalCount
    });
  }

  return items;
};

/**
 * Track page view (automatic with gtag config, but can be called manually for SPA)
 */
export const trackPageView = (pagePath, pageTitle) => {
  safeGtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle
  });
};

/**
 * Track when user views the product/Studio page
 */
export const trackViewItem = () => {
  safeGtag('event', 'view_item', {
    currency: 'INR',
    value: BASE_PRICE,
    items: [{
      item_id: 'RETRO-POLAROID-BASE',
      item_name: 'Retro Polaroid Prints',
      item_brand: 'RetroFrame',
      item_category: 'Photo Prints',
      price: BASE_PRICE,
      quantity: 1
    }]
  });
};

/**
 * Track when user adds a photo to their order
 */
export const trackAddToCart = (photoCount, options = {}) => {
  const value = calculateTotal(photoCount);

  safeGtag('event', 'add_to_cart', {
    currency: 'INR',
    value: value,
    items: generateItems(photoCount, options)
  });
};

/**
 * Track when user removes a photo from their order
 */
export const trackRemoveFromCart = (photoCount, options = {}) => {
  safeGtag('event', 'remove_from_cart', {
    currency: 'INR',
    value: ADDITIONAL_PRICE, // Value of removed item
    items: [{
      item_id: 'RETRO-POLAROID-PRINT',
      item_name: 'Retro Polaroid Print',
      item_brand: 'RetroFrame',
      item_category: 'Photo Prints',
      price: ADDITIONAL_PRICE,
      quantity: 1
    }]
  });
};

/**
 * Track when user views their cart
 */
export const trackViewCart = (photoCount, options = {}) => {
  const value = calculateTotal(photoCount);

  safeGtag('event', 'view_cart', {
    currency: 'INR',
    value: value,
    items: generateItems(photoCount, options)
  });
};

/**
 * Track when user begins checkout
 */
export const trackBeginCheckout = (photoCount, options = {}) => {
  const value = calculateTotal(photoCount);

  safeGtag('event', 'begin_checkout', {
    currency: 'INR',
    value: value,
    items: generateItems(photoCount, options)
  });
};

/**
 * Track when user submits shipping information
 */
export const trackAddShippingInfo = (photoCount, shippingTier = 'Free Shipping', options = {}) => {
  const value = calculateTotal(photoCount);

  safeGtag('event', 'add_shipping_info', {
    currency: 'INR',
    value: value,
    shipping_tier: shippingTier,
    items: generateItems(photoCount, options)
  });
};

/**
 * Track when user submits payment information / proceeds to payment
 */
export const trackAddPaymentInfo = (photoCount, paymentType = 'PayU', options = {}) => {
  const value = calculateTotal(photoCount);

  safeGtag('event', 'add_payment_info', {
    currency: 'INR',
    value: value,
    payment_type: paymentType,
    items: generateItems(photoCount, options)
  });
};

/**
 * Track successful purchase
 * This is the most important event for Google Ads conversion tracking
 */
export const trackPurchase = (orderData) => {
  const {
    orderNumber,
    photoCount,
    totalAmount,
    tax = 0,
    shipping = 0,
    coupon = null,
    options = {}
  } = orderData;

  const purchaseData = {
    transaction_id: orderNumber,
    value: totalAmount,
    tax: tax,
    shipping: shipping,
    currency: 'INR',
    items: generateItems(photoCount, options)
  };

  if (coupon) {
    purchaseData.coupon = coupon;
  }

  // Send to GA4
  safeGtag('event', 'purchase', purchaseData);

  // Send Google Ads conversion (if you have a conversion ID)
  // Replace 'AW-CONVERSION_ID/CONVERSION_LABEL' with your actual conversion tracking
  safeGtag('event', 'conversion', {
    send_to: 'AW-17759957136/purchase',
    value: totalAmount,
    currency: 'INR',
    transaction_id: orderNumber
  });
};

/**
 * Track failed/cancelled payment
 */
export const trackPaymentFailed = (orderNumber, errorReason = 'unknown') => {
  safeGtag('event', 'payment_failed', {
    transaction_id: orderNumber,
    error_reason: errorReason
  });
};

/**
 * Track custom events
 */
export const trackCustomEvent = (eventName, params = {}) => {
  safeGtag('event', eventName, params);
};

/**
 * Track user engagement events
 */
export const trackEngagement = {
  // Track when user uploads first photo
  firstPhotoUpload: () => {
    safeGtag('event', 'first_photo_upload', {
      event_category: 'engagement'
    });
  },

  // Track when user customizes a photo (border/effect change)
  photoCustomized: (customizationType) => {
    safeGtag('event', 'photo_customized', {
      event_category: 'engagement',
      customization_type: customizationType
    });
  },

  // Track when user adds caption
  captionAdded: () => {
    safeGtag('event', 'caption_added', {
      event_category: 'engagement'
    });
  },

  // Track CTA button clicks
  ctaClicked: (ctaName, ctaLocation) => {
    safeGtag('event', 'cta_click', {
      event_category: 'engagement',
      cta_name: ctaName,
      cta_location: ctaLocation
    });
  }
};

export default {
  trackPageView,
  trackViewItem,
  trackAddToCart,
  trackRemoveFromCart,
  trackViewCart,
  trackBeginCheckout,
  trackAddShippingInfo,
  trackAddPaymentInfo,
  trackPurchase,
  trackPaymentFailed,
  trackCustomEvent,
  trackEngagement
};
