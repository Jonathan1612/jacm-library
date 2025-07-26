import React, { useEffect, useState, useRef } from 'react'
import styles from './IconCounter.module.css';
import cart from './cart.svg';
import cartDark from './cartDark.svg';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface IconCounterProps {
    count?: number;
    icon?: string;
    iconDark?: string;
    items?: CartItem[];
    onRemoveItem?: (itemId: string) => void;
    onUpdateQuantity?: (itemId: string, quantity: number) => void;
    onClearCart?: () => void;
    showMenu?: boolean;
}

const IconCounter = ({ 
  count, 
  icon = cart, 
  iconDark = cartDark, 
  items = [], 
  onRemoveItem, 
  onUpdateQuantity, 
  onClearCart,
  showMenu = false 
}: IconCounterProps) => {
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
    if (showMenu && items.length > 0) {
      setIsMenuOpen(!isMenuOpen);
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

  return (
    <div className={styles.containerIconCounter} ref={menuRef}>
      <button 
        className={`${styles.iconWrapper} ${showMenu && items.length > 0 ? styles.clickable : ''}`}
        onClick={handleIconClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleIconClick();
          }
        }}
        aria-label={`Carrito de compras con ${count || 0} productos`}
        disabled={!showMenu || items.length === 0}
        type="button"
      >
        <img alt="icon" src={isDark ? icon : iconDark} className={styles.icon}/>
        {count !== undefined && <span className={styles.count}>{count}</span>}
      </button>

      {/* Menú desplegable del carrito */}
      {showMenu && isMenuOpen && items.length > 0 && (
        <div className={styles.cartMenu}>
          <div className={styles.cartHeader}>
            <h3>Carrito de Compras</h3>
            <button 
              className={styles.closeButton}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Cerrar carrito"
            >
              ×
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
                  >
                    -
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button 
                    className={styles.quantityButton}
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                  <button 
                    className={styles.removeButton}
                    onClick={() => onRemoveItem?.(item.id)}
                    aria-label="Eliminar producto"
                  >
                    🗑️
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
              >
                Limpiar Carrito
              </button>
              <button 
                className={styles.checkoutButton}
                onClick={() => setIsMenuOpen(false)}
              >
                Proceder al Pago
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje cuando el carrito está vacío */}
      {showMenu && isMenuOpen && items.length === 0 && (
        <div className={styles.emptyCart}>
          <p>Tu carrito está vacío</p>
        </div>
      )}
    </div>
  )
}

export default IconCounter
