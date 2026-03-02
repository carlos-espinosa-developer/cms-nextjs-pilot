import { type LabelNoImgBlockProps } from '@/types/wordpress';
import Image from 'next/image';

/**
 * LabelNoImgBlock - Banner con título + imagen. Sin contenido largo.
 * align ["right"] = título a la derecha, imagen a la izquierda.
 * align ["left"] o sin align = título a la izquierda, imagen a la derecha.
 */
export function LabelNoImgBlock({
  title,
  align = [],
  background_color,
  image,
}: LabelNoImgBlockProps) {
  const bgColor = background_color ?? '#009056';
  const imageUrl = image?.node?.sourceUrl;
  const altText = image?.node?.altText ?? '';
  const isTitleRight = align[0]?.toLowerCase() === 'right';

  return (
    <section
      className="w-full overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-between">
          {/* Imagen: a la izquierda si align right, a la derecha si align left */}
          <div
            className={`relative w-full max-w-md lg:max-w-lg flex-shrink-0 ${
              isTitleRight ? 'order-1 lg:order-1' : 'order-2 lg:order-2'
            }`}
          >
            {imageUrl ? (
              <div className="relative w-full aspect-[4/3] max-h-[180px]">
                <Image
                  src={imageUrl}
                  alt={altText}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            ) : null}
          </div>

          {/* Título: blanco, grande; lado opuesto a la imagen */}
          <div
            className={`flex-1 flex items-center justify-center lg:justify-end text-center lg:text-left ${
              isTitleRight ? 'order-2 lg:order-2 lg:justify-end pr-12' : 'order-1 lg:order-1 lg:justify-start pl-12'
            }`}
          >
            {title && (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                {title}
              </h2>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
