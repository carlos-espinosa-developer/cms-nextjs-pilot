/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        hostname: 'dev-sostenibilidad.segurosbolivar.com',
        pathname: '**',
      },
    ],
    // Deshabilitar optimización de imágenes en desarrollo si hay problemas con SSL
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

module.exports = nextConfig;

