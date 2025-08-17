import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { payment_id, order_id, signature } = await req.json();

    if (!payment_id || !order_id || !signature) {
      return NextResponse.json(
        { error: 'Missing required payment details' },
        { status: 400 }
      );
    }

    // Create signature to verify
    const body = order_id + "|" + payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === signature;

    if (isSignatureValid) {
      // Here you can save the payment details to your database
      // For now, we'll just return success
      
      return NextResponse.json({
        verified: true,
        payment_id,
        order_id,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid signature', verified: false },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Payment verification failed', verified: false },
      { status: 500 }
    );
  }
}
