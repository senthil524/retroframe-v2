import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { usePhotos } from '@/components/PhotoContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Package, Truck, MapPin, Loader2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { loadPayUSDK } from '@/components/payuHelper';
import { trackBeginCheckout, trackAddShippingInfo, trackAddPaymentInfo } from '@/lib/analytics';

// Pricing: ₹270 for first 18 prints, ₹15 for each additional
const BASE_PRICE = 270;
const BASE_PRINTS = 18;
const ADDITIONAL_PRICE = 15;
const PAYU_SDK_LOADED = { current: false, promise: null };
const SHIPPING_COST = 0; // Free shipping

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
];

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { photos, cartId, clearPhotos, getUploadStats, allPhotosUploaded } = usePhotos();
  const [submitting, setSubmitting] = useState(false);
  const [canProceed, setCanProceed] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    delivery_name: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
    delivery_phone: ''
  });

  const uploadStats = getUploadStats();

  useEffect(() => {
    setCanProceed(allPhotosUploaded());
  }, [uploadStats, allPhotosUploaded]);

  // Preload PayU SDK as soon as user lands on checkout
  useEffect(() => {
    if (!PAYU_SDK_LOADED.current && !PAYU_SDK_LOADED.promise) {
      PAYU_SDK_LOADED.promise = loadPayUSDK()
        .then(() => { PAYU_SDK_LOADED.current = true; })
        .catch(err => console.warn('PayU SDK preload failed:', err));
    }
  }, []);

  // Track begin_checkout when page loads
  useEffect(() => {
    if (photos.length > 0) {
      trackBeginCheckout(photos.length);
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate total: ₹270 for first 18, ₹15 for each additional
  const calculateTotal = (count) => {
    if (count <= BASE_PRINTS) return BASE_PRICE;
    return BASE_PRICE + (count - BASE_PRINTS) * ADDITIONAL_PRICE;
  };
  const subtotal = calculateTotal(photos.length);
  const shipping = SHIPPING_COST; // Always free
  const total = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.delivery_name || !formData.address1 || !formData.city || !formData.state || !formData.pincode || !formData.delivery_phone) {
      toast.error('Please fill in all fields');
      return;
    }

    if (photos.length === 0) {
      toast.error('No photos to order');
      return;
    }

    if (!canProceed) {
      toast.error('Please wait for all photos to finish uploading');
      return;
    }

    setSubmitting(true);

    // Track shipping info added
    trackAddShippingInfo(photos.length, 'Free Shipping');

    try {
      toast.loading('Creating order...', { id: 'checkout' });

      // Generate unique transaction ID (UUID-based, no special characters for PayU)
      const txnId = `RF${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Generate order number (numeric only, no # symbol for DB consistency)
      // Format: 10001, 10002, etc. - displayed with # prefix in UI only
      const orderNumber = Date.now().toString().slice(-8);
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 7);

      // Update existing photo records with order_id (photos already saved during upload)
      const existingPhotos = await base44.entities.Photo.filter({ cart_id: cartId });
      const updatePromises = existingPhotos.map(photo =>
        base44.entities.Photo.update(photo.id, { order_id: orderNumber })
      );

      // Create order FIRST (must exist before payment redirect)
      const orderResult = await base44.entities.Order.create({
        order_number: orderNumber,
        cart_id: cartId,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        delivery_address: {
          name: formData.delivery_name,
          address1: formData.address1,
          address2: formData.address2 || '',
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: `+91${formData.delivery_phone}`,
          country: 'India'
        },
        total_items: photos.length,
        subtotal: subtotal,
        shipping_cost: shipping,
        total_price: total,
        order_status: 'pending_payment',
        payment_status: 'pending',
        estimated_delivery: deliveryDate.toISOString().split('T')[0]
      });

      // Create cart and payment records in parallel, update photos
      const [cartResult, paymentResult] = await Promise.all([
        // Create cart record
        base44.entities.Cart.create({
          cart_id: cartId,
          session_started: new Date().toISOString(),
          total_items: photos.length,
          total_price: total,
          status: 'checkout'
        }),
        // Create payment record with full details
        base44.entities.Payment.create({
          order_number: orderNumber,
          cart_id: cartId,
          txnid: txnId,  // Use unique txnId
          amount: total,
          payment_status: 'pending',
          customer_email: formData.email,
          customer_phone: formData.phone,
          product_info: `RetroFrame Order ${orderNumber}`
        }),
        // Update photos with order_id
        ...updatePromises
      ]);

      toast.loading('Opening payment gateway...', { id: 'checkout' });

      // Track payment info event before opening payment gateway
      trackAddPaymentInfo(photos.length, 'PayU');

      // Prepare payment data for PayU
      const paymentData = {
        txnid: txnId,  // Use unique txnId for PayU (no # symbol)
        amount: total.toFixed(2),
        productinfo: `RetroFrame Order ${orderNumber}`,
        firstname: formData.name.split(' ')[0],
        lastname: formData.name.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        phone: formData.phone, // 10 digit phone without country code
        surl: window.location.origin + createPageUrl('PaymentCallback'),
        furl: window.location.origin + createPageUrl('PaymentCallback'),
        // UDF fields for reference - store both order number and txnId
        udf1: orderNumber,  // Display order number
        udf2: txnId,        // Unique transaction ID
        udf3: '',
        udf4: '',
        udf5: '',
        // Billing address (helps with fraud detection)
        address1: formData.address1.substring(0, 100), // Max 100 chars
        address2: (formData.address2 || '').substring(0, 100),
        city: formData.city.substring(0, 50),
        state: formData.state.substring(0, 50),
        country: 'India',
        zipcode: formData.pincode.substring(0, 20) // Max 20 chars for cardless EMI
      };

      try {
        // Generate hash and ensure SDK is loaded in parallel
        const [hashResponse, bolt] = await Promise.all([
          base44.functions.invoke('payuGenerateHash', { paymentData }),
          loadPayUSDK()
        ]);

        const { hash, key } = hashResponse.data;
        const data = { ...paymentData, hash, key };

        toast.dismiss('checkout');

        // Launch PayU Bolt (Popup)
        bolt.launch(data, {
          responseHandler: async (response) => {
            console.log('PayU Response:', response);

            // PayU Bolt returns response in BOLT.response format
            // txnStatus can be: SUCCESS, FAILED, CANCEL (uppercase per PayU docs)
            // status field contains: success, failure, pending (lowercase)
            const r = response.response || {};
            const txnStatus = r.txnStatus || r.status; // txnStatus is uppercase, status is lowercase
            const statusLower = (txnStatus || '').toLowerCase();

            // Handle cancelled/failed payments without hash verification
            // Check for CANCEL, userCancelled, or missing critical fields
            if (!r.hash || !r.txnid || statusLower === 'cancel' || statusLower === 'usercancelled') {
              console.log('Payment cancelled or incomplete');
              toast.error('Payment was cancelled');
              setSubmitting(false);

              // Update order status to cancelled
              try {
                const orders = await base44.entities.Order.filter({ order_number: orderNumber });
                if (orders.length > 0) {
                  await base44.entities.Order.update(orders[0].id, {
                    payment_status: 'cancelled',
                    order_status: 'payment_failed'
                  });
                }
                const payments = await base44.entities.Payment.filter({ txnid: txnId });
                if (payments.length > 0) {
                  await base44.entities.Payment.update(payments[0].id, {
                    payment_status: 'cancelled',
                    txn_status: txnStatus || 'cancelled'
                  });
                }
              } catch (e) {
                console.error('Failed to update cancelled status:', e);
              }

              navigate(createPageUrl('Confirmation') + `?order_number=${orderNumber}&payment=cancelled`);
              return;
            }

            // Verify Response Hash for completed transactions
            // PayU response includes: status (lowercase: success/failure/pending)
            const responseParams = {
              status: r.status, // Use lowercase status for hash verification
              udf1: r.udf1 || orderNumber,
              udf2: r.udf2 || '',
              udf3: r.udf3 || '',
              udf4: r.udf4 || '',
              udf5: r.udf5 || '',
              email: r.email || '',
              firstname: r.firstname || '',
              productinfo: r.productinfo || '',
              amount: r.amount,
              txnid: r.txnid,
              key: r.key,
              hash: r.hash
            };

            let isHashValid = false;
            try {
              const verifyResponse = await base44.functions.invoke('payuVerifyHash', { params: responseParams });
              isHashValid = verifyResponse?.data?.isValid === true;
            } catch (verifyError) {
              console.error('Hash verification error:', verifyError);
              // For failed payments, don't block on hash verification
              if (statusLower !== 'success') {
                isHashValid = false;
              }
            }

            // PayU status field: success, failure, pending (lowercase)
            const isSuccess = statusLower === 'success' && isHashValid;

            if (statusLower === 'success' && !isHashValid) {
              toast.error('Security Error: Payment verification failed');
              setSubmitting(false);
              navigate(createPageUrl('Confirmation') + `?order_number=${orderNumber}&payment=failed`);
              return;
            }

            try {
              // Update Payment Record with all PayU response details - find by txnid (unique)
              const payments = await base44.entities.Payment.filter({ txnid: txnId });
              if (payments.length > 0) {
                await base44.entities.Payment.update(payments[0].id, {
                  mihpayid: r.mihpayid || '',
                  txnid: r.txnid || txnId,
                  txn_status: r.status || txnStatus || '',
                  unmapped_status: r.unmappedstatus || '',
                  payment_status: isSuccess ? 'success' : (statusLower === 'failure' || statusLower === 'failed' ? 'failed' : 'cancelled'),
                  payment_mode: r.mode || '',
                  card_category: r.cardCategory || '',
                  bank_ref_num: r.bank_ref_num || '',
                  bankcode: r.bankcode || '',
                  pg_type: r.PG_TYPE || '',
                  error_code: r.error || '',
                  error_message: r.error_Message || '',
                  card_num: r.cardnum || '',
                  name_on_card: r.name_on_card || '',
                  net_amount_debit: parseFloat(r.net_amount_debit) || total,
                  discount: parseFloat(r.discount) || 0,
                  payu_response_hash: r.hash || '',
                  hash_verified: isHashValid,
                  payment_date: new Date().toISOString()
                });
              }

              // Update Order Status with payment method
              const orders = await base44.entities.Order.filter({ order_number: orderNumber });
              if (orders.length > 0) {
                await base44.entities.Order.update(orders[0].id, {
                  payment_status: isSuccess ? 'success' : 'failed',
                  order_status: isSuccess ? 'processing' : 'payment_failed',
                  payment_method: r.mode || '',
                  payment_id: payments[0]?.id || ''
                });
              }

              // Update cart status
              const carts = await base44.entities.Cart.filter({ cart_id: cartId });
              if (carts.length > 0) {
                await base44.entities.Cart.update(carts[0].id, {
                  status: isSuccess ? 'completed' : 'checkout'
                });
              }

              // Clear local cart on successful payment
              if (isSuccess) {
                clearPhotos();
                toast.success('Payment successful!');
              } else {
                toast.error('Payment failed');
              }

              setSubmitting(false);
              // Navigate to Confirmation
              navigate(createPageUrl('Confirmation') + `?order_number=${orderNumber}&payment=${isSuccess ? 'success' : 'failed'}`);

            } catch (dbError) {
              console.error('Failed to update records:', dbError);
              // Clear cart even if DB update fails on success
              if (isSuccess) {
                clearPhotos();
              }
              setSubmitting(false);
              // Even if DB update fails, redirect based on PayU status if possible, but show error
              navigate(createPageUrl('Confirmation') + `?order_number=${orderNumber}&payment=${isSuccess ? 'success' : 'failed'}`);
            }
          },
          catchException: (response) => {
            console.error('PayU Exception:', response);
            toast.error('Payment was cancelled or failed');
            setSubmitting(false);
            // Navigate back or show retry option
            navigate(createPageUrl('Confirmation') + `?order_number=${orderNumber}&payment=cancelled`);
          }
        });

      } catch (error) {
        console.error('Payment initiation error:', error);
        toast.error('Failed to initiate payment');
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      toast.error('Order failed. Please try again.', { id: 'checkout' });
      setSubmitting(false);
    }
  };

  if (photos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF8F5] to-white">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
          <Button
            onClick={() => navigate(createPageUrl('Studio'))}
            className="bg-[#FF6B9D] hover:bg-[#FF5589] rounded-full"
          >
            Start Creating
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-warm pb-32">
      {/* Header */}
      <header className="bg-white border-b border-brand sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-semibold text-brand-dark" style={{ fontFamily: 'var(--font-serif)' }}>Checkout</h1>
          </div>
        </div>
      </header>

      {/* Upload warning banner */}
      {!canProceed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-4 pt-4"
        >
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
            <Loader2 className="w-5 h-5 text-yellow-600 animate-spin flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-yellow-800 mb-1">Photos are uploading...</p>
              <p className="text-sm text-yellow-700">
                {uploadStats.pending} of {uploadStats.total} photos still uploading.
                Please wait before placing your order.
              </p>
              <div className="w-full h-2 bg-yellow-200 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-yellow-600 transition-all duration-300"
                  style={{ width: `${(uploadStats.uploaded / uploadStats.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {uploadStats.failed > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-4 pt-4"
        >
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-800 mb-1">Some photos failed to upload</p>
              <p className="text-sm text-red-700">
                {uploadStats.failed} photo{uploadStats.failed > 1 ? 's' : ''} failed to upload.
                Please go back and retry or remove them.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-warm-light rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-brand-coral" />
              </div>
              <h2 className="text-xl font-semibold text-brand-dark">Contact Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Doe"
                  className="mt-1.5"
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@example.com"
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="flex gap-2 mt-1.5">
                    <div className="w-16 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-md text-sm font-medium text-gray-700">
                      +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="9876543210"
                      className="flex-1"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Delivery Address */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-warm-light rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-brand-coral" />
              </div>
              <h2 className="text-xl font-semibold text-brand-dark">Delivery Address</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="delivery_name">Full Name *</Label>
                <Input
                  id="delivery_name"
                  value={formData.delivery_name}
                  onChange={(e) => handleInputChange('delivery_name', e.target.value)}
                  placeholder="John Doe"
                  className="mt-1.5"
                  required
                />
              </div>
              <div>
                <Label htmlFor="address1">Address Line 1 *</Label>
                <Input
                  id="address1"
                  value={formData.address1}
                  onChange={(e) => handleInputChange('address1', e.target.value)}
                  placeholder="House/Flat No., Building Name"
                  className="mt-1.5"
                  required
                />
              </div>
              <div>
                <Label htmlFor="address2">Address Line 2</Label>
                <Input
                  id="address2"
                  value={formData.address2}
                  onChange={(e) => handleInputChange('address2', e.target.value)}
                  placeholder="Street, Area, Landmark"
                  className="mt-1.5"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Mumbai"
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pincode">PIN Code *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="400001"
                    className="mt-1.5"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="delivery_phone">Phone Number *</Label>
                  <div className="flex gap-2 mt-1.5">
                    <div className="w-16 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-md text-sm font-medium text-gray-700">
                      +91
                    </div>
                    <Input
                      id="delivery_phone"
                      type="tel"
                      value={formData.delivery_phone}
                      onChange={(e) => handleInputChange('delivery_phone', e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="9876543210"
                      className="flex-1"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Order Summary */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-warm-light rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-brand-coral" />
              </div>
              <h2 className="text-xl font-semibold text-brand-dark">Order Summary</h2>
            </div>

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
                <span className="font-semibold text-brand-dark">₹{subtotal}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span className="text-sm">Shipping</span>
                </div>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="pt-4 border-t-2 border-gray-100">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-lg font-semibold text-brand-dark">Total Amount</span>
                  <span className="text-3xl font-bold text-brand-coral">₹{total}</span>
                </div>
                <p className="text-xs text-gray-500 text-right">Including all taxes</p>
              </div>
              <div className="bg-brand-warm-light rounded-xl p-4 flex items-center justify-center gap-2 mt-6">
                <Truck className="w-4 h-4 text-brand-coral" />
                <p className="text-sm text-gray-700 font-medium">
                  Estimated delivery: <span className="text-brand-coral">5-7 business days</span>
                </p>
              </div>
            </div>
          </motion.section>
        </form>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={handleSubmit}
            disabled={submitting || !canProceed || uploadStats.failed > 0}
            className="w-full rounded-full text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold"
            style={{ backgroundColor: 'var(--color-coral)' }}
            onMouseEnter={(e) => (submitting || !canProceed || uploadStats.failed > 0) ? null : e.currentTarget.style.backgroundColor = 'var(--color-coral-dark)'}
            onMouseLeave={(e) => (submitting || !canProceed || uploadStats.failed > 0) ? null : e.currentTarget.style.backgroundColor = 'var(--color-coral)'}
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Processing...
              </>
            ) : !canProceed ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Uploading photos...
              </>
            ) : uploadStats.failed > 0 ? (
              'Fix upload errors to continue'
            ) : (
              `Place Order • ₹${total}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}