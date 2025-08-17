import Image from 'next/image'
import Link from 'next/link'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ProductGrid } from '@/components/product/ProductGrid'
import { getAllProducts } from '@/lib/fsdb'
import { getAllCategories } from '@/lib/fsdb'
import { getAllProductsFromMongo, getAllCategoriesFromMongo } from '@/lib/mongodb'
import { Carousel } from '@/components/ui/Carousel'
import { ArrowRight, Star, Truck, Shield, Clock } from 'lucide-react'
import { cn } from '@/lib/cn'
import AIRecommendations from '@/components/AIRecommendations'
import AIChatbot from '@/components/AIChatbot'
import AIStatusWidget from '@/components/AIStatusWidget'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Get user session for personalized recommendations
  const session = await getServerSession(authOptions)
  
  // Try MongoDB first, fallback to local files if not available
  const [productsMongo, categoriesMongo] = await Promise.all([
    getAllProductsFromMongo(),
    getAllCategoriesFromMongo()
  ])
  
  // Use MongoDB data if available, otherwise use local files
  const products = productsMongo.length > 0 ? productsMongo : await getAllProducts()
  const categories = categoriesMongo.length > 0 ? categoriesMongo : await getAllCategories()
  const trending = products.slice(0, 6)
  return (
    <div>
      {/* Top Slider */}
      <section className="relative w-full overflow-hidden bg-slate-50">
        <div className="container-base py-4">
          <Carousel images={["/images/slide1.png", "/images/slide2.png", "/images/slide3.png", "/images/slide4.png"]} />
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative w-full min-h-[70vh] lg:min-h-[80vh] bg-gradient-to-br from-brand-navy via-brand-navy/90 to-brand-navy/80 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-green rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-light rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        {/* Hero Image */}
        <div className="absolute inset-0">
          <Image 
            src="/images/hero.png"
            alt="Fresh Natural Products" 
            fill 
            className="object-cover opacity-20" 
            priority 
          />
        </div>

        {/* Content */}
        <div className="container-base relative h-full flex items-center py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Content */}
            <div className="text-white space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Star className="h-4 w-4 text-brand-light" />
                <span className="text-sm font-medium">Premium Quality Since 2020</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight">
                <span className="text-brand-light">Fresh</span> Essentials.<br />
                <span className="text-brand-light">Better</span> Prices.
              </h1>
              
              <p className="text-xl text-white/90 max-w-lg leading-relaxed">
                Discover premium natural extracts, essential oils, and wellness products. 
                Sourced responsibly, delivered fresh to your doorstep.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop">
                  <Button size="lg" className="group bg-brand-green hover:bg-brand-green/90 text-white px-8 py-4 text-lg font-semibold">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Content - Stats & Features */}
            <div className="hidden lg:block space-y-6 animate-slide-up">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl font-bold text-brand-light">500+</div>
                  <div className="text-white/80 text-sm">Happy Customers</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl font-bold text-brand-light">50+</div>
                  <div className="text-white/80 text-sm">Product Varieties</div>
                </div>
              </div>
              
              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-10 h-10 bg-brand-green/20 rounded-full flex items-center justify-center">
                    <Truck className="h-5 w-5 text-brand-light" />
                  </div>
                  <span className="text-sm">Free Delivery on Orders Above ₹999</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-10 h-10 bg-brand-green/20 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-brand-light" />
                  </div>
                  <span className="text-sm">100% Authentic & Certified Products</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-10 h-10 bg-brand-green/20 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-brand-light" />
                  </div>
                  <span className="text-sm">Same Day Dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Best Selling */}
      <section className="py-20 sm:py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-brand-green rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-brand-light rounded-full"></div>
        </div>
        
        <Container>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green rounded-full text-sm font-medium mb-4">
              <Star className="h-4 w-4" />
              Most Popular Categories
            </div>
            <SectionTitle 
              title="Best Selling Products" 
              subtitle="Discover our most loved natural products that customers trust and recommend" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((c) => ({ 
              name: c.name, 
              img: c.image ?? '/images/hero.jpg', 
              href: `/category/${c.slug}`,
              type: c.type,
              description: c.type === 'B2B' ? 'Premium wholesale products for businesses' : 'High-quality retail products for individuals'
            })).slice(0, 6).map((c, index) => (
              <div key={c.name} className="group relative">
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold text-white",
                    c.type === 'B2B' ? "bg-brand-navy" : "bg-brand-green"
                  )}>
                    {c.type}
                  </div>
                </div>
                
                {/* Popular Badge */}
                {index < 3 && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-semibold">
                      <Star className="h-3 w-3 fill-current" />
                      Popular
                    </div>
                  </div>
                )}
                
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden border border-slate-100">
                  {/* Image Section */}
                  <div className="relative h-64 overflow-hidden">
                    <Image 
                      src={c.img} 
                      alt={c.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                      <div className="p-6 text-white">
                        <p className="text-sm opacity-90">Click to explore</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="font-serif text-2xl font-bold text-brand-navy mb-2 group-hover:text-brand-green transition-colors">
                        {c.name}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-sm">
                        {c.description}
                      </p>
                    </div>
                    
                    {/* Features */}
                    <div className="flex items-center gap-4 mb-6 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                        Premium Quality
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                        Fast Delivery
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <Link href={c.href}>
                      <Button 
                        size="lg" 
                        className="w-full group bg-gradient-to-r from-brand-green to-brand-green/90 hover:from-brand-green/90 hover:to-brand-green text-white font-semibold py-4 transition-all duration-300 hover:shadow-lg"
                      >
                        <span>Explore {c.name}</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
                
                {/* Decorative Element */}
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-brand-light/20 to-brand-green/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
          
          {/* View All Categories CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-2 text-slate-600 mb-4">
              <div className="w-8 h-px bg-slate-300"></div>
              <span className="text-sm font-medium">Want to see more?</span>
              <div className="w-8 h-px bg-slate-300"></div>
            </div>
            <Link href="/shop">
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition-all duration-300"
              >
                View All Categories
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Plant Glimpse Carousel */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-20 w-40 h-40 bg-brand-green/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-32 h-32 bg-brand-light/20 rounded-full blur-3xl"></div>
        </div>
        
        <Container>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green rounded-full text-sm font-medium mb-4">
              🌱 Natural Sourcing
            </div>
            <SectionTitle 
              title="A Glimpse of the Plant" 
              subtitle="Discover the journey from farm to your wellness - see how our products are responsibly sourced and processed" 
            />
          </div>
          
          {/* Enhanced Carousel Section */}
          <div className="relative">
            {/* Main Carousel */}
            <div className="mb-8">
              {/* Debug: Simple image display first */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="relative h-32">
                  <Image src="/images/hero.png" alt="Hero" fill className="object-cover rounded-lg" />
                  <p className="text-xs text-center mt-2">hero.png</p>
                </div>
                <div className="relative h-32">
                  <Image src="/images/turmeric.jpg" alt="Turmeric" fill className="object-cover rounded-lg" />
                  <p className="text-xs text-center mt-2">turmeric.jpg</p>
                </div>
                <div className="relative h-32">
                  <Image src="/images/essential.jpg" alt="Essential" fill className="object-cover rounded-lg" />
                  <p className="text-xs text-center mt-2">essential.jpg</p>
                </div>
                <div className="relative h-32">
                  <Image src="/images/oleoresin.jpg" alt="Oleoresin" fill className="object-cover rounded-lg" />
                  <p className="text-xs text-center mt-2">oleoresin.jpg</p>
                </div>
              </div>
              
              {/* Original Carousel */}
              <Carousel images={["/images/hero.png","/images/turmeric.jpg","/images/essential.jpg","/images/oleoresin.jpg"]} />
            </div>
            
            {/* Process Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
              {[
                { 
                  step: "01", 
                  title: "Organic Farming", 
                  description: "Our plants are grown using traditional farming methods without harmful chemicals",
                  icon: "🌿"
                },
                { 
                  step: "02", 
                  title: "Careful Harvesting", 
                  description: "Hand-picked at the perfect time to ensure maximum potency and freshness",
                  icon: "✂️"
                },
                { 
                  step: "03", 
                  title: "Expert Processing", 
                  description: "Using advanced extraction techniques to preserve natural properties",
                  icon: "⚗️"
                },
                { 
                  step: "04", 
                  title: "Quality Testing", 
                  description: "Rigorous testing ensures every product meets our high standards",
                  icon: "🔬"
                }
              ].map((item, index) => (
                <div key={item.step} className="group text-center">
                  <div className="relative mb-4">
                    {/* Step Number */}
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-brand-green to-brand-green/80 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                    
                    {/* Icon */}
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                  </div>
                  
                  <h4 className="font-serif text-lg font-semibold text-brand-navy mb-2 group-hover:text-brand-green transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-2 text-slate-600 mb-6">
                <div className="w-12 h-px bg-slate-300"></div>
                <span className="text-sm font-medium">Why Trust Our Process?</span>
                <div className="w-12 h-px bg-slate-300"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: "🏆", title: "Certified Organic", desc: "100% organic certification" },
                  { icon: "🌍", title: "Sustainable", desc: "Eco-friendly practices" },
                  { icon: "💚", title: "Pure Quality", desc: "No artificial additives" }
                ].map((trust) => (
                  <div key={trust.title} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="text-3xl mb-3">{trust.icon}</div>
                    <h5 className="font-semibold text-brand-navy mb-2">{trust.title}</h5>
                    <p className="text-slate-600 text-sm">{trust.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Benefits strip */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { t: 'World Class Technology', d: 'Supercritical CO₂ extraction for maximum purity.', icon: '🔬' },
              { t: 'Certified Organic', d: '100% Guarantee of organic certification.', icon: '🌿' },
              { t: 'Cost Effective', d: 'Value-driven pricing without compromising quality.', icon: '💰' },
              { t: 'Transparent Process', d: 'Full traceability from farm to your doorstep.', icon: '📋' },
            ].map((b) => (
              <div key={b.t} className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl mb-4">{b.icon}</div>
                <h4 className="font-semibold text-lg text-brand-navy mb-2">{b.t}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{b.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA band */}
      <section className="py-16 bg-gradient-to-r from-brand-navy to-brand-navy/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <Container>
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="space-y-4">
              <h3 className="text-3xl lg:text-4xl font-serif font-bold">Get 15% Off On Your First Purchase!</h3>
              <p className="text-xl text-white/90">Join thousands of satisfied customers today</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <Button size="lg" variant="secondary" className="px-8 py-4 text-lg font-semibold">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Trending Products */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-10 w-40 h-40 bg-brand-green/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-32 h-32 bg-brand-light/20 rounded-full blur-3xl"></div>
        </div>
        
        <Container>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green rounded-full text-sm font-medium mb-4">
              🔥 Hot Right Now
            </div>
            <SectionTitle 
              title="Trending Products" 
              subtitle="Discover what everyone's talking about - our most popular and highly-rated products this month" 
            />
          </div>
          
          {/* Enhanced Product Grid */}
          <div className="mb-12">
            <ProductGrid products={trending} />
          </div>
          
          {/* Product Stats & Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { 
                icon: "⭐", 
                title: "Customer Ratings", 
                value: "4.8/5", 
                description: "Average rating from verified customers",
                color: "text-yellow-600"
              },
              { 
                icon: "👥", 
                title: "Active Users", 
                value: "2.5K+", 
                description: "People actively browsing products",
                color: "text-brand-green"
              },
              { 
                icon: "📈", 
                title: "Growth Rate", 
                value: "23%", 
                description: "Monthly increase in product views",
                color: "text-brand-navy"
              }
            ].map((stat) => (
              <div key={stat.title} className="text-center group">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-100">
                  <div className={`text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-brand-navy mb-2 group-hover:text-brand-green transition-colors">
                    {stat.value}
                  </div>
                  <h4 className="font-semibold text-lg text-brand-navy mb-2">{stat.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{stat.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Product Categories Showcase */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-serif font-bold text-brand-navy mb-4">Shop by Category</h3>
              <p className="text-slate-600 max-w-2xl mx-auto">Explore our wide range of natural products organized by category for easy navigation</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((category) => (
                <Link 
                  key={category.slug} 
                  href={`/category/${category.slug}`}
                  className="group bg-white rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-slate-100"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-brand-green/20 to-brand-light/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">
                      {category.type === 'B2B' ? '🏢' : '🛍️'}
                    </span>
                  </div>
                  <h4 className="font-medium text-brand-navy text-sm group-hover:text-brand-green transition-colors">
                    {category.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">{category.type}</p>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Customer Reviews Preview */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-serif font-bold text-brand-navy mb-4">What Our Customers Say</h3>
              <p className="text-slate-600">Real feedback from verified customers about our trending products</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Priya Sharma",
                  rating: 5,
                  comment: "Amazing quality! The turmeric extract has improved my skin significantly.",
                  product: "Turmeric Extract",
                  avatar: "👩‍🦰"
                },
                {
                  name: "Rajesh Patel",
                  rating: 5,
                  comment: "Best essential oils I've ever used. Pure and authentic products.",
                  product: "Essential Oils",
                  avatar: "👨‍🦱"
                },
                {
                  name: "Anita Desai",
                  rating: 5,
                  comment: "Fast delivery and excellent customer service. Highly recommended!",
                  product: "Clove Oil",
                  avatar: "👩‍🦳"
                }
              ].map((review, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{review.avatar}</div>
                    <div>
                      <h5 className="font-semibold text-brand-navy">{review.name}</h5>
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-500">⭐</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm mb-3 italic">"{review.comment}"</p>
                  <div className="text-xs text-brand-green font-medium">Product: {review.product}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-slate-600 mb-6">
              <div className="w-16 h-px bg-slate-300"></div>
              <span className="text-sm font-medium">Ready to Explore More?</span>
              <div className="w-16 h-px bg-slate-300"></div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button 
                  size="lg" 
                  className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-brand-green to-brand-green/90 hover:from-brand-green/90 hover:to-brand-green text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-4 text-lg font-semibold border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition-all duration-300"
                >
                  Get Personalized Recommendations
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Wellness Tips & Blog Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-brand-green/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-brand-light/20 rounded-full blur-3xl"></div>
        </div>
        
        <Container>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green rounded-full text-sm font-medium mb-4">
              💡 Wellness Wisdom
            </div>
            <SectionTitle 
              title="Health & Wellness Tips" 
              subtitle="Expert advice and insights to help you live a healthier, more natural lifestyle" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: "/images/turmeric.jpg",
                category: "Natural Remedies",
                title: "10 Benefits of Turmeric for Daily Wellness",
                excerpt: "Discover how this golden spice can boost your immunity, reduce inflammation, and improve overall health.",
                readTime: "5 min read",
                date: "2 days ago"
              },
              {
                image: "/images/essential.jpg",
                category: "Essential Oils",
                title: "Essential Oils for Better Sleep & Relaxation",
                excerpt: "Learn which essential oils can help you achieve deeper, more restful sleep naturally.",
                readTime: "4 min read",
                date: "1 week ago"
              },
              {
                image: "/images/plant1.jpg",
                category: "Organic Living",
                title: "Complete Guide to Organic Skincare",
                excerpt: "Transform your skincare routine with natural, chemical-free products that nourish your skin.",
                readTime: "6 min read",
                date: "3 days ago"
              }
            ].map((article, index) => (
              <article key={index} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-slate-100">
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={article.image} 
                    alt={article.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-brand-green text-white text-xs font-medium rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-brand-navy mb-3 group-hover:text-brand-green transition-colors leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                  <Link href={`/blog/${index + 1}`} className="inline-flex items-center gap-2 text-brand-green hover:text-brand-navy font-medium text-sm transition-colors">
                    Read More
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/blog">
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition-all duration-300"
              >
                View All Articles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Testimonials & Success Stories */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-10 w-40 h-40 bg-brand-green/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-32 h-32 bg-brand-light/20 rounded-full blur-3xl"></div>
        </div>
        
        <Container>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green rounded-full text-sm font-medium mb-4">
              ❤️ Success Stories
            </div>
            <SectionTitle 
              title="What Our Customers Achieve" 
              subtitle="Real stories from people who have transformed their health and wellness with our natural products" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Meera Iyer",
                role: "Ayurvedic Practitioner",
                image: "👩‍⚕️",
                story: "I've been using ESSE's essential oils in my practice for over 2 years. The quality and purity are exceptional, and my patients love the results.",
                rating: 5,
                achievement: "500+ patients treated"
              },
              {
                name: "Rahul Verma",
                role: "Fitness Enthusiast",
                image: "💪",
                story: "ESSE's protein supplements and natural extracts have been game-changers for my fitness journey. Clean energy without any side effects.",
                rating: 5,
                achievement: "Lost 15kg naturally"
              },
              {
                name: "Priya Desai",
                role: "Wellness Coach",
                image: "🧘‍♀️",
                story: "As a wellness coach, I recommend ESSE products to all my clients. The organic certification and quality standards are unmatched.",
                rating: 5,
                achievement: "200+ clients transformed"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{testimonial.image}</div>
                  <div>
                    <h4 className="font-semibold text-brand-navy">{testimonial.name}</h4>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500">⭐</span>
                  ))}
                </div>
                
                <p className="text-slate-600 text-sm mb-4 italic leading-relaxed">
                  "{testimonial.story}"
                </p>
                
                <div className="bg-brand-green/10 text-brand-green text-xs font-medium px-3 py-1 rounded-full inline-block">
                  {testimonial.achievement}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Product Quality & Certifications */}
      <section className="py-20 bg-white relative overflow-hidden">
        <Container>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green rounded-full text-sm font-medium mb-4">
              🏆 Quality Assurance
            </div>
            <SectionTitle 
              title="Our Quality Standards" 
              subtitle="Every product meets the highest international standards for safety, purity, and effectiveness" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: "🌿", title: "USDA Organic", desc: "100% certified organic ingredients" },
              { icon: "🔬", title: "GMP Certified", desc: "Good Manufacturing Practices" },
              { icon: "🌍", title: "ISO 22000", desc: "Food safety management system" },
              { icon: "💚", title: "Vegan Certified", desc: "No animal products or testing" }
            ].map((cert) => (
              <div key={cert.title} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-brand-green/20 to-brand-light/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">{cert.icon}</span>
                </div>
                <h4 className="font-semibold text-brand-navy mb-2">{cert.title}</h4>
                <p className="text-slate-600 text-sm">{cert.desc}</p>
              </div>
            ))}
          </div>
          
          {/* Quality Process */}
          <div className="bg-gradient-to-r from-slate-50 to-white rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-serif font-bold text-brand-navy mb-4">Our Quality Process</h3>
                <div className="space-y-4">
                  {[
                    "Rigorous testing at every stage of production",
                    "Third-party laboratory verification",
                    "Regular quality audits and inspections",
                    "Traceability from farm to final product"
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-brand-green rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <span className="text-slate-600">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h4 className="font-semibold text-brand-navy mb-4">Quality Metrics</h4>
                  <div className="space-y-4">
                    {[
                      { label: "Product Purity", value: "99.9%", color: "text-brand-green" },
                      { label: "Customer Satisfaction", value: "98.5%", color: "text-brand-navy" },
                      { label: "On-time Delivery", value: "99.2%", color: "text-brand-light" }
                    ].map((metric) => (
                      <div key={metric.label} className="flex justify-between items-center">
                        <span className="text-slate-600 text-sm">{metric.label}</span>
                        <span className={`font-bold ${metric.color}`}>{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Newsletter & Special Offers */}
      <section className="py-20 bg-gradient-to-r from-brand-navy to-brand-navy/90 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              🎁 Exclusive Offers
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Get Exclusive Access to Premium Natural Products
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join our wellness community and receive early access to new products, 
              exclusive discounts, and expert wellness tips delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <input 
                className="flex-1 px-6 py-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent text-lg" 
                placeholder="Enter your email address" 
              />
              <button className="px-8 py-4 bg-brand-green hover:bg-brand-green/90 text-white rounded-lg font-semibold text-lg transition-colors flex items-center gap-2">
                Subscribe Now
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                <span>No spam, ever</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                <span>Unsubscribe anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                <span>Exclusive member benefits</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* AI Powered Recommendations - Now Active! */}
      <AIRecommendations 
        products={products} 
        userId={session?.user?.id || null}
        className="bg-gradient-to-br from-blue-50 to-purple-50"
        maxRecommendations={6}
        title="🤖 Smart Recommendations For You"
        showPersonalized={true}
        showTrending={true}
        context="homepage"
      />

      {/* AI Chatbot - Enhanced */}
      <AIChatbot 
        userId={session?.user?.id}
      />

    </div>
  )
}


