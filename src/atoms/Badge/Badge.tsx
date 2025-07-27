import React, { forwardRef } from 'react';
import { BaseComponentProps, ComponentVariant, ComponentSize } from '../../types/common';
import { cn } from '../../utils/classNames';
import styles from './Badge.module.css';

export interface BadgeProps extends BaseComponentProps {
  /** Contenido del badge */
  children?: React.ReactNode;
  /** Valor numérico del badge */
  count?: number;
  /** Valor máximo a mostrar (ej: 99+) */
  max?: number;
  /** Si mostrar el badge cuando count es 0 */
  showZero?: boolean;
  /** Variante del badge */
  variant?: ComponentVariant;
  /** Tamaño del badge */
  size?: ComponentSize;
  /** Si el badge es solo un punto */
  dot?: boolean;
  /** Texto personalizado */
  text?: string;
  /** Posición del badge */
  placement?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /** Offset horizontal */
  offsetX?: number;
  /** Offset vertical */
  offsetY?: number;
  /** Si el badge está standalone (no sobre un elemento) */
  standalone?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(({
  children,
  count,
  max = 99,
  showZero = false,
  variant = 'primary',
  size = 'medium',
  dot = false,
  text,
  placement = 'top-right',
  offsetX = 0,
  offsetY = 0,
  standalone = false,
  className,
  style,
  ...props
}, ref) => {
  // Determinar el contenido del badge
  const getBadgeContent = () => {
    if (dot) return null;
    if (text) return text;
    if (count !== undefined) {
      if (count === 0 && !showZero) return null;
      return count > max ? `${max}+` : count;
    }
    return null;
  };

  const badgeContent = getBadgeContent();
  const shouldShow = dot || badgeContent !== null;

  if (!shouldShow && !children) return null;

  const badgeClasses = cn(
    styles.badge,
    styles[variant],
    styles[size],
    dot && styles.dot,
    standalone && styles.standalone,
    !standalone && styles[placement],
    className
  );

  const badgeStyle = {
    ...style,
    ...(offsetX !== 0 && { transform: `translateX(${offsetX}px) translateY(${offsetY}px)` }),
    ...(offsetY !== 0 && !offsetX && { transform: `translateY(${offsetY}px)` })
  };

  // Si es standalone, solo retorna el badge
  if (standalone) {
    return (
      <span
        ref={ref}
        className={badgeClasses}
        style={badgeStyle}
        {...props}
      >
        {badgeContent}
      </span>
    );
  }

  // Si tiene children, envuelve el elemento con el badge
  if (children) {
    return (
      <div className={styles.wrapper}>
        {children}
        {shouldShow && (
          <span
            ref={ref}
            className={badgeClasses}
            style={badgeStyle}
            {...props}
          >
            {badgeContent}
          </span>
        )}
      </div>
    );
  }

  // Solo badge sin children
  return (
    <span
      ref={ref}
      className={badgeClasses}
      style={badgeStyle}
      {...props}
    >
      {badgeContent}
    </span>
  );
});

Badge.displayName = 'Badge';
