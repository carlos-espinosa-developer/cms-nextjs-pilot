import { BlockRenderer } from '@/components/BlockRenderer';
import {
  getPageBuilderBlocks,
  getPageBuilderBlocksFromRealData,
} from '@/constants/mockData';
import type { PageBuilderBlock } from '@/types/wordpress';

function getBlocks(slug: string[]): PageBuilderBlock[] {
  const path = slug?.length ? `/${slug.join('/')}/` : '/home/';
  const realBlocks = getPageBuilderBlocksFromRealData(path);
  if (realBlocks?.length) return realBlocks;
  return getPageBuilderBlocks();
}

interface PageProps {
  params: {
    slug: string[];
  };
}

/**
 * Página dinámica catch-all para rutas de WordPress
 * 
 * Esta página renderiza el contenido de WordPress usando el BlockRenderer
 * Para pruebas, usa datos mock de constants/mockData.ts
 * 
 * @param params - Parámetros de la ruta (slug)
 */
export default function DynamicPage({ params }: PageProps) {
  const blocks = getBlocks(params.slug ?? []);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Renderizar los bloques dinámicos */}
      <BlockRenderer blocks={blocks} />

      {/* Información de debug en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-sm">
            <p className="font-semibold mb-2">Debug Info:</p>
            <p>Slug: {params.slug?.join('/') || 'home'}</p>
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

