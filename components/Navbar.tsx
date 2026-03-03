'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { getMenu, buildMenuHierarchy, type MenuItemWithChildren } from '@/lib/wp-api';

interface NavbarProps {
  menuLocation?: 'PRIMARY' | 'FOOTER';
  /** URL del logo (desde WordPress Media). Si no se pasa, se muestra el texto "Logo". */
  logoUrl?: string;
  logoAlt?: string;
}

/**
 * Convierte la URL de WordPress (absoluta) en ruta relativa para Next.js.
 * Elimina el dominio base y deja solo pathname (ej. https://site.com/home/ → /home/).
 */
function formatUrl(url: string): string {
  if (!url || url === '#') return '/';
  if (url.startsWith('/')) return url;
  try {
    const parsed = new URL(url);
    return parsed.pathname || '/';
  } catch {
    return url;
  }
}

/**
 * Navbar - Componente de navegación dinámico desde WordPress
 * 
 * Características:
 * - Diseño moderno y responsive con Tailwind CSS
 * - Soporte para menús jerárquicos (padres e hijos)
 * - Menú móvil con hamburguesa
 * - Indicador de página activa
 * - Carga asíncrona del menú desde WordPress
 */
export function Navbar({ menuLocation = 'PRIMARY', logoUrl, logoAlt = 'Logo' }: NavbarProps) {
  const [menuItems, setMenuItems] = useState<MenuItemWithChildren[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function loadMenu() {
      try {
        setIsLoading(true);
        const data = await getMenu(menuLocation);
        const hierarchicalMenu = buildMenuHierarchy(data.menuItems.nodes);
        setMenuItems(hierarchicalMenu);
      } catch (error) {
        console.error('Error al cargar el menú:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadMenu();
  }, [menuLocation]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenSubmenuId(null);
  };

  const toggleSubmenu = (itemId: string) => {
    setOpenSubmenuId((prev) => (prev === itemId ? null : itemId));
  };

  const isActiveLink = (url: string) => {
    const path = formatUrl(url);
    if (!path || path === '#') return false;
    return pathname === path || pathname.startsWith(path + '/');
  };

  const renderMenuItem = (item: MenuItemWithChildren, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = isActiveLink(item.url);
    const isTopLevel = depth === 0;

    // Estilos base según el nivel
    const baseStyles = isTopLevel
      ? 'px-4 py-2 text-sm font-medium transition-colors duration-200'
      : 'px-3 py-2 text-sm transition-colors duration-200';

    const activeStyles = isActive
      ? 'text-blue-600'
      : 'text-black hover:text-blue-600';

    if (hasChildren) {
      const isSubmenuOpen = openSubmenuId === item.id;

      return (
        <li key={item.id} className="relative group">
          <div className="flex items-center">
            <Link
              href={formatUrl(item.url || '#')}
              className={`${baseStyles} ${activeStyles} flex items-center gap-1 min-w-0 flex-1`}
              onClick={closeMobileMenu}
            >
              {item.label}
            </Link>
            <button
              type="button"
              className="lg:hidden p-2 -m-2 rounded hover:bg-gray-100 text-current"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSubmenu(item.id);
              }}
              aria-expanded={isSubmenuOpen}
              aria-label={isSubmenuOpen ? 'Cerrar submenú' : 'Abrir submenú'}
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isSubmenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <svg
              className="hidden lg:block w-4 h-4 flex-shrink-0 text-current pointer-events-none transition-transform duration-200 group-hover:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Submenú Desktop: solo ventana flotante en lg; en móvil no se muestra */}
          <ul
            className={`
              hidden lg:block absolute left-0 mt-1 w-56 bg-white 
              rounded-lg shadow-lg border border-gray-200
              opacity-0 invisible group-hover:opacity-100 group-hover:visible
              transition-all duration-200 z-50
              ${isTopLevel ? 'top-full' : 'top-0 left-full ml-1'}
            `}
          >
            {item.children!.map((child) => renderMenuItem(child, depth + 1))}
          </ul>

          {/* Submenú Mobile */}
          <ul
            id={`submenu-${item.id}`}
            className={`lg:hidden pl-4 mt-1 space-y-1 ${isSubmenuOpen ? 'block' : 'hidden'}`}
          >
            {item.children!.map((child) => renderMenuItem(child, depth + 1))}
          </ul>
        </li>
      );
    }

    return (
      <li key={item.id}>
        <Link
          href={formatUrl(item.url || '#')}
          className={`${baseStyles} ${activeStyles} block`}
          onClick={closeMobileMenu}
        >
          {item.label}
          {isActive && (
            <span className="ml-2 w-1.5 h-1.5 bg-blue-600 rounded-full inline-block" />
          )}
        </Link>
      </li>
    );
  };

  if (isLoading) {
    return (
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="hidden md:flex space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-6 w-20 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  if (menuItems.length === 0) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo: desde WordPress Media (logoUrl) o texto por defecto */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="block">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={logoAlt}
                  width={160}
                  height={48}
                  className="h-16 w-auto object-contain object-left"
                  priority
                />
              ) : (
                <span className="text-xl font-bold text-black hover:text-blue-600 transition-colors">
                  Logo
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex lg:items-center lg:space-x-1">
            {menuItems.map((item) => renderMenuItem(item))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-black hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200">
            <ul className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => renderMenuItem(item))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

