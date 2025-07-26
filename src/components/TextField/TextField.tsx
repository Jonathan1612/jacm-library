"use client";
import React from "react";
import { useState, CSSProperties, InputHTMLAttributes } from "react";
import styles from "./TextField.module.css";

type TextFieldProps = {
  value?: string; // Valor del campo de texto
  onChange?: (value: string) => void; // Función que se ejecuta al cambiar el valor
  variant?: "primary" | "secondary" | "normal"; // Variantes de estilo
  size?: "small" | "medium" | "large"; // Tamaños del campo de texto
  placeholder?: string; // Placeholder para el campo de texto
  className?: string;
  style?: CSSProperties;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">;

const TextField: React.FC<TextFieldProps> = ({
  value: controlledValue,
  onChange,
  variant = "primary",
  size = "medium",
  placeholder = "",
  className = "",
  style,
  ...inputProps
}) => {
  const [value, setValue] = useState(controlledValue || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) {
      setValue(newValue);
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <input
      type="text"
      value={controlledValue !== undefined ? controlledValue : value}
      onChange={handleChange}
      placeholder={placeholder}
      className={`${styles.textField} ${styles[variant]} ${styles[size]} ${className}`}
      style={style}
      {...inputProps}
    />
  );
};

export default TextField;
