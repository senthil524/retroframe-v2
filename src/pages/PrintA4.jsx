import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Loader2, Download } from 'lucide-react';
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
  white: '#2B2B2B',
  black: '#FFFFFF',
  cream: '#8B7355',
  pink: '#C2185B',
  blue: '#1565C0',
  mint: '#2E7D32',
  lavender: '#6A1B9A',
  peach: '#E65100'
};

const effects = {
  original: '',
  vintage: 'sepia(30%) contrast(110%) brightness(105%)',
  noir: 'grayscale(100%) contrast(120%)',
  vivid: 'saturate(140%) contrast(110%)',
  dramatic: 'contrast(130%) brightness(95%)'
};

// A4 Portrait: 210mm x 297mm
// Card size: 3.4" x 4" = 86.36mm x 101.6mm
// Cards are rotated 90°, so each cell is 101.6mm wide x 86.36mm tall
// Layout: 2 columns x 3 rows = 6 photos per page
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const CARD_WIDTH_INCHES = 3.4;
const CARD_HEIGHT_INCHES = 4;
const CARD_WIDTH_MM = CARD_WIDTH_INCHES * 25.4; // 86.36mm
const CARD_HEIGHT_MM = CARD_HEIGHT_INCHES * 25.4; // 101.6mm

// After 90° rotation, displayed dimensions swap
const CELL_WIDTH_MM = CARD_HEIGHT_MM; // 101.6mm
const CELL_HEIGHT_MM = CARD_WIDTH_MM; // 86.36mm

const COLS = 2;
const ROWS = 3;
const ITEMS_PER_PAGE = COLS * ROWS;

// Calculate margins to center the grid
const TOTAL_GRID_WIDTH = COLS * CELL_WIDTH_MM; // 203.2mm
const TOTAL_GRID_HEIGHT = ROWS * CELL_HEIGHT_MM; // 259.08mm
const MARGIN_LEFT = (A4_WIDTH_MM - TOTAL_GRID_WIDTH) / 2; // ~3.4mm
const MARGIN_TOP = (A4_HEIGHT_MM - TOTAL_GRID_HEIGHT) / 2; // ~18.96mm

// Photo area within polaroid (3" x 3" with 0.2" padding)
const PHOTO_PADDING_PERCENT = (0.2 / 3.4) * 100;
const CAPTION_HEIGHT_PERCENT = (0.6 / 4) * 100;

// PDF export at 300 DPI (3.4" x 4" = 1020px x 1200px)
const DPI = 300;
const PDF_WIDTH_PX = CARD_WIDTH_INCHES * DPI; // 1020px
const PDF_HEIGHT_PX = CARD_HEIGHT_INCHES * DPI; // 1200px
const PDF_PADDING_PX = 0.2 * DPI; // 60px
const PDF_CAPTION_HEIGHT_PX = 0.6 * DPI; // 180px
const PDF_PHOTO_WIDTH_PX = PDF_WIDTH_PX - (PDF_PADDING_PX * 2); // 900px
const PDF_PHOTO_HEIGHT_PX = PDF_HEIGHT_PX - PDF_PADDING_PX - PDF_CAPTION_HEIGHT_PX; // 960px

function PrintA4Content() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const orderNumber = searchParams.get('order_number');

  useEffect(() => {
    loadOrderAndPhotos();
  }, [orderNumber]);

  const loadOrderAndPhotos = async () => {
    if (!orderNumber) {
      setLoading(false);
      return;
    }

    try {
      const cleanOrderNumber = orderNumber.replace(/^#/, '');
      const orders = await base44.entities.Order.filter({ order_number: cleanOrderNumber });
      if (orders.length > 0) {
        setOrder(orders[0]);
        const orderPhotos = await base44.entities.Photo.filter({ order_id: cleanOrderNumber });
        setPhotos(orderPhotos);
      }
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    setGenerating(true);

    try {
      // Dynamic imports - only load when needed (saves ~200KB from main bundle)
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
      ]);

      // First page: Order details (A4 size)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Order Details Page
      const pageWidth = 210;
      let y = 20;

      // Header
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RetroFrame Print Order', pageWidth / 2, y, { align: 'center' });
      y += 15;

      // Order Info Box
      pdf.setDrawColor(200);
      pdf.setFillColor(250, 250, 250);
      pdf.roundedRect(15, y, pageWidth - 30, 45, 3, 3, 'FD');
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Order Number:', 25, y + 12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`#${order.order_number}`, 70, y + 12);

      pdf.setFont('helvetica', 'bold');
      pdf.text('Order Date:', 25, y + 24);
      pdf.setFont('helvetica', 'normal');
      pdf.text(new Date(order.created_date).toLocaleDateString('en-IN', { 
        day: 'numeric', month: 'long', year: 'numeric' 
      }), 70, y + 24);

      pdf.setFont('helvetica', 'bold');
      pdf.text('Total Prints:', 25, y + 36);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${photos.length} photos`, 70, y + 36);

      pdf.setFont('helvetica', 'bold');
      pdf.text('Total Amount:', 120, y + 12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`₹${order.total_price}`, 165, y + 12);

      pdf.setFont('helvetica', 'bold');
      pdf.text('Payment:', 120, y + 24);
      pdf.setFont('helvetica', 'normal');
      pdf.text(order.payment_status === 'success' ? 'Paid' : order.payment_status, 165, y + 24);

      y += 55;

      // Customer Details
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Customer Details', 15, y);
      y += 8;

      pdf.setDrawColor(200);
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(15, y, pageWidth - 30, 35, 3, 3, 'FD');

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Name:', 25, y + 10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(order.customer_name || '-', 55, y + 10);

      pdf.setFont('helvetica', 'bold');
      pdf.text('Email:', 25, y + 20);
      pdf.setFont('helvetica', 'normal');
      pdf.text(order.customer_email || '-', 55, y + 20);

      pdf.setFont('helvetica', 'bold');
      pdf.text('Phone:', 25, y + 30);
      pdf.setFont('helvetica', 'normal');
      pdf.text(order.customer_phone || '-', 55, y + 30);

      y += 45;

      // Delivery Address
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Delivery Address', 15, y);
      y += 8;

      pdf.setDrawColor(200);
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(15, y, pageWidth - 30, 50, 3, 3, 'FD');

      const addr = order.delivery_address || {};
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      let addrY = y + 10;
      if (addr.name) { pdf.text(addr.name, 25, addrY); addrY += 8; }
      if (addr.address1) { pdf.text(addr.address1, 25, addrY); addrY += 8; }
      if (addr.address2) { pdf.text(addr.address2, 25, addrY); addrY += 8; }
      pdf.text(`${addr.city || ''}, ${addr.state || ''} - ${addr.pincode || ''}`, 25, addrY);
      addrY += 8;
      if (addr.phone) { pdf.text(`Phone: ${addr.phone}`, 25, addrY); }

      y += 60;

      // Print Specifications
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Print Specifications', 15, y);
      y += 8;

      pdf.setDrawColor(200);
      pdf.setFillColor(250, 250, 250);
      pdf.roundedRect(15, y, pageWidth - 30, 30, 3, 3, 'FD');

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Card Size: 3.4" x 4" (86.36mm x 101.6mm)', 25, y + 10);
      pdf.text('Resolution: 300 DPI', 25, y + 20);
      pdf.text('Photo Area: 3" x 3" with 0.2" border', 120, y + 10);
      pdf.text(`Pages: ${photos.length + 1} (including this cover)`, 120, y + 20);

      // Footer
      pdf.setFontSize(9);
      pdf.setTextColor(128);
      pdf.text('Generated by RetroFrame • retroframe.co', pageWidth / 2, 280, { align: 'center' });
      pdf.setTextColor(0);

      // Photo pages - each photo on its own 3.4" x 4" page
      for (let i = 0; i < photos.length; i++) {
        pdf.addPage([CARD_WIDTH_INCHES * 25.4, CARD_HEIGHT_INCHES * 25.4], 'portrait');

        const photo = photos[i];
        const borderColor = borderColors[photo.border_color] || borderColors.white;
        const textColor = textColors[photo.border_color] || textColors.white;
        const effect = effects[photo.effect] || effects.original;

        // Create canvas at exact 300 DPI (1020 x 1200 px)
        const canvas = document.createElement('canvas');
        canvas.width = PDF_WIDTH_PX;
        canvas.height = PDF_HEIGHT_PX;
        const ctx = canvas.getContext('2d');

        // Fill background with border color
        ctx.fillStyle = borderColor;
        ctx.fillRect(0, 0, PDF_WIDTH_PX, PDF_HEIGHT_PX);

        // Load and draw image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = photo.image_url;
        });

        // Calculate image fit using "cover" logic - SAME as PhotoFrame.jsx
        // Scale so image fills container while maintaining aspect ratio
        const scale = Math.max(
          PDF_PHOTO_WIDTH_PX / img.width,
          PDF_PHOTO_HEIGHT_PX / img.height
        );
        
        const fitWidth = img.width * scale;
        const fitHeight = img.height * scale;

        const zoom = photo.crop_data?.zoom ?? 1;
        // Convert normalized offsets to pixels (same as PhotoFrame)
        const offsetX = (photo.crop_data?.offset?.x ?? 0) * fitWidth;
        const offsetY = (photo.crop_data?.offset?.y ?? 0) * fitHeight;

        // Draw photo area with clipping
        ctx.save();
        ctx.beginPath();
        ctx.rect(PDF_PADDING_PX, PDF_PADDING_PX, PDF_PHOTO_WIDTH_PX, PDF_PHOTO_HEIGHT_PX);
        ctx.clip();

        // Apply effect filter
        if (effect) {
          ctx.filter = effect;
        }

        // Calculate draw position - SAME transform as PhotoFrame
        // transform: scale(zoom) translate(offsetX, offsetY)
        // transformOrigin: center center
        const scaledWidth = fitWidth * zoom;
        const scaledHeight = fitHeight * zoom;
        
        // Center the image first, then apply zoom and offset
        const centerX = PDF_PADDING_PX + (PDF_PHOTO_WIDTH_PX / 2);
        const centerY = PDF_PADDING_PX + (PDF_PHOTO_HEIGHT_PX / 2);
        
        // The transform in CSS is: scale(zoom) translate(offsetX, offsetY)
        // This means: first translate, then scale (CSS applies right to left)
        // So final position = center + (offset * zoom)
        const drawX = centerX - (scaledWidth / 2) + (offsetX * zoom);
        const drawY = centerY - (scaledHeight / 2) + (offsetY * zoom);

        ctx.drawImage(img, drawX, drawY, scaledWidth, scaledHeight);
        ctx.restore();

        // Draw caption
        if (photo.caption) {
          ctx.fillStyle = textColor;
          ctx.font = `${PDF_CAPTION_HEIGHT_PX * 0.35}px Caveat, cursive`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const captionY = PDF_HEIGHT_PX - (PDF_CAPTION_HEIGHT_PX / 2);
          ctx.fillText(photo.caption, PDF_WIDTH_PX / 2, captionY, PDF_WIDTH_PX - 40);
        }

        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, CARD_WIDTH_INCHES * 25.4, CARD_HEIGHT_INCHES * 25.4);
      }

      pdf.save(`Order_${orderNumber}_Print.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-coral" />
      </div>
    );
  }

  if (!order || photos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Order not found or no photos</p>
      </div>
    );
  }

  const pages = Math.ceil(photos.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">Print File Generator</h1>
            <p className="text-gray-600">
              Order: #{orderNumber} • {photos.length} prints • {pages} page{pages > 1 ? 's' : ''}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Layout: 2×3 grid, A4 Portrait, Cards rotated 90°
            </p>
          </div>
          <Button
            onClick={generatePDF}
            disabled={generating}
            className="bg-brand-coral hover:bg-brand-coral-dark text-white"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Preview - A4 layout with 2x3 grid */}
      <div className="space-y-8">
        {Array.from({ length: pages }).map((_, pageIndex) => {
          const pagePhotos = photos.slice(pageIndex * ITEMS_PER_PAGE, (pageIndex + 1) * ITEMS_PER_PAGE);
          
          return (
            <div
              key={pageIndex}
              className="bg-white mx-auto shadow-lg"
              style={{
                width: `${A4_WIDTH_MM}mm`,
                height: `${A4_HEIGHT_MM}mm`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Crop Marks */}
              <svg 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  pointerEvents: 'none', 
                  zIndex: 100 
                }}
              >
                {Array.from({ length: COLS + 1 }).map((_, i) => {
                  const x = MARGIN_LEFT + (i * CELL_WIDTH_MM);
                  return (
                    <React.Fragment key={`v-${i}`}>
                      <line x1={`${x}mm`} y1="0" x2={`${x}mm`} y2="8mm" stroke="black" strokeWidth="0.3" />
                      <line x1={`${x}mm`} y1={`${A4_HEIGHT_MM}mm`} x2={`${x}mm`} y2={`${A4_HEIGHT_MM - 8}mm`} stroke="black" strokeWidth="0.3" />
                    </React.Fragment>
                  );
                })}
                {Array.from({ length: ROWS + 1 }).map((_, i) => {
                  const y = MARGIN_TOP + (i * CELL_HEIGHT_MM);
                  return (
                    <React.Fragment key={`h-${i}`}>
                      <line x1="0" y1={`${y}mm`} x2="3mm" y2={`${y}mm`} stroke="black" strokeWidth="0.3" />
                      <line x1={`${A4_WIDTH_MM}mm`} y1={`${y}mm`} x2={`${A4_WIDTH_MM - 3}mm`} y2={`${y}mm`} stroke="black" strokeWidth="0.3" />
                    </React.Fragment>
                  );
                })}
              </svg>

              {/* Photo Grid */}
              <div 
                style={{
                  position: 'absolute',
                  display: 'grid',
                  gridTemplateColumns: `repeat(${COLS}, ${CELL_WIDTH_MM}mm)`,
                  gridTemplateRows: `repeat(${ROWS}, ${CELL_HEIGHT_MM}mm)`,
                  gap: 0,
                  left: `${MARGIN_LEFT}mm`,
                  top: `${MARGIN_TOP}mm`
                }}
              >
                {pagePhotos.map((photo, idx) => {
                  const borderColor = borderColors[photo.border_color] || borderColors.white;
                  const textColor = textColors[photo.border_color] || textColors.white;
                  const effect = effects[photo.effect] || effects.original;

                  const framePadding = CARD_WIDTH_MM * (PHOTO_PADDING_PERCENT / 100);
                  const captionHeight = CARD_HEIGHT_MM * (CAPTION_HEIGHT_PERCENT / 100);
                  const photoWidth = CARD_WIDTH_MM - (framePadding * 2);
                  const photoHeight = CARD_HEIGHT_MM - framePadding - captionHeight;
                  const fontSize = captionHeight * 0.4;

                  // Use "cover" logic - SAME as PhotoFrame.jsx
                  const imgWidth = photo.original_width || 1;
                  const imgHeight = photo.original_height || 1;
                  const scale = Math.max(photoWidth / imgWidth, photoHeight / imgHeight);
                  const fitWidth = imgWidth * scale;
                  const fitHeight = imgHeight * scale;

                  const zoom = photo.crop_data?.zoom ?? 1;
                  const offsetX = (photo.crop_data?.offset?.x ?? 0) * fitWidth;
                  const offsetY = (photo.crop_data?.offset?.y ?? 0) * fitHeight;

                  return (
                    <div 
                      key={photo.id} 
                      style={{ 
                        width: `${CELL_WIDTH_MM}mm`, 
                        height: `${CELL_HEIGHT_MM}mm`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{
                        width: `${CARD_WIDTH_MM}mm`,
                        height: `${CARD_HEIGHT_MM}mm`,
                        backgroundColor: borderColor,
                        padding: `${framePadding}mm`,
                        paddingBottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        boxSizing: 'border-box',
                        transform: 'rotate(90deg)',
                        transformOrigin: 'center center',
                        flexShrink: 0
                      }}>
                        <div style={{
                          width: `${photoWidth}mm`,
                          height: `${photoHeight}mm`,
                          position: 'relative',
                          overflow: 'hidden',
                          background: '#f3f4f6',
                          flexShrink: 0
                        }}>
                          <div style={{
                            position: 'absolute',
                            width: `${fitWidth}mm`,
                            height: `${fitHeight}mm`,
                            left: '50%',
                            top: '50%',
                            transform: `translate(-50%, -50%) scale(${zoom}) translate(${offsetX}px, ${offsetY}px)`,
                            transformOrigin: 'center center'
                          }}>
                            <img
                              src={photo.image_url}
                              alt="Print"
                              crossOrigin="anonymous"
                              style={{
                                width: '100%',
                                height: '100%',
                                display: 'block',
                                objectFit: 'cover',
                                filter: effect
                              }}
                            />
                          </div>
                        </div>
                        <div style={{
                          height: `${captionHeight}mm`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0 1mm',
                          color: textColor,
                          fontSize: `${fontSize}mm`,
                          fontFamily: "'Caveat', cursive",
                          textAlign: 'center',
                          overflow: 'hidden',
                          wordBreak: 'break-word'
                        }}>
                          {photo.caption || ''}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PrintA4() {
  return (
    <AdminAuthGuard>
      <PrintA4Content />
    </AdminAuthGuard>
  );
}