import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { usePhotos } from '@/components/PhotoContext.jsx';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Package, Mail, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { trackPurchase, trackPaymentFailed } from '@/lib/analytics';

export default function Confirmation() {
  const { clearPhotos } = usePhotos();
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const purchaseTracked = useRef(false); // Prevent duplicate tracking

  const urlParams = new URLSearchParams(window.location.search);
  const orderNumber = urlParams.get('order_number');
  const paymentStatus = urlParams.get('payment');

  useEffect(() => {
    if (orderNumber) {
      loadOrderAndPayment();
    } else {
      setLoading(false);
    }
  }, [orderNumber]);

  const loadOrderAndPayment = async (retryCount = 0) => {
    try {
      // order_number is numeric only (no # symbol in DB)
      // Remove # if present (for backwards compatibility)
      const cleanOrderNumber = orderNumber.replace(/^#/, '');
      const orders = await base44.entities.Order.filter({ order_number: cleanOrderNumber });
      
      const foundOrder = orders[0];
      if (foundOrder) {
        setOrder(foundOrder);

        // Clear photos only on successful payment
        const isSuccess = paymentStatus === 'success' || foundOrder.payment_status === 'success';
        if (isSuccess) {
          clearPhotos();

          // Track purchase event for Google Analytics & Google Ads (only once)
          if (!purchaseTracked.current) {
            purchaseTracked.current = true;
            trackPurchase({
              orderNumber: cleanOrderNumber,
              photoCount: foundOrder.total_items || 0,
              totalAmount: foundOrder.total_price || 0,
              tax: 0,
              shipping: foundOrder.shipping_cost || 0
            });
          }
        } else if (!purchaseTracked.current) {
          // Track failed payment
          purchaseTracked.current = true;
          trackPaymentFailed(cleanOrderNumber, paymentStatus || 'unknown');
        }

        // Fetch payment by order_number
        const payments = await base44.entities.Payment.filter({ order_number: cleanOrderNumber });
        if (payments.length > 0) {
          setPayment(payments[0]);
        }
        setLoading(false);
      } else if (retryCount < 5) {
        // Retry up to 5 times with increasing delay (order may not be created yet)
        console.log(`Order not found, retrying... (${retryCount + 1}/5)`);
        setTimeout(() => loadOrderAndPayment(retryCount + 1), 1000 * (retryCount + 1));
      } else {
        // After retries, still show the page with URL params
        console.log('Order not found after retries');
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to load order:', error);
      if (retryCount < 3) {
        setTimeout(() => loadOrderAndPayment(retryCount + 1), 1000);
      } else {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-warm">
        <div className="w-8 h-8 border-4 border-brand-coral border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If no order found but we have payment status from URL, show appropriate message
  if (!order && orderNumber) {
    const isSuccessFromUrl = paymentStatus === 'success';
    const isFailedFromUrl = paymentStatus === 'failed';
    
    return (
      <div className="min-h-screen bg-brand-warm">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="text-center mb-8"
          >
            {isSuccessFromUrl ? (
              <>
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-14 h-14 text-green-600" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
                  Payment Successful!
                </h1>
                <p className="text-lg text-gray-600 mb-2">Your order is being processed</p>
                <p className="text-sm text-gray-500">Order: {orderNumber}</p>
              </>
            ) : isFailedFromUrl ? (
              <>
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-14 h-14 text-red-600" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
                  Payment Failed
                </h1>
                <p className="text-lg text-gray-600 mb-2">We couldn't process your payment</p>
                <p className="text-sm text-gray-500">Order: {orderNumber}</p>
              </>
            ) : (
              <>
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-14 h-14 text-yellow-600" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
                  Order Status Unknown
                </h1>
                <p className="text-lg text-gray-600">Order: {orderNumber}</p>
              </>
            )}
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isSuccessFromUrl ? (
              <>
                <Link to={createPageUrl('OrderTracking')}>
                  <Button
                    size="lg"
                    className="rounded-full text-white"
                    style={{ backgroundColor: 'var(--color-coral)' }}
                  >
                    Track Your Order
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to={createPageUrl('Studio')}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-2 border-brand-coral text-brand-coral hover:bg-brand-warm-light"
                  >
                    Create More Prints
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to={createPageUrl('Cart')}>
                  <Button
                    size="lg"
                    className="rounded-full text-white"
                    style={{ backgroundColor: 'var(--color-coral)' }}
                  >
                    Retry Payment
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to={createPageUrl('ContactUs')}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-2 border-brand-coral text-brand-coral hover:bg-brand-warm-light"
                  >
                    Contact Support
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-warm">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Order not found</p>
          <Link to={createPageUrl('Home')}>
            <Button className="rounded-full text-white" style={{ backgroundColor: 'var(--color-coral)' }}>
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isSuccess = paymentStatus === 'success' || order.payment_status === 'success';
  const isFailed = paymentStatus === 'failed' || order.payment_status === 'failed';

  return (
    <div className="min-h-screen bg-brand-warm">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Status Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="text-center mb-8"
        >
          {isSuccess ? (
            <>
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-14 h-14 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
                Payment Successful!
              </h1>
              <p className="text-lg text-gray-600">
                Thank you, {order.customer_name}!
              </p>
            </>
          ) : isFailed ? (
            <>
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-14 h-14 text-red-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
                Payment Failed
              </h1>
              <p className="text-lg text-gray-600">
                We couldn't process your payment
              </p>
            </>
          ) : (
            <>
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-14 h-14 text-yellow-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
                Payment Pending
              </h1>
              <p className="text-lg text-gray-600">
                Awaiting payment confirmation
              </p>
            </>
          )}
        </motion.div>

        {/* Payment Status Notice */}
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6"
          >
            <p className="text-green-800 text-sm text-center font-semibold">
              ✅ Payment confirmed • Your order is being processed
            </p>
            {payment?.mihpayid && (
              <p className="text-green-700 text-xs text-center mt-1">
                Payment ID: {payment.mihpayid}
              </p>
            )}
          </motion.div>
        )}

        {isFailed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
          >
            <p className="text-red-800 text-sm text-center font-semibold mb-2">
              ❌ Payment was not successful
            </p>
            {payment?.error_message && (
              <p className="text-red-700 text-xs text-center mb-2">
                {payment.error_message}
              </p>
            )}
            <p className="text-red-700 text-xs text-center">
              Your order is saved. You can retry payment or contact support.
            </p>
          </motion.div>
        )}

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-6"
        >
          <div className="border-b border-gray-100 pb-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-brand-dark">#{order.order_number}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-5 h-5 text-brand-coral" />
                <h3 className="font-semibold text-brand-dark">Order Details</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Prints</span>
                  <span className="font-semibold">{order.total_items}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{order.total_price - order.shipping_cost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">{order.shipping_cost === 0 ? 'FREE' : `₹${order.shipping_cost}`}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600 font-semibold">Total</span>
                  <span className="font-bold text-brand-coral">₹{order.total_price}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    isSuccess ? 'bg-green-100 text-green-700' : 
                    isFailed ? 'bg-red-100 text-red-700' : 
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {isSuccess ? 'Processing' : isFailed ? 'Payment Failed' : 'Pending Payment'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-5 h-5 text-brand-coral" />
                <h3 className="font-semibold text-brand-dark">Delivery Information</h3>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>{order.delivery_address?.name}</p>
                <p>{order.delivery_address?.address1}</p>
                {order.delivery_address?.address2 && <p>{order.delivery_address.address2}</p>}
                <p>{order.delivery_address?.city}, {order.delivery_address?.state} - {order.delivery_address?.pincode}</p>
                <p>{order.delivery_address?.phone}</p>
                {order.estimated_delivery && (
                  <p className="font-semibold text-brand-dark mt-3">
                    Est. Delivery: {format(new Date(order.estimated_delivery), 'MMM d, yyyy')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {isSuccess && (
            <div className="bg-brand-warm-light rounded-xl p-4">
              <p className="text-sm text-gray-700">
                📧 Confirmation email sent to <span className="font-semibold">{order.customer_email}</span>
              </p>
            </div>
          )}
        </motion.div>

        {/* Payment Details */}
        {payment && (payment.mihpayid || payment.payment_mode || payment.bank_ref_num || payment.txnid) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-6"
          >
            <h3 className="text-lg font-semibold text-brand-dark mb-4">Payment Details</h3>
            <div className="space-y-2 text-sm">
              {payment.txnid && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-medium text-brand-dark font-mono text-xs">{payment.txnid}</span>
                </div>
              )}
              {payment.mihpayid && (
                <div className="flex justify-between">
                  <span className="text-gray-600">PayU Payment ID</span>
                  <span className="font-medium text-brand-dark font-mono text-xs">{payment.mihpayid}</span>
                </div>
              )}
              {payment.payment_mode && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Mode</span>
                  <span className="font-medium text-brand-dark">{payment.payment_mode}</span>
                </div>
              )}
              {payment.bank_ref_num && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank Reference</span>
                  <span className="font-medium text-brand-dark font-mono text-xs">{payment.bank_ref_num}</span>
                </div>
              )}
              {payment.txn_status && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium ${
                    payment.txn_status === 'SUCCESS' ? 'text-green-600' : 
                    payment.txn_status === 'FAILED' ? 'text-red-600' : 
                    'text-yellow-600'
                  }`}>
                    {payment.txn_status}
                  </span>
                </div>
              )}
            </div>


          </motion.div>
        )}

        {/* What's Next - Only for successful payments */}
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-6"
          >
            <h3 className="text-xl font-bold text-brand-dark mb-4">What happens next?</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold" style={{ backgroundColor: 'var(--color-coral)' }}>
                  1
                </div>
                <div>
                  <p className="font-semibold text-brand-dark">Processing</p>
                  <p className="text-sm text-gray-600">We'll start preparing your prints immediately</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold" style={{ backgroundColor: 'var(--color-coral)' }}>
                  2
                </div>
                <div>
                  <p className="font-semibold text-brand-dark">Printing</p>
                  <p className="text-sm text-gray-600">Your photos will be printed with premium quality</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold" style={{ backgroundColor: 'var(--color-coral)' }}>
                  3
                </div>
                <div>
                  <p className="font-semibold text-brand-dark">Shipping</p>
                  <p className="text-sm text-gray-600">Carefully packaged and shipped to your doorstep</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {isSuccess ? (
            <>
              <Link to={createPageUrl('OrderTracking')} className="flex-1">
                <Button
                  size="lg"
                  className="w-full rounded-full text-white"
                  style={{ backgroundColor: 'var(--color-coral)' }}
                >
                  Track Your Order
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl('Studio')} className="flex-1">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-full border-2 border-brand-coral text-brand-coral hover:bg-brand-warm-light"
                >
                  Create More Prints
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to={createPageUrl('Checkout')} className="flex-1">
                <Button
                  size="lg"
                  className="w-full rounded-full text-white"
                  style={{ backgroundColor: 'var(--color-coral)' }}
                >
                  Retry Payment
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl('ContactUs')} className="flex-1">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-full border-2 border-brand-coral text-brand-coral hover:bg-brand-warm-light"
                >
                  Contact Support
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}