import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Package,
  CreditCard,
  Truck,
  User,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  FileText,
  Save,
  ExternalLink,
  Copy,
  Image as ImageIcon
} from 'lucide-react';
import PhotoPreviewFrame from '@/components/admin/PhotoPreviewFrame';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'sonner';

const orderStatusOptions = [
  { value: 'pending_payment', label: 'Pending Payment', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'payment_failed', label: 'Payment Failed', color: 'bg-red-100 text-red-700' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-700' },
  { value: 'printed', label: 'Printed', color: 'bg-purple-100 text-purple-700' },
  { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-700' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-700' }
];

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  success: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-700',
  refunded: 'bg-purple-100 text-purple-700'
};

function OrderDetailsContent() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedOrder, setEditedOrder] = useState({});

  const urlParams = new URLSearchParams(window.location.search);
  const orderNumber = urlParams.get('order_number');

  useEffect(() => {
    if (orderNumber) {
      loadOrderDetails();
    }
  }, [orderNumber]);

  const loadOrderDetails = async () => {
    setLoading(true);
    try {
      // order_number is numeric only (no # symbol in DB)
      // Remove # if present (for backwards compatibility)
      const cleanOrderNumber = orderNumber.replace(/^#/, '');
      
      const [orders, payments, allPhotos] = await Promise.all([
        base44.entities.Order.filter({ order_number: cleanOrderNumber }),
        base44.entities.Payment.filter({ order_number: cleanOrderNumber }),
        base44.entities.Photo.filter({ order_id: cleanOrderNumber })
      ]);

      if (orders.length > 0) {
        setOrder(orders[0]);
        setEditedOrder({
          order_status: orders[0].order_status,
          tracking_number: orders[0].tracking_number || '',
          tracking_url: orders[0].tracking_url || '',
          shipped_date: orders[0].shipped_date || '',
          delivered_date: orders[0].delivered_date || '',
          notes: orders[0].notes || ''
        });
      }

      if (payments.length > 0) {
        setPayment(payments[0]);
      }

      setPhotos(allPhotos);
    } catch (error) {
      console.error('Failed to load order:', error);
      toast.error('Failed to load order details');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.Order.update(order.id, editedOrder);
      setOrder({ ...order, ...editedOrder });
      toast.success('Order updated successfully');
    } catch (error) {
      console.error('Failed to update order:', error);
      toast.error('Failed to update order');
    }
    setSaving(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-warm">
        <div className="w-8 h-8 border-4 border-brand-coral border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-warm">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Order not found</p>
          <Button onClick={() => navigate(createPageUrl('Admin'))} className="rounded-full">
            Back to Admin
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = orderStatusOptions.find(s => s.value === order.order_status) || orderStatusOptions[0];

  return (
    <div className="min-h-screen bg-brand-warm pb-8">
      {/* Header */}
      <header className="bg-white border-b border-brand sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(createPageUrl('Admin'))}
                className="rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-brand-dark" style={{ fontFamily: 'var(--font-serif)' }}>
                  Order #{order.order_number}
                </h1>
                <p className="text-sm text-gray-500">
                  Created {format(new Date(order.created_date), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to={createPageUrl('Studio') + `?order=${order.order_number}`}>
                <Button variant="outline" className="rounded-full">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  View & Edit Photos
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => window.open(`${window.location.origin}/PrintA4?order_number=${encodeURIComponent(order.order_number)}`, '_blank')}
                className="rounded-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                Print A4
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="rounded-full text-white"
                style={{ backgroundColor: 'var(--color-coral)' }}
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-warm-light rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-brand-coral" />
                </div>
                <h2 className="text-xl font-semibold text-brand-dark">Order Status</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Order Status</Label>
                  <Select 
                    value={editedOrder.order_status} 
                    onValueChange={(value) => setEditedOrder({ ...editedOrder, order_status: value })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {orderStatusOptions.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          <Badge className={status.color}>{status.label}</Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Estimated Delivery</Label>
                  <Input
                    type="date"
                    value={order.estimated_delivery || ''}
                    disabled
                    className="mt-1.5 bg-gray-50"
                  />
                </div>

                <div>
                  <Label>Shipped Date</Label>
                  <Input
                    type="date"
                    value={editedOrder.shipped_date}
                    onChange={(e) => setEditedOrder({ ...editedOrder, shipped_date: e.target.value })}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>Delivered Date</Label>
                  <Input
                    type="date"
                    value={editedOrder.delivered_date}
                    onChange={(e) => setEditedOrder({ ...editedOrder, delivered_date: e.target.value })}
                    className="mt-1.5"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Tracking Number</Label>
                  <Input
                    value={editedOrder.tracking_number}
                    onChange={(e) => setEditedOrder({ ...editedOrder, tracking_number: e.target.value })}
                    placeholder="Enter tracking number"
                    className="mt-1.5"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Tracking URL</Label>
                  <Input
                    value={editedOrder.tracking_url}
                    onChange={(e) => setEditedOrder({ ...editedOrder, tracking_url: e.target.value })}
                    placeholder="https://..."
                    className="mt-1.5"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Internal Notes</Label>
                  <Textarea
                    value={editedOrder.notes}
                    onChange={(e) => setEditedOrder({ ...editedOrder, notes: e.target.value })}
                    placeholder="Add notes about this order..."
                    className="mt-1.5"
                    rows={3}
                  />
                </div>
              </div>
            </motion.div>

            {/* Payment Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-warm-light rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-brand-coral" />
                </div>
                <h2 className="text-xl font-semibold text-brand-dark">Payment Details</h2>
                {payment && (
                  <Badge className={paymentStatusColors[payment.payment_status]}>
                    {payment.payment_status?.toUpperCase()}
                  </Badge>
                )}
              </div>

              {payment ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <InfoRow label="Transaction ID" value={payment.txnid} copyable />
                    <InfoRow label="PayU Payment ID" value={payment.mihpayid} copyable />
                    <InfoRow label="Amount" value={`₹${payment.amount}`} />
                    <InfoRow label="Net Amount Debited" value={payment.net_amount_debit ? `₹${payment.net_amount_debit}` : '-'} />
                    <InfoRow label="Discount" value={payment.discount ? `₹${payment.discount}` : '-'} />
                    <InfoRow label="Payment Mode" value={payment.payment_mode || '-'} />
                    <InfoRow label="Card Category" value={payment.card_category || '-'} />
                    <InfoRow label="Card Number" value={payment.card_num || '-'} />
                    <InfoRow label="Bank Reference" value={payment.bank_ref_num} copyable />
                    <InfoRow label="Bank Code" value={payment.bankcode || '-'} />
                    <InfoRow label="PG Type" value={payment.pg_type || '-'} />
                    <InfoRow label="Transaction Status" value={payment.txn_status || '-'} />
                    <InfoRow label="Unmapped Status" value={payment.unmapped_status || '-'} />
                    <InfoRow 
                      label="Payment Date" 
                      value={payment.payment_date ? format(new Date(payment.payment_date), 'MMM d, yyyy h:mm a') : '-'} 
                    />
                    <InfoRow 
                      label="Hash Verified" 
                      value={payment.hash_verified ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" /> Yes
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600">
                          <XCircle className="w-4 h-4" /> No
                        </span>
                      )} 
                    />
                  </div>

                  {(payment.error_code || payment.error_message) && (
                    <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
                      <p className="font-semibold text-red-700 mb-1">Error Details</p>
                      {payment.error_code && <p className="text-sm text-red-600">Code: {payment.error_code}</p>}
                      {payment.error_message && <p className="text-sm text-red-600">Message: {payment.error_message}</p>}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No payment record found</p>
                </div>
              )}
            </motion.div>

            {/* Photos Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-warm-light rounded-full flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-brand-coral" />
                </div>
                <h2 className="text-xl font-semibold text-brand-dark">Order Photos ({photos.length})</h2>
              </div>

              {photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {photos.map((photo, idx) => (
                    <div key={photo.id} className="relative group">
                      <PhotoPreviewFrame photo={photo} className="w-full" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <a
                          href={photo.image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white text-xs"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No photos found for this order</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="font-semibold text-brand-dark mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Items</span>
                  <span className="font-semibold">{order.total_items} prints</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">
                    {order.shipping_cost === 0 ? 'FREE' : `₹${order.shipping_cost}`}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-semibold text-brand-dark">Total</span>
                  <span className="font-bold text-brand-coral text-lg">₹{order.total_price}</span>
                </div>
              </div>
            </motion.div>

            {/* Customer Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-brand-coral" />
                <h3 className="font-semibold text-brand-dark">Customer</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-brand-dark">{order.customer_name}</p>
                <p className="text-gray-600 flex items-center gap-2">
                  {order.customer_email}
                  <button onClick={() => copyToClipboard(order.customer_email)} className="text-gray-400 hover:text-gray-600">
                    <Copy className="w-3 h-3" />
                  </button>
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  {order.customer_phone}
                  <button onClick={() => copyToClipboard(order.customer_phone)} className="text-gray-400 hover:text-gray-600">
                    <Copy className="w-3 h-3" />
                  </button>
                </p>
              </div>
            </motion.div>

            {/* Delivery Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-brand-coral" />
                <h3 className="font-semibold text-brand-dark">Delivery Address</h3>
              </div>
              {order.delivery_address && (
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="font-semibold text-brand-dark">{order.delivery_address.name}</p>
                  <p>{order.delivery_address.address1}</p>
                  {order.delivery_address.address2 && <p>{order.delivery_address.address2}</p>}
                  <p>{order.delivery_address.city}, {order.delivery_address.state}</p>
                  <p>{order.delivery_address.pincode}</p>
                  <p>{order.delivery_address.phone}</p>
                </div>
              )}
            </motion.div>

            {/* Timestamps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-brand-coral" />
                <h3 className="font-semibold text-brand-dark">Timeline</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created</span>
                  <span>{format(new Date(order.created_date), 'MMM d, h:mm a')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Updated</span>
                  <span>{format(new Date(order.updated_date), 'MMM d, h:mm a')}</span>
                </div>
                {order.shipped_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipped</span>
                    <span>{format(new Date(order.shipped_date), 'MMM d, yyyy')}</span>
                  </div>
                )}
                {order.delivered_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivered</span>
                    <span>{format(new Date(order.delivered_date), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* IDs Reference */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 rounded-2xl p-6"
            >
              <h3 className="font-semibold text-gray-700 mb-4 text-sm">Reference IDs</h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Order ID</span>
                  <span className="text-gray-700">{order.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Cart ID</span>
                  <span className="text-gray-700 truncate max-w-[150px]">{order.cart_id}</span>
                </div>
                {payment && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Payment ID</span>
                    <span className="text-gray-700">{payment.id}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, copyable }) {
  const handleCopy = () => {
    if (value && typeof value === 'string') {
      navigator.clipboard.writeText(value);
      toast.success('Copied!');
    }
  };

  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-100">
      <span className="text-gray-500 text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium text-sm text-right">{value || '-'}</span>
        {copyable && value && typeof value === 'string' && (
          <button onClick={handleCopy} className="text-gray-400 hover:text-gray-600">
            <Copy className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

function getBorderColor(color) {
  const colors = {
    white: '#FFFFFF',
    black: '#2B2B2B',
    cream: '#F5F1E8',
    pink: '#FFE5EE',
    blue: '#E3F2FD',
    mint: '#E8F5E9',
    lavender: '#F3E5F5',
    peach: '#FFE0B2'
  };
  return colors[color] || colors.white;
}

export default function OrderDetails() {
  return (
    <AdminAuthGuard>
      <OrderDetailsContent />
    </AdminAuthGuard>
  );
}