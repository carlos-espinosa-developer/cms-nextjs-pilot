import { type LabelImageBlockProps } from '@/types/wordpress';
import Image from 'next/image';

/**
 * LabelImageBlock - Bloque de dos columnas: texto a la izquierda, imagen a la derecha.
 * La imagen abarca el 100% de la altura del banner (top y bottom). Referencia Figma: 1920px ancho, imagen 1016×740px.
 */
export function LabelImageBlock({
  title,
  content,
  background_color,
  image,
  text_color,
}: LabelImageBlockProps) {
  const bgColor = background_color || '#f5f0e8';
  const imageUrl = image?.node?.sourceUrl;
  const altText = image?.node?.altText ?? '';
  const textColor = text_color ?? '#000000';

  return (
    <section
      className="w-full overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full mx-auto pl-4 sm:pl-6 lg:pl-48">
        <div
          className="grid grid-cols-1 lg:grid-cols-12 items-center
            min-h-[457px]"
        >
          <div
            className="max-w-[50rem] lg:col-span-7 flex flex-col justify-center order-2 lg:order-1 py-10 lg:py-12 lg:pr-10"
            style={{ color: textColor }}
          >
            {title && (
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                {title}
              </h2>
            )}
            {content && (
              <div
                className="prose prose-lg max-w-none [&_*]:!text-inherit
                  prose-headings:font-bold
                  prose-p:leading-relaxed prose-p:mb-4"
                style={{ color: textColor }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>
          <div
            className="relative lg:col-span-5 order-1 lg:order-2
              w-full min-h-full
              -mx-4 sm:-mx-6 lg:mx-0 lg:-mr-8 xl:-mr-12 2xl:-mr-16"
          >
            {imageUrl ? (
              <div className="absolute inset-0">
                <Image
                  src={imageUrl}
                  alt={altText}
                  fill
                  className="object-cover object-left"
                  sizes="(max-width: 1023px) 100vw, 45vw"
                />
              </div>
            ) : (
              <div
                className="absolute inset-0 bg-gray-200 rounded-lg"
                aria-hidden
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
