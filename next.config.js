/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fix for face-api.js and other Node.js modules in browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        url: false
      }
      
      // Add regenerator-runtime polyfill for async/await support
      config.resolve.alias = {
        ...config.resolve.alias,
        'regenerator-runtime': require.resolve('regenerator-runtime')
      }
    }
    return config
  }
}

module.exports = nextConfig
