'use client';
import React, { useState } from 'react';
import MenuItem from '../../interfaces/menuItem';
import styles from './NestedMenuItem.module.css';

interface NestedMenuItemProps {
  item: MenuItem;
}

const NestedMenuItem: React.FC<NestedMenuItemProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  // Manejamos el hover para abrir/cerrar submenú
  const handleMouseEnter = () => {
    if (hasChildren) setIsOpen(true);
  };
  const handleMouseLeave = () => {
    if (hasChildren) setIsOpen(false);
  };

  return (
    <li 
      className={styles.menuItem} 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.menuItemLabel}>
        {/* Si tiene hijos, mostramos un indicador (por ejemplo, ▶, ▼, etc.) */}
        {hasChildren ? (
          <span className={styles.labelWithChildren}>
            {item.label} {isOpen ? '▼' : '▶'}
          </span>
        ) : (
          <a href={item.url} className={styles.link}>
            {item.label}
          </a>
        )}
      </div>

      {/* Submenú visible al hover (isOpen) */}
      {hasChildren && isOpen && (
        <div className={styles.submenuContainer}>
          <ul className={styles.submenu}>
            {item.children?.map((child, index) => (
              <NestedMenuItem key={index} item={child} />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default NestedMenuItem;
