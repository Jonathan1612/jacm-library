import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { BaseComponentProps, ComponentVariant, ComponentSize } from '../../types/common';
import { cn } from '../../utils/classNames';
import styles from './Select.module.css';

export interface SelectOption {
  /** Valor de la opción */
  value: string;
  /** Texto a mostrar */
  label: string;
  /** Si la opción está deshabilitada */
  disabled?: boolean;
  /** Icono de la opción */
  icon?: React.ReactNode;
}

export interface SelectProps extends BaseComponentProps {
  /** Opciones del select */
  options: SelectOption[];
  /** Valor seleccionado */
  value?: string;
  /** Valor por defecto */
  defaultValue?: string;
  /** Placeholder cuando no hay selección */
  placeholder?: string;
  /** Si el select está deshabilitado */
  disabled?: boolean;
  /** Si es de solo lectura */
  readOnly?: boolean;
  /** Si es requerido */
  required?: boolean;
  /** Si hay error */
  error?: boolean;
  /** Variante del select */
  variant?: ComponentVariant;
  /** Tamaño del select */
  size?: ComponentSize;
  /** Callback al cambiar selección */
  onChange?: (value: string, option: SelectOption) => void;
  /** Callback al abrir/cerrar */
  onOpenChange?: (open: boolean) => void;
  /** Texto de ayuda */
  helpText?: string;
  /** Mensaje de error */
  errorMessage?: string;
  /** Si permite búsqueda */
  searchable?: boolean;
  /** Placeholder de búsqueda */
  searchPlaceholder?: string;
  /** Si puede limpiar la selección */
  clearable?: boolean;
  /** Posición del dropdown */
  placement?: 'bottom' | 'top';
  /** Si el dropdown está abierto (controlado) */
  open?: boolean;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(({
  options = [],
  value,
  defaultValue,
  placeholder = 'Seleccionar...',
  disabled = false,
  readOnly = false,
  required = false,
  error = false,
  variant = 'primary',
  size = 'medium',
  onChange,
  onOpenChange,
  helpText,
  errorMessage,
  searchable = false,
  searchPlaceholder = 'Buscar...',
  clearable = false,
  placement = 'bottom',
  open: controlledOpen,
  className,
  style,
  ...props
}, ref) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const [internalOpen, setInternalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentValue = value ?? internalValue;
  const isOpen = controlledOpen ?? internalOpen;

  // Filtrar opciones por búsqueda
  const filteredOptions = searchable && searchQuery
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const selectedOption = options.find(option => option.value === currentValue);

  // Manejar clicks fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return undefined;
  }, [isOpen]);

  // Manejar teclas
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          handleClose();
          break;
        case 'Enter':
          event.preventDefault();
          if (filteredOptions.length > 0) {
            handleSelect(filteredOptions[0]);
          }
          break;
        case 'ArrowDown':
          event.preventDefault();
          break;
        case 'ArrowUp':
          event.preventDefault();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
    
    return undefined;
  }, [isOpen, filteredOptions]);

  // Foco en el input de búsqueda cuando se abre
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleToggle = () => {
    if (disabled || readOnly) return;
    
    const newOpen = !isOpen;
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  const handleClose = () => {
    if (controlledOpen === undefined) {
      setInternalOpen(false);
    }
    onOpenChange?.(false);
    setSearchQuery('');
  };

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;
    
    const newValue = option.value;
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue, option);
    handleClose();
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    const newValue = '';
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue, { value: '', label: '', disabled: false });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const selectClasses = cn(
    styles.select,
    styles[variant],
    styles[size],
    isOpen && styles.open,
    disabled && styles.disabled,
    readOnly && styles.readOnly,
    error && styles.error,
    required && styles.required,
    className
  );

  const dropdownClasses = cn(
    styles.dropdown,
    styles[`placement${placement.charAt(0).toUpperCase() + placement.slice(1)}`],
    isOpen && styles.open
  );

  return (
    <div className={styles.container}>
      <div
        ref={ref || containerRef}
        className={selectClasses}
        style={style}
        onClick={handleToggle}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-required={required}
        aria-invalid={error}
        tabIndex={disabled ? -1 : 0}
        {...props}
      >
        <div className={styles.display}>
          <div className={styles.content}>
            {selectedOption?.icon && (
              <span className={styles.selectedIcon}>
                {selectedOption.icon}
              </span>
            )}
            <span className={cn(
              styles.selectedText,
              !currentValue && styles.placeholder
            )}>
              {selectedOption?.label || placeholder}
            </span>
          </div>
          <div className={styles.actions}>
            {clearable && currentValue && !disabled && !readOnly && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={handleClear}
                aria-label="Limpiar selección"
              >
                ✕
              </button>
            )}
            <span className={cn(
              styles.arrow,
              isOpen && styles.arrowUp
            )}>
              ▼
            </span>
          </div>
        </div>

        {isOpen && (
          <div className={dropdownClasses}>
            {searchable && (
              <div className={styles.searchContainer}>
                <input
                  ref={searchInputRef}
                  type="text"
                  className={styles.searchInput}
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            <ul className={styles.options} role="listbox">
              {filteredOptions.length === 0 ? (
                <li className={styles.noOptions}>
                  {searchQuery ? 'No se encontraron opciones' : 'Sin opciones'}
                </li>
              ) : (
                filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    className={cn(
                      styles.option,
                      option.value === currentValue && styles.selected,
                      option.disabled && styles.disabled
                    )}
                    role="option"
                    aria-selected={option.value === currentValue}
                    onClick={() => handleSelect(option)}
                  >
                    {option.icon && (
                      <span className={styles.optionIcon}>
                        {option.icon}
                      </span>
                    )}
                    <span className={styles.optionLabel}>
                      {option.label}
                    </span>
                    {option.value === currentValue && (
                      <span className={styles.checkmark}>✓</span>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Help text or error message */}
      {(helpText || errorMessage) && (
        <div className={cn(
          styles.helpText,
          error && styles.helpTextError
        )}>
          {error && errorMessage ? errorMessage : helpText}
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';
