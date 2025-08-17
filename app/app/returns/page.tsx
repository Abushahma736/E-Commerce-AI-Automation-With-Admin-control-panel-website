import { Container } from '@/components/ui/Container'

export default function ReturnsPage() {
  return (
    <div className='py-8'>
      <Container>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl font-bold text-gray-900 mb-8'>Returns & Refunds</h1>
          <div className='prose prose-lg max-w-none'>
            <p className='text-gray-600 mb-6'>Easy returns and quick refunds for your peace of mind</p>
            
            <h2 className='text-2xl font-semibold mb-4'>Return Policy</h2>
            <div className='bg-green-50 border border-green-200 rounded-lg p-6 mb-6'>
              <h3 className='font-semibold text-green-800 mb-2'>30-Day Return Window</h3>
              <p className='text-green-700'>
                You can return most items within 30 days of delivery for a full refund or exchange.
              </p>
            </div>
            
            <h2 className='text-2xl font-semibold mb-4'>What Can Be Returned?</h2>
            <div className='grid md:grid-cols-2 gap-6 mb-6'>
              <div>
                <h3 className='font-semibold text-green-600 mb-2'>✓ Returnable Items</h3>
                <ul className='space-y-1 text-gray-600'>
                  <li>• Unopened essential oil bottles</li>
                  <li>• Sealed extract containers</li>
                  <li>• Unused products in original packaging</li>
                  <li>• Defective or damaged items</li>
                </ul>
              </div>
              
              <div>
                <h3 className='font-semibold text-red-600 mb-2'>✗ Non-Returnable Items</h3>
                <ul className='space-y-1 text-gray-600'>
                  <li>• Opened essential oils</li>
                  <li>• Products with broken seals</li>
                  <li>• Items returned after 30 days</li>
                  <li>• Custom products</li>
                </ul>
              </div>
            </div>
            
            <h2 className='text-2xl font-semibold mb-4'>Refund Timeline</h2>
            <ul className='list-disc list-inside text-gray-600 space-y-2 mb-6'>
              <li>UPI Payment: 1-2 business days</li>
              <li>Credit/Debit Card: 3-5 business days</li>
              <li>Cash on Delivery: 5-7 business days (bank transfer)</li>
            </ul>
            
            <h2 className='text-2xl font-semibold mb-4'>Contact</h2>
            <p className='text-gray-600'>
              Phone: +91 93340 42952<br/>
              Email: returns@esse-naturals.com
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}