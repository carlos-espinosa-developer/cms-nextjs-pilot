import { BlockRenderer } from '@/components/BlockRenderer';
import { getPageBySlug } from '@/lib/wp-api';

/**
 * Página de origen (/): pide a WordPress la página con URI /home/
 * y renderiza sus bloques. Redirigir /home → / está en next.config.js.
 */
export default async function HomePage() {
  const page = await getPageBySlug([]);
  const blocks = page?.pageBuilder ?? [];

  if (!page) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-semibold text-black">
            Página no encontrada
          </h1>
          <p className="mt-2 text-gray-600">
            No hay contenido para la página de inicio en WordPress (URI: /home/).
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <BlockRenderer blocks={blocks} />

      {process.env.NODE_ENV === 'development' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gray-100 rounded-lg p-4 text-sm text-black">
            <p className="font-semibold mb-2">Debug Info (Home):</p>
            <p>Título: {page.title}</p>
            <p>URI: {page.uri}</p>
            <p>Bloques cargados: {blocks.length}</p>
            <details className="mt-2">
              <summary className="cursor-pointer font-semibold">
                Ver estructura de bloques
              </summary>
              <pre className="mt-2 p-2 bg-gray-200 rounded overflow-auto text-xs text-black">
                {JSON.stringify(blocks, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </main>
  );
}
