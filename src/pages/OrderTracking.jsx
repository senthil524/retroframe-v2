import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Truck, CheckCircle, Clock, Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'sonner';
import SEO, { structuredData } from '@/components/seo/SEO';
import { createPageUrl } from '@/utils';
import Logo from '@/components/ui/Logo';

const statusSteps = {
  pending: { step: 1, icon: Clock, label: 'Order Placed', color: 'text-yellow-600' },
  processing: { step: 2, icon: Package, label: 'Processing', color: 'text-blue-600' },
  printed: { step: 3, icon: Package, label: 'Printed', color: 'text-purple-600' },
  shipped: { step: 4, icon: Truck, label: 'Shipped', color: 'text-green-600' },
  delivered: { step: 5, icon: CheckCircle, label: 'Delivered', color: 'text-green-700' }
};

export default function OrderTracking() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);

  const handleTrack = async (e) => {
    e.preventDefault();
    
    if (!orderNumber || !phone) {
      toast.error('Please enter order number and phone number');
      return;
    }

    // order_number is numeric only (no # symbol in DB)
    // Remove # if present (for backwards compatibility)
    const cleanOrderNumber = orderNumber.replace(/^#/, '');

    setLoading(true);
    try {
      // Use filter for efficient lookup
      const orders = await base44.entities.Order.filter({ order_number: cleanOrderNumber });
      const foundOrder = orders.find(
        o => o.customer_phone === phone || o.customer_phone === `+91${phone}`
      );

      if (foundOrder) {
        setOrder(foundOrder);
        
        // Load photos for this order efficiently
        const orderPhotos = await base44.entities.Photo.filter({ order_id: foundOrder.order_number });
        setPhotos(orderPhotos);
      } else {
        toast.error('Order not found. Please check your order number and phone number.');
        setOrder(null);
        setPhotos([]);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch order. Please try again.');
    }
    setLoading(false);
  };

  const currentStep = order ? (statusSteps[order.order_status]?.step || 1) : 0;

  return (
    <div className="min-h-screen bg-brand-warm">
      <SEO
        title="Track Your Order"
        description="Track your RetroFrame polaroid prints order. Enter your order number and phone number to see real-time delivery status."
        keywords="track order, order tracking, polaroid prints delivery status, retroframe order status, check order india"
        url="/order-tracking"
        structuredData={structuredData.webPage({
          title: 'Track Your Order',
          description: 'Track your RetroFrame polaroid prints order. Enter your order number and phone number to see real-time delivery status.',
          url: '/order-tracking'
        })}
      />

      {/* Site Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-brand sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <Link to={createPageUrl('Studio')}>
              <Button
                size="sm"
                className="text-xs md:text-sm text-white rounded-full px-4 md:px-6"
                style={{ backgroundColor: 'var(--color-coral)' }}>
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Create Prints
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
            Track Your Order
          </h1>
          <p className="text-brand-secondary">
            Enter your order details to check the status
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8"
        >
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <Label htmlFor="orderNumber">Order Number</Label>
              <Input
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="10001"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2 mt-1">
                <div className="w-16 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-md text-sm font-medium text-gray-700">
                  +91
                </div>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="9876543210"
                  className="flex-1"
                  maxLength={10}
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full py-6 text-white"
              style={{ backgroundColor: 'var(--color-coral)' }}
            >
              <Search className="w-5 h-5 mr-2" />
              {loading ? 'Searching...' : 'Track Order'}
            </Button>
          </form>
        </motion.div>

        {/* Order Details */}
        <AnimatePresence>
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Order Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="text-xl md:text-2xl font-bold text-brand-dark">
                      #{order.order_number}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-semibold text-brand-dark">
                      {format(new Date(order.created_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                  <div className="flex justify-between items-center relative">
                    {/* Progress Line */}
                    <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10" />
                    <div 
                      className="absolute top-6 left-0 h-1 -z-10 transition-all duration-500"
                      style={{ width: `${((currentStep - 1) / 4) * 100}%`, backgroundColor: 'var(--color-coral)' }}
                    />

                    {Object.entries(statusSteps).map(([status, config]) => {
                      const Icon = config.icon;
                      const isActive = config.step <= currentStep;
                      const isCurrent = config.step === currentStep;

                      return (
                        <div key={status} className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                              isActive
                                ? 'text-white'
                                : 'bg-gray-200 text-gray-400'
                            } ${isCurrent ? 'ring-4 ring-brand-warm-light' : ''}`}
                            style={isActive ? { backgroundColor: 'var(--color-coral)' } : {}}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <p className={`text-xs md:text-sm font-medium text-center ${
                            isActive ? 'text-brand-dark' : 'text-gray-400'
                          }`}>
                            {config.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                  <div>
                    <h3 className="font-semibold text-brand-dark mb-3">Order Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Items</span>
                        <span className="font-semibold">{order.total_items} prints</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total</span>
                        <span className="font-semibold">₹{order.total_price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Est. Delivery</span>
                        <span className="font-semibold">
                          {order.estimated_delivery ? format(new Date(order.estimated_delivery), 'MMM d, yyyy') : 'TBD'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-brand-dark mb-3">Delivery Address</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-semibold text-brand-dark">{order.delivery_address?.name || order.customer_name}</p>
                      <p>{order.delivery_address?.address1}</p>
                      {order.delivery_address?.address2 && <p>{order.delivery_address.address2}</p>}
                      <p>{order.delivery_address?.city}, {order.delivery_address?.state}</p>
                      <p>{order.delivery_address?.pincode}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Preview */}
              {photos.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <h3 className="font-semibold text-brand-dark mb-4">
                    Your Photos ({photos.length})
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                      >
                        <img
                          src={photo.image_url}
                          alt="Order photo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}