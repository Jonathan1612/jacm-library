import React, { forwardRef } from 'react';
import { BaseComponentProps } from '../../types/common';
import { TextField, TextFieldProps } from '../../atoms/TextField/TextField';
import { cn } from '../../utils/classNames';
import styles from './FormField.module.css';

export interface FormFieldProps extends BaseComponentProps {
  /** Props para el TextField */
  textFieldProps?: TextFieldProps;
  /** Etiqueta del campo */
  label: React.ReactNode;
  /** Si el campo es requerido */
  required?: boolean;
  /** Mensaje de error */
  error?: string;
  /** Texto de ayuda */
  helperText?: string;
  /** Estado del campo */
  status?: 'default' | 'success' | 'warning' | 'error';
  /** Si debe ocupar todo el ancho */
  fullWidth?: boolean;
  /** Tamaño del campo */
  size?: 'small' | 'medium' | 'large';
  /** Si está deshabilitado */
  disabled?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(({
  textFieldProps,
  label,
  required = false,
  error,
  helperText,
  status = 'default',
  fullWidth = false,
  size = 'medium',
  disabled = false,
  className,
  style,
  ...props
}, ref) => {
  const hasError = !!error || status === 'error';
  const showError = hasError && error;
  const showHelper = !showError && helperText;

  const containerClasses = cn(
    styles.container,
    styles[size],
    styles[status],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    hasError && styles.hasError,
    className
  );

  // Determinar la variante del TextField basada en el estado
  const getTextFieldVariant = () => {
    switch (status) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'normal';
    }
  };

  return (
    <div className={containerClasses} style={style} {...props}>
      <TextField
        ref={ref}
        label={label}
        required={required}
        error={hasError}
        errorMessage={showError ? error : undefined}
        helperText={showHelper ? helperText : undefined}
        variant={getTextFieldVariant()}
        size={size}
        fullWidth={fullWidth}
        disabled={disabled}
        {...textFieldProps}
      />
    </div>
  );
});

FormField.displayName = 'FormField';
