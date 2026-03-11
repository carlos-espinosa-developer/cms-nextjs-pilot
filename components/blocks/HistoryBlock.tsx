'use client';

import { useState } from 'react';
import Image from 'next/image';
import { type HistoryBlockProps } from '@/types/wordpress';

const TIMELINE_COLOR = '#1c4f2d';
const ACTIVE_BG = 'rgb(253, 186, 116)'; // amarillo-naranja

/**
 * HistoryBlock - Timeline izquierda (años) y eventos a la derecha.
 * Al hacer clic en un año se muestran sus history_by_year.
 */
export function HistoryBlock({ history = [] }: HistoryBlockProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = history[selectedIndex];
  const events = selected?.history_by_year ?? [];

  if (history.length === 0) return null;

  return (
    <section className="w-full bg-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Columna izquierda: línea vertical + años */}
          <aside className="relative flex-shrink-0 lg:w-36">
            {/* Línea vertical (desktop: junto a los años) */}
            <div
              className="hidden lg:block absolute left-[5px] top-2 bottom-2 w-0.5"
              style={{ backgroundColor: TIMELINE_COLOR }}
            />
            <div className="flex flex-row flex-wrap gap-2 lg:flex-col lg:flex-nowrap lg:gap-0">
              {history.map((item, index) => {
                const isActive = index === selectedIndex;
                return (
                  <button
                    key={item.year_tab ?? index}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    className={`
                      relative flex items-center gap-3 lg:gap-4 w-full text-left py-2 pl-8 lg:pl-8 pr-3 rounded
                      transition-colors
                      ${isActive ? 'font-semibold' : 'text-gray-500 hover:text-gray-700'}
                    `}
                    style={{
                      backgroundColor: isActive ? ACTIVE_BG : undefined,
                    }}
                  >
                    <span
                      className="absolute left-0 w-3 h-3 rounded-full border-2 border-white shadow flex-shrink-0"
                      style={{
                        backgroundColor: TIMELINE_COLOR,
                        borderColor: TIMELINE_COLOR,
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    />
                    <span className="text-lg" style={{ color: isActive ? '#1a1a1a' : undefined }}>
                      {item.year_tab}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Columna derecha: eventos del año seleccionado */}
          <div className="flex-1 min-w-0 space-y-12 lg:pl-8">
            {events.map((event, eventIndex) => (
              <article key={eventIndex} className="space-y-4">
                {event.title && (
                  <h3
                    className="text-3xl sm:text-4xl font-bold"
                    style={{ color: event.title_color ?? TIMELINE_COLOR }}
                  >
                    {event.title}
                  </h3>
                )}
                {event.subtitle && (
                  <p
                    className="text-xl font-semibold"
                    style={{ color: event.title_color ?? TIMELINE_COLOR }}
                  >
                    {event.subtitle}
                  </p>
                )}
                {event.image?.node?.sourceUrl && (
                  <div className="relative w-full max-w-2xl aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={event.image.node.sourceUrl}
                      alt={event.image.node.altText || event.subtitle || ''}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  </div>
                )}
                {event.text && (
                  <div
                    className="prose prose-lg max-w-none text-black whitespace-pre-line"
                    style={{ color: '#000' }}
                  >
                    {event.text}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
