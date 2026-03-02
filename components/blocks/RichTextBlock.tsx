import { type TextBlockProps } from '@/types/wordpress';

/**
 * TextBlock (RichTextBlock) - Componente de bloque de texto enriquecido.
 * Recibe content (string) y lo renderiza con estilos de editor WordPress
 * usando @tailwindcss/typography (prose prose-lg max-w-none).
 */
export function RichTextBlock({ content }: TextBlockProps) {
  if (!content) {
    return null;
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div
        className="prose prose-lg max-w-none
          prose-headings:text-gray-900
          prose-p:text-gray-700
          prose-ul:text-gray-700
          prose-li:text-gray-700
          prose-a:text-blue-600
          prose-a:no-underline hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  );
}
