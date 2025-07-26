"use client";
import React, { useState, ReactNode, CSSProperties } from "react";
import styles from "./Tabs.module.css";

// 📝 **Props para Tab**
type TabProps = {
  label: string; // Etiqueta visible de la pestaña
  children: ReactNode; // Contenido que se muestra al seleccionar la pestaña
};

// 📝 **Props para Tabs**
type TabsProps = {
  children: ReactNode; // Deben ser componentes Tab
  defaultActiveTab?: number; // Índice de la pestaña que está activa por defecto
  variant?: "primary" | "secondary" | "normal";
  size?: "small" | "medium" | "large";
  className?: string;
  style?: CSSProperties;
};

// 📌 **Componente Tab**
const Tab: React.FC<TabProps> = ({ children }) => {
  return <div className={styles.tabContent}>{children}</div>;
};

// 📌 **Componente Tabs**
const Tabs: React.FC<TabsProps> = ({
  children,
  defaultActiveTab = 0,
  variant = "primary",
  size = "small",
  className = "",
  style,
}) => {
  const [activeTab, setActiveTab] = useState<number>(defaultActiveTab);

  // 🧠 **Filtrar y validar los hijos como elementos válidos de React**
  const childrenArray = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === Tab
  ) as React.ReactElement<TabProps>[];

  // 🛡️ **Evitar índices fuera de rango**
  const safeActiveTab = Math.min(Math.max(activeTab, 0), childrenArray.length - 1);

  // 🔄 **Manejar clic en las pestañas**
  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className={`${styles.tabsContainer} ${className}`} style={style}>
      {/* 📝 Lista de botones de las pestañas */}
      <div className={`${styles.tabList} ${styles[variant]} ${styles[size]}`}>
        {childrenArray.map((child, index) => (
          <button
            key={index}
            className={`${styles.tabButton} ${
              safeActiveTab === index ? styles.active : ""
            }`}
            onClick={() => handleTabClick(index)}
          >
            {child.props.label}
          </button>
        ))}
      </div>

      {/* 📝 Contenido de la pestaña activa */}
      <div className={styles.tabContent}>
        {childrenArray[safeActiveTab]?.props.children}
      </div>
    </div>
  );
};

export { Tabs, Tab };
