# 🏗️ Architecture & Deployment Guide - ESSE Naturals

## 📐 System Architecture Overview

The ESSE Naturals platform follows a modern, scalable architecture combining Next.js frontend, Python AI services, and MongoDB database with real-time capabilities and comprehensive API integration.

---

## 🎯 Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser]
        B[Mobile Browser]
        C[Admin Dashboard]
    end
    
    subgraph "Frontend Layer (Next.js)"
        D[App Router Pages]
        E[API Routes]
        F[Components]
        G[State Management]
    end
    
    subgraph "AI Services Layer (Python)"
        H[AI App Service]
        I[Voice Assistant]
        J[Marketing AI]
    end
    
    subgraph "Database Layer"
        K[(MongoDB)]
        L[JSON Fallback]
    end
    
    subgraph "External Services"
        M[Razorpay Gateway]
        N[Twilio SMS]
        O[Gemini AI API]
        P[OpenAI API]
    end
    
    A --> D
    B --> D
    C --> D
    D --> E
    E --> H
    E --> I
    E --> J
    E --> K
    E --> L
    E --> M
    E --> N
    H --> O
    H --> P
    I --> O
```

---

## 🔧 Technical Stack Deep Dive

### **Frontend Architecture (Next.js 15)**

#### **App Router Structure**
```
app/
├── (routes)/
│   ├── page.tsx                    # Home page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   │
│   ├── shop/
│   │   ├── page.tsx                # Product listing
│   │   └── [slug]/page.tsx         # Product details
│   │
│   ├── admin/
│   │   ├── layout.tsx              # Admin layout
│   │   ├── page.tsx                # Dashboard
│   │   ├── products/
│   │   ├── orders/
│   │   └── analytics/
│   │
│   ├── api/
│   │   ├── products/
│   │   │   ├── route.ts            # GET /api/products
│   │   │   └── [id]/route.ts       # GET /api/products/[id]
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts
│   │   │   └── register/route.ts
│   │   └── payment/
│   │       ├── create-order/route.ts
│   │       └── verify/route.ts
│   │
│   ├── ai-voice/
│   │   └── page.tsx                # Voice assistant UI
│   │
│   └── account/
       ├── layout.tsx
       ├── profile/page.tsx
       └── orders/page.tsx
```

#### **Component Architecture**
```
components/
├── ui/                             # Base UI components
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── modal.tsx
│
├── layout/                         # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Navigation.tsx
│
├── product/                        # Product components
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── ProductDetail.tsx
│   └── ProductRecommendations.tsx
│
├── admin/                          # Admin components
│   ├── AdminSidebar.tsx
│   ├── ProductForm.tsx
│   ├── OrderTable.tsx
│   └── AnalyticsChart.tsx
│
└── ai/                            # AI components
    ├── VoiceAssistant.tsx
    ├── ChatBot.tsx
    └── RecommendationEngine.tsx
```

---

## 🧠 AI Services Architecture

### **Python Services Structure**
```
ai_services/
├── ai_app.py                       # Main AI Flask service
├── voice_assistant.py              # Voice processing service
├── ai_marketing_app.py             # Marketing automation
├── requirements.txt                # Python dependencies
│
├── models/
│   ├── recommendation_model.py     # ML recommendation engine
│   ├── nlp_processor.py           # Natural language processing
│   └── image_analyzer.py          # Computer vision
│
├── utils/
│   ├── api_helpers.py             # API utility functions
│   ├── data_processors.py         # Data processing utilities
│   └── security.py               # Security utilities
│
└── config/
    ├── ai_config.py               # AI service configuration
    └── model_config.py            # ML model settings
```

### **AI Service Communication**
```python
# API Communication Pattern
class AIServiceClient:
    def __init__(self):
        self.base_url = "http://localhost:5000"
        self.timeout = 30
        
    async def generate_description(self, product_data):
        response = await fetch(f"{self.base_url}/api/generate-description", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(product_data)
        })
        return response.json()
        
    async def get_recommendations(self, user_id, context):
        # ML-powered recommendations
        pass
        
    async def process_voice_command(self, audio_data):
        # Voice processing pipeline
        pass
```

---

## 💾 Database Architecture

### **MongoDB Collections Schema**

#### **Products Collection**
```javascript
{
  _id: ObjectId,
  id: String,                       // Unique product identifier
  title: String,                    // Product name
  description: String,              // Product description
  price: Number,                    // Product price
  onSale: Boolean,                  // Sale status
  salePrice: Number,               // Discounted price
  category: String,                // Product category
  images: [String],                // Product image URLs
  tags: [String],                  // SEO and search tags
  inStock: Boolean,                // Availability status
  stockQuantity: Number,           // Available quantity
  rating: {
    average: Number,               // Average rating
    count: Number                  // Number of reviews
  },
  features: [String],              // Product features
  createdAt: Date,
  updatedAt: Date
}
```

#### **Users Collection**
```javascript
{
  _id: ObjectId,
  email: String,                   // Unique email
  name: String,                    // User full name
  phone: String,                   // Phone number
  hashedPassword: String,          // Encrypted password
  role: String,                    // "customer" | "admin"
  profile: {
    avatar: String,                // Profile image URL
    dateOfBirth: Date,
    preferences: [String]          // Product preferences
  },
  addresses: [{
    type: String,                  // "home" | "work" | "other"
    street: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: Boolean
  }],
  wishlist: [String],              // Product IDs
  cart: [{
    productId: String,
    quantity: Number,
    addedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### **Orders Collection**
```javascript
{
  _id: ObjectId,
  orderId: String,                 // Unique order identifier
  userId: String,                  // Customer ID
  items: [{
    productId: String,
    title: String,
    price: Number,
    quantity: Number,
    subtotal: Number
  }],
  summary: {
    subtotal: Number,
    shipping: Number,
    tax: Number,
    discount: Number,
    total: Number
  },
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  payment: {
    method: String,                // "card" | "upi" | "netbanking"
    transactionId: String,
    status: String,               // "pending" | "completed" | "failed"
    gateway: String               // "razorpay"
  },
  status: String,                 // "pending" | "confirmed" | "shipped" | "delivered"
  tracking: {
    carrier: String,
    trackingNumber: String,
    estimatedDelivery: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

### **Database Connection & Fallback Strategy**
```typescript
// lib/mongodb.ts
export async function getDb(): Promise<Db | null> {
  try {
    const client = await getClient()
    if (!client) return null
    return client.db(dbName)
  } catch (error) {
    console.log('⚠️ MongoDB unavailable, using JSON fallback')
    return null
  }
}

// Fallback to JSON files when MongoDB is unavailable
export async function getAllProducts(): Promise<Product[]> {
  const mongoProducts = await getAllProductsFromMongo()
  if (mongoProducts.length > 0) return mongoProducts
  
  // Fallback to JSON file
  const jsonProducts = await import('@/data/products.json')
  return jsonProducts.default
}
```

---

## 🔐 Authentication & Security Architecture

### **NextAuth.js Configuration**
```typescript
// app/api/auth/[...nextauth]/route.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = await verifyCredentials(credentials)
        return user ? { id: user.id, email: user.email, name: user.name } : null
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role
      return session
    }
  }
}
```

### **Security Middleware**
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")
  const { pathname } = request.nextUrl
  
  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    return authMiddleware(request)
  }
  
  // Rate limiting
  if (pathname.startsWith('/api/')) {
    return rateLimitMiddleware(request)
  }
  
  return NextResponse.next()
}
```

---

## 💳 Payment Integration Architecture

### **Razorpay Integration**
```typescript
// app/api/payment/create-order/route.ts
export async function POST(request: Request) {
  const { amount, currency = 'INR', receipt } = await request.json()
  
  const order = await razorpay.orders.create({
    amount: amount * 100, // Convert to paise
    currency,
    receipt,
    payment_capture: 1
  })
  
  return NextResponse.json({ 
    orderId: order.id,
    amount: order.amount,
    currency: order.currency
  })
}

// Payment verification
export async function verifyPayment(
  paymentId: string, 
  orderId: string, 
  signature: string
) {
  const body = orderId + "|" + paymentId
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body.toString())
    .digest("hex")
    
  return expectedSignature === signature
}
```

---

## 🚀 Deployment Architecture

### **Development Environment**
```bash
# Local development setup
npm install                         # Install dependencies
cp .env.example .env.local         # Setup environment
npm run seed                       # Seed database
npm run dev                        # Start dev server (port 3005)

# Start AI services
pip install -r requirements.txt
python ai_app.py                   # AI service (port 5000)
python voice_assistant.py          # Voice service
```

### **Production Deployment Options**

#### **Option 1: Vercel (Recommended)**
```yaml
# vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "env": {
    "MONGODB_URI": "@mongodb-uri",
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "RAZORPAY_KEY_ID": "@razorpay-key-id",
    "RAZORPAY_KEY_SECRET": "@razorpay-key-secret"
  }
}
```

#### **Option 2: Docker Deployment**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

#### **Docker Compose Configuration**
```yaml
# docker-compose.yml
version: '3.8'
services:
  nextjs:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/esse-naturals
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    depends_on:
      - mongo
      - ai-service

  ai-service:
    build: ./ai_services
    ports:
      - "5000:5000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

#### **Option 3: Traditional Server Deployment**
```bash
# Production server setup
# Install Node.js and MongoDB
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs mongodb

# Clone and setup application
git clone https://github.com/your-repo/esse-naturals.git
cd esse-naturals
npm install
npm run build

# Setup PM2 for process management
npm install -g pm2
pm2 start ecosystem.config.js
```

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'esse-naturals',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }, {
    name: 'ai-service',
    script: 'python',
    args: 'ai_app.py',
    cwd: './ai_services',
    env: {
      FLASK_ENV: 'production'
    }
  }]
}
```

---

## 🌐 Infrastructure Requirements

### **Minimum System Requirements**

#### **Development Environment**
- **CPU**: 2+ cores
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 10GB free space
- **Node.js**: 18.x or higher
- **Python**: 3.8 or higher
- **MongoDB**: 6.0+ (optional, JSON fallback available)

#### **Production Environment**
- **CPU**: 4+ cores
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 50GB+ with SSD
- **Bandwidth**: 100Mbps+ connection
- **SSL Certificate**: Required for HTTPS

### **Scaling Considerations**

#### **Horizontal Scaling**
```bash
# Load balancer configuration (Nginx)
upstream esse_backend {
    server app1.example.com:3000;
    server app2.example.com:3000;
    server app3.example.com:3000;
}

server {
    listen 80;
    server_name esse-naturals.com;
    
    location / {
        proxy_pass http://esse_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### **Database Scaling**
```javascript
// MongoDB replica set configuration
rs.initiate({
  _id: "esse-replica-set",
  members: [
    { _id: 0, host: "mongo1.example.com:27017" },
    { _id: 1, host: "mongo2.example.com:27017" },
    { _id: 2, host: "mongo3.example.com:27017" }
  ]
})
```

---

## 📊 Monitoring & Performance

### **Performance Monitoring**
```typescript
// Performance monitoring setup
import { NextRequest, NextResponse } from 'next/server'

export function performanceMiddleware(request: NextRequest) {
  const start = Date.now()
  
  return NextResponse.next().then(response => {
    const duration = Date.now() - start
    console.log(`${request.method} ${request.url} - ${duration}ms`)
    return response
  })
}
```

### **Health Check Endpoints**
```typescript
// app/api/health/route.ts
export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: await checkDatabase(),
      ai_service: await checkAIService(),
      payment: await checkPaymentGateway()
    }
  }
  
  return NextResponse.json(health)
}
```

### **Logging Strategy**
```typescript
// lib/logger.ts
export class Logger {
  static info(message: string, meta?: any) {
    console.log(JSON.stringify({
      level: 'info',
      message,
      meta,
      timestamp: new Date().toISOString()
    }))
  }
  
  static error(message: string, error?: Error) {
    console.error(JSON.stringify({
      level: 'error',
      message,
      stack: error?.stack,
      timestamp: new Date().toISOString()
    }))
  }
}
```

---

## 🔧 Configuration Management

### **Environment Variables**
```bash
# Production .env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://esse-naturals.com

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/production

# Authentication
NEXTAUTH_URL=https://esse-naturals.com
NEXTAUTH_SECRET=super-secure-secret-key

# Payment Gateway
RAZORPAY_KEY_ID=rzp_live_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxx

# AI Services
GEMINI_API_KEY=your_production_gemini_key
OPENAI_API_KEY=your_production_openai_key

# Communication
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxx

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=notifications@esse-naturals.com
SMTP_PASS=app-specific-password
```

---

## 🚀 CI/CD Pipeline

### **GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🔒 Security Best Practices

### **Security Checklist**
- [ ] **HTTPS Everywhere**: SSL certificates configured
- [ ] **Environment Variables**: No secrets in code
- [ ] **Input Validation**: All user inputs sanitized
- [ ] **Authentication**: Secure session management
- [ ] **Rate Limiting**: API endpoint protection
- [ ] **CORS Policy**: Configured for production domains
- [ ] **Database Security**: Connection encryption enabled
- [ ] **Error Handling**: No sensitive info in error messages
- [ ] **Dependency Updates**: Regular security updates
- [ ] **Backup Strategy**: Automated database backups

---

## 📋 Deployment Checklist

### **Pre-Deployment**
- [ ] Code review completed
- [ ] Tests passing (unit, integration, e2e)
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Static assets optimized
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] Monitoring tools setup

### **Post-Deployment**
- [ ] Health checks passing
- [ ] Performance metrics normal
- [ ] Error rates acceptable
- [ ] User flows tested
- [ ] Payment processing verified
- [ ] Email notifications working
- [ ] Backup processes running
- [ ] Monitoring alerts active

---

## 🎯 Performance Optimization

### **Frontend Optimization**
- **Image Optimization**: Next.js Image component with WebP
- **Code Splitting**: Automatic route-based splitting
- **Static Generation**: ISR for product pages
- **Caching**: CDN and browser caching strategies
- **Bundle Analysis**: webpack-bundle-analyzer

### **Backend Optimization**
- **Database Indexing**: Optimized queries
- **API Caching**: Redis for frequent queries
- **Connection Pooling**: MongoDB connection optimization
- **AI Service Caching**: Response caching for AI calls

---

*This architecture is designed for scalability, maintainability, and high performance, ensuring the ESSE Naturals platform can grow with business needs while maintaining exceptional user experience.*

---

**Generated on: August 17, 2025**
**Architecture Documentation by: Technical Team**
