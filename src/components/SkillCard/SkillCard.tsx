import React from 'react';
import styles from './SkillCard.module.css';

interface SkillCardProps {
  icon: string; // URL o ruta del icono
  name: string; // Nombre del lenguaje
  level: number; // Nivel en porcentaje (0 a 100)
}

const SkillCard: React.FC<SkillCardProps> = ({ icon, name, level }) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconContainer}>
        <img src={icon} alt={`${name} icon`} className={styles.icon} />
      </div>
      <div className={styles.infoContainer}>
        <h3 className={styles.name}>{name}</h3>
        <div className={styles.levelBar}>
          <div className={styles.levelFill} style={{ width: `${level}%` }} />
        </div>
        <p className={styles.levelText}>{level}%</p>
      </div>
    </div>
  );
};

export default SkillCard;
