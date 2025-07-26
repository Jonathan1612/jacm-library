import React, { forwardRef } from 'react';
import { BaseComponentProps, ClickableProps, ComponentSize, ComponentVariant } from '../../types';
import { cn } from '../../utils';
import styles from './Button.module.css';

export interface ButtonProps extends BaseComponentProps, ClickableProps {
  /** Contenido del botón */
  children: React.ReactNode;
  /** Variante visual del botón */
  variant?: ComponentVariant | 'normal';
  /** Tamaño del botón */
  size?: ComponentSize;
  /** Icono a la izquierda del texto */
  leftIcon?: React.ReactNode;
  /** Icono a la derecha del texto */
  rightIcon?: React.ReactNode;
  /** Si el botón debe ocupar todo el ancho disponible */
  fullWidth?: boolean;
  /** Tipo de botón HTML */
  type?: 'button' | 'submit' | 'reset';
  /** Estado de carga */
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    className,
    style,
    variant = 'primary',
    size = 'medium',
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled = false,
    loading = false,
    type = 'button',
    onClick,
    onKeyDown,
    'data-testid': dataTestId,
    'aria-label': ariaLabel,
    id,
    tabIndex,
    ...rest
  }, ref) => {
    const buttonClasses = cn(
      styles.button,
      styles[variant],
      styles[size],
      fullWidth && styles.fullWidth,
      loading && styles.loading,
      disabled && styles.disabled,
      className
    );

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;
      onClick?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;
      onKeyDown?.(event);
    };

    return (
      <button
        ref={ref}
        id={id}
        className={buttonClasses}
        style={style}
        type={type}
        disabled={disabled || loading}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        data-testid={dataTestId}
        {...rest}
      >
        {loading && <span className={styles.spinner} aria-hidden="true" />}
        {!loading && leftIcon && (
          <span className={styles.leftIcon} aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span className={styles.content}>
          {children}
        </span>
        {!loading && rightIcon && (
          <span className={styles.rightIcon} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
