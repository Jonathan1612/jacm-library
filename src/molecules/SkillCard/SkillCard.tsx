import React, { forwardRef } from 'react';
import { BaseComponentProps, ComponentVariant, ComponentSize } from '../../types/common';
import { Card, CardContent } from '../../atoms/Card';
import { cn } from '../../utils/classNames';
import styles from './SkillCard.module.css';

export interface SkillCardProps extends BaseComponentProps {
  /** URL o ruta del icono */
  icon?: string;
  /** Elemento de icono personalizado */
  iconElement?: React.ReactNode;
  /** Nombre de la habilidad */
  name: string;
  /** Nivel de la habilidad (0-100) */
  level: number;
  /** Mostrar porcentaje */
  showPercentage?: boolean;
  /** Variante del card */
  variant?: ComponentVariant;
  /** Tamaño del card */
  size?: ComponentSize;
  /** Si el card es clickeable */
  clickable?: boolean;
  /** Callback al hacer click */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Color personalizado de la barra */
  barColor?: string;
  /** Descripción adicional */
  description?: string;
  /** Si mostrar la barra de progreso animada */
  animated?: boolean;
}

export const SkillCard = forwardRef<HTMLDivElement, SkillCardProps>(({
  icon,
  iconElement,
  name,
  level,
  showPercentage = true,
  variant = 'outlined',
  size = 'medium',
  clickable = false,
  onClick,
  barColor,
  description,
  animated = true,
  className,
  style,
  ...props
}, ref) => {
  // Asegurar que el nivel esté entre 0 y 100
  const clampedLevel = Math.max(0, Math.min(100, level));

  const cardClasses = cn(
    styles.skillCard,
    styles[size],
    animated && styles.animated,
    className
  );

  const barFillStyle = {
    width: `${clampedLevel}%`,
    ...(barColor && { backgroundColor: barColor })
  };

  return (
    <Card
      ref={ref}
      className={cardClasses}
      style={style}
      variant={variant as ComponentVariant | 'outlined' | 'elevated' | 'filled'}
      clickable={clickable}
      onClick={onClick}
      padding="medium"
      {...props}
    >
      <CardContent className={styles.content}>
        {/* Icon */}
        {(icon || iconElement) && (
          <div className={styles.iconContainer}>
            {iconElement || (
              <img
                src={icon || ''}
                alt={`${name} icon`}
                className={styles.icon}
              />
            )}
          </div>
        )}

        {/* Info */}
        <div className={styles.info}>
          <h3 className={styles.name}>{name}</h3>
          
          {description && (
            <p className={styles.description}>{description}</p>
          )}

          {/* Level Bar */}
          <div className={styles.levelContainer}>
            <div className={styles.levelBar}>
              <div 
                className={cn(styles.levelFill, styles[variant])}
                style={barFillStyle}
              />
            </div>
            
            {showPercentage && (
              <span className={styles.levelText}>
                {clampedLevel}%
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

SkillCard.displayName = 'SkillCard';
