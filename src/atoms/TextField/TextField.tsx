import React, { forwardRef, useState } from 'react';
import { BaseComponentProps, ComponentSize, ComponentVariant, FormInputProps } from '../../types';
import { cn } from '../../utils';
import styles from './TextField.module.css';

export interface TextFieldProps extends BaseComponentProps, FormInputProps {
  /** Variante visual del campo */
  variant?: ComponentVariant | 'normal';
  /** Tamaño del campo */
  size?: ComponentSize;
  /** Tipo de input HTML */
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';
  /** Etiqueta del campo */
  label?: React.ReactNode;
  /** Texto de ayuda */
  helperText?: string;
  /** Si está en estado de error */
  error?: boolean;
  /** Mensaje de error */
  errorMessage?: string;
  /** Icono a la izquierda */
  leftIcon?: React.ReactNode;
  /** Icono a la derecha */
  rightIcon?: React.ReactNode;
  /** Si el campo debe ocupar todo el ancho */
  fullWidth?: boolean;
  /** Texto a mostrar cuando está vacío */
  emptyStateText?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({
    value,
    defaultValue,
    onChange,
    variant = 'normal',
    size = 'medium',
    type = 'text',
    label,
    helperText,
    error = false,
    errorMessage,
    leftIcon,
    rightIcon,
    fullWidth = false,
    emptyStateText,
    disabled = false,
    readOnly = false,
    required = false,
    placeholder,
    className,
    style,
    id,
    name,
    'data-testid': dataTestId,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    onBlur,
    onFocus,
    ...rest
  }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const [focused, setFocused] = useState(false);
    
    const isControlled = value !== undefined;
    const inputValue = isControlled ? value : internalValue;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      
      if (!isControlled) {
        setInternalValue(newValue);
      }
      
      onChange?.(newValue, event);
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(event);
    };

    const fieldId = id || `textfield-${Math.random().toString(36).substring(2, 11)}`;
    const helperTextId = `${fieldId}-helper`;
    const errorMessageId = `${fieldId}-error`;
    
    const describedBy = [
      ariaDescribedBy,
      helperText && helperTextId,
      errorMessage && errorMessageId
    ].filter(Boolean).join(' ') || undefined;

    const containerClasses = cn(
      styles.container,
      fullWidth && styles.fullWidth,
      className
    );

    const fieldClasses = cn(
      styles.field,
      styles[size],
      styles[variant],
      focused && styles.focused,
      error && styles.error,
      disabled && styles.disabled,
      readOnly && styles.readOnly,
      !!leftIcon && styles.hasLeftIcon,
      !!rightIcon && styles.hasRightIcon
    );

    const showError = error && errorMessage;
    const showHelper = !showError && helperText;
    const isEmpty = !inputValue || inputValue.length === 0;

    return (
      <div className={containerClasses} style={style}>
        {label && (
          <label htmlFor={fieldId} className={styles.label}>
            {label}
            {required && <span className={styles.required} aria-label="requerido">*</span>}
          </label>
        )}
        
        <div className={styles.fieldWrapper}>
          {leftIcon && (
            <div className={styles.leftIcon} aria-hidden="true">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={fieldId}
            name={name}
            type={type}
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            placeholder={placeholder}
            className={fieldClasses}
            data-testid={dataTestId}
            aria-describedby={describedBy}
            aria-invalid={ariaInvalid || error || undefined}
            {...rest}
          />
          
          {rightIcon && (
            <div className={styles.rightIcon} aria-hidden="true">
              {rightIcon}
            </div>
          )}
          
          {isEmpty && emptyStateText && !focused && !placeholder && (
            <div className={styles.emptyState} aria-hidden="true">
              {emptyStateText}
            </div>
          )}
        </div>
        
        {showError && (
          <div id={errorMessageId} className={styles.errorMessage} role="alert">
            {errorMessage}
          </div>
        )}
        
        {showHelper && (
          <div id={helperTextId} className={styles.helperText}>
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;
