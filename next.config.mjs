/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Enable React strict mode for better development
  reactStrictMode: true,
  
  // Image optimization config
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'profile.line-scdn.net',
      },
    ],
  },
  
  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
