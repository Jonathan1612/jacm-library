import React, { forwardRef } from 'react';
import { BaseComponentProps } from '../../types/common';
import { WorkExperienceCard, WorkExperienceCardProps } from '../../molecules/WorkExperienceCard';
import { cn } from '../../utils/classNames';
import styles from './WorkExperienceList.module.css';

export interface WorkExperience {
  id?: string;
  company: string;
  companyLogo?: string;
  vision?: string;
  position: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  activities: string;
  projects?: string[];
  technologies?: string[];
  achievements?: string[];
}

export interface WorkExperienceListProps extends BaseComponentProps {
  /** Lista de experiencias laborales */
  experiences: WorkExperience[];
  /** Título de la lista */
  title?: string;
  /** Layout de la lista */
  layout?: 'timeline' | 'grid' | 'list';
  /** Si mostrar línea de tiempo */
  showTimeline?: boolean;
  /** Props adicionales para cada WorkExperienceCard */
  cardProps?: Partial<WorkExperienceCardProps>;
  /** Callback al hacer click en una experiencia */
  onExperienceClick?: (experience: WorkExperience, index: number) => void;
}

export const WorkExperienceList = forwardRef<HTMLDivElement, WorkExperienceListProps>(({
  experiences,
  title,
  layout = 'list',
  showTimeline = layout === 'timeline',
  cardProps = {},
  onExperienceClick,
  className,
  style,
  ...props
}, ref) => {
  const containerClasses = cn(
    styles.workExperienceList,
    styles[layout],
    showTimeline && styles.withTimeline,
    className
  );

  const handleExperienceClick = (experience: WorkExperience, index: number) => {
    onExperienceClick?.(experience, index);
  };

  return (
    <div
      ref={ref}
      className={containerClasses}
      style={style}
      {...props}
    >
      {title && (
        <h2 className={styles.title}>{title}</h2>
      )}
      
      <div className={styles.list}>
        {experiences.map((experience, index) => (
          <div key={experience.id || `experience-${index}`} className={styles.experienceItem}>
            {showTimeline && (
              <div className={styles.timelineIndicator}>
                <div className={styles.timelineNode} />
                {index < experiences.length - 1 && (
                  <div className={styles.timelineLine} />
                )}
              </div>
            )}
            
            <WorkExperienceCard
              company={experience.company}
              companyLogo={experience.companyLogo}
              vision={experience.vision}
              position={experience.position}
              startDate={experience.startDate}
              endDate={experience.endDate}
              current={experience.current}
              activities={experience.activities}
              projects={experience.projects}
              technologies={experience.technologies}
              achievements={experience.achievements}
              clickable={!!onExperienceClick}
              onClick={() => handleExperienceClick(experience, index)}
              className={styles.experienceCard}
              {...cardProps}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

WorkExperienceList.displayName = 'WorkExperienceList';
