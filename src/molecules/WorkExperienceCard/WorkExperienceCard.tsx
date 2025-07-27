import React, { forwardRef } from 'react';
import { BaseComponentProps, ComponentVariant } from '../../types/common';
import { Card, CardHeader, CardContent } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';
import { cn } from '../../utils/classNames';
import styles from './WorkExperienceCard.module.css';

export interface WorkExperienceCardProps extends BaseComponentProps {
  /** Nombre de la empresa */
  company: string;
  /** Logo de la empresa */
  companyLogo?: string;
  /** Visión o descripción de la empresa */
  vision?: string;
  /** Posición o cargo */
  position: string;
  /** Fecha de inicio */
  startDate: string;
  /** Fecha de fin */
  endDate: string;
  /** Si el trabajo es actual */
  current?: boolean;
  /** Actividades realizadas */
  activities: string;
  /** Proyectos en los que participó */
  projects?: string[];
  /** Tecnologías utilizadas */
  technologies?: string[];
  /** Logros destacados */
  achievements?: string[];
  /** Variante del card */
  variant?: ComponentVariant;
  /** Si el card es clickeable */
  clickable?: boolean;
  /** Callback al hacer click */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export const WorkExperienceCard = forwardRef<HTMLDivElement, WorkExperienceCardProps>(({
  company,
  companyLogo,
  vision,
  position,
  startDate,
  endDate,
  current = false,
  activities,
  projects,
  technologies,
  achievements,
  variant = 'outlined',
  clickable = false,
  onClick,
  className,
  style,
  ...props
}, ref) => {
  const cardClasses = cn(
    styles.workExperienceCard,
    className
  );

  const formatDateRange = () => {
    const endDisplay = current ? 'Presente' : endDate;
    return `${startDate} - ${endDisplay}`;
  };

  return (
    <Card
      ref={ref}
      className={cardClasses}
      style={style}
      variant={variant as ComponentVariant | 'outlined' | 'elevated' | 'filled'}
      clickable={clickable}
      onClick={onClick}
      {...props}
    >
      <CardHeader
        avatar={companyLogo && (
          <img
            src={companyLogo}
            alt={`${company} logo`}
            className={styles.companyLogo} />
        )}
        title={<span className={styles.company}>{company}</span>}
        subtitle={<div className={styles.headerInfo}>
          <span className={styles.position}>{position}</span>
          <span className={styles.dateRange}>
            {formatDateRange()}
            {current && (
              <Badge
                text="Actual"
                variant="success"
                size="small"
                standalone
                className={styles.currentBadge} />
            )}
          </span>
        </div>} children={undefined}      >
        {/* Children content can be empty */}
      </CardHeader>

      <CardContent className={styles.content}>
        {vision && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Acerca de la empresa</h4>
            <p className={styles.vision}>{vision}</p>
          </div>
        )}

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Actividades</h4>
          <p className={styles.activities}>{activities}</p>
        </div>

        {achievements && achievements.length > 0 && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Logros</h4>
            <ul className={styles.list}>
              {achievements.map((achievement, index) => (
                <li key={index} className={styles.listItem}>
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {projects && projects.length > 0 && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Proyectos</h4>
            <ul className={styles.list}>
              {projects.map((project, index) => (
                <li key={index} className={styles.listItem}>
                  {project}
                </li>
              ))}
            </ul>
          </div>
        )}

        {technologies && technologies.length > 0 && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Tecnologías</h4>
            <div className={styles.technologies}>
              {technologies.map((tech, index) => (
                <Badge
                  key={index}
                  text={tech}
                  variant="secondary"
                  size="small"
                  standalone
                  className={styles.techBadge}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

WorkExperienceCard.displayName = 'WorkExperienceCard';
