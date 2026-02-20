/**
 * Tipos TypeScript para WordPress ACF Flexible Content
 * Define la estructura de los bloques dinámicos provenientes de ACF
 */

/**
 * Campo base para todos los layouts de Flexible Content
 * Todos los layouts deben incluir fieldGroupName para identificación
 */
export interface FlexibleContentLayout {
  fieldGroupName: string;
}

/**
 * Layout Hero - Bloque hero con imagen, título, subtítulo y CTA
 */
export interface HeroLayout extends FlexibleContentLayout {
  fieldGroupName: 'page_flexiblecontent_hero' | 'Page_Flexiblecontent_Hero';
  title?: string;
  subtitle?: string;
  image?: {
    sourceUrl: string;
    altText?: string;
    mediaDetails?: {
      width?: number;
      height?: number;
    };
  };
  ctaText?: string;
  ctaLink?: string;
}

/**
 * Layout RichText - Bloque de texto enriquecido
 */
export interface RichTextLayout extends FlexibleContentLayout {
  fieldGroupName: 'page_flexiblecontent_richtext' | 'Page_Flexiblecontent_RichText';
  content?: string;
}

/**
 * Unión de todos los layouts disponibles
 * Agregar nuevos layouts aquí cuando se creen
 */
export type FlexibleContentBlock = HeroLayout | RichTextLayout;

/**
 * Array de bloques Flexible Content
 * Esta es la estructura que viene de WordPress ACF
 */
export type FlexibleContent = FlexibleContentBlock[];

/**
 * Tipo guard para verificar si un bloque es Hero
 */
export function isHeroBlock(
  block: FlexibleContentBlock
): block is HeroLayout {
  return (
    block.fieldGroupName === 'page_flexiblecontent_hero' ||
    block.fieldGroupName === 'Page_Flexiblecontent_Hero'
  );
}

/**
 * Tipo guard para verificar si un bloque es RichText
 */
export function isRichTextBlock(
  block: FlexibleContentBlock
): block is RichTextLayout {
  return (
    block.fieldGroupName === 'page_flexiblecontent_richtext' ||
    block.fieldGroupName === 'Page_Flexiblecontent_RichText'
  );
}

/**
 * Tipos para el menú de WordPress
 */
export interface MenuItem {
  id: string;
  label: string;
  url: string;
  path: string;
  parentId: string | null;
  children?: MenuItem[];
}

/**
 * Estructura de una página de WordPress
 */
export interface WordPressPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  flexibleContent?: FlexibleContent;
}

