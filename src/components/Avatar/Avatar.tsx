"use client";
import React from 'react';
import styles from './Avatar.module.css';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'small' | 'medium' | 'large' | number;
  name?: string;
  shape?: 'circle' | 'square';
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'medium', name, shape = 'circle' }) => {
  const getInitials = () => {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    return nameParts.length > 1
      ? nameParts[0][0] + nameParts[1][0]
      : nameParts[0][0];
  };

  const sizeStyle = typeof size === 'number' ? { width: size, height: size } : {};
  const classNames = `
    ${styles.avatar} 
    ${styles[size as string]} 
    ${shape === 'circle' ? styles.circle : styles.square}
  `;

  return (
    <div className={classNames} style={sizeStyle}>
      {src ? (
        <img src={src} alt={alt || 'Avatar'} className={styles.image} />
      ) : (
        <span className={styles.initials}>{getInitials()}</span>
      )}
    </div>
  );
};

export default Avatar;
