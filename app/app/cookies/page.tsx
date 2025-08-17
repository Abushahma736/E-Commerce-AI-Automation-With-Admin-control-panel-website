import { Container } from '@/components/ui/Container'

export default function CookiesPage() {
  return (
    <div className='py-8'>
      <Container>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl font-bold text-gray-900 mb-8'>Cookie Policy</h1>
          <div className='prose prose-lg max-w-none'>
            <p className='text-gray-600 mb-6'>How we use cookies to improve your experience</p>
            
            <h2 className='text-2xl font-semibold mb-4'>What are Cookies?</h2>
            <p className='text-gray-600 mb-4'>
              Cookies are small text files stored on your device when you visit our website.
            </p>
            
            <h2 className='text-2xl font-semibold mb-4'>Types of Cookies We Use</h2>
            <div className='space-y-4'>
              <div className='border-l-4 border-green-500 pl-4'>
                <h3 className='font-semibold'>Essential Cookies</h3>
                <p className='text-gray-600'>Required for the website to function properly</p>
              </div>
              <div className='border-l-4 border-blue-500 pl-4'>
                <h3 className='font-semibold'>Analytics Cookies</h3>
                <p className='text-gray-600'>Help us understand how visitors use our website</p>
              </div>
            </div>
            
            <h2 className='text-2xl font-semibold mb-4'>Managing Cookies</h2>
            <p className='text-gray-600 mb-4'>
              You can manage cookies through your browser settings.
            </p>
            
            <h2 className='text-2xl font-semibold mb-4'>Contact</h2>
            <p className='text-gray-600'>
              Phone: +91 93340 42952<br/>
              Email: privacy@esse-naturals.com
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}