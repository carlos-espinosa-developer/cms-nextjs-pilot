import { type RichTextLayout } from '@/types/wordpress';

interface RichTextBlockProps extends RichTextLayout {}

/**
 * RichTextBlock - Componente de bloque de texto enriquecido
 * Renderiza contenido HTML de WordPress de forma segura
 */
export function RichTextBlock({ content }: RichTextBlockProps) {
  if (!content) {
    return null;
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div
        className="prose prose-lg dark:prose-invert max-w-none
          prose-headings:text-gray-900 dark:prose-headings:text-gray-100
          prose-p:text-gray-700 dark:prose-p:text-gray-300
          prose-ul:text-gray-700 dark:prose-ul:text-gray-300
          prose-li:text-gray-700 dark:prose-li:text-gray-300
          prose-a:text-blue-600 dark:prose-a:text-blue-400
          prose-a:no-underline hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  );
}

