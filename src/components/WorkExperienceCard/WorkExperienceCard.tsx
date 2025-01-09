import React from 'react';
import styles from './WorkExperienceCard.module.css';

interface WorkExperienceCardProps {
  company: string; // Nombre de la empresa
  vision?: string;
  position: string; // Puesto
  startDate: string; // Fecha de inicio
  endDate: string; // Fecha de fin
  activities: string; // Descripción de actividades
  languages: string[]; // Lenguajes o tecnologías usadas
}

const WorkExperienceCard: React.FC<WorkExperienceCardProps> = ({
  company,
  vision,
  position,
  startDate,
  endDate,
  activities,
  languages,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.company}>{company}</span>
        <p className={styles.vision}>{vision}</p>
        <p className={styles.position}>{position}</p>
        <p className={styles.date}>
          {startDate} - {endDate}
        </p>
      </div>
      <div className={styles.body}>
        <p className={styles.activities}>{activities}</p>
        <div className={styles.languages}>
          <strong>Lenguajes Usados:</strong>
          <ul>
            {languages.map((language, index) => (
              <li key={index}>{language}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkExperienceCard;
