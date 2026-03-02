/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'dev-sostenibilidad.segurosbolivar.com', pathname: '/**' },
      { protocol: 'https', hostname: 'dev-portales.segurosbolivar.com', pathname: '/**' },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/home/', destination: '/', permanent: true },
    ];
  },
};

module.exports = nextConfig;

