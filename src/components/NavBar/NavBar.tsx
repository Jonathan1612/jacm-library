import React from 'react';
import styles from './NavBar.module.css';

interface NavBarProps {
  title: string;
  links: { name: string; href: string }[];
  className?: string;
  avatar?: React.ReactNode;
  buttonEnd?: React.ReactNode;
}

const NavBar: React.FC<NavBarProps> = ({
  title,
  links,
  className,
  avatar,
  buttonEnd,
}) => {
  return (
    <nav className={`${styles.navbar} ${className ?? ''}`}>
      <div className={styles.logo}>
        {avatar && <div className={styles.avatar}>{avatar}</div>}
        <a className={styles.title} href="/">
          {title}
        </a>
      </div>
      <div className={styles.containerEnd}>
        <ul className={styles.navLinks}>
          {links.map(link => (
            <li key={link.name} className={styles.navItem}>
              <a href={link.href}>{link.name}</a>
            </li>
          ))}
        </ul>
        {buttonEnd && <div className={styles.endSlot}>{buttonEnd}</div>}
      </div>
    </nav>
  );
};

export default NavBar;
