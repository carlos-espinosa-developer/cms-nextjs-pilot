import type { PageBuilderBlock } from '@/types/wordpress';

/**
 * DOCUMENTACIÓN / REFERENCIA
 * La app se conecta solo a la API (getPageBySlug en lib/wp-api.ts).
 * Este archivo y realData.json se mantienen como referencia de la forma
 * de los datos del page builder (fieldGroupName, image.node, etc.).
 */

/**
 * Datos mock que simulan la respuesta del page builder de WordPress
 * (misma forma que realData.json: fieldGroupName, image.node, etc.)
 */
export const mockPageBuilderBlocks: PageBuilderBlock[] = [
  {
    __typename: 'PageBuilderDataPageBuilderHeroBlockLayout',
    fieldGroupName: 'PageBuilderDataPageBuilderHeroBlockLayout',
    title: 'Bienvenido a Nuestro Sitio',
    image: {
      node: {
        sourceUrl: 'https://placehold.co/1920x1080/667eea/ffffff?text=Hero+Image',
        altText: 'Hero image',
      },
    },
  },
  {
    __typename: 'PageBuilderDataPageBuilderTextBlockLayout',
    fieldGroupName: 'PageBuilderDataPageBuilderTextBlockLayout',
    content:
      '<h2>Nuestra Historia</h2>\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n<h3>Nuestros Valores</h3>\n<ul>\n<li>Innovación constante</li>\n<li>Compromiso con la calidad</li>\n<li>Sostenibilidad</li>\n</ul>\n',
  },
];

/**
 * Devuelve bloques mock. Solo para tests o documentación; la app no lo usa.
 */
export function getPageBuilderBlocks(): PageBuilderBlock[] {
  return mockPageBuilderBlocks;
}

/**
 * Devuelve bloques desde realData.json por uri. Solo para referencia; la app no lo usa.
 */
export function getPageBuilderBlocksFromRealData(
  uri: string
): PageBuilderBlock[] | null {
  try {
    const realData = require('./realData.json') as {
      data: {
        pages: {
          nodes: Array<{
            uri: string;
            pageBuilderData?: { pageBuilder: PageBuilderBlock[] | null };
          }>;
        };
      };
    };
    const normalizedUri = uri.startsWith('/') ? uri : `/${uri}`;
    const node = realData.data.pages.nodes.find(
      (n) => n.uri === normalizedUri || n.uri === `${normalizedUri}/`
    );
    const blocks = node?.pageBuilderData?.pageBuilder ?? null;
    return Array.isArray(blocks) ? blocks : null;
  } catch {
    return null;
  }
}
