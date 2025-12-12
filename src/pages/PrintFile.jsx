import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';

const borderColors = {
  white: '#FFFFFF',
  black: '#2B2B2B',
  cream: '#F5F1E8',
  pink: '#FFE5EE',
  blue: '#E3F2FD',
  mint: '#E8F5E9',
  lavender: '#F3E5F5',
  peach: '#FFE0B2'
};

const textColors = {
  white: '#4B5563',
  black: '#FFFFFF',
  cream: '#374151',
  pink: '#374151',
  blue: '#374151',
  mint: '#374151',
  lavender: '#374151',
  peach: '#374151'
};

const effects = {
  original: '',
  vintage: 'sepia(30%) contrast(110%) brightness(105%)',
  noir: 'grayscale(100%) contrast(120%)',
  vivid: 'saturate(140%) contrast(110%)',
  dramatic: 'contrast(130%) brightness(95%)'
};

// Print specifications - Card: 3.4" x 4", Photo: 3" x 3" with 0.2" gap
const DPI = 300;
const POLAROID_WIDTH_INCHES = 3.4;
const POLAROID_HEIGHT_INCHES = 4;
const PHOTO_SIZE_INCHES = 3; // 3" x 3" photo area
const PHOTO_GAP_INCHES = 0.2; // 0.2" gap on top, left, right
const PREVIEW_PADDING_PERCENT = (0.2 / 3.4) * 100; // ~5.88%
const CAPTION_HEIGHT_INCHES = 4 - 3 - 0.2; // 0.8" for caption area

function PrintFileContent() {
  const [order, setOrder] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const orderDetailsRef = useRef(null);
  const photoRefs = useRef([]);

  const urlParams = new URLSearchParams(window.location.search);
  const orderNumber = urlParams.get('order_number');

  useEffect(() => {
    if (orderNumber) {
      loadOrderAndPhotos();
    }
  }, [orderNumber]);

  const loadOrderAndPhotos = async () => {
    try {
      const orders = await base44.entities.Order.list();
      const foundOrder = orders.find(o => o.order_number === orderNumber);
      
      if (foundOrder) {
        setOrder(foundOrder);
        
        const allPhotos = await base44.entities.Photo.list();
        const orderPhotos = allPhotos.filter(p => p.order_id === orderNumber);
        setPhotos(orderPhotos);
      } else {
        toast.error('Order not found');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load order');
    }
    setLoading(false);
  };

  const generatePDF = async () => {
    if (!order || photos.length === 0) {
      toast.error('No photos to generate PDF');
      return;
    }

    setGenerating(true);
    toast.loading('Generating PDF...', { id: 'pdf-gen' });

    try {
      // Dynamic imports - only load when needed (saves ~200KB from main bundle)
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
      ]);

      // Create PDF - Letter size (8.5" x 11")
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter'
      });

      // Page 1: Order Details
      if (orderDetailsRef.current) {
        const canvas = await html2canvas(orderDetailsRef.current, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 8.5;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }

      // Pages 2+: Individual Photos (each on separate page)
      for (let i = 0; i < photos.length; i++) {
        const photoElement = photoRefs.current[i];
        
        if (photoElement) {
          // Add new page for each photo
          pdf.addPage();

          const canvas = await html2canvas(photoElement, {
            scale: 3, // Higher quality for photos
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true
          });

          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          
          // Center the photo on the page
          const imgWidthInches = POLAROID_WIDTH_INCHES;
          const imgHeightInches = POLAROID_HEIGHT_INCHES;
          const xPos = (8.5 - imgWidthInches) / 2;
          const yPos = (11 - imgHeightInches) / 2;
          
          pdf.addImage(imgData, 'JPEG', xPos, yPos, imgWidthInches, imgHeightInches);
        }

        // Update progress
        toast.loading(`Generating PDF... ${i + 1}/${photos.length}`, { id: 'pdf-gen' });
      }

      // Save the PDF
      const filename = `${order.order_number}_prints.pdf`;
      pdf.save(filename);

      toast.success('PDF downloaded successfully!', { id: 'pdf-gen' });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF', { id: 'pdf-gen' });
    }

    setGenerating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF8F5] to-white">
        <div className="w-8 h-8 border-4 border-[#FF6B9D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF8F5] to-white">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F5] to-white py-8">
      {/* Controls */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#2B2B2B]">Print File Ready</h1>
              <p className="text-gray-500 mt-1">Order #{order.order_number} • {photos.length} prints</p>
            </div>
            <Button
              onClick={generatePDF}
              disabled={generating}
              className="bg-[#FF6B9D] hover:bg-[#FF5589] rounded-full px-8 py-6"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden rendering area */}
      <div className="hidden">
        {/* Order Details Page */}
        <div 
          ref={orderDetailsRef}
          className="bg-white"
          style={{ 
            width: '8.5in', 
            height: '11in', 
            padding: '1in',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '32px' }}>Order Details</h1>
            
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Order Information</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <p style={{ color: '#6B7280', fontSize: '14px' }}>Order Number</p>
                  <p style={{ fontWeight: 'bold', fontSize: '24px' }}>{order.order_number}</p>
                </div>
                <div>
                  <p style={{ color: '#6B7280', fontSize: '14px' }}>Order Date</p>
                  <p style={{ fontWeight: '600' }}>{format(new Date(order.created_date), 'MMMM d, yyyy')}</p>
                </div>
                <div>
                  <p style={{ color: '#6B7280', fontSize: '14px' }}>Total Prints</p>
                  <p style={{ fontWeight: '600' }}>{order.total_items}</p>
                </div>
                <div>
                  <p style={{ color: '#6B7280', fontSize: '14px' }}>Total Amount</p>
                  <p style={{ fontWeight: '600' }}>₹{order.total_price}</p>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Customer Information</h2>
              <div>
                <p style={{ fontWeight: '600' }}>{order.customer_name}</p>
                <p>{order.customer_email}</p>
                <p>{order.customer_phone}</p>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Delivery Address</h2>
              <div>
                <p>{order.delivery_address.street}</p>
                <p>{order.delivery_address.city}, {order.delivery_address.state}</p>
                <p>{order.delivery_address.pincode}</p>
                <p>{order.delivery_address.country}</p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
              <p style={{ fontSize: '14px', color: '#6B7280' }}>
                Print Quality: 300 DPI | Card Size: 3.4" × 4" | Photo: 3" × 3"
              </p>
            </div>
          </div>
        </div>

        {/* Individual Photo Pages */}
        {photos.map((photo, index) => {
          const totalWidthPx = POLAROID_WIDTH_INCHES * DPI;
          const totalHeightPx = POLAROID_HEIGHT_INCHES * DPI;
          const framePaddingPx = (totalWidthPx * PREVIEW_PADDING_PERCENT) / 100;
          const captionHeightPx = (totalHeightPx * PREVIEW_CAPTION_PERCENT) / 100;
          const fontSizePx = captionHeightPx * 0.35;
          const pdfContainerWidth = totalWidthPx - (framePaddingPx * 2);
          const pdfContainerHeight = totalHeightPx - (framePaddingPx * 2) - captionHeightPx;

          const pdfContainerAspect = pdfContainerWidth / pdfContainerHeight;
          const imageAspect = photo.original_width / photo.original_height;

          let fitWidth, fitHeight;
          if (imageAspect > pdfContainerAspect) {
            fitHeight = pdfContainerHeight;
            fitWidth = pdfContainerHeight * imageAspect;
          } else {
            fitWidth = pdfContainerWidth;
            fitHeight = pdfContainerWidth / imageAspect;
          }

          const zoom = photo.crop_data?.zoom ?? 1;
          const normalizedOffsetX = photo.crop_data?.offset?.x ?? 0;
          const normalizedOffsetY = photo.crop_data?.offset?.y ?? 0;

          const onScreenContainerWidth = pdfContainerWidth;
          const onScreenContainerHeight = pdfContainerWidth;
          const onScreenScale = Math.max(
            onScreenContainerWidth / photo.original_width,
            onScreenContainerHeight / photo.original_height
          );
          const onScreenFitWidth = photo.original_width * onScreenScale;
          const onScreenFitHeight = photo.original_height * onScreenScale;
          const onScreenScaledWidth = onScreenFitWidth * zoom;
          const onScreenScaledHeight = onScreenFitHeight * zoom;
          const onScreenOverflowX = Math.max(0, onScreenScaledWidth - onScreenContainerWidth);
          const onScreenOverflowY = Math.max(0, onScreenScaledHeight - onScreenContainerHeight);
          const onScreenOffsetX = normalizedOffsetX * onScreenFitWidth;
          const onScreenOffsetY = normalizedOffsetY * onScreenFitHeight;
          const panRatioX = onScreenOverflowX > 0 ? onScreenOffsetX / (onScreenOverflowX / 2) : 0;
          const panRatioY = onScreenOverflowY > 0 ? onScreenOffsetY / (onScreenOverflowY / 2) : 0;
          const pdfScaledWidth = fitWidth * zoom;
          const pdfScaledHeight = fitHeight * zoom;
          const pdfOverflowX = Math.max(0, pdfScaledWidth - pdfContainerWidth);
          const pdfOverflowY = Math.max(0, pdfScaledHeight - pdfContainerHeight);
          const pdfOffsetX = panRatioX * (pdfOverflowX / 2);
          const pdfOffsetY = panRatioY * (pdfOverflowY / 2);

          return (
            <div
              key={photo.id}
              ref={(el) => (photoRefs.current[index] = el)}
              style={{
                backgroundColor: borderColors[photo.border_color || 'white'],
                width: `${totalWidthPx}px`,
                height: `${totalHeightPx}px`,
                padding: `${framePaddingPx}px`,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div
                style={{
                  width: `${pdfContainerWidth}px`,
                  height: `${pdfContainerHeight}px`,
                  position: 'relative',
                  overflow: 'hidden',
                  background: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: `${fitWidth}px`,
                    height: `${fitHeight}px`,
                    transform: `scale(${zoom}) translate(${pdfOffsetX}px, ${pdfOffsetY}px)`,
                    transformOrigin: 'center center'
                  }}
                >
                  <img
                    src={photo.image_url}
                    alt={`Print ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'block',
                      filter: effects[photo.effect || 'original']
                    }}
                    crossOrigin="anonymous"
                  />
                </div>
              </div>
              <div
                style={{
                  height: `${captionHeightPx}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 8px',
                  color: textColors[photo.border_color || 'white'],
                  fontSize: `${fontSizePx}px`,
                  fontFamily: "'Caveat', cursive",
                  textAlign: 'center',
                  overflow: 'hidden',
                  wordWrap: 'break-word'
                }}
              >
                {photo.caption || ''}
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Section */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-[#2B2B2B] mb-6">Preview</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Page 1: Order Details</h3>
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                <p className="text-gray-600 text-center">Order information will be on the first page</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Pages 2-{photos.length + 1}: Individual Prints</h3>
              <div className="grid grid-cols-3 gap-4">
              {photos.slice(0, 6).map((photo, idx) => (
                <div key={photo.id} className="aspect-[3.4/4] bg-gray-100 rounded-lg overflow-hidden">
                    <img src={photo.image_url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                {photos.length > 6 && (
                  <div className="aspect-[3.4/4] bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 font-semibold">+{photos.length - 6} more</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PrintFile() {
  return (
    <AdminAuthGuard>
      <PrintFileContent />
    </AdminAuthGuard>
  );
}