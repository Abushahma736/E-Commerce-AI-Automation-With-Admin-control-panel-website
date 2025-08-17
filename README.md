# 🛒 ESSE Naturals Nutrition - AI-Powered E-Commerce Platform

**Complete Full-Stack E-Commerce Solution with Advanced AI Integration**

[![Next.js](https://img.shields.io/badge/Next.js-15.4+-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.8+-green.svg)](https://www.mongodb.com/)
[![AI](https://img.shields.io/badge/AI-Google%20Gemini-orange.svg)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-blue.svg)](https://www.typescriptlang.org/)

A modern, production-ready e-commerce platform for natural health products featuring advanced AI capabilities, voice assistant, real-time chat, payment processing, comprehensive admin panel, and automated content management.

## 🎯 **Live Demo Features**

- 🛍️ **Complete Shopping Experience** - Product catalog, cart, checkout, order tracking
- 🤖 **AI Voice Assistant** - Hindi/English voice interactions with Gemini AI
- 👨‍💼 **Admin Dashboard** - Complete product, order, and user management
- 💳 **Payment Integration** - Razorpay payment gateway with multiple options
- 📱 **Responsive Design** - Mobile-first, works on all devices
- 🔐 **Authentication** - Secure user login with NextAuth.js
- 💬 **Real-time Chat** - Live customer support with Socket.IO
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS and Framer Motion
- 📊 **Analytics Dashboard** - Sales metrics, user behavior, and insights
- 🔍 **Smart Search** - AI-powered product discovery

## 🚀 **Quick Start - Clone & Run**

### **Prerequisites**
- Node.js 18+ and npm
- MongoDB database (local or cloud)
- Google Gemini API key (free)

### **1. Clone Repository**
```bash
git clone https://github.com/ibrahimalam078/hack.git
cd hack
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Setup**
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local and add your API keys:
# GEMINI_API_KEY=your_gemini_api_key_here
# MONGODB_URI=your_mongodb_connection_string
# NEXTAUTH_SECRET=your_nextauth_secret
```

### **4. Database Setup**
```bash
# Seed the database with sample data
npm run seed
npm run seed-admin
npm run seed-users
```

### **5. Start Development Server**
```bash
npm run dev
```

**🎉 Open http://localhost:3005 in your browser!**

## 🏗️ **Project Architecture**

```
esse-naturals-nutrition/
├── 🎨 Frontend (Next.js 15 + TypeScript)
│   ├── app/                    # App Router pages
│   ├── components/             # Reusable UI components
│   ├── lib/                   # Utilities and configurations
│   └── public/                # Static assets
├── 🧠 AI Services
│   ├── ai_app.py              # Main AI service
│   ├── voice_assistant.py     # Voice interaction
│   └── ai_marketing_app.py    # Marketing automation
├── 🗄️ Database (MongoDB)
│   ├── data/                  # Sample data files
│   └── scripts/               # Database seeders
└── 📱 Features
    ├── 🛍️ E-commerce Core
    ├── 🤖 AI Integration
    ├── 👨‍💼 Admin Panel
    ├── 💳 Payment Processing
    └── 📊 Analytics
```

## ✨ **Core Features**

### 🛒 **E-Commerce Functionality**
- **Product Catalog** - Advanced filtering, sorting, search
- **Shopping Cart** - Add, remove, update quantities
- **Checkout Process** - Multi-step with address and payment
- **Order Management** - Track orders, order history
- **User Accounts** - Registration, login, profile management
- **Wishlist** - Save products for later
- **Reviews & Ratings** - Customer feedback system

### 🤖 **AI-Powered Features**
- **Voice Shopping** - "Add turmeric capsules to cart" (Hindi/English)
- **Smart Recommendations** - ML-powered product suggestions
- **AI Chat Support** - Intelligent customer service
- **Content Generation** - Automated product descriptions
- **Image Recognition** - Product identification via camera
- **Voice Search** - Speak to find products

### 👨‍💼 **Admin Dashboard**
- **Product Management** - CRUD operations, inventory tracking
- **Order Processing** - Order status updates, fulfillment
- **User Management** - Customer data, roles, permissions
- **Analytics** - Sales reports, user behavior, trends
- **Content Management** - Blog posts, pages, SEO
- **Marketing Tools** - Promotions, discounts, campaigns

### 💳 **Payment & Security**
- **Razorpay Integration** - Cards, UPI, Net Banking, Wallets
- **Secure Checkout** - PCI compliant payment processing
- **Order Tracking** - Real-time status updates
- **Invoice Generation** - Automated billing
- **Refund Management** - Easy refund processing

## 🛠️ **Technology Stack**

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.4+ | React framework with App Router |
| **React** | 18.2 | UI library with hooks |
| **TypeScript** | 5.5+ | Type safety and better DX |
| **Tailwind CSS** | 3.4+ | Utility-first styling |
| **Framer Motion** | 10.16+ | Smooth animations |
| **Radix UI** | Latest | Accessible components |

### **Backend & Database**
| Technology | Version | Purpose |
|------------|---------|---------|
| **MongoDB** | 6.8+ | NoSQL database |
| **NextAuth.js** | 4.24+ | Authentication |
| **Socket.IO** | 4.7+ | Real-time communication |
| **Razorpay** | 2.9+ | Payment processing |

### **AI & ML**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Google Gemini** | Latest | Conversational AI |
| **TensorFlow.js** | 4.12+ | Client-side ML |
| **OpenAI** | 4.52+ | Additional AI features |
| **Face-API.js** | 0.22+ | Facial recognition |

## 📱 **Pages & Features**

### **Customer Pages**
- **Home** (`/`) - Hero section, featured products, testimonials
- **Products** (`/products`) - Product catalog with filters
- **Product Detail** (`/products/[id]`) - Detailed product view
- **Cart** (`/cart`) - Shopping cart management
- **Checkout** (`/checkout`) - Multi-step checkout process
- **Account** (`/account`) - User profile and order history
- **Contact** (`/contact`) - Customer support and contact info

### **Admin Pages**
- **Dashboard** (`/admin`) - Analytics and overview
- **Products** (`/admin/products`) - Product management
- **Orders** (`/admin/orders`) - Order processing
- **Users** (`/admin/users`) - Customer management
- **Analytics** (`/admin/analytics`) - Detailed reports
- **Settings** (`/admin/settings`) - System configuration

### **AI Features**
- **Voice Assistant** - Hands-free shopping experience
- **AI Chat** - Intelligent customer support
- **Smart Search** - Natural language product search
- **Recommendations** - Personalized product suggestions

## 🎨 **UI Components**

Built with modern, accessible components:

```typescript
// Example: Product Card Component
<ProductCard
  id={product.id}
  name={product.name}
  price={product.price}
  image={product.image}
  rating={product.rating}
  onAddToCart={handleAddToCart}
  onAddToWishlist={handleAddToWishlist}
/>

// Example: AI Voice Button
<VoiceAssistant
  language="hi" // Hindi/English support
  onCommand={handleVoiceCommand}
  onResponse={handleAIResponse}
/>
```

## 🔧 **Configuration**

### **Environment Variables**
```bash
# Required API Keys
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Database
MONGODB_URI=mongodb://localhost:27017/esse-naturals
MONGODB_DB=esse-naturals

# Authentication
NEXTAUTH_URL=http://localhost:3005
NEXTAUTH_SECRET=your_nextauth_secret_here

# Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# External Services
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

### **Database Collections**
- **products** - Product catalog with variants
- **users** - Customer accounts and profiles
- **orders** - Order history and status
- **categories** - Product categorization
- **reviews** - Customer reviews and ratings
- **cart** - Shopping cart items
- **wishlists** - Saved products
- **admin_users** - Admin panel access

## 🎯 **Getting Started for Developers**

### **Development Commands**
```bash
# Development server (port 3005)
npm run dev

# Production build
npm run build
npm start

# Database seeding
npm run seed          # Products and categories
npm run seed-admin    # Admin users
npm run seed-users    # Sample customers

# Code quality
npm run lint
npm run type-check
```

### **AI Services Setup**
```bash
# Install Python dependencies for AI features
pip install -r requirements.txt

# Start AI service (for voice assistant)
python ai_app.py

# Start voice assistant
python voice_assistant.py

# Start marketing automation
python ai_marketing_app.py
```

## 📊 **Testing & Demo**

### **Test Accounts**
```
👨‍💼 Admin Account:
Email: admin@esse.com
Password: admin123

👤 Customer Account:
Email: customer@test.com
Password: customer123
```

### **Test Payment**
```
💳 Test Card (Razorpay):
Card: 4111 1111 1111 1111
CVV: 123
Expiry: Any future date
```

### **Demo Data**
- 50+ natural health products
- 20 product categories
- Sample customer orders
- Reviews and ratings
- Admin analytics data

## 🚀 **Deployment**

### **Vercel Deployment (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Manual Deployment**
```bash
# Build production
npm run build

# Start production server
npm start
```

### **Environment Variables for Production**
- Set all environment variables in your hosting platform
- Use production MongoDB database
- Configure production payment gateway keys
- Set secure NEXTAUTH_SECRET

## 🔍 **API Routes**

### **Customer APIs**
```
GET    /api/products           # Get all products
GET    /api/products/[id]      # Get single product
POST   /api/cart/add          # Add to cart
POST   /api/orders/create     # Create order
GET    /api/user/profile      # User profile
```

### **Admin APIs**
```
POST   /api/admin/products     # Create product
PUT    /api/admin/products/[id] # Update product
DELETE /api/admin/products/[id] # Delete product
GET    /api/admin/orders       # Get all orders
GET    /api/admin/analytics    # Dashboard data
```

### **AI APIs**
```
POST   /api/ai/voice          # Voice command processing
POST   /api/ai/chat           # AI chat responses  
POST   /api/ai/recommend      # Product recommendations
POST   /api/ai/search         # Intelligent search
```

## 🎨 **Customization**

### **Branding**
- Update colors in `tailwind.config.ts`
- Replace logos in `public/` directory
- Modify content in `data/` files

### **Adding Products**
```javascript
// Add to data/products.js or use admin panel
{
  name: "New Product",
  price: 999,
  category: "supplements",
  description: "Product description",
  images: ["product1.jpg"],
  inStock: true,
  featured: false
}
```

### **Custom Components**
```typescript
// Create in components/
export function CustomComponent() {
  return (
    <div className="custom-component">
      {/* Your custom UI */}
    </div>
  )
}
```

## 🐛 **Common Issues & Solutions**

### **Installation Issues**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Python dependencies issues
pip install --upgrade pip
pip install -r requirements.txt
```

### **Database Connection**
```bash
# Check MongoDB is running
mongosh "mongodb://localhost:27017"

# Reset database
npm run seed
```

### **API Key Issues**
```bash
# Verify environment file
cat .env.local

# Restart development server
npm run dev
```

## 📈 **Performance Optimization**

- **Image Optimization** - Next.js automatic optimization
- **Code Splitting** - Automatic with Next.js App Router
- **Caching** - MongoDB queries and API responses
- **CDN Ready** - Static assets optimized for CDN
- **Mobile First** - Responsive design for all devices

## 🔒 **Security Features**

- **Input Validation** - All forms and APIs validated
- **CSRF Protection** - NextAuth.js built-in protection
- **Secure Headers** - Security headers configured
- **Environment Variables** - Secrets not in code
- **Payment Security** - PCI compliant via Razorpay

## 🎓 **Learning Resources**

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Google AI Documentation](https://ai.google.dev/docs)

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 **Support**

- 📧 **Email**: support@esse-naturals.com
- 💬 **Discord**: [Join our community]()
- 📱 **WhatsApp**: +91-XXXXX-XXXXX
- 🐛 **Issues**: [GitHub Issues]()

---

## 🎯 **Project Highlights**

- ✅ **Production Ready** - Complete e-commerce solution
- ✅ **AI Integration** - Voice assistant and smart features
- ✅ **Modern Stack** - Next.js 15, React 18, TypeScript
- ✅ **Responsive Design** - Works on all devices
- ✅ **Real Payments** - Razorpay integration
- ✅ **Admin Panel** - Complete management system
- ✅ **SEO Optimized** - Better search rankings
- ✅ **Fast Performance** - Optimized for speed

**🚀 Ready to revolutionize your e-commerce business with AI? Clone, configure, and launch!**

---

*Last Updated: August 15, 2025 | Version: 1.0.0 | Status: Production Ready*
