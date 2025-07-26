import React, { forwardRef, useState } from 'react';
import { BaseComponentProps } from '../../types/common';
import { Button } from '../../atoms/Button/Button';
import { Avatar } from '../../atoms/Avatar/Avatar';
import { cn } from '../../utils/classNames';
import styles from './Sidebar.module.css';

export interface SidebarItem {
  /** ID único del elemento */
  id: string;
  /** Texto del elemento */
  label: string;
  /** Icono del elemento */
  icon?: React.ReactNode;
  /** URL del enlace */
  href?: string;
  /** Si está activo */
  active?: boolean;
  /** Si está deshabilitado */
  disabled?: boolean;
  /** Badge o contador */
  badge?: string | number;
  /** Sub-elementos */
  children?: SidebarItem[];
  /** Callback al hacer clic */
  onClick?: (item: SidebarItem, event: React.MouseEvent) => void;
}

export interface SidebarProps extends BaseComponentProps {
  /** Título del sidebar */
  title?: React.ReactNode;
  /** Logo o elemento superior */
  logo?: React.ReactNode;
  /** Información del usuario */
  user?: {
    avatar?: {
      src?: string;
      alt?: string;
      name?: string;
      size?: 'small' | 'medium' | 'large';
    };
    name?: string;
    email?: string;
    role?: string;
  };
  /** Elementos del menú */
  items?: SidebarItem[];
  /** Si está colapsado */
  collapsed?: boolean;
  /** Callback al cambiar estado de colapso */
  onToggleCollapse?: (collapsed: boolean) => void;
  /** Si se puede colapsar */
  collapsible?: boolean;
  /** Posición del sidebar */
  position?: 'left' | 'right';
  /** Variante de color */
  variant?: 'light' | 'dark' | 'bordered';
  /** Ancho del sidebar */
  width?: 'narrow' | 'medium' | 'wide';
  /** Si tiene sombra */
  shadow?: boolean;
  /** Si es overlay en móvil */
  overlay?: boolean;
  /** Si el overlay está visible */
  overlayVisible?: boolean;
  /** Callback al cerrar overlay */
  onOverlayClose?: () => void;
  /** Contenido del footer */
  footer?: React.ReactNode;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(({
  title,
  logo,
  user,
  items = [],
  collapsed = false,
  onToggleCollapse,
  collapsible = true,
  position = 'left',
  variant = 'light',
  width = 'medium',
  shadow = true,
  overlay = false,
  overlayVisible = false,
  onOverlayClose,
  footer,
  className,
  style,
  ...props
}, ref) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemClick = (item: SidebarItem, event: React.MouseEvent) => {
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    if (item.children && item.children.length > 0) {
      event.preventDefault();
      toggleExpanded(item.id);
    }

    item.onClick?.(item, event);
  };

  const renderItem = (item: SidebarItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const Element = item.href ? 'a' : 'button';

    return (
      <div key={item.id} className={styles.itemWrapper}>
        <Element
          className={cn(
            styles.item,
            styles[`level${level}`],
            item.active && styles.active,
            item.disabled && styles.disabled,
            hasChildren && styles.hasChildren
          )}
          href={item.href}
          onClick={(e: React.MouseEvent) => handleItemClick(item, e)}
          disabled={item.disabled}
          aria-expanded={hasChildren ? isExpanded : undefined}
          role={item.href ? undefined : 'button'}
        >
          <div className={styles.itemContent}>
            {item.icon && (
              <span className={styles.itemIcon}>
                {item.icon}
              </span>
            )}
            {(!collapsed || level > 0) && (
              <span className={styles.itemLabel}>
                {item.label}
              </span>
            )}
            {item.badge && (!collapsed || level > 0) && (
              <span className={styles.itemBadge}>
                {item.badge}
              </span>
            )}
          </div>
          {hasChildren && (!collapsed || level > 0) && (
            <span className={cn(
              styles.itemArrow,
              isExpanded && styles.expanded
            )}>
              ▼
            </span>
          )}
        </Element>
        {hasChildren && isExpanded && (!collapsed || level > 0) && (
          <div className={styles.subItems}>
            {item.children?.map((child) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const sidebarClasses = cn(
    styles.sidebar,
    styles[variant],
    styles[width],
    styles[position],
    collapsed && styles.collapsed,
    shadow && styles.shadow,
    overlay && styles.overlay,
    overlay && overlayVisible && styles.overlayVisible,
    className
  );

  return (
    <>
      {overlay && overlayVisible && (
        <div 
          className={styles.backdrop}
          onClick={onOverlayClose}
          aria-hidden="true"
        />
      )}
      <aside 
        ref={ref} 
        className={sidebarClasses} 
        style={style}
        {...props}
      >
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            {logo && (
              <div className={styles.logo}>
                {logo}
              </div>
            )}
            {title && !collapsed && (
              <div className={styles.title}>
                {typeof title === 'string' ? (
                  <h2 className={styles.titleText}>{title}</h2>
                ) : title}
              </div>
            )}
            {collapsible && (
              <Button
                variant="secondary"
                size="small"
                onClick={() => onToggleCollapse?.(!collapsed)}
                className={styles.collapseButton}
                aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
              >
                {collapsed ? '→' : '←'}
              </Button>
            )}
          </div>

          {/* User Info */}
          {user && (
            <div className={styles.userInfo}>
              {user.avatar && (
                <Avatar
                  src={user.avatar.src}
                  alt={user.avatar.alt}
                  name={user.avatar.name}
                  size={collapsed ? 'small' : user.avatar.size || 'medium'}
                />
              )}
              {!collapsed && (
                <div className={styles.userDetails}>
                  {user.name && (
                    <div className={styles.userName}>{user.name}</div>
                  )}
                  {user.email && (
                    <div className={styles.userEmail}>{user.email}</div>
                  )}
                  {user.role && (
                    <div className={styles.userRole}>{user.role}</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className={styles.navigation}>
            <ul className={styles.itemList}>
              {items.map((item) => (
                <li key={item.id}>
                  {renderItem(item)}
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          {footer && !collapsed && (
            <div className={styles.footer}>
              {footer}
            </div>
          )}
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';
