/**
 * Normaliza los nombres de tipos largos de WPGraphQL/SCF a nombres de componentes amigables.
 * Ejemplo: "PageBuilderDataPageBuilderHeroBlockLayout" -> "HeroBlock"
 */
export function getComponentNameFromFieldGroup(fieldGroupName: string): string {
    // 1. Eliminamos el prefijo común que ya vimos que genera tu WP
    // 2. Eliminamos el sufijo "Layout"
    return fieldGroupName
      .replace('PageBuilderDataPageBuilder', '')
      .replace('Layout', '');
  }
  
  /**
   * Diccionario de excepciones. 
   * Úsalo solo si un nombre de SCF es muy raro y no quieres que se llame igual en el front.
   */
  const COMPONENT_OVERRIDES: Record<string, string> = {
    'TextBlock': 'RichTextBlock', // Ejemplo: si en WP se llama TextBlock pero tu componente es RichTextBlock
  };
  
  export function resolveBlockComponent(fieldGroupName: string): string {
    const normalizedName = getComponentNameFromFieldGroup(fieldGroupName);
    return COMPONENT_OVERRIDES[normalizedName] || normalizedName;
  }