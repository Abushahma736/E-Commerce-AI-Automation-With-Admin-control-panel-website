"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { createRazorpayOrder, initiateRazorpayPayment, verifyPayment } from '@/lib/razorpay';
import { toast } from 'sonner';
import { CreditCard, Smartphone, Loader } from 'lucide-react';

interface RazorpayPaymentProps {
  amount: number;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
  disabled?: boolean;
}

export default function RazorpayPayment({
  amount,
  customerEmail,
  customerPhone,
  customerName,
  onPaymentSuccess,
  onPaymentError,
  disabled = false
}: RazorpayPaymentProps) {
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    try {
      setProcessing(true);
      
      // Create order
      const order = await createRazorpayOrder(amount);
      
      // Special handling for UPI testing
      const isTestMode = process.env.NODE_ENV === 'development';
      const testUpiId = '93340@paytm'; // Your preferred UPI ID
      
      // Initiate payment
      await initiateRazorpayPayment({
        amount: order.amount,
        currency: order.currency,
        name: 'ESSE - Naturals & Nutrition',
        description: 'Natural Products Order',
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify payment
            const verified = await verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );
            
            if (verified) {
              toast.success('Payment successful!');
              onPaymentSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                amount,
                currency: order.currency
              });
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
            onPaymentError('Payment verification failed');
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone
        },
        notes: {
          order_type: 'natural_products',
          customer_email: customerEmail
        },
        theme: {
          color: '#0078ad' // Your brand green color
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            toast.info('Payment cancelled');
          }
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment');
      onPaymentError(error instanceof Error ? error.message : 'Payment failed');
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Payment Methods Display */}
      <div className="bg-slate-50 rounded-lg p-4 space-y-3">
        <h4 className="font-semibold text-brand-navy">Secure Payment Options</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <CreditCard className="w-4 h-4" />
            <span>Credit/Debit Cards</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Smartphone className="w-4 h-4" />
            <span>UPI & Wallets</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-xs">🏦</span>
            <span>Net Banking</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-xs">💰</span>
            <span>Buy Now Pay Later</span>
          </div>
        </div>
      </div>

      {/* Payment Amount */}
      <div className="bg-gradient-to-r from-brand-green/10 to-brand-green/5 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-600">Total Amount:</span>
          <span className="text-2xl font-bold text-brand-navy">
            ₹{amount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Pay Button */}
      <Button
        onClick={handlePayment}
        disabled={disabled || processing}
        size="lg"
        className="w-full bg-gradient-to-r from-brand-green to-brand-green/90 hover:from-brand-green/90 hover:to-brand-green text-white font-semibold py-4 h-14"
      >
        {processing ? (
          <>
            <Loader className="w-5 h-5 animate-spin mr-2" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Pay ₹{amount.toLocaleString('en-IN')} Securely
          </>
        )}
      </Button>

      {/* Security Notice */}
      <div className="text-center text-xs text-slate-500">
        <p>🔒 Your payment is secured by Razorpay</p>
        <p>All transactions are encrypted and secure</p>
      </div>
    </div>
  );
}
