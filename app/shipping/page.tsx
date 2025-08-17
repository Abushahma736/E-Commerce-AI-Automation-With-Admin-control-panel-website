import { Container } from '@/components/ui/Container'

export default function ShippingPage() {
  return (
    <div className='py-8'>
      <Container>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl font-bold text-gray-900 mb-8'>Shipping Information</h1>
          <div className='prose prose-lg max-w-none'>
            <p className='text-gray-600 mb-6'>Fast, reliable delivery of your natural products</p>
            
            <h2 className='text-2xl font-semibold mb-4'>Shipping Methods</h2>
            <div className='grid md:grid-cols-2 gap-6 mb-6'>
              <div className='border rounded-lg p-6'>
                <h3 className='font-semibold text-lg mb-2'>Standard Delivery</h3>
                <ul className='space-y-2 text-gray-600'>
                  <li>• Delivery Time: 5-7 business days</li>
                  <li>• Free for orders above ₹1,000</li>
                  <li>• ₹99 shipping fee for orders below ₹1,000</li>
                  <li>• Available across India</li>
                </ul>
              </div>
              
              <div className='border rounded-lg p-6'>
                <h3 className='font-semibold text-lg mb-2'>Express Delivery</h3>
                <ul className='space-y-2 text-gray-600'>
                  <li>• Delivery Time: 2-3 business days</li>
                  <li>• ₹199 shipping fee</li>
                  <li>• Available in major cities</li>
                  <li>• Priority handling</li>
                </ul>
              </div>
            </div>
            
            <h2 className='text-2xl font-semibold mb-4'>Delivery Areas</h2>
            <p className='text-gray-600 mb-4'>We deliver to all states in India including:</p>
            <ul className='list-disc list-inside text-gray-600 space-y-1 mb-6'>
              <li>Delhi NCR, Mumbai, Bangalore (2-3 days)</li>
              <li>Chennai, Kolkata, Hyderabad (3-4 days)</li>
              <li>Other major cities (4-5 days)</li>
              <li>Remote areas (5-7 days)</li>
            </ul>
            
            <h2 className='text-2xl font-semibold mb-4'>Contact</h2>
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