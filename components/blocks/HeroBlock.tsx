import { type HeroLayout } from '@/types/wordpress';
import Image from 'next/image';
import Link from 'next/link';

interface HeroBlockProps extends HeroLayout {}

/**
 * HeroBlock - Componente de bloque Hero
 * Renderiza una sección hero con imagen, título, subtítulo y CTA
 */
export function HeroBlock({
  title,
  subtitle,
  image,
  ctaText,
  ctaLink,
}: HeroBlockProps) {
  return (
    <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
      {/* Imagen de fondo */}
      {image?.sourceUrl && (
        <div className="absolute inset-0 z-0">
          {/* Usar img normal si hay problemas con next/image en desarrollo */}
          {process.env.NODE_ENV === 'development' ? (
            <img
              src={image.sourceUrl}
              alt={image.altText || 'Hero image'}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback a un gradiente si la imagen falla
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }
              }}
            />
          ) : (
            <Image
              src={image.sourceUrl}
              alt={image.altText || 'Hero image'}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )}
          {/* Overlay oscuro para mejorar legibilidad */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Contenido */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        {title && (
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-xl sm:text-2xl mb-8 text-gray-200 animate-fade-in-delay">
            {subtitle}
          </p>
        )}
        {ctaText && ctaLink && (
          <Link
            href={ctaLink}
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl animate-fade-in-delay-2"
          >
            {ctaText}
          </Link>
        )}
      </div>
    </section>
  );
}

