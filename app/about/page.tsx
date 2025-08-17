import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Carousel } from '@/components/ui/Carousel'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Star, Users, Package, Award, Globe, Leaf, Heart, Shield, Truck, Clock, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-brand-navy via-brand-navy/90 to-brand-navy/80 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-green rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-light rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <Container>
          <div className="text-center text-white max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Leaf className="h-4 w-4 text-brand-light" />
              <span className="text-sm font-medium">Since 2020</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
              Your Trusted Partner in
              <span className="text-brand-light"> Natural Wellness</span>
            </h1>
            
            <p className="text-xl text-white/90 leading-relaxed mb-8 max-w-3xl mx-auto">
              We are ESSE - a premium supplier of the purest bulk CO₂ extracts, essential oils, 
              oleoresins, and total extracts using advanced Supercritical Fluid Extraction technology. 
              Committed to purity, quality, and environmental responsibility.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button size="lg" className="group bg-brand-green hover:bg-brand-green/90 text-white px-8 py-4 text-lg font-semibold">
                  Explore Our Products
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
                >
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, number: '3,500+', label: 'Satisfied Customers', color: 'text-brand-green' },
              { icon: Package, number: '500+', label: 'Curated Products', color: 'text-brand-navy' },
              { icon: Award, number: '40+', label: 'Product Categories', color: 'text-brand-light' },
              { icon: Globe, number: '25+', label: 'Countries Served', color: 'text-brand-green' }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-brand-green/20 to-brand-light/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
                <div className="text-slate-600 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-brand-green rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-brand-light rounded-full blur-3xl"></div>
        </div>
        
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green rounded-full text-sm font-medium">
                📖 Our Story
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy leading-tight">
                From Farm to Wellness: Our Journey
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Founded in 2020, ESSE began with a simple mission: to provide the purest, 
                most effective natural extracts to health-conscious individuals and businesses worldwide.
              </p>
              <p className="text-slate-600 leading-relaxed">
                We started as a small family business, passionate about natural wellness and 
                committed to preserving the ancient wisdom of herbal medicine through modern, 
                sustainable extraction methods.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  { icon: Leaf, title: "Natural Sourcing", desc: "Direct from organic farms" },
                  { icon: Shield, title: "Quality First", desc: "Rigorous testing standards" },
                  { icon: Heart, title: "Customer Care", desc: "Personalized service" },
                  { icon: Globe, title: "Global Reach", desc: "Serving 25+ countries" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-5 w-5 text-brand-green" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-navy text-sm">{feature.title}</h4>
                      <p className="text-slate-500 text-xs">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-serif font-bold text-brand-navy mb-6 text-center">Our Mission</h3>
                <div className="space-y-4">
                  {[
                    "To provide the purest natural extracts using advanced technology",
                    "To promote sustainable and responsible sourcing practices",
                    "To empower individuals with natural wellness solutions",
                    "To maintain the highest standards of quality and safety"
                  ].map((mission, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-brand-green rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-slate-600 text-sm">{mission}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Technology & Process Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <Container>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green rounded-full text-sm font-medium mb-4">
              🔬 Advanced Technology
            </div>
            <SectionTitle 
              title="Supercritical CO₂ Extraction" 
              subtitle="Our proprietary technology ensures maximum purity and potency while preserving natural properties" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: "⚗️",
                title: "Supercritical CO₂",
                description: "Uses carbon dioxide at high pressure and temperature for optimal extraction",
                benefits: ["No chemical residues", "Preserves active compounds", "Environmentally safe"]
              },
              {
                icon: "🌿",
                title: "Natural Processing",
                description: "Maintains the integrity of natural compounds without artificial additives",
                benefits: ["100% natural", "No preservatives", "Pure extracts"]
              },
              {
                icon: "🔬",
                title: "Quality Control",
                description: "Rigorous testing at every stage ensures consistent quality",
                benefits: ["Third-party verified", "Batch testing", "Purity guaranteed"]
              }
            ].map((tech, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-100">
                <div className="text-4xl mb-4">{tech.icon}</div>
                <h3 className="font-serif text-xl font-semibold text-brand-navy mb-3">{tech.title}</h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{tech.description}</p>
                <ul className="space-y-2">
                  {tech.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Product Categories Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        <Container>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green rounded-full text-sm font-medium mb-4">
              🏷️ Product Categories
            </div>
            <SectionTitle 
              title="Our Premium Product Range" 
              subtitle="Comprehensive selection of natural extracts and essential oils for every need" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🫗", title: "Oil Extracts", desc: "Pure essential oils extracted naturally" },
              { icon: "🌱", title: "Total Extracts", desc: "Complete plant compounds preserved" },
              { icon: "🧪", title: "Oleoresins", desc: "Concentrated natural flavor compounds" },
              { icon: "💧", title: "CO₂ Extracts", desc: "Premium supercritical fluid extracts" }
            ].map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-100">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-brand-green/20 to-brand-light/20 rounded-full flex items-center justify-center">
                  <span className="text-3xl">{category.icon}</span>
                </div>
                <h4 className="font-semibold text-brand-navy mb-2">{category.title}</h4>
                <p className="text-slate-600 text-sm">{category.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Plant Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <Container>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green rounded-full text-sm font-medium mb-4">
              🏭 Our Facility
            </div>
            <SectionTitle 
              title="State-of-the-Art Processing Plant" 
              subtitle="See where the magic happens - our advanced facility ensures quality at every step" 
            />
          </div>
          
          <div className="mb-12">
            <Carousel images={["/images/slide1.jpg","/images/slide2.jpg","/images/slide3.jpg","/images/silde4.jpg"]} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🏗️",
                title: "Modern Infrastructure",
                description: "Advanced processing equipment and clean room facilities"
              },
              {
                icon: "🔒",
                title: "Quality Control",
                description: "Multiple testing stages ensure product consistency"
              },
              {
                icon: "🌍",
                title: "Sustainable Practices",
                description: "Eco-friendly processes and waste management"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-brand-green/20 to-brand-light/20 rounded-full flex items-center justify-center">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h4 className="font-semibold text-brand-navy mb-2">{feature.title}</h4>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Team & Values Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
        <Container>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green rounded-full text-sm font-medium mb-4">
              👥 Our Team
            </div>
            <SectionTitle 
              title="Meet the Experts Behind ESSE" 
              subtitle="Dedicated professionals committed to bringing you the finest natural products" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                name: "Dr. Rajesh Kumar",
                role: "Chief Scientific Officer",
                expertise: "Phytochemistry & Extraction",
                experience: "15+ years in natural product research"
              },
              {
                name: "Priya Sharma",
                role: "Quality Assurance Manager",
                expertise: "Quality Control & Testing",
                experience: "12+ years in pharmaceutical quality"
              },
              {
                name: "Amit Patel",
                role: "Operations Director",
                expertise: "Production & Supply Chain",
                experience: "18+ years in manufacturing"
              }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-brand-green/20 to-brand-light/20 rounded-full flex items-center justify-center">
                  <span className="text-3xl">👨‍🔬</span>
                </div>
                <h4 className="font-semibold text-brand-navy mb-1">{member.name}</h4>
                <p className="text-brand-green text-sm font-medium mb-2">{member.role}</p>
                <p className="text-slate-600 text-sm mb-2">{member.expertise}</p>
                <p className="text-slate-500 text-xs">{member.experience}</p>
              </div>
            ))}
          </div>
          
          {/* Company Values */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
            <h3 className="text-2xl font-serif font-bold text-brand-navy mb-8 text-center">Our Core Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: "🌿", title: "Natural Purity", desc: "100% natural, no artificial additives" },
                { icon: "🔬", title: "Scientific Excellence", desc: "Research-driven product development" },
                { icon: "🌍", title: "Environmental Care", desc: "Sustainable and responsible practices" },
                { icon: "❤️", title: "Customer First", desc: "Your satisfaction is our priority" }
              ].map((value, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-brand-green/20 to-brand-light/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">{value.icon}</span>
                  </div>
                  <h5 className="font-semibold text-brand-navy mb-2">{value.title}</h5>
                  <p className="text-slate-600 text-xs">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-navy to-brand-navy/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Ready to Experience the ESSE Difference?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join thousands of satisfied customers who trust ESSE for their natural wellness needs. 
              Discover the power of pure, natural extracts today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button 
                  size="lg" 
                  className="px-8 py-4 text-lg font-semibold bg-brand-green hover:bg-brand-green/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}


