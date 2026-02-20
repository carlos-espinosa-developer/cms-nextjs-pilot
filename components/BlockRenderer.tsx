'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { type FlexibleContentBlock } from '@/types/wordpress';

/**
 * Mapeo entre los fieldGroupName de ACF y los nombres de componentes React
 * Normaliza los nombres para manejar variaciones (snake_case, PascalCase)
 */
const BLOCK_COMPONENT_MAP: Record<string, string> = {
  // Hero block variations
  'page_flexiblecontent_hero': 'HeroBlock',
  'Page_Flexiblecontent_Hero': 'HeroBlock',
  
  // RichText block variations
  'page_flexiblecontent_richtext': 'RichTextBlock',
  'Page_Flexiblecontent_RichText': 'RichTextBlock',
};

/**
 * Normaliza el fieldGroupName para obtener el nombre del componente
 */
function getComponentName(fieldGroupName: string): string | null {
  return BLOCK_COMPONENT_MAP[fieldGroupName] || null;
}

/**
 * Cache de componentes dinámicos para evitar recargas innecesarias
 */
const componentCache = new Map<string, ReturnType<typeof dynamic>>();

/**
 * Carga dinámicamente un componente de bloque con caché
 */
function loadBlockComponent(componentName: string) {
  if (componentCache.has(componentName)) {
    return componentCache.get(componentName)!;
  }

  const DynamicComponent = dynamic(
    () => import(`@/components/blocks/${componentName}`).then((mod) => mod[componentName]),
    {
      loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded" />,
      ssr: true,
    }
  );

  componentCache.set(componentName, DynamicComponent);
  return DynamicComponent;
}

interface BlockRendererProps {
  blocks: FlexibleContentBlock[];
}

/**
 * BlockRenderer - Componente que renderiza bloques dinámicos de ACF
 * 
 * @param blocks - Array de bloques Flexible Content provenientes de WordPress
 * 
 * Características:
 * - Importación dinámica de componentes para optimización
 * - Mapeo automático entre fieldGroupName y componentes React
 * - Manejo de bloques no encontrados (null en producción, warning en desarrollo)
 * - Loading state durante la carga de componentes
 */
export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  // Memoizar los componentes dinámicos para evitar recargas
  const blockComponents = useMemo(() => {
    return blocks.map((block, index) => {
      const componentName = getComponentName(block.fieldGroupName);

      // Si no se encuentra el componente, manejar según el entorno
      if (!componentName) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `[BlockRenderer] Bloque no encontrado: "${block.fieldGroupName}" en el índice ${index}. ` +
            `Asegúrate de crear el componente correspondiente en @/components/blocks/`
          );
        }
        return null;
      }

      // Cargar el componente dinámicamente (con caché)
      const DynamicComponent = loadBlockComponent(componentName);

      return {
        Component: DynamicComponent,
        props: block,
        key: `${block.fieldGroupName}-${index}`,
      };
    }).filter((item): item is NonNullable<typeof item> => item !== null);
  }, [blocks]);

  return (
    <>
      {blockComponents.map(({ Component, props, key }) => (
        <Component key={key} {...props} />
      ))}
    </>
  );
}

