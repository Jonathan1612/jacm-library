import { useState, CSSProperties, InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.css';

type CheckboxProps = {
  variant?: "primary" | "secondary" | "normal";
  size?: "small" | "large" | "medium";
  className?: string;
  style?: CSSProperties;
  nameLeft?: string;
  nameRight?: string;
  initialChecked?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

const Checkbox: React.FC<CheckboxProps> = ({
  variant = 'primary',
  size = 'small',
  nameLeft,
  nameRight,
  initialChecked = false,
  className = '',
  ...inputProps
}) => {

  const [checked, setChecked] = useState(initialChecked);

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  return (
    <label className={`${styles.checkboxContainer}`} style={inputProps.style || {}}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
        className={styles.checkbox}
        {...inputProps}
      />
      {nameLeft && <span className={styles.labelTextLeft}>{nameLeft}</span> }
      <span className={`${className} ${styles[size]} ${styles.checkmark} ${checked && styles[variant]}`}></span>
      {nameRight && <span className={styles.labelTextRight}>{nameRight}</span> }
    </label>
  );
};

export default Checkbox;
