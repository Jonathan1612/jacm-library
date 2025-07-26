import React, { forwardRef } from 'react';
import { BaseComponentProps } from '../../types/common';
import { Rating, RatingProps } from '../../atoms/Rating/Rating';
import { Label } from '../../atoms/Label/Label';
import { cn } from '../../utils/classNames';
import styles from './RatingField.module.css';

export interface RatingFieldProps extends BaseComponentProps {
  /** Props para el Rating */
  ratingProps?: Omit<RatingProps, 'id' | 'name'>;
  /** Etiqueta del campo */
  label?: React.ReactNode;
  /** Si el campo es requerido */
  required?: boolean;
  /** Mensaje de error */
  error?: string;
  /** Texto de ayuda */
  helperText?: string;
  /** ID único */
  id?: string;
  /** Nombre para formularios */
  name?: string;
  /** Si debe ocupar todo el ancho */
  fullWidth?: boolean;
  /** Tamaño del campo */
  size?: 'small' | 'medium' | 'large';
  /** Si está deshabilitado */
  disabled?: boolean;
  /** Orientación del layout */
  orientation?: 'horizontal' | 'vertical';
}

export const RatingField = forwardRef<HTMLFieldSetElement, RatingFieldProps>(({
  ratingProps,
  label,
  required = false,
  error,
  helperText,
  id,
  name,
  fullWidth = false,
  size = 'medium',
  disabled = false,
  orientation = 'horizontal',
  className,
  style,
  ...props
}, ref) => {
  const fieldId = id || `rating-field-${Math.random().toString(36).substring(2, 11)}`;
  const helperTextId = `${fieldId}-helper`;
  const errorMessageId = `${fieldId}-error`;
  
  const hasError = !!error;
  const showError = hasError && error;
  const showHelper = !showError && helperText;

  const containerClasses = cn(
    styles.container,
    styles[size],
    styles[orientation],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    hasError && styles.hasError,
    className
  );

  return (
    <div className={containerClasses} style={style} {...props}>
      {label && (
        <Label
          htmlFor={fieldId}
          required={required}
          error={hasError}
          size={size}
          className={styles.label}
        >
          {label}
        </Label>
      )}
      
      <div className={styles.ratingWrapper}>
        <Rating
          ref={ref}
          id={fieldId}
          name={name}
          size={size}
          disabled={disabled}
          aria-describedby={
            [
              showHelper ? helperTextId : undefined,
              showError ? errorMessageId : undefined
            ].filter(Boolean).join(' ') || undefined
          }
          {...ratingProps}
        />
      </div>
      
      {showError && (
        <div id={errorMessageId} className={styles.errorMessage} role="alert">
          {error}
        </div>
      )}
      
      {showHelper && (
        <div id={helperTextId} className={styles.helperText}>
          {helperText}
        </div>
      )}
    </div>
  );
});

RatingField.displayName = 'RatingField';
