import React, { forwardRef } from 'react';
import { BaseComponentProps, ComponentSize, ComponentVariant } from '../../types';
import { cn } from '../../utils';
import styles from './Label.module.css';

export interface LabelProps extends BaseComponentProps {
  /** Contenido del label */
  children: React.ReactNode;
  /** Variante visual del label */
  variant?: ComponentVariant | 'normal';
  /** Tamaño del label */
  size?: ComponentSize;
  /** HTML for attribute para asociar con un input */
  htmlFor?: string;
  /** Si el campo asociado es requerido */
  required?: boolean;
  /** Si mostrar indicador visual de error */
  error?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({
    children,
    className,
    style,
    variant = 'normal',
    size = 'medium',
    htmlFor,
    required = false,
    error = false,
    id,
    'data-testid': dataTestId,
    ...rest
  }, ref) => {
    const labelClasses = cn(
      styles.label,
      styles[variant],
      styles[size],
      error && styles.error,
      className
    );

    return (
      <label
        ref={ref}
        id={id}
        className={labelClasses}
        style={style}
        htmlFor={htmlFor}
        data-testid={dataTestId}
        {...rest}
      >
        {children}
        {required && (
          <span className={styles.required} aria-label="requerido">
            *
          </span>
        )}
      </label>
    );
  }
);

Label.displayName = 'Label';

export default Label;
