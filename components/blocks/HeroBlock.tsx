import { type HeroBlockProps } from '@/types/wordpress';
import Image from 'next/image';

/**
 * HeroBlock - Componente de bloque Hero
 * Recibe props según HeroBlockProps (data real de WordPress).
 * La imagen viene en image.node (sourceUrl, altText).
 */
export function HeroBlock({ title, image }: HeroBlockProps) {
  const imageUrl = image?.node?.sourceUrl;
  const altText = image?.node?.altText ?? '';

  return (
    <section className="relative w-full min-h-[400px] flex items-center justify-center overflow-hidden">
      {/* Imagen de fondo o placeholder */}
      <div className="absolute inset-0 z-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={altText || 'Hero image'}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.hero-placeholder')) {
                const placeholder = document.createElement('div');
                placeholder.className = 'hero-placeholder absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900';
                parent.appendChild(placeholder);
              }
            }}
          />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900"
            aria-hidden
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        {title && (
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            {title}
          </h1>
        )}
      </div>
    </section>
  );
}
