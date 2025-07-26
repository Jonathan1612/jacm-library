import React, { forwardRef, useState, useEffect } from 'react';
import { BaseComponentProps, ComponentSize, ComponentVariant, FormInputProps } from '../../types';
import { cn } from '../../utils';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends BaseComponentProps, Omit<FormInputProps, 'value' | 'onChange'> {
  /** Estado checked del checkbox */
  checked?: boolean;
  /** Estado inicial si no es controlado */
  defaultChecked?: boolean;
  /** Función callback cuando cambia el estado */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Variante visual del checkbox */
  variant?: ComponentVariant | 'normal';
  /** Tamaño del checkbox */
  size?: ComponentSize;
  /** Texto de la etiqueta */
  label?: React.ReactNode;
  /** Posición de la etiqueta */
  labelPosition?: 'left' | 'right';
  /** Estado indeterminado */
  indeterminate?: boolean;
  /** Si está en estado de error */
  error?: boolean;
  /** Texto de ayuda o error */
  helperText?: string;
  /** ID del elemento de ayuda para aria-describedby */
  helperTextId?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({
    checked,
    defaultChecked = false,
    onChange,
    variant = 'primary',
    size = 'medium',
    label,
    labelPosition = 'right',
    indeterminate = false,
    error = false,
    disabled = false,
    required = false,
    helperText,
    helperTextId,
    className,
    style,
    id,
    name,
    'data-testid': dataTestId,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    ...rest
  }, ref) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const isControlled = checked !== undefined;
    const checkedValue = isControlled ? checked : internalChecked;

    useEffect(() => {
      if (ref && typeof ref === 'object' && ref.current) {
        ref.current.indeterminate = indeterminate;
      }
    }, [indeterminate, ref]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked;
      
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      
      onChange?.(newChecked, event);
    };

    const checkboxClasses = cn(
      styles.checkbox,
      styles[size],
      styles[variant],
      checkedValue && styles.checked,
      indeterminate && styles.indeterminate,
      error && styles.error,
      disabled && styles.disabled
    );

    const containerClasses = cn(
      styles.container,
      labelPosition === 'left' && styles.labelLeft,
      disabled && styles.containerDisabled,
      error && styles.containerError,
      className
    );

    const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 11)}`;
    const describedBy = [ariaDescribedBy, helperTextId].filter(Boolean).join(' ') || undefined;

    return (
      <div className={containerClasses} style={style}>
        <label className={styles.label} htmlFor={checkboxId}>
          {label && labelPosition === 'left' && (
            <span className={styles.labelText}>{label}</span>
          )}
          
          <div className={styles.checkboxWrapper}>
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              name={name}
              checked={checkedValue}
              onChange={handleChange}
              disabled={disabled}
              required={required}
              className={styles.input}
              data-testid={dataTestId}
              aria-describedby={describedBy}
              aria-invalid={ariaInvalid || error || undefined}
              {...rest}
            />
            
            <div className={checkboxClasses}>
              {checkedValue && !indeterminate && (
                <svg
                  className={styles.checkIcon}
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
              )}
              
              {indeterminate && (
                <svg
                  className={styles.indeterminateIcon}
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                </svg>
              )}
            </div>
          </div>
          
          {label && labelPosition === 'right' && (
            <span className={styles.labelText}>{label}</span>
          )}
        </label>
        
        {helperText && (
          <div 
            id={helperTextId}
            className={cn(styles.helperText, error && styles.helperTextError)}
          >
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
