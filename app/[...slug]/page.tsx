import { BlockRenderer } from '@/components/BlockRenderer';
import { getPageBySlug } from '@/lib/wp-api';

interface PageProps {
  params: {
    slug?: string[];
  };
}

/**
 * Página dinámica catch-all: solo se conecta a la API (NEXT_PUBLIC_WORDPRESS_API_URL).
 * Slug vacío o ['home'] → página principal. Sin fallback a mock ni realData.
 * Ver constants/mockData.ts y constants/realData.json solo como documentación/referencia.
 */
export default async function DynamicPage({ params }: PageProps) {
  const page = await getPageBySlug(params.slug ?? undefined);
  const blocks = page?.pageBuilder ?? [];

  if (!page) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Página no encontrada
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            No existe contenido para esta ruta en WordPress.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <BlockRenderer blocks={blocks} />

      {process.env.NODE_ENV === 'development' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-sm">
            <p className="font-semibold mb-2">Debug Info:</p>
            <p>Slug: {params.slug?.join('/') || 'home'}</p>
            <p>Título: {page.title}</p>
            <p>Bloques cargados: {blocks.length}</p>
            <details className="mt-2">
              <summary className="cursor-pointer font-semibold">
                Ver estructura de bloques
              </summary>
              <pre className="mt-2 p-2 bg-gray-200 dark:bg-gray-900 rounded overflow-auto text-xs">
                {JSON.stringify(blocks, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </main>
  );
}
