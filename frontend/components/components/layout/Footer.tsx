import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowRight, Shield, Truck, Clock, Star } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-20 bg-gradient-to-br from-brand-navy via-brand-navy/95 to-brand-navy/90 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-light rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="container-base relative">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center">
                <span className="text-2xl font-serif font-bold text-white">E</span>
              </div>
              <div>
                <div className="font-serif text-3xl font-bold text-white">ESSE</div>
                <div className="text-brand-light text-sm">Naturals & Nutrition</div>
              </div>
            </div>
            
            <p className="text-white/80 leading-relaxed max-w-md">
              Premium natural extracts, essential oils, and wellness products. 
              Sourced responsibly, delivered fresh to your doorstep with world-class quality.
            </p>
            
            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Stay Updated</h4>
              <p className="text-sm text-white/70">Get exclusive offers and wellness tips</p>
              <form className="flex gap-2">
                <input 
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent" 
                  placeholder="Enter your email" 
                />
                <button className="px-6 py-3 bg-brand-green hover:bg-brand-green/90 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/shop" className="text-white/80 hover:text-brand-green transition-colors flex items-center gap-2 group">
                  <span>Shop All</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/80 hover:text-brand-green transition-colors flex items-center gap-2 group">
                  <span>About Us</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 hover:text-brand-green transition-colors flex items-center gap-2 group">
                  <span>Contact</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/80 hover:text-brand-green transition-colors flex items-center gap-2 group">
                  <span>FAQ</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg text-white">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/account" className="text-white/80 hover:text-brand-green transition-colors flex items-center gap-2 group">
                  <span>My Account</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-white/80 hover:text-brand-green transition-colors flex items-center gap-2 group">
                  <span>Shopping Cart</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-white/80 hover:text-brand-green transition-colors flex items-center gap-2 group">
                  <span>Shipping Info</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-white/80 hover:text-brand-green transition-colors flex items-center gap-2 group">
                  <span>Returns</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="py-8 border-t border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "100% Authentic", desc: "Certified organic products" },
              { icon: Truck, title: "Free Delivery", desc: "On orders above ₹999" },
              { icon: Clock, title: "Same Day Dispatch", desc: "Fast processing" },
              { icon: Star, title: "Premium Quality", desc: "Best in class products" }
            ].map((feature) => (
              <div key={feature.title} className="flex items-center gap-3 text-center md:text-left">
                <div className="w-10 h-10 bg-brand-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-brand-green" />
                </div>
                <div>
                  <h5 className="font-semibold text-white text-sm">{feature.title}</h5>
                  <p className="text-white/60 text-xs">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Contact & Social */}
        <div className="py-8 border-t border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-white">Get in Touch</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/80">
                  <Mail className="h-4 w-4 text-brand-green" />
                  <span>hello@essenaturals.com</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Phone className="h-4 w-4 text-brand-green" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <MapPin className="h-4 w-4 text-brand-green" />
                  <span>Mumbai, Maharashtra, India</span>
                </div>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-white">Follow Us</h4>
              <p className="text-white/70 text-sm">Stay connected for latest updates and offers</p>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: "#", label: "Facebook" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Instagram, href: "#", label: "Instagram" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                  { icon: Youtube, href: "#", label: "YouTube" }
                ].map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 hover:bg-brand-green rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5 text-white group-hover:text-white" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <span className="text-white/60 text-sm">
                © {new Date().getFullYear()} ESSE Naturals & Nutrition. All rights reserved.
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <Link href="/terms" className="text-white/60 hover:text-brand-green transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-white/60 hover:text-brand-green transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-white/60 hover:text-brand-green transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


