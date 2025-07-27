import React, { forwardRef } from 'react';
import styles from './IconMediaLink.module.css';

export interface IconMediaLinkProps {
  /** URL del icono */
  icon: string;
  /** Nombre que se muestra debajo del icono */
  name: string;
  /** URL de destino */
  url: string;
  /** Texto alternativo para accesibilidad */
  altText: string;
  /** SVG del icono como string */
  iconSvg?: string;
  /** Tamaño del componente */
  size?: 'small' | 'medium' | 'large';
  /** Variante del estilo */
  variant?: 'filled' | 'outlined' | 'ghost';
  /** Forma del icono */
  shape?: 'square' | 'circle';
  /** Si se muestra el nombre */
  showName?: boolean;
  /** Si el enlace se abre en nueva pestaña */
  target?: '_blank' | '_self' | '_parent' | '_top';
  /** Relación del enlace */
  rel?: string;
  /** Función ejecutada al hacer click */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  /** Si el componente está deshabilitado */
  disabled?: boolean;
  /** Clases CSS adicionales */
  className?: string;
  /** ID del elemento */
  id?: string;
}

export const IconMediaLink = forwardRef<HTMLAnchorElement, IconMediaLinkProps>(({
  icon,
  name,
  url,
  altText,
  iconSvg,
  size = 'medium',
  variant = 'ghost',
  shape = 'square',
  showName = true,
  target = '_blank',
  rel = 'noopener noreferrer',
  onClick,
  disabled = false,
  className = '',
  id,
  ...props
}, ref) => {
  const getIconSrc = () => {
    if (iconSvg) {
      return `data:image/svg+xml;base64,${btoa(iconSvg)}`;
    }
    return icon;
  };

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  if (disabled) {
    return (
      <div 
        className={`
          ${styles.iconMediaLink} 
          ${styles[size]} 
          ${styles[variant]} 
          ${styles[shape]}
          ${styles.disabled}
          ${className}
        `}
        id={id}
      >
        <div className={styles.iconContainer}>
          <img 
            src={getIconSrc()} 
            alt={altText}
            className={styles.icon}
          />
        </div>
        {showName && (
          <span className={styles.name}>{name}</span>
        )}
      </div>
    );
  }

  return (
    <a
      ref={ref}
      href={url}
      target={target}
      rel={target === '_blank' ? rel : undefined}
      onClick={handleClick}
      className={`
        ${styles.iconMediaLink} 
        ${styles[size]} 
        ${styles[variant]} 
        ${styles[shape]}
        ${className}
      `}
      aria-label={altText}
      id={id}
      {...props}
    >
      <div className={styles.iconContainer}>
        <img 
          src={getIconSrc()} 
          alt={altText}
          className={styles.icon}
        />
      </div>
      {showName && (
        <span className={styles.name}>{name}</span>
      )}
    </a>
  );
});

IconMediaLink.displayName = 'IconMediaLink';
