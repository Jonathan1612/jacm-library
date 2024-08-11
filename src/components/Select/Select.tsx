import { useState, CSSProperties, useRef} from 'react'
import styles from './Select.module.css'
import iconArrowDown from './arrowDropDown.svg'
import iconArrowUp from './arrowDropUp.svg'

type Option = {
    label: string;
    value: string;
};

type SelectProps = {
    options: Option[]; // Array de opciones para seleccionar
    placeholder?: string; // Texto que aparece cuando no hay selección
    variant?: 'primary' | 'secondary' | 'normal'; // Variantes de estilo
    size?: 'small' | 'medium' | 'large'; // Tamaños del select
    className?: string;
    style?: CSSProperties;
    onChange?: (value: string) => void; // Callback cuando se selecciona una opción
}

const Select: React.FC<SelectProps> = ({
    options,
    placeholder = 'Todos',
    variant = 'primary',
    size = 'small',
    className = '',
    style,
    onChange,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const selectRef = useRef<HTMLDivElement>(null);
  
    const handleOptionClick = (value: string) => {
      setSelectedValue(value);
      setIsOpen(false);
      if (onChange) {
        onChange(value);
      }
    };
  
    const handleToggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  return (
    <div ref={selectRef} className={`${styles[variant]} ${styles[size]} ${isOpen ? styles.selectContainerOpen : styles.selectContainer} ${className}`} style={style} onClick={handleToggleDropdown}>
      <div className={isOpen ? styles.contanerLabelOpen : styles.contanerLabel} >
      <span className={styles.selectedText}>
          {selectedValue
            ? options.find(option => option.value === selectedValue)?.label
            : placeholder}
        </span>
      </div>
      { isOpen ? <img src={iconArrowUp} />: <img src={iconArrowDown} /> }
      {isOpen && (
        <div className={styles.dropdown}>
          {options.map(option => (
            <div
              key={option.value}
              className={styles.option}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Select
