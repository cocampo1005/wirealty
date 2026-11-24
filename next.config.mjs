/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  env: {
    // Fallback for the footer copyright year in prerendered HTML.
    NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [70, 75, 85],
  },
}

export default nextConfig
