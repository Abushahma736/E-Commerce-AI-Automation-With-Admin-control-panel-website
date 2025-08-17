import { Container } from '@/components/ui/Container'

export default function PrivacyPage() {
  return (
    <div className='py-8'>
      <Container>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl font-bold text-gray-900 mb-8'>Privacy Policy</h1>
          <div className='prose prose-lg max-w-none'>
            <p className='text-gray-600 mb-6'>Last updated: January 13, 2024</p>
            
            <h2 className='text-2xl font-semibold mb-4'>Information We Collect</h2>
            <ul className='list-disc list-inside text-gray-600 space-y-2 mb-6'>
              <li>Name and contact details</li>
              <li>Email address and phone number</li>
              <li>Shipping and billing addresses</li>
              <li>Payment information (encrypted)</li>
            </ul>
            
            <h2 className='text-2xl font-semibold mb-4'>How We Use Your Information</h2>
            <p className='text-gray-600 mb-4'>
              We use your information to process orders, arrange delivery, and provide customer support.
            </p>
            
            <h2 className='text-2xl font-semibold mb-4'>Data Security</h2>
            <p className='text-gray-600 mb-4'>
              All data is encrypted and securely stored. We never share your personal information with third parties.
            </p>
            
            <h2 className='text-2xl font-semibold mb-4'>Contact Us</h2>
            <p className='text-gray-600'>
              For privacy-related questions:<br/>
              Phone: +91 93340 42952<br/>
              Email: privacy@esse-naturals.com
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}