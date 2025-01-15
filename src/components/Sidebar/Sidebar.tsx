'use client';
import React, { useState } from 'react';
import NestedMenu from '../NestedMenu/NestedMenu'; // O desde tu librería si lo exportas
import MenuItem from '../../interfaces/menuItem';
import styles from './Sidebar.module.css';

// Puedes usar cualquier ícono; aquí un ejemplo con react-icons
import menu from '../../assets/icons/menu.svg'
import menu_open from '../../assets/icons/menu_open.svg'

interface SidebarProps {
  menuData: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ menuData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Ícono fijo en la parte superior-izquierda para abrir/cerrar */}
      <div className={styles.topIcon}>
        <button onClick={toggleSidebar} className={styles.toggleButton}>
          {isOpen ? <img src={menu} />  : <img src={menu_open} /> }
        </button>
      </div>

      {/* Menú lateral */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <NestedMenu items={menuData} />
      </aside>
    </div>
  );
};

export default Sidebar;
