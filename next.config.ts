import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['silverringventures.com'],
    formats: ['image/webp', 'image/avif'],
  },
  // Ensure Three.js works correctly
  transpilePackages: ['three'],
  // Allow server-side packages in API routes
  serverExternalPackages: ['nodemailer', 'twilio'],
}

export default nextConfig
