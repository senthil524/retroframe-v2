import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Package, RefreshCw, LogOut, FileText, Eye, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import SEO from '@/components/seo/SEO';

const statusColors = {
  pending_payment: 'bg-yellow-100 text-yellow-700',
  payment_failed: 'bg-red-100 text-red-700',
  processing: 'bg-blue-100 text-blue-700',
  printed: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-700'
};

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
const PREVIEW_CAPTION_PERCENT = (0.8 / 4) * 100; // ~20%
const CAPTION_HEIGHT_INCHES = 4 - 3 - 0.2; // 0.8" for caption area

// PDF page settings
const PAGE_WIDTH = 8.5; // inches
const PAGE_HEIGHT = 11; // inches
const PAGE_MARGIN = 0.5; // inches - margin around polaroid on page

function AdminContent() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/AdminLogin');
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const [allOrders, allPayments] = await Promise.all([
        base44.entities.Order.list('-created_date'),
        base44.entities.Payment.list()
      ]);
      
      const ordersWithPayments = allOrders.map(order => {
        const payment = allPayments.find(p => p.order_number === order.order_number);
        return { ...order, payment };
      });

      setOrders(ordersWithPayments);
    } catch (error) {
      console.error('❌ Failed to load orders:', error);
      toast.error('Failed to load orders: ' + error.message);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await base44.entities.Order.update(orderId, { order_status: newStatus });
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, order_status: newStatus } : order
      ));
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  const generatePDF = async (order) => {
    setGeneratingPDF(order.id);
    toast.loading('Loading photos...', { id: 'pdf-gen' });

    try {
      // Load photos for this order
      const allPhotos = await base44.entities.Photo.list();
      const orderPhotos = allPhotos.filter(p => p.order_id === order.order_number);

      if (orderPhotos.length === 0) {
        toast.error('No photos found for this order', { id: 'pdf-gen' });
        setGeneratingPDF(null);
        return;
      }

      toast.loading('Generating PDF...', { id: 'pdf-gen' });

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter'
      });

      // Page 1: Order Details
      const orderDetailsDiv = document.createElement('div');
      orderDetailsDiv.style.cssText = `
        width: 8.5in;
        height: 11in;
        padding: 1in;
        box-sizing: border-box;
        background: white;
        font-family: system-ui, -apple-system, sans-serif;
      `;
      orderDetailsDiv.innerHTML = `
        <h1 style="font-size: 36px; font-weight: bold; margin-bottom: 32px;">Order Details</h1>
        <div style="margin-bottom: 32px;">
          <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px;">Order Information</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <p style="color: #6B7280; font-size: 14px;">Order Number</p>
              <p style="font-weight: bold; font-size: 24px;">#${order.order_number}</p>
            </div>
            <div>
              <p style="color: #6B7280; font-size: 14px;">Order Date</p>
              <p style="font-weight: 600;">${format(new Date(order.created_date), 'MMMM d, yyyy')}</p>
            </div>
            <div>
              <p style="color: #6B7280; font-size: 14px;">Total Prints</p>
              <p style="font-weight: 600;">${order.total_items}</p>
            </div>
            <div>
              <p style="color: #6B7280; font-size: 14px;">Total Amount</p>
              <p style="font-weight: 600;">₹${order.total_price}</p>
            </div>
          </div>
        </div>
        <div style="margin-bottom: 32px;">
          <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px;">Customer Information</h2>
          <div>
            <p style="font-weight: 600;">${order.customer_name}</p>
            <p>${order.customer_email}</p>
            <p>${order.customer_phone}</p>
          </div>
        </div>
        <div style="margin-bottom: 32px;">
          <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px;">Delivery Address</h2>
          <div>
            <p>${order.delivery_address?.address1 || ''}</p>
            <p>${order.delivery_address?.address2 || ''}</p>
            <p>${order.delivery_address?.city || ''}, ${order.delivery_address?.state || ''}</p>
            <p>${order.delivery_address?.pincode || ''}</p>
            <p>${order.delivery_address?.country || 'India'}</p>
          </div>
        </div>
        <div style="border-top: 1px solid #E5E7EB; padding-top: 16px;">
          <p style="font-size: 14px; color: #6B7280;">Print Quality: 300 DPI | Card Size: 3.4" × 4" | Photo: 3" × 3"</p>
        </div>
      `;
      document.body.appendChild(orderDetailsDiv);

      const orderCanvas = await html2canvas(orderDetailsDiv, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      });
      document.body.removeChild(orderDetailsDiv);

      const orderImgData = orderCanvas.toDataURL('image/png');
      const orderImgWidth = 8.5;
      const orderImgHeight = (orderCanvas.height * orderImgWidth) / orderCanvas.width;
      pdf.addImage(orderImgData, 'PNG', 0, 0, orderImgWidth, orderImgHeight);

      // Pages 2+: Individual Photos (MAXIMIZED TO FIT PAGE)
      for (let i = 0; i < orderPhotos.length; i++) {
        const photo = orderPhotos[i];
        
        // Calculate polaroid dimensions at 300 DPI
        const totalWidthPx = POLAROID_WIDTH_INCHES * DPI;
        const totalHeightPx = POLAROID_HEIGHT_INCHES * DPI;
        const framePaddingPx = (totalWidthPx * PREVIEW_PADDING_PERCENT) / 100;
        const captionHeightPx = (totalHeightPx * PREVIEW_CAPTION_PERCENT) / 100;
        const fontSizePx = captionHeightPx * 0.35;
        const pdfContainerWidth = totalWidthPx - (framePaddingPx * 2);
        const pdfContainerHeight = totalHeightPx - (framePaddingPx * 2) - captionHeightPx;

        // Calculate image fit and transformation
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

        // Calculate pan ratios from on-screen dimensions
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

        // Apply pan ratios to PDF dimensions
        const pdfScaledWidth = fitWidth * zoom;
        const pdfScaledHeight = fitHeight * zoom;
        const pdfOverflowX = Math.max(0, pdfScaledWidth - pdfContainerWidth);
        const pdfOverflowY = Math.max(0, pdfScaledHeight - pdfContainerHeight);
        const pdfOffsetX = panRatioX * (pdfOverflowX / 2);
        const pdfOffsetY = panRatioY * (pdfOverflowY / 2);

        // Create polaroid frame
        const photoDiv = document.createElement('div');
        photoDiv.style.cssText = `
          background-color: ${borderColors[photo.border_color || 'white']};
          width: ${totalWidthPx}px;
          height: ${totalHeightPx}px;
          padding: ${framePaddingPx}px;
          display: flex;
          flex-direction: column;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;

        const photoContainer = document.createElement('div');
        photoContainer.style.cssText = `
          width: ${pdfContainerWidth}px;
          height: ${pdfContainerHeight}px;
          position: relative;
          overflow: hidden;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        `;

        const transformWrapper = document.createElement('div');
        transformWrapper.style.cssText = `
          position: absolute;
          width: ${fitWidth}px;
          height: ${fitHeight}px;
          transform: scale(${zoom}) translate(${pdfOffsetX}px, ${pdfOffsetY}px);
          transform-origin: center center;
        `;

        const img = document.createElement('img');
        img.src = photo.image_url;
        img.crossOrigin = 'anonymous';
        img.style.cssText = `
          width: 100%;
          height: 100%;
          display: block;
          filter: ${effects[photo.effect || 'original']};
        `;

        transformWrapper.appendChild(img);
        photoContainer.appendChild(transformWrapper);

        const captionDiv = document.createElement('div');
        captionDiv.style.cssText = `
          height: ${captionHeightPx}px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 8px;
          color: ${textColors[photo.border_color || 'white']};
          font-size: ${fontSizePx}px;
          font-family: 'Caveat', cursive;
          text-align: center;
          overflow: hidden;
          word-wrap: break-word;
        `;
        captionDiv.textContent = photo.caption || '';

        photoDiv.appendChild(photoContainer);
        photoDiv.appendChild(captionDiv);
        document.body.appendChild(photoDiv);

        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });

        const photoCanvas = await html2canvas(photoDiv, {
          scale: 3,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true
        });
        document.body.removeChild(photoDiv);

        pdf.addPage();
        const photoImgData = photoCanvas.toDataURL('image/jpeg', 1.0);

        // Calculate scaling to maximize polaroid size on page while maintaining aspect ratio
        const availableWidth = PAGE_WIDTH - (2 * PAGE_MARGIN);
        const availableHeight = PAGE_HEIGHT - (2 * PAGE_MARGIN);
        const polaroidAspect = POLAROID_WIDTH_INCHES / POLAROID_HEIGHT_INCHES;
        const availableAspect = availableWidth / availableHeight;

        let scaledWidth, scaledHeight;
        if (polaroidAspect > availableAspect) {
          // Polaroid is wider relative to height - fit to width
          scaledWidth = availableWidth;
          scaledHeight = availableWidth / polaroidAspect;
        } else {
          // Polaroid is taller relative to width - fit to height
          scaledHeight = availableHeight;
          scaledWidth = availableHeight * polaroidAspect;
        }

        // Center the scaled polaroid on the page
        const xPos = (PAGE_WIDTH - scaledWidth) / 2;
        const yPos = (PAGE_HEIGHT - scaledHeight) / 2;

        pdf.addImage(photoImgData, 'JPEG', xPos, yPos, scaledWidth, scaledHeight);

        toast.loading(`Generating PDF... ${i + 1}/${orderPhotos.length}`, { id: 'pdf-gen' });
      }

      const filename = `${order.order_number}_prints.pdf`;
      pdf.save(filename);

      toast.success('PDF downloaded successfully!', { id: 'pdf-gen' });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF', { id: 'pdf-gen' });
    }

    setGeneratingPDF(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF8F5] to-white">
        <div className="w-8 h-8 border-4 border-[#FF6B9D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F5] to-white">
      <SEO
        title="Admin Dashboard"
        description="RetroFrame admin order management"
        url="/Admin"
        noindex={true}
      />
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#2B2B2B]">Order Management</h1>
              <p className="text-gray-500 mt-1">{orders.length} total orders</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={loadOrders}
                className="rounded-full"
              >
                <RefreshCw className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="rounded-full border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Package className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">No orders yet</h2>
            <p className="text-gray-500">Orders will appear here once customers place them</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-bold">Order #</TableHead>
                    <TableHead className="font-bold">Customer</TableHead>
                    <TableHead className="font-bold">Items</TableHead>
                    <TableHead className="font-bold">Total</TableHead>
                    <TableHead className="font-bold">Payment</TableHead>
                    <TableHead className="font-bold">Date</TableHead>
                    <TableHead className="font-bold">Order Status</TableHead>
                    <TableHead className="font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50">
                      <TableCell className="font-mono text-sm">#{order.order_number}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-[#2B2B2B]">{order.customer_name}</p>
                          <p className="text-xs text-gray-500">{order.customer_email}</p>
                          <p className="text-xs text-gray-500">{order.customer_phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{order.total_items} prints</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">₹{order.total_price}</TableCell>
                      <TableCell>
                        {order.payment ? (
                          <div className="text-xs">
                            <div className={`font-semibold mb-1 ${
                              order.payment.payment_status === 'success' ? 'text-green-600' :
                              order.payment.payment_status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {order.payment.payment_status.toUpperCase()}
                            </div>
                            <div className="text-gray-500 font-mono">{order.payment.txnid}</div>
                            {order.payment.payment_mode && <div className="text-gray-500">{order.payment.payment_mode}</div>}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Pending</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(order.created_date), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.order_status}
                          onValueChange={(value) => handleStatusUpdate(order.id, value)}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue>
                              <Badge className={statusColors[order.order_status] || 'bg-gray-100 text-gray-700'}>
                                {order.order_status?.replace('_', ' ')}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending_payment">Pending Payment</SelectItem>
                            <SelectItem value="payment_failed">Payment Failed</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="printed">Printed</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link to={createPageUrl('OrderDetails') + `?order_number=${encodeURIComponent(order.order_number)}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-brand-coral hover:bg-brand-warm-light"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => generatePDF(order)}
                            disabled={generatingPDF === order.id}
                            className="text-[#FF6B9D] hover:bg-[#FFF5F0]"
                          >
                            {generatingPDF === order.id ? (
                              <div className="w-4 h-4 border-2 border-[#FF6B9D] border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`${window.location.origin}/PrintA4?order_number=${encodeURIComponent(order.order_number)}`, '_blank')}
                            className="text-blue-600 hover:bg-blue-50"
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  return (
    <AdminAuthGuard>
      <AdminContent />
    </AdminAuthGuard>
  );
}