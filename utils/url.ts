/**
 * Utilidades para URLs: distinguir internas vs externas y normalizar para Next.js.
 *
 * Para que los enlaces del mismo dominio se detecten en SSR, define en .env.local:
 *   NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
 * (sin barra final). En el cliente también se usa window.location.origin como respaldo.
 */

const SITE_ORIGIN =
  typeof window !== 'undefined'
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '');

/**
 * Indica si una URL es interna (mismo sitio) y debe usar next/link.
 * - Rutas relativas (que empiezan con /) → internas.
 * - Mismo origen que NEXT_PUBLIC_SITE_URL (o el actual en cliente) → interna.
 */
export function isInternalUrl(url: string): boolean {
  if (!url || url === '#') return false;
  if (url.startsWith('/')) return true;
  try {
    const parsed = new URL(url);
    const origin = parsed.origin;
    if (SITE_ORIGIN && origin === SITE_ORIGIN) return true;
    if (typeof window !== 'undefined' && origin === window.location.origin)
      return true;
    return false;
  } catch {
    return false;
  }
}

/**
 * Convierte una URL a href para uso en next/link (solo path).
 * Si la URL es absoluta del mismo sitio, devuelve pathname; si ya es path, la devuelve tal cual.
 */
export function toInternalHref(url: string): string {
  if (!url || url === '#') return '/';
  if (url.startsWith('/')) return url;
  try {
    const parsed = new URL(url);
    return parsed.pathname || '/';
  } catch {
    return url;
  }
}
