import React, { forwardRef, useState } from 'react';
import { BaseComponentProps } from '../../types/common';
import { TextField, TextFieldProps } from '../../atoms/TextField/TextField';
import { Button } from '../../atoms/Button/Button';
import { cn } from '../../utils/classNames';
import styles from './SearchField.module.css';

export interface SearchFieldProps extends BaseComponentProps {
  /** Props para el campo de texto */
  textFieldProps?: Omit<TextFieldProps, 'rightIcon' | 'type'>;
  /** Texto del placeholder */
  placeholder?: string;
  /** Valor del campo de búsqueda */
  value?: string;
  /** Valor por defecto */
  defaultValue?: string;
  /** Callback cuando cambia el valor */
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Callback cuando se ejecuta la búsqueda */
  onSearch?: (value: string) => void;
  /** Callback cuando se presiona Enter */
  onEnterPress?: (value: string, event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Callback cuando se limpia el campo */
  onClear?: () => void;
  /** Si está cargando */
  loading?: boolean;
  /** Si debe mostrar el botón de limpiar */
  clearable?: boolean;
  /** Texto del botón de búsqueda */
  searchButtonText?: string;
  /** Si debe mostrar el botón de búsqueda */
  showSearchButton?: boolean;
  /** Tamaño del componente */
  size?: 'small' | 'medium' | 'large';
  /** Si debe ocupar todo el ancho */
  fullWidth?: boolean;
  /** Si está deshabilitado */
  disabled?: boolean;
  /** Icono de búsqueda personalizado */
  searchIcon?: React.ReactNode;
  /** Icono de limpiar personalizado */
  clearIcon?: React.ReactNode;
}

const SearchIcon: React.FC = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const ClearIcon: React.FC = () => (
  <svg 
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(({
  textFieldProps,
  placeholder = "Buscar...",
  value,
  defaultValue = "",
  onChange,
  onSearch,
  onEnterPress,
  onClear,
  loading = false,
  clearable = true,
  searchButtonText = "Buscar",
  showSearchButton = false,
  size = 'medium',
  fullWidth = false,
  disabled = false,
  searchIcon,
  clearIcon,
  className,
  style,
  ...props
}, ref) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const hasValue = currentValue && currentValue.length > 0;

  const handleChange = (newValue: string, event?: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue, event!);
  };

  const handleSearchClick = () => {
    if (!disabled && !loading) {
      onSearch?.(currentValue || "");
    }
  };

  const handleClearClick = () => {
    if (!disabled && !loading) {
      const newValue = "";
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onClear?.();
      onChange?.(newValue, { target: { value: newValue } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const containerClasses = cn(
    styles.container,
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    loading && styles.loading,
    className
  );

  // Construir el icono derecho
  const rightIcon = (
    <div className={styles.rightActions}>
      {clearable && hasValue && !loading && (
        <button
          type="button"
          onClick={handleClearClick}
          className={styles.clearButton}
          aria-label="Limpiar búsqueda"
          tabIndex={-1}
        >
          {clearIcon || <ClearIcon />}
        </button>
      )}
      
      {loading && (
        <div className={styles.spinner} aria-label="Cargando">
          <div className={styles.spinnerCircle} />
        </div>
      )}
      
      {!showSearchButton && !loading && (
        <div className={styles.searchIconWrapper}>
          {searchIcon || <SearchIcon />}
        </div>
      )}
    </div>
  );

  return (
    <div className={containerClasses} style={style} {...props}>
      <TextField
        ref={ref}
        type="search"
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        fullWidth={!showSearchButton}
        size={size}
        leftIcon={showSearchButton ? (searchIcon || <SearchIcon />) : undefined}
        rightIcon={rightIcon}
        {...textFieldProps}
      />
      
      {showSearchButton && (
        <Button
          onClick={handleSearchClick}
          disabled={disabled || loading}
          loading={loading}
          size={size}
          variant="primary"
          className={styles.searchButton}
        >
          {searchButtonText}
        </Button>
      )}
    </div>
  );
});

SearchField.displayName = 'SearchField';
