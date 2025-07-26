import React, { forwardRef, useState, useCallback, useRef, useEffect } from 'react';
import { BaseComponentProps } from '../../types/common';
import { cn } from '../../utils/classNames';
import styles from './Slider.module.css';

export interface SliderProps extends BaseComponentProps {
  /** Valor actual del slider */
  value?: number;
  /** Valor por defecto para modo no controlado */
  defaultValue?: number;
  /** Callback cuando cambia el valor */
  onChange?: (value: number, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Callback durante el arrastre */
  onInput?: (value: number, event: React.FormEvent<HTMLInputElement>) => void;
  /** Valor mínimo */
  min?: number;
  /** Valor máximo */
  max?: number;
  /** Paso del slider */
  step?: number;
  /** Si el slider está deshabilitado */
  disabled?: boolean;
  /** Orientación del slider */
  orientation?: 'horizontal' | 'vertical';
  /** Tamaño del slider */
  size?: 'small' | 'medium' | 'large';
  /** Color del slider */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  /** Si debe mostrar el valor */
  showValue?: boolean;
  /** Si debe mostrar marcas */
  showMarks?: boolean;
  /** Marcas personalizadas */
  marks?: Array<{ value: number; label?: string }>;
  /** Etiqueta para accesibilidad */
  'aria-label'?: string;
  /** ID único */
  id?: string;
  /** Nombre para formularios */
  name?: string;
  /** Si debe mostrar tooltip con el valor */
  showTooltip?: boolean;
  /** Formatear el valor mostrado */
  formatValue?: (value: number) => string;
  /** Props adicionales para el input */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(({
  value,
  defaultValue = 0,
  onChange,
  onInput,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  orientation = 'horizontal',
  size = 'medium',
  color = 'primary',
  showValue = false,
  showMarks = false,
  marks = [],
  'aria-label': ariaLabel,
  id,
  name,
  showTooltip = false,
  formatValue,
  className,
  style,
  inputProps,
  ...props
}, ref) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const currentValue = value ?? internalValue;
  const sliderId = id || `slider-${Math.random().toString(36).substring(2, 11)}`;
  
  // Calcular porcentaje
  const percentage = ((currentValue - min) / (max - min)) * 100;
  
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    
    if (value === undefined) {
      setInternalValue(newValue);
    }
    
    onChange?.(newValue, event);
  }, [value, onChange]);

  const handleInput = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    const newValue = parseFloat((event.target as HTMLInputElement).value);
    onInput?.(newValue, event);
  }, [onInput]);

  const formatDisplayValue = useCallback((val: number) => {
    if (formatValue) {
      return formatValue(val);
    }
    return val.toString();
  }, [formatValue]);

  // Generar marcas automáticas si showMarks está habilitado pero no hay marcas personalizadas
  let displayMarks: Array<{ value: number; label?: string }> = [];
  if (showMarks) {
    if (marks.length > 0) {
      displayMarks = marks;
    } else {
      displayMarks = [
        { value: min, label: formatDisplayValue(min) },
        { value: max, label: formatDisplayValue(max) }
      ];
    }
  }

  const containerClasses = cn(
    styles.container,
    styles[orientation],
    styles[size],
    styles[color],
    disabled && styles.disabled,
    isDragging && styles.dragging,
    className
  );

  const trackClasses = cn(styles.track);
  const thumbClasses = cn(
    styles.thumb,
    isDragging && styles.thumbActive
  );

  const trackStyle: React.CSSProperties = orientation === 'horizontal' 
    ? { background: `linear-gradient(to right, var(--slider-color) 0%, var(--slider-color) ${percentage}%, var(--track-color) ${percentage}%, var(--track-color) 100%)` }
    : { background: `linear-gradient(to top, var(--slider-color) 0%, var(--slider-color) ${percentage}%, var(--track-color) ${percentage}%, var(--track-color) 100%)` };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = () => {
      if (isDragging) {
        // Lógica adicional si es necesaria durante el arrastre
      }
    };

    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging]);

  return (
    <div 
      className={containerClasses} 
      style={style}
      {...props}
    >
      <div ref={sliderRef} className={styles.sliderWrapper}>
        <input
          ref={ref}
          type="range"
          id={sliderId}
          name={name}
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          onInput={handleInput}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          disabled={disabled}
          className={styles.input}
          aria-label={ariaLabel || `Slider de ${formatDisplayValue(min)} a ${formatDisplayValue(max)}`}
          aria-orientation={orientation}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          aria-valuetext={formatDisplayValue(currentValue)}
          {...inputProps}
        />
        
        <div className={trackClasses} style={trackStyle}>
          <div 
            className={thumbClasses}
            style={{
              [orientation === 'horizontal' ? 'left' : 'bottom']: `${percentage}%`
            }}
          >
            {showTooltip && (
              <div className={styles.tooltip}>
                {formatDisplayValue(currentValue)}
              </div>
            )}
          </div>
        </div>
        
        {displayMarks.length > 0 && (
          <div className={styles.marks}>
            {displayMarks.map((mark) => {
              const markPercentage = ((mark.value - min) / (max - min)) * 100;
              return (
                <div
                  key={`mark-${mark.value}`}
                  className={styles.mark}
                  style={{
                    [orientation === 'horizontal' ? 'left' : 'bottom']: `${markPercentage}%`
                  }}
                >
                  <div className={styles.markDot} />
                  {mark.label && (
                    <div className={styles.markLabel}>
                      {mark.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {showValue && (
        <div className={styles.valueDisplay}>
          {formatDisplayValue(currentValue)}
        </div>
      )}
    </div>
  );
});

Slider.displayName = 'Slider';
