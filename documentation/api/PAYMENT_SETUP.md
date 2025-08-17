# 💳 Payment Gateway Setup Guide - Razorpay Integration

## 🎯 **Overview**
आपके ESSE - Naturals & Nutrition प्रोजेक्ट में अब **dual payment system** है:

1. **Razorpay Payment** (Recommended) - Production ready
2. **Mock Payment Gateway** - For testing/demo purposes

## 🔧 **Razorpay Setup Steps**

### **Step 1: Razorpay Account बनाएं**

1. Visit: https://razorpay.com
2. Sign up for a business account
3. Complete KYC verification
4. Get your API keys

### **Step 2: API Keys Configure करें**

1. Razorpay Dashboard में जाएं
2. Settings → API Keys से keys copy करें
3. Create `.env.local` file in project root:

```bash
# Copy from .env.example and fill with your keys
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
MONGODB_URI=mongodb://localhost:27017/hack
NEXT_PUBLIC_APP_URL=http://localhost:3005
```

### **Step 3: Test Mode Setup**

Development के लिए test keys का उपयोग करें:

```bash
# Test Mode Keys (for development)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=test_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

## 🧪 **Testing Guide**

### **Test Cards for Development:**

1. **Success Payment:**
   - Card: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date

2. **Failed Payment:**
   - Card: `4000 0000 0000 0002`

3. **UPI Testing:**
   - UPI ID: `success@razorpay`
   - UPI ID: `failure@razorpay`

### **Test Flow:**
1. Add products to cart
2. Go to checkout
3. Select delivery address  
4. Choose "Online Payment" (Razorpay)
5. Use test card details
6. Complete payment

## 📱 **Supported Payment Methods**

### **Through Razorpay:**
✅ Credit/Debit Cards (Visa, MasterCard, RuPay)
✅ UPI (Google Pay, PhonePe, Paytm, etc.)
✅ Net Banking (All major banks)
✅ Digital Wallets (Paytm, Mobikwik, etc.)
✅ Buy Now Pay Later (LazyPay, etc.)

### **Backup Payment:**
✅ Mock payment system for fallback
✅ Cash on Delivery option
✅ Manual payment methods

## 💰 **Pricing Structure**

### **Razorpay Transaction Fees:**
- **Domestic Cards:** 2% + ₹3 per transaction
- **UPI:** 1% + ₹1 per transaction  
- **Net Banking:** 2% + ₹3 per transaction
- **Wallets:** 1.5% + ₹2 per transaction

### **Free Tier:**
- First ₹1,00,000 in transactions - No setup fees
- No annual maintenance charges
- Instant activation

## 🚀 **Go Live Checklist**

### **Before Production:**

1. **✅ Test Integration**
   - All payment methods working
   - Success/failure scenarios tested
   - Order creation working
   - Email notifications setup

2. **✅ Security Verification**
   - SSL certificate installed
   - Environment variables secure
   - No API keys in frontend code

3. **✅ Razorpay Account Setup**
   - KYC completed
   - Business verification done
   - Live API keys generated
   - Webhook endpoints configured

4. **✅ Legal Compliance**
   - Terms of Service updated
   - Privacy Policy includes payment info
   - Refund/Cancellation policy clear

### **Production Deployment:**

1. Update `.env` with live keys:
```bash
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=live_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
```

2. Setup webhook endpoint:
   - URL: `https://yourdomain.com/api/payment/webhook`
   - Events: `payment.captured`, `payment.failed`

3. Configure settlement:
   - Auto-settlement to your bank account
   - Settlement timing (T+0, T+1, etc.)

## 🔍 **Monitoring & Analytics**

### **Razorpay Dashboard:**
- Real-time transaction monitoring
- Success/failure rates
- Settlement reports
- Customer payment behavior

### **Your Application:**
- Order confirmation emails
- Payment success/failure logs
- Customer support integration
- Refund management

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **"Failed to load Razorpay SDK"**
   - Check internet connection
   - Verify script loading in browser console
   
2. **"Invalid API Key"**
   - Check environment variables
   - Ensure PUBLIC key is used in frontend
   
3. **"Payment Verification Failed"**
   - Check webhook secret
   - Verify signature calculation
   
4. **"Order Creation Failed"**
   - Check database connectivity
   - Verify order amount format

### **Support Contacts:**
- **Razorpay Support:** https://razorpay.com/support/
- **Documentation:** https://razorpay.com/docs/
- **Integration Help:** support@razorpay.com

## 🎯 **Next Enhancements**

1. **Email Notifications:** Integrate with SendGrid/AWS SES
2. **SMS Alerts:** Payment confirmation via SMS
3. **Refund Management:** Automated refund processing
4. **Subscription Billing:** For recurring orders
5. **Multi-currency:** For international customers

---

## 🔐 **Security Notes**

⚠️ **IMPORTANT:**
- Never commit `.env` files to Git
- Use different keys for development/production  
- Regularly rotate API secrets
- Monitor unusual transaction patterns
- Setup fraud detection rules in Razorpay dashboard

---

**Happy Selling! 🚀 आपका e-commerce business ready है!**
