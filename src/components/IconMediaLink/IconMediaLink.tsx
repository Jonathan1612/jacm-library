import React from 'react';
import styles from './IconMediaLink.module.css'

interface IconMediaLinksProps {
  icon: string;
  name: string;
  url: string;
  altText: string;
}

const IconMediaLink: React.FC<IconMediaLinksProps> = ({
  icon,
  name,
  url,
  altText,
}) => (
  <div className={styles.containerGen}>
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={altText}
    >
      <img src={icon} className={styles.containerIcon} />
    </a>
    <span className={styles.textSpan}>{name}</span>
  </div>
);

export default IconMediaLink;
