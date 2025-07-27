import React, { forwardRef } from 'react';
import { BaseComponentProps, ComponentVariant } from '../../types/common';
import { cn } from '../../utils/classNames';
import styles from './Card.module.css';

export interface CardProps extends BaseComponentProps {
  /** Contenido del card */
  children: React.ReactNode;
  /** Variante visual */
  variant?: ComponentVariant | 'outlined' | 'elevated' | 'filled';
  /** Si el card es clickeable */
  clickable?: boolean;
  /** Callback al hacer click */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Si está deshabilitado */
  disabled?: boolean;
  /** Si tiene hover effect */
  hoverable?: boolean;
  /** Padding del card */
  padding?: 'none' | 'small' | 'medium' | 'large';
  /** Radio de borde */
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
  /** Sombra */
  shadow?: 'none' | 'small' | 'medium' | 'large';
}

export interface CardHeaderProps extends BaseComponentProps {
  /** Contenido del header */
  children: React.ReactNode;
  /** Avatar o imagen */
  avatar?: React.ReactNode;
  /** Título */
  title?: React.ReactNode;
  /** Subtítulo */
  subtitle?: React.ReactNode;
  /** Acciones del header */
  action?: React.ReactNode;
}

export interface CardContentProps extends BaseComponentProps {
  /** Contenido */
  children: React.ReactNode;
}

export interface CardActionsProps extends BaseComponentProps {
  /** Acciones */
  children: React.ReactNode;
  /** Alineación de las acciones */
  align?: 'left' | 'center' | 'right' | 'space-between';
}

export interface CardMediaProps extends BaseComponentProps {
  /** URL de la imagen */
  src: string;
  /** Texto alternativo */
  alt?: string;
  /** Altura de la imagen */
  height?: number | string;
  /** Si la imagen es clickeable */
  clickable?: boolean;
  /** Callback al hacer click */
  onClick?: (event: React.MouseEvent<HTMLImageElement>) => void;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  variant = 'outlined',
  clickable = false,
  onClick,
  disabled = false,
  hoverable = true,
  padding = 'medium',
  borderRadius = 'medium',
  shadow = 'small',
  className,
  style,
  ...props
}, ref) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onClick?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (clickable && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick?.(event as any);
    }
  };

  const cardClasses = cn(
    styles.card,
    styles[variant],
    styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
    styles[`radius${borderRadius.charAt(0).toUpperCase() + borderRadius.slice(1)}`],
    styles[`shadow${shadow.charAt(0).toUpperCase() + shadow.slice(1)}`],
    clickable && styles.clickable,
    disabled && styles.disabled,
    hoverable && !disabled && styles.hoverable,
    className
  );

  return (
    <div
      ref={ref}
      className={cardClasses}
      style={style}
      onClick={clickable ? handleClick : undefined}
      onKeyDown={clickable ? handleKeyDown : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable && !disabled ? 0 : undefined}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({
  children,
  avatar,
  title,
  subtitle,
  action,
  className,
  style,
  ...props
}, ref) => {
  const hasContent = avatar || title || subtitle || action;
  
  if (!hasContent && !children) return null;

  return (
    <div
      ref={ref}
      className={cn(styles.header, className)}
      style={style}
      {...props}
    >
      {avatar && (
        <div className={styles.avatar}>
          {avatar}
        </div>
      )}
      
      {(title || subtitle) && (
        <div className={styles.headerContent}>
          {title && (
            <div className={styles.title}>
              {title}
            </div>
          )}
          {subtitle && (
            <div className={styles.subtitle}>
              {subtitle}
            </div>
          )}
        </div>
      )}
      
      {action && (
        <div className={styles.action}>
          {action}
        </div>
      )}
      
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({
  children,
  className,
  style,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn(styles.content, className)}
    style={style}
    {...props}
  >
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

export const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(({
  children,
  align = 'right',
  className,
  style,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn(styles.actions, styles[`align${align.charAt(0).toUpperCase() + align.slice(1)}`], className)}
    style={style}
    {...props}
  >
    {children}
  </div>
));

CardActions.displayName = 'CardActions';

export const CardMedia = forwardRef<HTMLImageElement, CardMediaProps>(({
  src,
  alt = '',
  height = 200,
  clickable = false,
  onClick,
  className,
  style,
  ...props
}, ref) => {
  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (clickable) {
      onClick?.(event);
    }
  };

  const mediaStyle = {
    ...style,
    height: typeof height === 'number' ? `${height}px` : height
  };

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={cn(styles.media, clickable && styles.clickableMedia, className)}
      style={mediaStyle}
      onClick={handleClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...props}
    />
  );
});

CardMedia.displayName = 'CardMedia';
