"use client";
import React, { CSSProperties, useState, ChangeEvent } from "react";
import styles from "./Switch.module.css";

type SwitchProps = {
  checked?: boolean; // Si el switch está activado o no
  onChange?: (checked: boolean) => void; // Función que se ejecuta al cambiar el estado
  variant?: "primary" | "secondary" | "normal"; // Variantes de estilo
  size?: "small" | "medium" | "large"; // Tamaños del switch
  leftName?: string;
  rightName?: string;
  className?: string;
  style?: CSSProperties;
};

const Switch: React.FC<SwitchProps> = ({
  checked: controlledChecked,
  onChange,
  variant = "primary",
  size = "medium",
  leftName,
  rightName,
  className = "",
  style,
}) => {
  const [checked, setChecked] = useState(controlledChecked || false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    if (controlledChecked === undefined) {
      setChecked(newChecked);
    }
    if (onChange) {
      onChange(newChecked);
    }
  };
  return (
    <div className={styles.containerDiv}>
      <span className={styles.nameL}>{leftName}</span>
      <label
        className={`${styles.switchContainer} ${className} ${styles[variant]} ${styles[size]}`}
        style={style}
      >
        <input
          type="checkbox"
          className={styles.switchInput}
          checked={
            controlledChecked !== undefined ? controlledChecked : checked
          }
          onChange={handleChange}
        />
        <span className={styles.switchSlider}></span>
      </label>
      <span className={styles.nameR}>{rightName}</span>
    </div>
  );
};

export default Switch;
