import React from 'react';
import styles from './NavBar.module.css';

interface NavBarProps {
  links: { name: string; href: string }[];
}

const NavBar: React.FC<NavBarProps> = ({ links }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <a href="/">My Profile</a>
      </div>
      <ul className={styles.navLinks}>
        {links.map((link) => (
          <li key={link.name} className={styles.navItem}>
            <a href={link.href}>{link.name}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
