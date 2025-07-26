"use client";
import React, { CSSProperties, InputHTMLAttributes, useState } from "react";
import styles from "./Checkbox.module.css";

type CheckboxProps = {
  variant?: "primary" | "secondary" | "normal";
  size?: "small" | "medium" | "large";
  className?: string;
  style?: CSSProperties;
  nameLeft?: string;
  nameRight?: string;
  initialChecked?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

const Checkbox: React.FC<CheckboxProps> = ({
  variant = "primary",
  size = "medium",
  nameLeft,
  nameRight,
  initialChecked = false,
  className = "",
  onChange,
  ...inputProps
}) => {
  const [isChecked, setIsChecked] = useState(initialChecked);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    if (onChange) onChange(e);
  };

  const sizeClass = styles[size] || styles.medium;
  const variantClass = styles[variant] || styles.primary;
  const checkedClass = isChecked ? `${styles[variant]} ${styles.checkmark}` : styles.checked;

  return (
    <label
      className={`${styles.checkboxContainer} ${className}`}
      style={inputProps.style || {}}
    >
      {/* Checkbox input */}
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        className={styles.checkbox}
        {...inputProps}
      />

      {/* Estilización visual */}
      {nameLeft && <span className={styles.labelTextLeft}>{nameLeft}</span>}
      <span
        className={`${styles.checkmark} ${sizeClass} ${variantClass} ${checkedClass}`}
      ></span>
      {nameRight && <span className={styles.labelTextRight}>{nameRight}</span>}
    </label>
  );
};

export default Checkbox;
