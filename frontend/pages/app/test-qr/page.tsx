"use client"

import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import UPIQRPayment from '@/components/UPIQRPayment';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TestQRPage() {
  const [amount, setAmount] = useState(1234);
  const [orderNumber, setOrderNumber] = useState(`TEST-${Date.now()}`);

  const handlePaymentSuccess = (paymentData: any) => {
    alert(`Payment Success!\nTransaction ID: ${paymentData.paymentId}\nAmount: ₹${paymentData.amount}`);
    console.log('Payment Success:', paymentData);
  };

  const handlePaymentError = (error: string) => {
    alert(`Payment Error: ${error}`);
    console.error('Payment Error:', error);
  };

  const handleCancel = () => {
    alert('Payment cancelled by user');
  };

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <Container>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-semibold">UPI QR Payment Test</h1>
          </div>

          {/* Test Controls */}
          <div className="bg-white rounded-lg shadow border p-6 mb-6">
            <h3 className="font-semibold mb-4">Test Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                  min="1"
                  max="100000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Number
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>
              <Button 
                onClick={() => {
                  setOrderNumber(`TEST-${Date.now()}`);
                }}
                variant="outline"
                size="sm"
              >
                Generate New Order Number
              </Button>
            </div>
          </div>

          {/* QR Payment Component */}
          <div className="bg-white rounded-lg shadow border p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-brand-green mb-2">
                🔥 Live UPI QR Payment Demo
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>UPI ID:</strong> 9334042952@ybl</p>
                <p><strong>Merchant:</strong> ESSE Naturals & Nutrition</p>
                <p><strong>Amount:</strong> ₹{amount.toLocaleString()}</p>
                <p><strong>Order:</strong> {orderNumber}</p>
              </div>
            </div>

            <UPIQRPayment
              amount={amount}
              orderNumber={orderNumber}
              customerName="Test Customer"
              customerEmail="test@example.com"
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              onCancel={handleCancel}
            />
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-blue-800 mb-2">📱 How to Test:</h4>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Adjust the amount above if needed</li>
              <li>The QR code will generate automatically with your UPI ID</li>
              <li>Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
              <li>Scan the QR code displayed</li>
              <li>Verify the amount and merchant name</li>
              <li>Complete payment with your UPI PIN</li>
              <li>Click "I Have Paid" button after payment</li>
            </ol>
          </div>

          {/* UPI ID Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-green-800 mb-2">💰 Payment Details:</h4>
            <div className="text-sm text-green-700 space-y-1">
              <p><strong>UPI ID:</strong> 9334042952@ybl (Yes Bank)</p>
              <p><strong>QR Code Format:</strong> Standard UPI QR with amount & order info</p>
              <p><strong>Timer:</strong> 10 minutes expiry (regenerate if expired)</p>
              <p><strong>Verification:</strong> Mock verification (90% success rate in demo)</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
