"use client";
import React from "react";
import { useState, CSSProperties, ChangeEvent } from "react";
import styles from "./Slider.module.css";

type SliderProps = {
  min?: number;
  max?: number;
  step?: number;
  initialValue?: number;
  variant: "primary" | "secondary" | "normal";
  size?: "small" | "medium" | "large";
  className?: string;
  style?: CSSProperties;
  onChange?: (value: number) => void;
};

const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  initialValue = 50,
  variant = "primary",
  size = "medium",
  className = "",
  style,
  onChange,
}) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div
      className={`${styles.sliderContainer} ${className} ${styles[variant]} ${styles[size]}`}
      style={style}
    >
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className={styles.slider}
      />
      <span className={styles.valueLabel}>{value}</span>
    </div>
  );
};

export default Slider;
