/**
 * Cliente WPGraphQL para Next.js
 * Maneja las queries y mutations de WordPress GraphQL API
 */

const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL || '';

if (!WP_GRAPHQL_URL) {
  console.warn('NEXT_PUBLIC_WP_GRAPHQL_URL no está configurado');
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
 * Query para obtener una página por slug con Flexible Content
 */
export const GET_PAGE_BY_SLUG = `
  query GetPageBySlug($slug: String!) {
    pageBy(slug: $slug) {
      id
      title
      slug
      content
      flexibleContent {
        fieldGroupName
        ... on Page_Flexiblecontent_Hero {
          title
          subtitle
          image {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
          ctaText
          ctaLink
        }
        ... on Page_Flexiblecontent_RichText {
          content
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
 * Helper para obtener una página por slug
 */
export async function getPageBySlug(slug: string) {
  return fetchGraphQL<{
    pageBy: {
      id: string;
      title: string;
      slug: string;
      content: string;
      flexibleContent: unknown[];
    };
  }>(GET_PAGE_BY_SLUG, { slug });
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

