import { type CaruselBlockProps } from '@/types/wordpress';
import Image from 'next/image';
import Link from 'next/link';
import { isInternalUrl, toInternalHref } from '@/utils/url';

/**
 * CaruselBlock - Bloque de carrusel con título, subtítulo, tarjetas (imagen + título + texto) y botón opcional.
 */
export function CaruselBlock({
  title,
  text_color,
  title_color,
  subtitle,
  carusel = [],
  boton,
}: CaruselBlockProps) {
  const textColor = text_color ?? '#000000';
  const titleColor = title_color ?? '#000000';

  if (carusel.length === 0) return null;

  return (
    <section className="w-full bg-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <header className="mb-8 lg:mb-10">
            {title && (
              <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-center" style={{ color: titleColor }}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg max-w-4xl text-center mx-auto" style={{ color: textColor }}>{subtitle}</p>
            )}
          </header>
        )}

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {carusel.map((item, index) => (
            <article
              key={index}
              className="w-full max-w-[320px] mx-auto sm:mx-0 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm
                hover:shadow-md transition-shadow flex flex-col"
            >
                {item.image?.node?.sourceUrl && (
                  <div className="relative w-full aspect-[4/3] bg-gray-100">
                    <Image
                      src={item.image.node.sourceUrl}
                      alt={item.image.node.altText || item.title || ''}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                  </div>
                )}
                <div className="p-5">
                  {item.title && (
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{
                        color: item.title_color ?? '#009056',
                      }}
                    >
                      {item.title}
                    </h3>
                  )}
                  {item.text && (
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: item.text_color ?? '#000000',
                      }}
                    >
                      {item.text}
                    </p>
                  )}
                </div>
              </article>
            ))}
        </div>

        {boton?.name && (
          <div className="mt-8 flex justify-center">
            {boton.url ? (
              isInternalUrl(boton.url) ? (
                <Link
                  href={toInternalHref(boton.url)}
                  className="inline-block px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90 text-center"
                  style={{
                    color: boton.text_color ?? '#ffffff',
                    backgroundColor: boton.background_color ?? '#009056',
                  }}
                >
                  {boton.name}
                </Link>
              ) : (
                <a
                  href={boton.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90 text-center"
                  style={{
                    color: boton.text_color ?? '#ffffff',
                    backgroundColor: boton.background_color ?? '#009056',
                  }}
                >
                  {boton.name}
                </a>
              )
            ) : (
              <span
                className="inline-block px-6 py-3 rounded-lg font-semibold"
                style={{
                  color: boton.text_color ?? '#ffffff',
                  backgroundColor: boton.background_color ?? '#009056',
                }}
              >
                {boton.name}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
