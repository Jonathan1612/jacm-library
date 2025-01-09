import React from 'react';
import styles from './ProfileCard.module.css';

interface ProfileCardProps {
  profileImage: string;
  coverImage: string;
  name: string;
  description?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profileImage,
  coverImage,
  name,
  description,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.coverContainer}>
        <img src={coverImage} alt="Cover" className={styles.coverImage} />
      </div>
      <div className={styles.profileContainer}>
        <img src={profileImage} alt={name} className={styles.profileImage} />
      </div>
      <div className={styles.infoContainer}>
        <h2 className={styles.name}>{name}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  );
};

export default ProfileCard;
