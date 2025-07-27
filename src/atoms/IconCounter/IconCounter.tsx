import React, { useEffect, useState, useRef, forwardRef } from 'react';
import styles from './IconCounter.module.css';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IconCounterProps {
  /** Número que se muestra en el contador */
  count?: number;
  /** URL del icono para modo claro */
  icon?: string;
  /** URL del icono para modo oscuro */
  iconDark?: string;
  /** SVG del icono como string */
  iconSvg?: string;
  /** Elementos del carrito (si aplica) */
  items?: CartItem[];
  /** Función ejecutada al remover un item */
  onRemoveItem?: (itemId: string) => void;
  /** Función ejecutada al actualizar cantidad */
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  /** Función ejecutada al limpiar carrito */
  onClearCart?: () => void;
  /** Función ejecutada al hacer click en el icono */
  onClick?: () => void;
  /** Si se muestra el menú desplegable */
  showMenu?: boolean;
  /** Si el componente está deshabilitado */
  disabled?: boolean;
  /** Posición del menú */
  menuPosition?: 'left' | 'right' | 'center';
  /** Tamaño del componente */
  size?: 'small' | 'medium' | 'large';
  /** Variante del estilo */
  variant?: 'filled' | 'outlined' | 'ghost';
  /** Clases CSS adicionales */
  className?: string;
  /** ID del elemento */
  id?: string;
  /** Aria label para accesibilidad */
  ariaLabel?: string;
}

export const IconCounter = forwardRef<HTMLButtonElement, IconCounterProps>(({
  count,
  icon,
  iconDark,
  iconSvg,
  items = [],
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  onClick,
  showMenu = false,
  disabled = false,
  menuPosition = 'right',
  size = 'medium',
  variant = 'ghost',
  className = '',
  id,
  ariaLabel,
  ...props
}, ref) => {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkDark = () => document.documentElement.classList.contains('dark');
    setIsDark(checkDark());
    const observer = new MutationObserver(() => setIsDark(checkDark()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect(); 
  }, []);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleIconClick = () => {
    if (disabled) return;
    
    if (showMenu && items.length > 0) {
      setIsMenuOpen(!isMenuOpen);
    }
    
    onClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleIconClick();
    }
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveItem?.(itemId);
    } else {
      onUpdateQuantity?.(itemId, newQuantity);
    }
  };

  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const getIconSrc = () => {
    if (iconSvg) return `data:image/svg+xml;base64,${btoa(iconSvg)}`;
    if (isDark && iconDark) return iconDark;
    if (icon) return icon;
    
    // Default cart icon SVG
    const defaultIcon = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(defaultIcon)}`;
  };

  const renderCartMenu = () => {
    if (!showMenu || !isMenuOpen) return null;

    if (items.length === 0) {
      return (
        <div className={`${styles.cartMenu} ${styles[menuPosition]}`}>
          <div className={styles.emptyCart}>
            <p>Tu carrito está vacío</p>
          </div>
        </div>
      );
    }

    return (
      <div className={`${styles.cartMenu} ${styles[menuPosition]}`}>
        <div className={styles.cartHeader}>
          <h3>Carrito de Compras</h3>
          <button 
            className={styles.closeButton}
            onClick={() => setIsMenuOpen(false)}
            aria-label="Cerrar carrito"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
            </svg>
          </button>
        </div>
        
        <div className={styles.cartItems}>
          {items.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className={styles.itemImage}
                />
              )}
              <div className={styles.itemDetails}>
                <h4 className={styles.itemName}>{item.name}</h4>
                <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
              </div>
              <div className={styles.itemControls}>
                <button 
                  className={styles.quantityButton}
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  aria-label="Disminuir cantidad"
                  type="button"
                >
                  -
                </button>
                <span className={styles.quantity}>{item.quantity}</span>
                <button 
                  className={styles.quantityButton}
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  aria-label="Aumentar cantidad"
                  type="button"
                >
                  +
                </button>
                <button 
                  className={styles.removeButton}
                  onClick={() => onRemoveItem?.(item.id)}
                  aria-label="Eliminar producto"
                  type="button"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5zM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53zm5.058 0a.5.5 0 0 1 .47.53L11 13.03a.5.5 0 0 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47zM8 4.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.cartFooter}>
          <div className={styles.totalPrice}>
            <strong>Total: ${totalPrice.toFixed(2)}</strong>
          </div>
          <div className={styles.cartActions}>
            <button 
              className={styles.clearButton}
              onClick={() => {
                onClearCart?.();
                setIsMenuOpen(false);
              }}
              type="button"
            >
              Limpiar Carrito
            </button>
            <button 
              className={styles.checkoutButton}
              onClick={() => setIsMenuOpen(false)}
              type="button"
            >
              Proceder al Pago
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`${styles.iconCounter} ${styles[size]} ${styles[variant]} ${className}`} 
      ref={menuRef}
    >
      <button 
        ref={ref}
        className={`${styles.iconButton} ${showMenu && items.length > 0 ? styles.clickable : ''}`}
        onClick={handleIconClick}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel || `Contador con ${count || 0} elementos`}
        disabled={disabled || (!showMenu && !onClick)}
        type="button"
        id={id}
        {...props}
      >
        <img 
          alt="icon" 
          src={getIconSrc()} 
          className={styles.icon}
        />
        {count !== undefined && count > 0 && (
          <span className={styles.count}>{count > 99 ? '99+' : count}</span>
        )}
      </button>

      {renderCartMenu()}
    </div>
  );
});

IconCounter.displayName = 'IconCounter';
