import React, { forwardRef, useState, useCallback } from 'react';
import { BaseComponentProps } from '../../types/common';
import { cn } from '../../utils/classNames';
import styles from './Rating.module.css';

export interface RatingProps extends BaseComponentProps {
  /** Valor actual del rating */
  value?: number;
  /** Valor por defecto para modo no controlado */
  defaultValue?: number;
  /** Callback cuando cambia el valor */
  onChange?: (value: number, event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Callback al hacer hover */
  onHover?: (value: number) => void;
  /** Callback al quitar el hover */
  onHoverExit?: () => void;
  /** Número máximo de estrellas */
  max?: number;
  /** Precisión del rating (0.5 para medias estrellas, 1 para estrellas completas) */
  precision?: number;
  /** Si el rating es de solo lectura */
  readOnly?: boolean;
  /** Si el rating está deshabilitado */
  disabled?: boolean;
  /** Tamaño de las estrellas */
  size?: 'small' | 'medium' | 'large';
  /** Color de las estrellas */
  color?: 'primary' | 'secondary' | 'warning' | 'error';
  /** Si debe mostrar el valor numérico */
  showValue?: boolean;
  /** Texto personalizado para el valor */
  valueText?: string;
  /** Etiqueta para accesibilidad */
  'aria-label'?: string;
  /** ID único */
  id?: string;
  /** Nombre para formularios */
  name?: string;
  /** Icono personalizado para estrellas vacías */
  emptyIcon?: React.ReactNode;
  /** Icono personalizado para estrellas llenas */
  filledIcon?: React.ReactNode;
  /** Si debe limpiar el rating al hacer clic en la misma estrella */
  clearable?: boolean;
}

const StarIcon: React.FC<{ filled?: boolean; half?: boolean }> = ({ filled = false, half = false }) => {
  let fillValue: string;
  if (half) {
    fillValue = 'url(#half-star)';
  } else if (filled) {
    fillValue = 'currentColor';
  } else {
    fillValue = 'none';
  }

  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      className={styles.starIcon}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="half-star" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={fillValue}
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const Rating = forwardRef<HTMLFieldSetElement, RatingProps>(({
  value,
  defaultValue = 0,
  onChange,
  onHover,
  onHoverExit,
  max = 5,
  precision = 1,
  readOnly = false,
  disabled = false,
  size = 'medium',
  color = 'warning',
  showValue = false,
  valueText,
  'aria-label': ariaLabel,
  id,
  name,
  emptyIcon,
  filledIcon,
  clearable = false,
  className,
  style,
  ...props
}, ref) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const currentValue = value ?? internalValue;
  const displayValue = hoverValue ?? currentValue;
  
  const ratingId = id || `rating-${Math.random().toString(36).substring(2, 11)}`;

  const handleClick = useCallback((starValue: number, event: React.MouseEvent<HTMLButtonElement>) => {
    if (readOnly || disabled) return;
    
    const newValue = clearable && currentValue === starValue ? 0 : starValue;
    
    if (value === undefined) {
      setInternalValue(newValue);
    }
    
    onChange?.(newValue, event);
  }, [currentValue, value, onChange, readOnly, disabled, clearable]);

  const handleMouseEnter = useCallback((starValue: number) => {
    if (readOnly || disabled) return;
    
    setHoverValue(starValue);
    onHover?.(starValue);
  }, [onHover, readOnly, disabled]);

  const handleMouseLeave = useCallback(() => {
    if (readOnly || disabled) return;
    
    setHoverValue(null);
    onHoverExit?.();
  }, [onHoverExit, readOnly, disabled]);

  const getStarValue = (index: number, precision: number): number => {
    return precision === 0.5 ? (index + 0.5) : (index + 1);
  };

  const renderStar = (index: number) => {
    const starValue = getStarValue(index, precision);
    const halfStarValue = precision === 0.5 ? index + 0.5 : starValue;
    
    const isFilled = displayValue >= starValue;
    const isHalf = precision === 0.5 && displayValue >= halfStarValue && displayValue < starValue;
    
    const starClasses = cn(
      styles.star,
      isFilled && styles.filled,
      isHalf && styles.half,
      !readOnly && !disabled && styles.interactive
    );

    return (
      <button
        key={index}
        type="button"
        className={starClasses}
        onClick={(event) => handleClick(starValue, event)}
        onMouseEnter={() => handleMouseEnter(starValue)}
        disabled={disabled}
        aria-label={`${starValue} ${starValue === 1 ? 'estrella' : 'estrellas'}`}
        tabIndex={readOnly ? -1 : 0}
      >
        {(() => {
          if (filledIcon && isFilled) {
            return filledIcon;
          }
          if (emptyIcon && !isFilled && !isHalf) {
            return emptyIcon;
          }
          return <StarIcon filled={isFilled} half={isHalf} />;
        })()}
      </button>
    );
  };

  const renderHalfStars = () => {
    const stars: React.ReactNode[] = [];
    
    for (let i = 0; i < max; i++) {
      // Estrella completa
      const fullStarValue = i + 1;
      
      // Media estrella
      const halfStarValue = i + 0.5;
      const isHalfFilled = displayValue >= halfStarValue && displayValue < fullStarValue;
      
      stars.push(
        <button
          key={`half-${i}`}
          type="button"
          className={cn(
            styles.star, 
            styles.halfStar,
            isHalfFilled && styles.filled,
            !readOnly && !disabled && styles.interactive
          )}
          onClick={(event) => handleClick(halfStarValue, event)}
          onMouseEnter={() => handleMouseEnter(halfStarValue)}
          disabled={disabled}
          aria-label={`${halfStarValue} estrellas`}
          tabIndex={readOnly ? -1 : 0}
        >
          <StarIcon filled={isHalfFilled} half={true} />
        </button>
      );
      
      stars.push(renderStar(i));
    }
    
    return stars;
  };

  const containerClasses = cn(
    styles.container,
    styles[size],
    styles[color],
    readOnly && styles.readOnly,
    disabled && styles.disabled,
    className
  );

  return (
    <fieldset
      ref={ref}
      className={containerClasses}
      style={style}
      onMouseLeave={handleMouseLeave}
      aria-label={ariaLabel || `Rating de ${currentValue} sobre ${max} estrellas`}
      disabled={disabled}
      id={ratingId}
      {...props}
    >
      <div className={styles.stars}>
        {precision === 0.5 ? renderHalfStars() : (
          Array.from({ length: max }, (_, index) => renderStar(index))
        )}
      </div>
      
      {showValue && (
        <span className={styles.value} aria-live="polite">
          {valueText || `${displayValue}/${max}`}
        </span>
      )}
      
      {name && (
        <input
          type="hidden"
          name={name}
          value={currentValue}
        />
      )}
    </fieldset>
  );
});

Rating.displayName = 'Rating';
