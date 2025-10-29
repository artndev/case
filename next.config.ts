import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: [process.env.NEXT_PUBLIC_APP_URL!],
}

export default nextConfig
