/**
 * Cliente WPGraphQL para Next.js
 * Usa NEXT_PUBLIC_WORDPRESS_API_URL como endpoint GraphQL.
 */

import type { PageBuilderBlock } from '@/types/wordpress';

const WP_GRAPHQL_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  process.env.NEXT_PUBLIC_WP_GRAPHQL_URL ||
  '';

if (!WP_GRAPHQL_URL && typeof window === 'undefined') {
  console.warn(
    'NEXT_PUBLIC_WORDPRESS_API_URL (o NEXT_PUBLIC_WP_GRAPHQL_URL) no está configurado'
  );
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
  }>;
}

interface FetchOptions {
  revalidate?: number;
  tags?: string[];
}

/**
 * Cliente GraphQL con soporte para caché y revalidación
 */
export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
  options: FetchOptions = {}
): Promise<T> {
  const { revalidate, tags } = options;

  const response = await fetch(WP_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    next: {
      revalidate,
      tags,
    },
  } as RequestInit);

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors) {
    throw new Error(
      `GraphQL errors: ${result.errors.map((e) => e.message).join(', ')}`
    );
  }

  if (!result.data) {
    throw new Error('No data returned from GraphQL query');
  }

  return result.data;
}

/**
 * Query para obtener una página por URI con Page Builder (fragmentos Hero + Text).
 * Compatible con la respuesta de realData.json.
 */
export const GET_PAGE_BY_URI = `
  query GetPageByUri($uri: String!) {
    nodeByUri(uri: $uri) {
      ... on Page {
        id
        title
        uri
        content
        pageBuilderData {
          pageBuilder {
            __typename
            fieldGroupName
            ... on PageBuilderDataPageBuilderHeroBlockLayout {
              title
              image {
                node {
                  sourceUrl
                  altText
                }
              }
            }
            ... on PageBuilderDataPageBuilderTextBlockLayout {
              content
            }
          }
        }
      }
    }
  }
`;

/**
 * Alternativa: query por lista de páginas filtrada por uri.
 * Algunos esquemas WPGraphQL exponen pages(where: { uri: $uri }).
 */
export const GET_PAGES_BY_URI = `
  query GetPagesByUri($uri: String!) {
    pages(where: { uri: $uri }) {
      nodes {
        id
        title
        uri
        content
        pageBuilderData {
          pageBuilder {
            __typename
            fieldGroupName
            ... on PageBuilderDataPageBuilderHeroBlockLayout {
              title
              image {
                node {
                  sourceUrl
                  altText
                }
              }
            }
            ... on PageBuilderDataPageBuilderTextBlockLayout {
              content
            }
          }
        }
      }
    }
  }
`;

/**
 * Query para obtener el menú principal
 */
export const GET_MENU = `
  query GetMenu($location: MenuLocationEnum!) {
    menuItems(where: { location: $location }) {
      nodes {
        id
        label
        url
        path
        parentId
      }
    }
  }
`;

/**
 * Normaliza el slug de la ruta a la URI que espera WordPress.
 * Ruta vacía o ['home'] → página principal (/ o /home/).
 */
export function normalizeSlugToUri(slug: string[] | undefined | null): string {
  if (!slug || slug.length === 0) {
    return '/home/';
  }
  const first = slug[0].toLowerCase();
  if (first === 'home') {
    return '/home/';
  }
  const path = '/' + slug.join('/');
  return path.endsWith('/') ? path : path + '/';
}

/** Respuesta de página con Page Builder (nodeByUri) */
export interface PageByUriResult {
  nodeByUri: {
    id: string;
    title: string;
    uri: string;
    content: string;
    pageBuilderData?: {
      pageBuilder: PageBuilderBlock[] | null;
    };
  } | null;
}

/** Respuesta de página con Page Builder (pages.nodes) */
export interface PagesByUriResult {
  pages: {
    nodes: Array<{
      id: string;
      title: string;
      uri: string;
      content: string;
      pageBuilderData?: {
        pageBuilder: PageBuilderBlock[] | null;
      };
    }>;
  };
}

/**
 * Obtiene una página por slug/uri desde la API GraphQL.
 * Usa ISR con revalidate: 60 (los cambios en WP se reflejan en el front como máximo cada minuto).
 * Slug vacío o ['home'] se considera la página principal.
 */
export async function getPageBySlug(slug: string[] | undefined | null): Promise<{
  id: string;
  title: string;
  uri: string;
  content: string;
  pageBuilder: PageBuilderBlock[] | null;
} | null> {
  const uri = normalizeSlugToUri(slug);

  try {
    const data = await fetchGraphQL<PageByUriResult>(
      GET_PAGE_BY_URI,
      { uri },
      { revalidate: 60 }
    );

    const page = data.nodeByUri;
    if (!page) {
      return null;
    }

    return {
      id: page.id,
      title: page.title,
      uri: page.uri,
      content: page.content,
      pageBuilder: page.pageBuilderData?.pageBuilder ?? null,
    };
  } catch {
    try {
      const data = await fetchGraphQL<PagesByUriResult>(
        GET_PAGES_BY_URI,
        { uri },
        { revalidate: 60 }
      );

      const node = data.pages?.nodes?.[0];
      if (!node) {
        return null;
      }

      return {
        id: node.id,
        title: node.title,
        uri: node.uri,
        content: node.content,
        pageBuilder: node.pageBuilderData?.pageBuilder ?? null,
      };
    } catch {
      return null;
    }
  }
}

/**
 * Helper para obtener el menú con tags de caché
 * Usa tags para revalidación selectiva del menú
 */
export async function getMenu(location: 'PRIMARY' | 'FOOTER' = 'PRIMARY') {
  return fetchGraphQL<{
    menuItems: {
      nodes: Array<{
        id: string;
        label: string;
        url: string;
        path: string;
        parentId: string | null;
      }>;
    };
  }>(
    GET_MENU,
    { location },
    {
      tags: [`menu-${location.toLowerCase()}`],
      revalidate: 3600, // Revalidar cada hora
    }
  );
}

/**
 * Tipo para items de menú con estructura jerárquica recursiva
 */
export type MenuItemWithChildren = {
  id: string;
  label: string;
  url: string;
  path: string;
  parentId: string | null;
  children: MenuItemWithChildren[];
};

/**
 * Transforma un array plano de items de menú en una estructura jerárquica
 * con hijos anidados
 */
export function buildMenuHierarchy(
  items: Array<{
    id: string;
    label: string;
    url: string;
    path: string;
    parentId: string | null;
  }>
): MenuItemWithChildren[] {
  const itemMap = new Map<string, MenuItemWithChildren>();
  const rootItems: MenuItemWithChildren[] = [];

  // Primero, crear un mapa de todos los items con children vacío
  items.forEach((item) => {
    itemMap.set(item.id, { ...item, children: [] });
  });

  // Luego, construir la jerarquía
  items.forEach((item) => {
    const menuItem = itemMap.get(item.id)!;
    if (item.parentId && itemMap.has(item.parentId)) {
      // Es un hijo, agregarlo al padre
      const parent = itemMap.get(item.parentId)!;
      parent.children.push(menuItem);
    } else {
      // Es un item raíz
      rootItems.push(menuItem);
    }
  });

  return rootItems;
}

