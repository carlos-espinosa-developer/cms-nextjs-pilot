'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import { resolveBlockComponent } from '@/lib/block-registry';
import type { PageBuilderBlock } from '@/types/wordpress';

const componentCache = new Map<string, ComponentType<PageBuilderBlock>>();

function loadBlockComponent(
  componentName: string
): ComponentType<PageBuilderBlock> {
  if (componentCache.has(componentName)) {
    return componentCache.get(componentName)!;
  }

  const DynamicComponent = dynamic(
    () =>
      import(`@/components/blocks/${componentName}`).then(
        (mod) => mod[componentName] || mod.default
      ),
    {
      loading: () => (
        <div className="animate-pulse bg-gray-100 h-40 w-full rounded-xl my-4" />
      ),
      ssr: true,
    }
  ) as ComponentType<PageBuilderBlock>;

  componentCache.set(componentName, DynamicComponent);
  return DynamicComponent;
}

export interface BlockRendererProps {
  blocks: PageBuilderBlock[];
}

/**
 * BlockRenderer - Renderiza bloques del page builder de WordPress.
 * Usa resolveBlockComponent para mapear fieldGroupName (ej. PageBuilderDataPageBuilderHeroBlockLayout)
 * al nombre del componente (HeroBlock). Las props se pasan según las interfaces HeroBlockProps / TextBlockProps.
 */
export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <>
      {blocks.map((block, index) => {
        const componentName = resolveBlockComponent(block.fieldGroupName);
        const Component = loadBlockComponent(componentName);

        return (
          <Component
            key={`${block.fieldGroupName}-${index}`}
            {...block}
          />
        );
      })}
    </>
  );
}
