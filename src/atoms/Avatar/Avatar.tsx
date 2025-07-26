import React, { forwardRef, useState } from 'react';
import { BaseComponentProps, ComponentSize } from '../../types';
import { cn } from '../../utils';
import styles from './Avatar.module.css';

export interface AvatarProps extends BaseComponentProps {
  /** URL de la imagen del avatar */
  src?: string;
  /** Texto alternativo para la imagen */
  alt?: string;
  /** Tamaño del avatar */
  size?: ComponentSize | number;
  /** Nombre para generar iniciales si no hay imagen */
  name?: string;
  /** Forma del avatar */
  shape?: 'circle' | 'square' | 'rounded';
  /** Color de fondo para las iniciales */
  backgroundColor?: string;
  /** Color del texto de las iniciales */
  textColor?: string;
  /** Función callback cuando falla la carga de la imagen */
  onError?: () => void;
  /** Función callback cuando se hace clic */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Si el avatar es clickeable */
  clickable?: boolean;
  /** Estado de carga */
  loading?: boolean;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({
    src,
    alt,
    size = 'medium',
    name,
    shape = 'circle',
    backgroundColor,
    textColor,
    className,
    style,
    onError,
    onClick,
    clickable = false,
    loading = false,
    id,
    'data-testid': dataTestId,
    ...rest
  }, ref) => {
    const [imageError, setImageError] = useState(false);

    const getInitials = () => {
      if (!name) return '';
      const nameParts = name.trim().split(' ').filter(Boolean);
      if (nameParts.length === 0) return '';
      
      if (nameParts.length === 1) {
        return nameParts[0].charAt(0).toUpperCase();
      }
      
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    };

    const sizeClass = typeof size === 'number' ? '' : size;
    const sizeStyle = typeof size === 'number' 
      ? { width: `${size}px`, height: `${size}px`, fontSize: `${size * 0.4}px` }
      : {};

    const avatarClasses = cn(
      styles.avatar,
      sizeClass && styles[sizeClass],
      styles[shape],
      clickable && styles.clickable,
      loading && styles.loading,
      className
    );

    const avatarStyle = {
      ...sizeStyle,
      backgroundColor: backgroundColor && !src && !imageError ? backgroundColor : undefined,
      color: textColor && !src && !imageError ? textColor : undefined,
      ...style,
    };

    const handleImageError = () => {
      setImageError(true);
      onError?.();
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      if (clickable && onClick) {
        onClick(event as React.MouseEvent<HTMLDivElement>);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
      if (clickable && onClick && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        onClick(event as any);
      }
    };

    const showImage = src && !imageError;
    const showInitials = !showImage && name;
    const showFallback = !showImage && !showInitials;

    const Component = clickable ? 'button' : 'div';
    const componentProps = clickable ? {
      type: 'button' as const,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
    } : {};

    return (
      <Component
        ref={ref as any}
        id={id}
        className={avatarClasses}
        style={avatarStyle}
        aria-label={alt || (name ? `Avatar de ${name}` : 'Avatar')}
        data-testid={dataTestId}
        {...componentProps}
        {...rest}
      >
        {loading && <div className={styles.spinner} />}
        
        {!loading && showImage && (
          <img
            src={src}
            alt={alt || (name ? `Avatar de ${name}` : 'Avatar')}
            className={styles.image}
            onError={handleImageError}
          />
        )}
        
        {!loading && showInitials && (
          <span className={styles.initials} aria-hidden="true">
            {getInitials()}
          </span>
        )}
        
        {!loading && showFallback && (
          <div className={styles.fallback} aria-hidden="true">
            <svg
              width="60%"
              height="60%"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        )}
      </Component>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;
