"use client";
import React, { CSSProperties, ChangeEvent } from "react";
import styles from "./Switch.module.css";

type SwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  variant?: "primary" | "secondary" | "normal";
  size?: "small" | "medium" | "large";
  leftName?: string;
  rightName?: string;
  className?: string;
  style?: CSSProperties;
};

const Switch: React.FC<SwitchProps> = ({
  checked,
  defaultChecked = false,
  onChange,
  variant = "primary",
  size = "medium",
  leftName,
  rightName,
  className = "",
  style,
}) => {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);

  const isControlled = checked !== undefined;
  const currentChecked = isControlled ? checked : internalChecked;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;

    if (!isControlled) {
      setInternalChecked(newChecked);
    }

    if (onChange) {
      onChange(newChecked);
    }
  };

  return (
    <div className={styles.containerDiv}>
      {leftName && <span className={styles.nameL}>{leftName}</span>}
      <label
        className={`${styles.switchContainer} ${className} ${styles[variant]} ${styles[size]}`}
        style={style}
      >
        <input
          type="checkbox"
          className={styles.switchInput}
          checked={currentChecked}
          onChange={handleChange}
        />
        <span className={styles.switchSlider}></span>
      </label>
      {rightName && <span className={styles.nameR}>{rightName}</span>}
    </div>
  );
};

export default Switch;
