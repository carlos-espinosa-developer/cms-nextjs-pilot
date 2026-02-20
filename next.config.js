/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Agregar aquí el dominio de tu WordPress cuando lo configures
      // {
      //   protocol: 'https',
      //   hostname: 'tudominio.com',
      // },
    ],
    // Deshabilitar optimización de imágenes en desarrollo si hay problemas con SSL
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

module.exports = nextConfig;

