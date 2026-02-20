import { type FlexibleContentBlock } from '@/types/wordpress';

/**
 * Datos mock que simulan la respuesta JSON de WordPress
 * para una página con el campo page_builder (Flexible Content)
 */
export const mockPageData = {
  id: 'cG9zdDox',
  title: 'Página de Prueba',
  slug: 'pagina-prueba',
  content: '<p>Contenido de la página de prueba</p>',
  page_builder: [
    {
      fieldGroupName: 'Page_Flexiblecontent_Hero',
      title: 'Bienvenido a Nuestro Sitio',
      subtitle: 'Descubre nuestras increíbles soluciones',
      image: {
        // Usar placeholder.com como alternativa si Unsplash falla
        sourceUrl: 'https://placehold.co/1920x1080/667eea/ffffff?text=Hero+Image',
        // Alternativa: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop',
        altText: 'Hero image',
        mediaDetails: {
          width: 1920,
          height: 1080,
        },
      },
      ctaText: 'Comenzar Ahora',
      ctaLink: '/contacto',
    },
    {
      fieldGroupName: 'Page_Flexiblecontent_RichText',
      content: '<h2>Nuestra Historia</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><h3>Nuestros Valores</h3><ul><li>Innovación constante</li><li>Compromiso con la calidad</li><li>Atención al cliente</li><li>Sostenibilidad</li></ul>',
    },
  ] as FlexibleContentBlock[],
};

/**
 * Función helper para obtener los bloques del page_builder
 */
export function getPageBuilderBlocks() {
  return mockPageData.page_builder;
}

