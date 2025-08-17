"use client"

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { 
  QrCode, 
  Copy, 
  CheckCircle, 
  Smartphone, 
  Timer, 
  AlertCircle,
  Download,
  Share2
} from 'lucide-react';
import QRCode from 'qrcode';

interface UPIQRPaymentProps {
  amount: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
  onCancel: () => void;
}

export default function UPIQRPayment({
  amount,
  orderNumber,
  customerName,
  customerEmail,
  onPaymentSuccess,
  onPaymentError,
  onCancel
}: UPIQRPaymentProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isExpired, setIsExpired] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'success' | 'failed'>('pending');
  const [transactionId, setTransactionId] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Your UPI ID
  const UPI_ID = '9334042952@ybl';
  const MERCHANT_NAME = 'ESSE Naturals & Nutrition';

  useEffect(() => {
    generateQRCode();
    startTimer();
    return () => {
      // Cleanup timer if component unmounts
    };
  }, [amount, orderNumber]);

  const generateQRCode = async () => {
    try {
      // UPI Payment URL format
      const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Order ${orderNumber} - Natural Products`)}&tr=${orderNumber}`;
      
      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(upiUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#0078ad', // Your brand color
          light: '#FFFFFF'
        }
      });
      
      setQrCodeUrl(qrCodeDataUrl);
      
      // Also generate on canvas for download
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, upiUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: '#0078ad',
            light: '#FFFFFF'
          }
        });
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    }
  };

  const startTimer = () => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    toast.success('UPI ID copied to clipboard!');
  };

  const copyAmount = () => {
    navigator.clipboard.writeText(amount.toString());
    toast.success('Amount copied to clipboard!');
  };

  const downloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `UPI-QR-${orderNumber}.png`;
      link.href = qrCodeUrl;
      link.click();
      toast.success('QR code downloaded!');
    }
  };

  const shareQR = async () => {
    if (navigator.share && qrCodeUrl) {
      try {
        // Convert data URL to blob
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const file = new File([blob], `UPI-Payment-${orderNumber}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: 'UPI Payment QR Code',
          text: `Pay ₹${amount} for Order ${orderNumber}`,
          files: [file]
        });
      } catch (error) {
        // Fallback to copying UPI ID
        copyUpiId();
      }
    } else {
      copyUpiId();
    }
  };

  const confirmPayment = () => {
    const txnId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
    setTransactionId(txnId);
    setPaymentStatus('checking');
    
    // Simulate payment verification (replace with actual verification)
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate for demo
      
      if (success) {
        setPaymentStatus('success');
        toast.success('Payment confirmed successfully!');
        onPaymentSuccess({
          paymentId: txnId,
          method: 'UPI',
          upiId: UPI_ID,
          amount,
          status: 'success',
          timestamp: new Date().toISOString()
        });
      } else {
        setPaymentStatus('failed');
        toast.error('Payment verification failed');
        onPaymentError('Payment verification failed');
      }
    }, 3000);
  };

  const regenerateQR = () => {
    setIsExpired(false);
    setTimeLeft(600);
    setPaymentStatus('pending');
    generateQRCode();
    startTimer();
    toast.info('New QR code generated');
  };

  if (paymentStatus === 'success') {
    return (
      <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">Payment Successful!</h3>
        <p className="text-green-600 mb-4">Transaction ID: {transactionId}</p>
        <p className="text-sm text-green-700">Amount: ₹{amount.toLocaleString()}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <QrCode className="w-6 h-6 text-brand-green" />
          <h3 className="text-lg font-semibold">UPI QR Payment</h3>
        </div>
        <p className="text-sm text-gray-600">
          Scan QR code with any UPI app to pay ₹{amount.toLocaleString()}
        </p>
      </div>

      {/* Timer */}
      <div className="text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
          timeLeft > 60 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          <Timer className="w-4 h-4" />
          <span className="font-mono font-semibold">
            {isExpired ? 'Expired' : formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {!isExpired && paymentStatus !== 'checking' ? (
        <>
          {/* QR Code */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="text-center space-y-4">
              {qrCodeUrl ? (
                <div className="inline-block p-4 bg-white rounded-lg shadow-inner">
                  <img 
                    src={qrCodeUrl} 
                    alt="UPI Payment QR Code" 
                    className="w-64 h-64 mx-auto"
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>
              ) : (
                <div className="w-64 h-64 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-gray-500">Generating QR Code...</div>
                </div>
              )}

              {/* QR Actions */}
              <div className="flex justify-center gap-2">
                <Button
                  onClick={downloadQR}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button
                  onClick={shareQR}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-800">Payment Details</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">UPI ID:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-white px-2 py-1 rounded border">
                    {UPI_ID}
                  </span>
                  <Button
                    onClick={copyUpiId}
                    variant="outline"
                    size="sm"
                    className="p-1 h-8 w-8"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-brand-navy">
                    ₹{amount.toLocaleString()}
                  </span>
                  <Button
                    onClick={copyAmount}
                    variant="outline"
                    size="sm"
                    className="p-1 h-8 w-8"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Order:</span>
                <span className="font-mono text-sm">{orderNumber}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Merchant:</span>
                <span className="text-sm">{MERCHANT_NAME}</span>
              </div>
            </div>
          </div>

          {/* Popular UPI Apps */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Popular UPI Apps
            </h4>
            <div className="grid grid-cols-4 gap-3 text-xs text-center">
              {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                <div key={app} className="bg-white p-2 rounded border">
                  <div className="font-medium text-blue-800">{app}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-blue-600 mt-3 text-center">
              Open any UPI app → Scan QR → Pay ₹{amount.toLocaleString()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={onCancel}
              variant="outline"
              className="w-full"
            >
              Cancel Payment
            </Button>
            <Button
              onClick={confirmPayment}
              className="w-full bg-brand-green hover:bg-brand-green/90"
            >
              I Have Paid
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-yellow-800 mb-2">Payment Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 text-yellow-700">
                  <li>Open any UPI app on your phone</li>
                  <li>Scan the QR code above</li>
                  <li>Verify amount (₹{amount.toLocaleString()}) and merchant name</li>
                  <li>Enter your UPI PIN to complete payment</li>
                  <li>Click "I Have Paid" button after successful payment</li>
                </ol>
              </div>
            </div>
          </div>
        </>
      ) : isExpired ? (
        /* Expired State */
        <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">QR Code Expired</h3>
          <p className="text-red-600 mb-4">Please generate a new QR code to continue</p>
          <Button onClick={regenerateQR} className="bg-brand-green hover:bg-brand-green/90">
            Generate New QR Code
          </Button>
        </div>
      ) : (
        /* Checking Payment State */
        <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Verifying Payment...</h3>
          <p className="text-blue-600">Please wait while we confirm your payment</p>
        </div>
      )}
    </div>
  );
}
