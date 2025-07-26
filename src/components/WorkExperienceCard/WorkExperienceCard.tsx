import React from 'react';
import styles from './WorkExperienceCard.module.css';

interface WorkExperienceCardProps {
  company: string;
  vision?: string;
  position: string;
  startDate: string;
  endDate: string;
  activities: string;
  proyects?: string[];
  languages: string[];
}

const WorkExperienceCard: React.FC<WorkExperienceCardProps> = ({
  company,
  vision,
  position,
  startDate,
  endDate,
  activities,
  proyects,
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
        {proyects ? 
        <div className={styles.languages}>
          <strong>Proyectos Participado:</strong>
          <ul>
            {proyects.map((proyect, index) => (
              <li key={index}>{proyect}</li>
            ))}
          </ul>
        </div> 
        :
        <div></div>
        }
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
