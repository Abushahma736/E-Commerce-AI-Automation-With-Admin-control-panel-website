import { Container } from '@/components/ui/Container'

export default function TermsPage() {
  return (
    <div className='py-8'>
      <Container>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl font-bold text-gray-900 mb-8'>Terms of Service</h1>
          <div className='prose prose-lg max-w-none'>
            <p className='text-gray-600 mb-6'>Last updated: January 13, 2024</p>
            
            <h2 className='text-2xl font-semibold mb-4'>1. About Our Service</h2>
            <p className='text-gray-600 mb-4'>
              ESSE – Naturals & Nutrition operates an e-commerce platform specializing in natural products, 
              essential oils, extracts, and wellness products.
            </p>
            
            <h2 className='text-2xl font-semibold mb-4'>2. Payment Terms</h2>
            <ul className='list-disc list-inside text-gray-600 space-y-2 mb-6'>
              <li>We accept UPI payments to 9334042952@ybl</li>
              <li>Cash on Delivery available with additional charges</li>
              <li>All prices are in Indian Rupees (INR)</li>
            </ul>
            
            <h2 className='text-2xl font-semibold mb-4'>3. Shipping Policy</h2>
            <p className='text-gray-600 mb-4'>
              We deliver across India. Free shipping on orders above ₹1000.
            </p>
            
            <h2 className='text-2xl font-semibold mb-4'>4. Returns</h2>
            <p className='text-gray-600 mb-4'>
              30-day return policy for unopened products in original packaging.
            </p>
            
            <h2 className='text-2xl font-semibold mb-4'>5. Contact</h2>
            <p className='text-gray-600'>
              Phone: +91 93340 42952<br/>
              Email: support@esse-naturals.com
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}