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

// ---------------------------------------------------------------------------
// Props de componentes (alineados con data real de WordPress / realData.json)
// ---------------------------------------------------------------------------

/**
 * Props del bloque Hero según respuesta real de WPGraphQL.
 * La imagen viene anidada en image.node
 */
export interface HeroBlockProps {
  title?: string;
  image?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
}

/**
 * Props del bloque de texto según respuesta real de WPGraphQL.
 */
export interface TextBlockProps {
  content?: string;
}

/**
 * Props del bloque Label + Imagen (dos columnas: texto + imagen).
 */
export interface LabelImageBlockProps {
  title?: string;
  content?: string;
  background_color?: string;
  image?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  text_color?: string;
}

/** Item del carrusel (título, texto, colores, imagen) */
export interface CaruselItem {
  title?: string;
  text?: string;
  text_color?: string;
  title_color?: string;
  image?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
}

/** Botón opcional del bloque (nombre, colores) */
export interface CaruselBoton {
  name?: string;
  text_color?: string;
  background_color?: string;
  url?: string;
}

/**
 * Props del bloque Carrusel (título, subtítulo, lista de items, botón).
 */
export interface CaruselBlockProps {
  title?: string;
  text_color?: string;
  title_color?: string;
  subtitle?: string;
  carusel?: CaruselItem[];
  boton?: CaruselBoton;
}

// ---------------------------------------------------------------------------
// Tipos de Page Builder (WPGraphQL / realData.json)
// ---------------------------------------------------------------------------

/**
 * Layout Hero del Page Builder - coincide con __typename en realData.json
 */
export interface PageBuilderDataPageBuilderHeroBlockLayout {
  __typename: 'PageBuilderDataPageBuilderHeroBlockLayout';
  fieldGroupName: 'PageBuilderDataPageBuilderHeroBlockLayout';
  title?: string;
  image?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
}

/**
 * Layout Text del Page Builder - coincide con __typename en realData.json
 */
export interface PageBuilderDataPageBuilderTextBlockLayout {
  __typename: 'PageBuilderDataPageBuilderTextBlockLayout';
  fieldGroupName: 'PageBuilderDataPageBuilderTextBlockLayout';
  content?: string;
}

/**
 * Layout Label + Imagen del Page Builder (dos columnas, fondo personalizado)
 */
export interface PageBuilderDataPageBuilderLabelImageBlockLayout {
  __typename: 'PageBuilderDataPageBuilderLabelImageBlockLayout';
  fieldGroupName: 'PageBuilderDataPageBuilderLabelImageBlockLayout';
  title?: string;
  content?: string;
  background_color?: string;
  image?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  text_color?: string;
}

/**
 * Layout Carrusel del Page Builder (título, subtítulo, items, botón)
 */
export interface PageBuilderDataPageBuilderCaruselBlockLayout {
  __typename: 'PageBuilderDataPageBuilderCaruselBlockLayout';
  fieldGroupName: 'PageBuilderDataPageBuilderCaruselBlockLayout';
  title?: string;
  subtitle?: string;
  carusel?: CaruselItem[];
  boton?: CaruselBoton;
}

/**
 * Unión de todos los bloques del page builder (data real)
 */
export type PageBuilderBlock =
  | PageBuilderDataPageBuilderHeroBlockLayout
  | PageBuilderDataPageBuilderTextBlockLayout
  | PageBuilderDataPageBuilderLabelImageBlockLayout
  | PageBuilderDataPageBuilderCaruselBlockLayout;

// ---------------------------------------------------------------------------
// Tipos legacy (Flexible Content anterior)
// ---------------------------------------------------------------------------

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
 * Tipo guard para bloques del Page Builder real
 */
export function isPageBuilderHeroBlock(
  block: PageBuilderBlock
): block is PageBuilderDataPageBuilderHeroBlockLayout {
  return block.fieldGroupName === 'PageBuilderDataPageBuilderHeroBlockLayout';
}

export function isPageBuilderTextBlock(
  block: PageBuilderBlock
): block is PageBuilderDataPageBuilderTextBlockLayout {
  return block.fieldGroupName === 'PageBuilderDataPageBuilderTextBlockLayout';
}

export function isPageBuilderLabelImageBlock(
  block: PageBuilderBlock
): block is PageBuilderDataPageBuilderLabelImageBlockLayout {
  return block.fieldGroupName === 'PageBuilderDataPageBuilderLabelImageBlockLayout';
}

export function isPageBuilderCaruselBlock(
  block: PageBuilderBlock
): block is PageBuilderDataPageBuilderCaruselBlockLayout {
  return block.fieldGroupName === 'PageBuilderDataPageBuilderCaruselBlockLayout';
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

