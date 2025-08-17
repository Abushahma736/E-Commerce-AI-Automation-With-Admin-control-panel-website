"use client"
import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { toast } from 'sonner'
import { ArrowRight, Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle, Users, Package, Truck } from 'lucide-react'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    
    console.log('Submitting form data:', formData) // Debug log
    
    try {
      const res = await fetch('/api/contact', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(formData) 
      })
      
      console.log('Response status:', res.status) // Debug log
      
      const data = await res.json()
      console.log('Response data:', data) // Debug log
      
      if (data.error) {
        toast.error(data.error)
        console.error('API Error:', data.error) // Debug log
      } else {
        toast.success('Message sent successfully! We\'ll get back to you soon.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
        console.log('Form submitted successfully') // Debug log
      }
    } catch (error) {
      console.error('Form submission error:', error) // Debug log
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
              <MessageCircle className="h-4 w-4 text-brand-light" />
              <span className="text-sm font-medium">Get in Touch</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
              Let's Start a
              <span className="text-brand-light"> Conversation</span>
            </h1>
            
            <p className="text-xl text-white/90 leading-relaxed mb-8 max-w-3xl mx-auto">
              Have questions about our products? Need custom formulations? 
              Want to discuss bulk orders? We're here to help you find the perfect natural solutions.
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green rounded-full text-sm font-medium mb-4">
              📞 Contact Information
            </div>
            <SectionTitle 
              title="Multiple Ways to Reach Us" 
              subtitle="Choose the most convenient way to get in touch - we're here to help" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Phone,
                title: "Phone Support",
                subtitle: "Call us directly",
                primary: "+91 00000 00000",
                secondary: "+91 00000 00001",
                description: "Available Monday to Friday, 9 AM - 6 PM IST",
                color: "text-brand-green"
              },
              {
                icon: Mail,
                title: "Email Support",
                subtitle: "Send us a message",
                primary: "hello@esse.example",
                secondary: "support@esse.example",
                description: "We typically respond within 2-4 hours",
                color: "text-brand-navy"
              },
              {
                icon: MapPin,
                title: "Visit Our Offices",
                subtitle: "Meet us in person",
                primary: "Visakhapatnam, India",
                secondary: "Bhubaneswar, India",
                description: "Schedule a meeting with our team",
                color: "text-brand-light"
              }
            ].map((contact, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-brand-green/20 to-brand-light/20 rounded-full flex items-center justify-center">
                  <contact.icon className={`h-8 w-8 ${contact.color}`} />
                </div>
                <h3 className="font-serif text-xl font-semibold text-brand-navy mb-2">{contact.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{contact.subtitle}</p>
                <div className="space-y-2 mb-4">
                  <div className={`font-semibold ${contact.color}`}>{contact.primary}</div>
                  <div className="text-slate-600 text-sm">{contact.secondary}</div>
                </div>
                <p className="text-slate-500 text-xs">{contact.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-brand-green rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-brand-light rounded-full blur-3xl"></div>
        </div>
        
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
              <div className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-brand-navy mb-4">Send us a Message</h2>
                <p className="text-slate-600">Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>
              
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                    <input
                      required
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                    <input
                      required
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors bg-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">Subject *</label>
                    <select
                      required
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="Product Inquiry">Product Inquiry</option>
                      <option value="Bulk Order">Bulk Order</option>
                      <option value="Custom Formulation">Custom Formulation</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Partnership">Partnership</option>
                      <option value="General Question">General Question</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message *</label>
                  <textarea
                    required
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us how we can help you..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors resize-none bg-white"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full group bg-brand-green hover:bg-brand-green/90 text-white px-8 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending Message...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Send Message
                      <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </form>
            </div>
            
            {/* Contact Details & Features */}
            <div className="space-y-8">
              {/* Why Choose Us */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                <h3 className="text-xl font-serif font-semibold text-brand-navy mb-4">Why Choose ESSE?</h3>
                <div className="space-y-4">
                  {[
                    { icon: CheckCircle, text: "Expert consultation on natural products", color: "text-brand-green" },
                    { icon: CheckCircle, text: "Custom formulations for your needs", color: "text-brand-green" },
                    { icon: CheckCircle, text: "Fast response time (2-4 hours)", color: "text-brand-green" },
                    { icon: CheckCircle, text: "Technical support and guidance", color: "text-brand-green" }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <feature.icon className={`h-5 w-5 ${feature.color}`} />
                      <span className="text-slate-600 text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Business Hours */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 text-brand-green" />
                  <h3 className="text-xl font-serif font-semibold text-brand-navy">Business Hours</h3>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM IST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM IST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium text-slate-400">Closed</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-brand-green/10 to-brand-light/10 rounded-2xl p-6 border border-brand-green/20">
                <h3 className="text-xl font-serif font-semibold text-brand-navy mb-4">Quick Facts</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Users, value: "3,500+", label: "Happy Customers" },
                    { icon: Package, value: "500+", label: "Products" },
                    { icon: Truck, value: "24h", label: "Response Time" },
                    { icon: CheckCircle, value: "100%", label: "Satisfaction" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-brand-green mb-1">{stat.value}</div>
                      <div className="text-xs text-slate-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green rounded-full text-sm font-medium mb-4">
              ❓ Frequently Asked
            </div>
            <SectionTitle 
              title="Common Questions" 
              subtitle="Find quick answers to the most frequently asked questions" 
            />
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "What is Supercritical CO₂ extraction?",
                answer: "Supercritical CO₂ extraction is an advanced technology that uses carbon dioxide at high pressure and temperature to extract natural compounds. This method ensures maximum purity, preserves active ingredients, and leaves no chemical residues."
              },
              {
                question: "Do you offer custom formulations?",
                answer: "Yes! We specialize in creating custom formulations tailored to your specific needs. Our team of experts can work with you to develop unique blends for your business or personal use."
              },
              {
                question: "What are your minimum order quantities?",
                answer: "We offer flexible ordering options. For retail customers, there's no minimum order. For bulk orders and businesses, we can discuss custom quantities based on your requirements."
              },
              {
                question: "How do you ensure product quality?",
                answer: "Every product undergoes rigorous testing at multiple stages. We use third-party laboratories, maintain strict quality control protocols, and follow international standards to guarantee purity and effectiveness."
              },
              {
                question: "What shipping options do you provide?",
                answer: "We offer various shipping options including express delivery, standard shipping, and bulk freight for large orders. All orders are carefully packaged to ensure product integrity during transit."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-slate-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-brand-navy mb-3 text-lg">{faq.question}</h4>
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
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
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Whether you have questions about our products, need custom formulations, 
              or want to discuss bulk orders, we're here to help you succeed.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="px-8 py-4 text-lg font-semibold bg-brand-green hover:bg-brand-green/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => document.getElementById('name')?.focus()}
              >
                Start Your Inquiry
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                className="px-8 py-4 text-lg font-semibold border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                Download Brochure
              </Button>
              
              {/* Test Button for Debugging */}
              <Button 
                className="px-8 py-4 text-lg font-semibold border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                onClick={async () => {
                  try {
                    const res = await fetch('/api/health')
                    const data = await res.json()
                    console.log('Health check result:', data)
                    toast.success('Health check completed. Check console for details.')
                  } catch (error) {
                    console.error('Health check failed:', error)
                    toast.error('Health check failed. Check console for details.')
                  }
                }}
              >
                Test API Connection
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}


