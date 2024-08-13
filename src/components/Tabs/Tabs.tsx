import React, { useState, ReactNode, CSSProperties } from 'react';
import styles from './Tabs.module.css';

// Resto del código del componente


type TabProps = {
  label: string; // Etiqueta visible de la pestaña
  children: ReactNode; // Contenido que se muestra al seleccionar la pestaña
};

type TabsProps = {
  children: ReactNode; // Deben ser Tab components
  defaultActiveTab?: number; // Índice de la pestaña que está activa por defecto
  variant?: 'primary' | 'secondary' | 'normal';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  style?: CSSProperties;
};

const Tab: React.FC<TabProps> = ({ children }) => {
  return <div className={styles.tabContent}>{children}</div>;
};

const Tabs: React.FC<TabsProps> = ({
  children,
  defaultActiveTab = 0,
  variant = 'primary',
  size = 'medium',
  className = '',
  style,
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className={`${styles.tabsContainer} ${className}`} style={style}>
      <div className={`${styles.tabList} ${styles[variant]} ${styles[size]}`}>
        {React.Children.map(children, (child, index) => (
          <button
            key={index}
            className={`${styles.tabButton} ${
              activeTab === index ? styles.active : ''
            }`}
            onClick={() => handleTabClick(index)}
          >
            {(child as React.ReactElement<TabProps>).props.label}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {React.Children.toArray(children)[activeTab]}
      </div>
    </div>
  );
};

export { Tabs, Tab };
