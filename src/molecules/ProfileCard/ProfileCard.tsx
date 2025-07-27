import React, { forwardRef } from 'react';
import { BaseComponentProps, ComponentSize } from '../../types/common';
import { Card, CardContent } from '../../atoms/Card';
import { Avatar } from '../../atoms/Avatar';
import { cn } from '../../utils/classNames';
import styles from './ProfileCard.module.css';

export interface ProfileCardProps extends BaseComponentProps {
  /** URL de la imagen de perfil */
  profileImage: string;
  /** URL de la imagen de portada */
  coverImage?: string;
  /** Nombre de la persona */
  name: string;
  /** Descripción o título */
  description?: string;
  /** Información adicional */
  subtitle?: string;
  /** Tamaño del avatar */
  avatarSize?: ComponentSize;
  /** Si el card es clickeable */
  clickable?: boolean;
  /** Callback al hacer click */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Acciones adicionales */
  actions?: React.ReactNode;
  /** Si mostrar el avatar encima de la portada */
  overlayAvatar?: boolean;
  /** Altura de la imagen de portada */
  coverHeight?: number | string;
}

export const ProfileCard = forwardRef<HTMLDivElement, ProfileCardProps>(({
  profileImage,
  coverImage,
  name,
  description,
  subtitle,
  avatarSize = 'large',
  clickable = false,
  onClick,
  actions,
  overlayAvatar = true,
  coverHeight = 120,
  className,
  style,
  ...props
}, ref) => {
  const cardClasses = cn(
    styles.profileCard,
    clickable && styles.clickable,
    className
  );

  const coverStyle = {
    height: typeof coverHeight === 'number' ? `${coverHeight}px` : coverHeight
  };

  return (
    <Card
      ref={ref}
      className={cardClasses}
      style={style}
      clickable={clickable}
      onClick={onClick}
      padding="none"
      {...props}
    >
      {/* Cover Image */}
      {coverImage && (
        <div className={styles.coverContainer} style={coverStyle}>
          <img
            src={coverImage}
            alt="Portada"
            className={styles.coverImage}
          />
        </div>
      )}

      {/* Avatar - puede estar superpuesto o no */}
      <div className={cn(
        styles.avatarContainer,
        overlayAvatar && coverImage && styles.overlayAvatar,
        !coverImage && styles.nocover
      )}>
        <Avatar
          src={profileImage}
          alt={name}
          size={avatarSize}
          className={styles.avatar}
        />
      </div>

      {/* Content */}
      <CardContent className={styles.content}>
        <div className={styles.info}>
          <h3 className={styles.name}>{name}</h3>
          {subtitle && (
            <p className={styles.subtitle}>{subtitle}</p>
          )}
          {description && (
            <p className={styles.description}>{description}</p>
          )}
        </div>
        
        {actions && (
          <div className={styles.actions}>
            {actions}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

ProfileCard.displayName = 'ProfileCard';
