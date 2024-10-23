import React, { useState, useEffect, useRef } from 'react';
import styles from './CustomDate.module.css';

interface CalendarProps {
  onSelectDate: (date: Date) => void;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Función para formatear la fecha en DD/MM/YYYY
const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Función para agregar automáticamente los separadores "/" en el input
const formatInputValue = (value: string) => {
  const cleanedValue = value.replace(/\D/g, ''); // Elimina todo excepto números
  const day = cleanedValue.substring(0, 2);
  const month = cleanedValue.substring(2, 4);
  const year = cleanedValue.substring(4, 8);
  if (cleanedValue.length <= 2) return day;
  if (cleanedValue.length <= 4) return `${day}/${month}`;
  return `${day}/${month}/${year}`;
};

const CustomDate: React.FC<CalendarProps> = ({ onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false); // Estado para mostrar el menú de selección de años
  const calendarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  // Obtener los días del mes anterior y siguiente
  const prevMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
  const nextMonthStart = 1;

  // Días que rellenan antes del mes actual
  const prevMonthDays = Array.from(
    { length: startDay },
    (_, i) => prevMonthEnd - startDay + i + 1
  );

  // Días del mes actual
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Días que rellenan después del mes actual
  const totalDisplayedDays = prevMonthDays.length + currentMonthDays.length;
  const nextMonthDays = Array.from(
    { length: 42 - totalDisplayedDays },
    (_, i) => nextMonthStart + i
  );

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleSelectDay = (day: number, isCurrentMonth: boolean) => {
    const selected = isCurrentMonth
      ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      : new Date(currentDate.getFullYear(), currentDate.getMonth() + (day < 15 ? 1 : -1), day);
    
    setSelectedDate(selected);
    onSelectDate(selected);

    // Actualizamos el valor del input
    if (inputRef.current) {
      inputRef.current.value = formatDate(selected); // Mostrar la fecha en formato DD/MM/YYYY
    }

    // Cerrar el calendario después de seleccionar la fecha
    setShowCalendar(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, ''); // Solo permitir números
    value = formatInputValue(value); // Formatear el valor con "/"
    inputRef.current!.value = value;

    // Validación para asegurar que siga el formato DD/MM/YYYY
    const [day, month, year] = value.split('/').map(Number);
    if (day && month && year && year.toString().length === 4) {
      const date = new Date(year, month - 1, day);
      if (!isNaN(date.getTime())) {
        setCurrentDate(date);
        setSelectedDate(date);
        onSelectDate(date);
      }
    }
  };

  // Manejar la selección de un año en el dropdown
  const handleSelectYear = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), currentDate.getDate()));
    setShowYearDropdown(false); // Cerrar el dropdown de años después de seleccionar
  };

  const years = Array.from({ length: 201 }, (_, i) => 1900 + i); // Rango de años desde 1900 hasta el año actual + algunos años futuros

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.inputContainer}>
        <input
          ref={inputRef}
          type="text"
          onChange={handleInputChange}
          placeholder="DD/MM/YYYY"
          className={styles.dateInput}
          maxLength={10} // Asegurar que no se pueda exceder el formato DD/MM/YYYY
        />
        <button onClick={() => setShowCalendar(!showCalendar)} className={styles.calendarIcon}>
          📅
        </button>
      </div>

      {showCalendar && (
        <div ref={calendarRef} className={styles.calendar}>
          <div className={styles.header}>
            <button onClick={handlePreviousMonth} className={styles.navButton}>❮</button>

            {/* Al hacer clic en el año, mostramos el dropdown de selección de años */}
            <span onClick={() => setShowYearDropdown(!showYearDropdown)} className={styles.yearSelector}>
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>

            <button onClick={handleNextMonth} className={styles.navButton}>❯</button>
          </div>

          {/* Dropdown de años */}
          {showYearDropdown && (
            <div className={styles.yearDropdown}>
              {years.map(year => (
                <div
                  key={year}
                  className={styles.yearItem}
                  onClick={() => handleSelectYear(year)}
                >
                  {year}
                </div>
              ))}
            </div>
          )}

          <div className={styles.weekdays}>
            {daysOfWeek.map(day => (
              <div key={day} className={styles.weekday}>{day}</div>
            ))}
          </div>

          <div className={styles.days}>
            {prevMonthDays.map((day, index) => (
              <div key={`prev-${index}`} className={styles.dayInactive}>{day}</div>
            ))}
            {currentMonthDays.map(day => (
              <div
                key={day}
                className={styles.day}
                onClick={() => handleSelectDay(day, true)}
              >
                {day}
              </div>
            ))}
            {nextMonthDays.map((day, index) => (
              <div key={`next-${index}`} className={styles.dayInactive}>{day}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDate;
