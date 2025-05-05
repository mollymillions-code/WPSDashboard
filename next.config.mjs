/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the env property that was exposing sensitive variables
  
  // Disable security headers check during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
