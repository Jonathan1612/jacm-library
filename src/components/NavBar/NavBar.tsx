import React from 'react';
import styles from './NavBar.module.css';

interface NavBarProps {
  title: string;
  links: { name: string; href: string }[];
}

const NavBar: React.FC<NavBarProps> = ({ title, links }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <a className={styles.title} href="/profile">{title}</a>
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
