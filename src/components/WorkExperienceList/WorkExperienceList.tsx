import React from 'react';
import WorkExperienceCard from '../WorkExperienceCard/WorkExperienceCard';
import styles from './WorkExperienceList.module.css';

interface WorkExperience {
  company: string;
  vision?: string;
  position: string;
  startDate: string;
  endDate: string;
  activities: string;
  proyects?: string[];
  languages: string[];
}

interface WorkExperienceListProps {
  experiences: WorkExperience[];
}

const WorkExperienceList: React.FC<WorkExperienceListProps> = ({ experiences }) => {
  return (
    <div className={styles.list}>
      {experiences.map((experience, index) => (
        <WorkExperienceCard key={index} {...experience} />
      ))}
    </div>
  );
};

export default WorkExperienceList;
