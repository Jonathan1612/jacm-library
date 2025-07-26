import React, { CSSProperties, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  useClassName?: string;
  useStyle?: CSSProperties;
  leftIcon?: string;
  rightIcon?: string;
  name: string;
  variant?: 'primary' | 'secondary' | 'normal';
  size?: 'small' | 'large' | 'medium';
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({
  name,
  variant = 'primary',
  size = 'small',
  useClassName = '',
  leftIcon,
  rightIcon,
  ...buttonProps
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${useClassName}`}
      style={buttonProps.useStyle || {}}
      {...buttonProps}
    >
      {leftIcon && <img className={styles.leftIcon} src={leftIcon} />}
      <span className={styles.text}>{name}</span>
      {rightIcon && <img className={styles.rightIcon} src={rightIcon} />}
    </button>
  );
};

export default Button;
