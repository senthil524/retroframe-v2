import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { usePhotos } from '@/components/PhotoContext.jsx';
import { Loader2 } from 'lucide-react';

import { toast } from 'sonner';

export default function PaymentCallback() {
  const navigate = useNavigate();
  const { clearPhotos } = usePhotos();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const processPaymentResponse = async () => {
      try {
        // Get payment response from URL parameters
        const params = new URLSearchParams(window.location.search);
        
        // order_number is numeric only (no # symbol in DB)
      const orderNumberRaw = params.get('udf1');
      const orderNumber = orderNumberRaw ? orderNumberRaw.replace(/^#/, '') : null;
        const txnIdFromPayU = params.get('txnid');  // Unique transaction ID
        const txnStatus = params.get('status');
        const mihpayid = params.get('mihpayid');
        const amount = params.get('amount');
        const mode = params.get('mode');
        const bankRefNum = params.get('bank_ref_num');
        const bankcode = params.get('bankcode');
        const errorMessage = params.get('error_Message');
        const cardNum = params.get('cardnum');
        const nameOnCard = params.get('name_on_card');
        
        // Verify hash for security
        const responseParams = {
          status: txnStatus,
          udf1: orderNumber || '', // Use empty string if null for hash check
          udf2: params.get('udf2'),
          udf3: params.get('udf3'),
          udf4: params.get('udf4'),
          udf5: params.get('udf5'),
          email: params.get('email'),
          firstname: params.get('firstname'),
          productinfo: params.get('productinfo'),
          amount: amount,
          txnid: txnIdFromPayU,
          key: params.get('key'),
          hash: params.get('hash')
        };

        // Verify hash via backend function
        const verifyResponse = await base44.functions.invoke('payuVerifyHash', { params: responseParams });
        const isHashValid = verifyResponse.data.isValid;

        if (!isHashValid) {
          console.error('Hash verification failed');
          toast.error('Security Error: Payment verification failed');
          if (orderNumber) {
            navigate(createPageUrl('Confirmation') + `?order_number=${orderNumber}&payment=failed`);
          } else {
            navigate(createPageUrl('Home'));
          }
          return;
        }

        if (!orderNumber) {
          console.error('Missing order number in callback');
          navigate(createPageUrl('Home'));
          return;
        }

        // Update payment record with all PayU response details - find by txnid (unique)
        const payments = await base44.entities.Payment.filter({ txnid: txnIdFromPayU });
        if (payments.length > 0) {
          await base44.entities.Payment.update(payments[0].id, {
            mihpayid: mihpayid || '',
            txnid: txnIdFromPayU,
            txn_status: txnStatus || '',
            unmapped_status: params.get('unmappedstatus') || '',
            payment_status: txnStatus === 'success' ? 'success' : txnStatus === 'failure' ? 'failed' : 'cancelled',
            payment_mode: mode || '',
            card_category: params.get('cardCategory') || '',
            bank_ref_num: bankRefNum || '',
            bankcode: bankcode || '',
            pg_type: params.get('PG_TYPE') || '',
            error_code: params.get('error') || '',
            error_message: errorMessage || '',
            card_num: cardNum || '',
            name_on_card: nameOnCard || '',
            net_amount_debit: parseFloat(params.get('net_amount_debit')) || 0,
            discount: parseFloat(params.get('discount')) || 0,
            payu_response_hash: params.get('hash') || '',
            hash_verified: isHashValid,
            payment_date: new Date().toISOString()
          });
        }

        // Update order status with payment method
        const orders = await base44.entities.Order.filter({ order_number: orderNumber });
        if (orders.length > 0) {
          await base44.entities.Order.update(orders[0].id, {
            payment_status: txnStatus === 'success' ? 'success' : txnStatus === 'failure' ? 'failed' : 'pending',
            order_status: txnStatus === 'success' ? 'processing' : 'payment_failed',
            payment_method: mode || '',
            payment_id: payments[0]?.id || ''
          });
        }

        // Update cart status if we have cart_id from payment
        if (payments[0]?.cart_id) {
          const carts = await base44.entities.Cart.filter({ cart_id: payments[0].cart_id });
          if (carts.length > 0) {
            await base44.entities.Cart.update(carts[0].id, {
              status: txnStatus === 'success' ? 'completed' : 'checkout'
            });
          }
        }

        // Clear cart on successful payment
        if (txnStatus === 'success') {
          clearPhotos();
          navigate(createPageUrl('Confirmation') + `?order_number=${orderNumber}&payment=success`);
        } else {
          navigate(createPageUrl('Confirmation') + `?order_number=${orderNumber}&payment=failed`);
        }
      } catch (error) {
        console.error('Payment callback error:', error);
        navigate(createPageUrl('Home'));
      }
    };

    processPaymentResponse();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-warm">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-brand-coral animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-brand-dark mb-2">Processing Payment...</h2>
        <p className="text-gray-600">Please wait while we confirm your payment</p>
      </div>
    </div>
  );
}