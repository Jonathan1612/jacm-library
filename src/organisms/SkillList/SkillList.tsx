import React, { forwardRef } from 'react';
import { BaseComponentProps } from '../../types/common';
import { SkillCard, SkillCardProps } from '../../molecules/SkillCard';
import { cn } from '../../utils/classNames';
import styles from './SkillList.module.css';

export interface Skill {
  id?: string;
  icon?: string;
  iconElement?: React.ReactNode;
  name: string;
  level: number;
  description?: string;
}

export interface SkillListProps extends BaseComponentProps {
  /** Lista de habilidades */
  skills: Skill[];
  /** Título de la lista */
  title?: string;
  /** Layout de la lista */
  layout?: 'grid' | 'list';
  /** Número de columnas en grid */
  columns?: number;
  /** Si mostrar animaciones */
  animated?: boolean;
  /** Props adicionales para cada SkillCard */
  cardProps?: Partial<SkillCardProps>;
  /** Callback al hacer click en una skill */
  onSkillClick?: (skill: Skill, index: number) => void;
}

export const SkillList = forwardRef<HTMLDivElement, SkillListProps>(({
  skills,
  title,
  layout = 'grid',
  columns = 3,
  animated = true,
  cardProps = {},
  onSkillClick,
  className,
  style,
  ...props
}, ref) => {
  const containerClasses = cn(
    styles.skillList,
    styles[layout],
    className
  );

  const gridStyle = layout === 'grid' ? {
    '--columns': columns,
    ...style
  } : style;

  const handleSkillClick = (skill: Skill, index: number) => {
    onSkillClick?.(skill, index);
  };

  return (
    <div
      ref={ref}
      className={containerClasses}
      style={gridStyle as React.CSSProperties}
      {...props}
    >
      {title && (
        <h2 className={styles.title}>{title}</h2>
      )}
      
      <div className={styles.list}>
        {skills.map((skill, index) => (
          <SkillCard
            key={skill.id || `skill-${index}`}
            icon={skill.icon}
            iconElement={skill.iconElement}
            name={skill.name}
            level={skill.level}
            description={skill.description}
            animated={animated}
            clickable={!!onSkillClick}
            onClick={() => handleSkillClick(skill, index)}
            className={styles.skillCard}
            {...cardProps}
          />
        ))}
      </div>
    </div>
  );
});

SkillList.displayName = 'SkillList';
