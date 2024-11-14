import React from 'react';
import styles from './Tooltip.module.css';

interface TooltipProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, position = 'top', children }) => {
  return (
    <div className={styles.tooltipContainer}>
      {children}
      <div className={`${styles.tooltip} ${styles[position]}`}>{text}</div>
    </div>
  );
};

export default Tooltip;
