'use client';
import React from 'react';
import MenuItem from '../../interfaces/menuItem'; // Donde hayas definido la interface
import NestedMenuItem from '../NestedMenuItem/NestedMenuItem';
import styles from './NestedMenu.module.css';

interface NestedMenuProps {
  items: MenuItem[];
}

const NestedMenu: React.FC<NestedMenuProps> = ({ items }) => {
  return (
    <ul className={styles.menu}>
      {items.map((item, index) => (
        <NestedMenuItem key={index} item={item} />
      ))}
    </ul>
  );
};

export default NestedMenu;
