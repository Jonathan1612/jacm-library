import React, { forwardRef } from 'react';
import { BaseComponentProps } from '../../types/common';
import { cn } from '../../utils/classNames';
import styles from './Switch.module.css';

export interface SwitchProps extends BaseComponentProps {
  /** Estado del switch */
  checked?: boolean;
  /** Estado por defecto para modo no controlado */
  defaultChecked?: boolean;
  /** Callback cuando cambia el estado */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Si el switch está deshabilitado */
  disabled?: boolean;
  /** Texto de la etiqueta */
  label?: string;
  /** Descripción adicional */
  description?: string;
  /** ID único para el input */
  id?: string;
  /** Nombre para formularios */
  name?: string;
  /** Valor para formularios */
  value?: string;
  /** Tamaño del switch */
  size?: 'small' | 'medium' | 'large';
  /** Color del switch */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  /** Si debe mostrar iconos dentro del switch */
  showIcons?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Props adicionales para el input */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  label,
  description,
  id,
  name,
  value,
  size = 'medium',
  color = 'primary',
  showIcons = false,
  loading = false,
  className,
  style,
  inputProps,
  ...props
}, ref) => {
  const switchId = id || `switch-${Math.random().toString(36).substring(2, 11)}`;
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || loading) return;
    onChange?.(event.target.checked, event);
  };

  const switchClasses = cn(
    styles.switch,
    styles[size],
    styles[color],
    disabled && styles.disabled,
    loading && styles.loading,
    showIcons && styles.withIcons,
    checked && styles.checked,
    className
  );

  const trackClasses = cn(
    styles.track,
    checked && styles.checkedTrack
  );

  const thumbClasses = cn(
    styles.thumb,
    checked && styles.checkedThumb
  );

  return (
    <div className={styles.container} style={style} {...props}>
      <label className={styles.label} htmlFor={switchId}>
        <div className={switchClasses}>
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            name={name}
            value={value}
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={handleChange}
            disabled={disabled || loading}
            className={styles.input}
            aria-describedby={description ? `${switchId}-description` : undefined}
            {...inputProps}
          />
          
          <div className={trackClasses}>
            <div className={thumbClasses}>
              {loading && (
                <div className={styles.spinner} />
              )}
              {!loading && showIcons && (
                <>
                  <svg 
                    className={cn(styles.icon, styles.checkIcon)}
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.5 6L5 7.5L8.5 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <svg 
                    className={cn(styles.icon, styles.crossIcon)}
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 4L8 8M8 4L4 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </>
              )}
            </div>
          </div>
        </div>
        
        {(label || description) && (
          <div className={styles.labelContent}>
            {label && (
              <span className={styles.labelText}>
                {label}
              </span>
            )}
            {description && (
              <span 
                className={styles.description}
                id={`${switchId}-description`}
              >
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    </div>
  );
});

Switch.displayName = 'Switch';
