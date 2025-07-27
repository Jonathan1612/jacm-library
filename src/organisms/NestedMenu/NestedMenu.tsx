import React, { useState, forwardRef } from 'react';
import MenuItem from '../../interfaces/menuItem';
import styles from './NestedMenu.module.css';

interface NestedMenuItemProps {
  item: MenuItem;
  level?: number;
  onItemClick?: (item: MenuItem) => void;
  disabled?: boolean;
}

const NestedMenuItem: React.FC<NestedMenuItemProps> = ({ 
  item, 
  level = 0, 
  onItemClick,
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleMouseEnter = () => {
    if (hasChildren && !disabled) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (hasChildren && !disabled) {
      setIsOpen(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else {
      onItemClick?.(item);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (hasChildren) {
          setIsOpen(!isOpen);
        } else {
          onItemClick?.(item);
        }
        break;
      case 'ArrowRight':
        if (hasChildren) {
          e.preventDefault();
          setIsOpen(true);
        }
        break;
      case 'ArrowLeft':
        if (hasChildren && isOpen) {
          e.preventDefault();
          setIsOpen(false);
        }
        break;
      case 'Escape':
        if (isOpen) {
          e.preventDefault();
          setIsOpen(false);
        }
        break;
    }
  };

  const getLevelClass = (level: number) => `level${level}`;
  const getSubmenuLevelClass = (level: number) => `submenuLevel${level}`;

  return (
    <li 
      className={`${styles.menuItem} ${styles[getLevelClass(level)]} ${disabled ? styles.disabled : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {hasChildren ? (
        <button 
          className={`${styles.menuItemLabel} ${styles.expandable} ${isOpen ? styles.expanded : ''}`}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label={`${item.label} (tiene submenú)`}
        >
          <span className={styles.labelText}>{item.label}</span>
          <span className={styles.indicator}>
            {isOpen ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            )}
          </span>
        </button>
      ) : (
        <a 
          href={item.url} 
          className={`${styles.menuItemLabel} ${styles.link}`}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
        >
          <span className={styles.labelText}>{item.label}</span>
        </a>
      )}

      {hasChildren && isOpen && (
        <div className={`${styles.submenuContainer} ${styles[getSubmenuLevelClass(level)]}`}>
          <ul className={styles.submenu} aria-label={`Submenú de ${item.label}`}>
            {item.children?.map((child) => (
              <NestedMenuItem 
                key={`${child.label}-${child.url || 'no-url'}`}
                item={child} 
                level={level + 1}
                onItemClick={onItemClick}
                disabled={disabled}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export interface NestedMenuProps {
  /** Elementos del menú */
  items: MenuItem[];
  /** Función ejecutada al hacer click en un item */
  onItemClick?: (item: MenuItem) => void;
  /** Si el menú está deshabilitado */
  disabled?: boolean;
  /** Orientación del menú */
  orientation?: 'horizontal' | 'vertical';
  /** Variante del estilo */
  variant?: 'default' | 'sidebar' | 'dropdown';
  /** Modo de activación de submenús */
  trigger?: 'hover' | 'click';
  /** Posición de los submenús */
  submenuPosition?: 'right' | 'left' | 'bottom';
  /** Si se permite múltiples submenús abiertos */
  allowMultiple?: boolean;
  /** Clases CSS adicionales */
  className?: string;
  /** ID del elemento */
  id?: string;
  /** Aria label para accesibilidad */
  ariaLabel?: string;
}

export const NestedMenu = forwardRef<HTMLElement, NestedMenuProps>(({
  items,
  onItemClick,
  disabled = false,
  orientation = 'vertical',
  variant = 'default',
  trigger = 'hover', // Por ahora mantenemos hover como estaba originalmente
  submenuPosition = 'right',
  allowMultiple = false,
  className = '',
  id,
  ariaLabel,
  ...props
}, ref) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav 
      ref={ref}
      className={`
        ${styles.nestedMenu} 
        ${styles[orientation]} 
        ${styles[variant]}
        ${styles[`submenu${submenuPosition.charAt(0).toUpperCase() + submenuPosition.slice(1)}`]}
        ${disabled ? styles.disabled : ''}
        ${className}
      `}
      id={id}
      aria-label={ariaLabel || 'Menú de navegación'}
      {...props}
    >
      <ul className={styles.menu}>
        {items.map((item) => (
          <NestedMenuItem 
            key={`${item.label}-${item.url || 'root'}`}
            item={item} 
            level={0}
            onItemClick={onItemClick}
            disabled={disabled}
          />
        ))}
      </ul>
    </nav>
  );
});

NestedMenu.displayName = 'NestedMenu';
