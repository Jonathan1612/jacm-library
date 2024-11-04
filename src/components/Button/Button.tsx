import React from "react";
import { CSSProperties, ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type ButtonProps = {
  className?: string;
  style?: CSSProperties;
  leftIcon?: string;
  rightIcon?: string;
  name: string;
  variant?: "primary" | "secondary" | "normal";
  size?: "small" | "large" | "medium";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({
  name,
  variant = "primary",
  size = "small",
  className = "",
  leftIcon,
  rightIcon,
  ...buttonProps
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
      style={buttonProps.style || {}}
      {...buttonProps}
    >
      {leftIcon && <img className={styles.leftIcon} src={leftIcon} />}
      <span className={styles.text}>{name}</span>
      {rightIcon && <img className={styles.rightIcon} src={rightIcon} />}
    </button>
  );
};

export default Button;
