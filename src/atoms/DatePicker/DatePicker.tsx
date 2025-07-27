import React, { useState, forwardRef, useEffect } from 'react';
import styles from './DatePicker.module.css';

export interface DatePickerProps {
  /** Valor actual de la fecha */
  value?: string;
  /** Función que se ejecuta cuando cambia el valor */
  onChange?: (value: string) => void;
  /** Función que se ejecuta cuando se abre/cierra el picker */
  onToggle?: (isOpen: boolean) => void;
  /** Placeholder del input */
  placeholder?: string;
  /** Si el componente está deshabilitado */
  disabled?: boolean;
  /** Si el campo es requerido */
  required?: boolean;
  /** Fecha mínima seleccionable */
  min?: string;
  /** Fecha máxima seleccionable */
  max?: string;
  /** Formato de fecha a mostrar */
  format?: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd';
  /** Si se muestra el botón para limpiar */
  clearable?: boolean;
  /** Etiqueta del campo */
  label?: string;
  /** Mensaje de error */
  error?: string;
  /** Texto de ayuda */
  helperText?: string;
  /** Variante del estilo */
  variant?: 'outlined' | 'filled' | 'standard';
  /** Tamaño del componente */
  size?: 'small' | 'medium' | 'large';
  /** Clases CSS adicionales */
  className?: string;
  /** ID del elemento */
  id?: string;
  /** Nombre del campo para formularios */
  name?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(({
  value = '',
  onChange,
  onToggle,
  placeholder = 'Selecciona una fecha',
  disabled = false,
  required = false,
  min,
  max,
  format = 'dd/mm/yyyy',
  clearable = true,
  label,
  error,
  helperText,
  variant = 'outlined',
  size = 'medium',
  className = '',
  id,
  name,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [displayMonth, setDisplayMonth] = useState(new Date());

  // Formatear fecha para mostrar
  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    switch (format) {
      case 'mm/dd/yyyy':
        return `${month}/${day}/${year}`;
      case 'yyyy-mm-dd':
        return `${year}-${month}-${day}`;
      case 'dd/mm/yyyy':
      default:
        return `${day}/${month}/${year}`;
    }
  };

  // Parsear fecha desde string
  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    
    let day: number, month: number, year: number;
    
    switch (format) {
      case 'mm/dd/yyyy': {
        const parts = dateString.split('/');
        if (parts.length !== 3) return null;
        month = parseInt(parts[0]);
        day = parseInt(parts[1]);
        year = parseInt(parts[2]);
        break;
      }
      case 'yyyy-mm-dd': {
        const parts = dateString.split('-');
        if (parts.length !== 3) return null;
        year = parseInt(parts[0]);
        month = parseInt(parts[1]);
        day = parseInt(parts[2]);
        break;
      }
      case 'dd/mm/yyyy':
      default: {
        const parts = dateString.split('/');
        if (parts.length !== 3) return null;
        day = parseInt(parts[0]);
        month = parseInt(parts[1]);
        year = parseInt(parts[2]);
        break;
      }
    }

    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  };

  // Efecto para sincronizar valor externo
  useEffect(() => {
    if (value) {
      const parsed = parseDate(value);
      if (parsed) {
        setSelectedDate(parsed);
        setInputValue(value);
        setDisplayMonth(parsed);
      }
    } else {
      setSelectedDate(null);
      setInputValue('');
    }
  }, [value, format]);

  // Generar días del calendario
  const generateCalendarDays = () => {
    const year = displayMonth.getFullYear();
    const month = displayMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (newValue === '') {
      setSelectedDate(null);
      onChange?.('');
      return;
    }

    const parsed = parseDate(newValue);
    if (parsed) {
      setSelectedDate(parsed);
      setDisplayMonth(parsed);
      onChange?.(newValue);
    }
  };

  const handleDateSelect = (date: Date) => {
    const formattedDate = formatDate(date);
    setSelectedDate(date);
    setInputValue(formattedDate);
    setIsOpen(false);
    onChange?.(formattedDate);
  };

  const handleClear = () => {
    setSelectedDate(null);
    setInputValue('');
    onChange?.('');
  };

  const handleToggle = () => {
    if (!disabled) {
      const newIsOpen = !isOpen;
      setIsOpen(newIsOpen);
      onToggle?.(newIsOpen);
    }
  };

  const handlePrevMonth = () => {
    setDisplayMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDisplayMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const isDateDisabled = (date: Date): boolean => {
    if (min && date < new Date(min)) return true;
    if (max && date > new Date(max)) return true;
    return false;
  };

  const isSelectedDate = (date: Date): boolean => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === displayMonth.getMonth();
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className={`${styles.datePicker} ${styles[variant]} ${styles[size]} ${className}`}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={`${styles.inputContainer} ${error ? styles.error : ''} ${disabled ? styles.disabled : ''}`}>
        <input
          ref={ref}
          type="text"
          id={id}
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={styles.input}
          {...props}
        />
        
        <div className={styles.inputActions}>
          {clearable && inputValue && !disabled && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClear}
              aria-label="Limpiar fecha"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
              </svg>
            </button>
          )}
          
          <button
            type="button"
            className={styles.calendarButton}
            onClick={handleToggle}
            disabled={disabled}
            aria-label="Abrir calendario"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className={styles.calendar}>
          <div className={styles.calendarHeader}>
            <button
              type="button"
              className={styles.navButton}
              onClick={handlePrevMonth}
              aria-label="Mes anterior"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
              </svg>
            </button>
            
            <span className={styles.monthYear}>
              {months[displayMonth.getMonth()]} {displayMonth.getFullYear()}
            </span>
            
            <button
              type="button"
              className={styles.navButton}
              onClick={handleNextMonth}
              aria-label="Mes siguiente"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>
          
          <div className={styles.calendarGrid}>
            <div className={styles.weekDays}>
              {weekDays.map(day => (
                <div key={day} className={styles.weekDay}>{day}</div>
              ))}
            </div>
            
            <div className={styles.days}>
              {generateCalendarDays().map((date) => (
                <button
                  key={date.toISOString()}
                  type="button"
                  className={`
                    ${styles.day}
                    ${!isCurrentMonth(date) ? styles.otherMonth : ''}
                    ${isSelectedDate(date) ? styles.selected : ''}
                    ${isToday(date) ? styles.today : ''}
                    ${isDateDisabled(date) ? styles.disabledDate : ''}
                  `}
                  onClick={() => !isDateDisabled(date) && handleDateSelect(date)}
                  disabled={isDateDisabled(date)}
                >
                  {date.getDate()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {(error || helperText) && (
        <div className={styles.helperText}>
          {error ? (
            <span className={styles.errorText}>{error}</span>
          ) : (
            <span className={styles.helperTextContent}>{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';
