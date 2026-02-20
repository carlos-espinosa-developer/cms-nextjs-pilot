'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getMenu, buildMenuHierarchy, type MenuItemWithChildren } from '@/lib/wp-api';

interface NavbarProps {
  menuLocation?: 'PRIMARY' | 'FOOTER';
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
export function Navbar({ menuLocation = 'PRIMARY' }: NavbarProps) {
  const [menuItems, setMenuItems] = useState<MenuItemWithChildren[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  };

  const isActiveLink = (url: string) => {
    if (!url) return false;
    try {
      const urlPath = new URL(url).pathname;
      return pathname === urlPath || pathname.startsWith(urlPath + '/');
    } catch {
      return pathname === url;
    }
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
      ? 'text-blue-600 dark:text-blue-400'
      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400';

    if (hasChildren) {
      return (
        <li key={item.id} className="relative group">
          <button
            className={`${baseStyles} ${activeStyles} flex items-center gap-1 w-full`}
            onClick={() => {
              // En móvil, toggle del submenú
              if (window.innerWidth < 1024) {
                const submenu = document.getElementById(`submenu-${item.id}`);
                if (submenu) {
                  submenu.classList.toggle('hidden');
                }
              }
            }}
          >
            <span>{item.label}</span>
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
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

          {/* Submenú Desktop */}
          <ul
            className={`
              absolute left-0 mt-1 w-56 bg-white dark:bg-gray-800 
              rounded-lg shadow-lg border border-gray-200 dark:border-gray-700
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
            className="hidden lg:hidden pl-4 mt-1 space-y-1"
          >
            {item.children!.map((child) => renderMenuItem(child, depth + 1))}
          </ul>
        </li>
      );
    }

    return (
      <li key={item.id}>
        <Link
          href={item.url || '#'}
          className={`${baseStyles} ${activeStyles} block`}
          onClick={closeMobileMenu}
        >
          {item.label}
          {isActive && (
            <span className="ml-2 w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full inline-block" />
          )}
        </Link>
      </li>
    );
  };

  if (isLoading) {
    return (
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="hidden md:flex space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
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
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Logo
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex lg:items-center lg:space-x-1">
            {menuItems.map((item) => renderMenuItem(item))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-800">
            <ul className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => renderMenuItem(item))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

