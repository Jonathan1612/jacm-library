import React, { forwardRef } from 'react';
import { BaseComponentProps } from '../../types/common';
import { Button } from '../../atoms/Button/Button';
import { Avatar } from '../../atoms/Avatar/Avatar';
import { cn } from '../../utils/classNames';
import styles from './NavigationBar.module.css';

export interface NavigationItem {
  /** Texto del enlace */
  label: string;
  /** URL del enlace */
  href: string;
  /** Si está activo */
  active?: boolean;
  /** Si está deshabilitado */
  disabled?: boolean;
  /** Icono del enlace */
  icon?: React.ReactNode;
  /** Callback al hacer clic */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface NavigationBarProps extends BaseComponentProps {
  /** Título o logo de la aplicación */
  title?: React.ReactNode;
  /** URL del título/logo */
  titleHref?: string;
  /** Elementos de navegación */
  navigationItems?: NavigationItem[];
  /** Avatar del usuario */
  avatar?: {
    src?: string;
    alt?: string;
    name?: string;
    size?: 'small' | 'medium' | 'large';
  };
  /** Contenido del lado derecho */
  rightContent?: React.ReactNode;
  /** Si debe tener sombra */
  shadow?: boolean;
  /** Variante de color */
  variant?: 'light' | 'dark' | 'transparent';
  /** Si es fijo en la parte superior */
  fixed?: boolean;
  /** Si debe mostrar el botón de menú móvil */
  showMobileMenu?: boolean;
  /** Callback del menú móvil */
  onMobileMenuToggle?: () => void;
  /** Si el menú móvil está abierto */
  mobileMenuOpen?: boolean;
  /** Tamaño del navbar */
  size?: 'small' | 'medium' | 'large';
}

export const NavigationBar = forwardRef<HTMLElement, NavigationBarProps>(({
  title,
  titleHref = "/",
  navigationItems = [],
  avatar,
  rightContent,
  shadow = true,
  variant = 'light',
  fixed = false,
  showMobileMenu = true,
  onMobileMenuToggle,
  mobileMenuOpen = false,
  size = 'medium',
  className,
  style,
  ...props
}, ref) => {
  const handleLinkClick = (item: NavigationItem, event: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    item.onClick?.(event);
  };

  const containerClasses = cn(
    styles.navbar,
    styles[variant],
    styles[size],
    shadow && styles.shadow,
    fixed && styles.fixed,
    mobileMenuOpen && styles.mobileMenuOpen,
    className
  );

  const titleElement = typeof title === 'string' ? (
    <span className={styles.titleText}>{title}</span>
  ) : title;

  return (
    <nav ref={ref} className={containerClasses} style={style} {...props}>
      <div className={styles.container}>
        {/* Logo/Title Section */}
        <div className={styles.brand}>
          {avatar && (
                      <Avatar
            src={avatar.src}
            alt={avatar.alt}
            name={avatar.name}
            size={avatar.size || size}
            className={styles.avatar}
          />
          )}
          
          {title && (
            <a 
              href={titleHref} 
              className={styles.title}
              aria-label="Ir al inicio"
            >
              {titleElement}
            </a>
          )}
        </div>

        {/* Navigation Links */}
        {navigationItems.length > 0 && (
          <ul className={styles.navigation} role="menubar">
            {navigationItems.map((item, index) => (
              <li key={item.href || index} className={styles.navigationItem} role="none">
                <a
                  href={item.href}
                  onClick={(e) => handleLinkClick(item, e)}
                  className={cn(
                    styles.navigationLink,
                    item.active && styles.active,
                    item.disabled && styles.disabled
                  )}
                  role="menuitem"
                  aria-current={item.active ? 'page' : undefined}
                  aria-disabled={item.disabled}
                  tabIndex={item.disabled ? -1 : 0}
                >
                  {item.icon && (
                    <span className={styles.linkIcon} aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  <span className={styles.linkText}>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Right Content */}
        {rightContent && (
          <div className={styles.rightContent}>
            {rightContent}
          </div>
        )}

        {/* Mobile Menu Button */}
        {showMobileMenu && (
          <Button
            variant="secondary"
            size={size}
            onClick={onMobileMenuToggle}
            className={styles.mobileMenuButton}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <svg
              className={styles.menuIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </Button>
        )}
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && navigationItems.length > 0 && (
        <div 
          id="mobile-navigation"
          className={cn(
            styles.mobileNavigation,
            mobileMenuOpen && styles.mobileNavigationOpen
          )}
        >
                  <nav className={styles.mobileMenu} id="mobile-navigation">
          {navigationItems?.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                styles.mobileMenuItem,
                item.active && styles.active,
                item.disabled && styles.disabled
              )}
              onClick={(e) => handleLinkClick(item, e)}
              aria-disabled={item.disabled}
            >
              {item.icon && <span className={styles.menuIcon}>{item.icon}</span>}
              {item.label}
            </a>
          ))}
        </nav>
        </div>
      )}
    </nav>
  );
});

NavigationBar.displayName = 'NavigationBar';
