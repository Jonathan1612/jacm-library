import React from 'react';
import SkillCard from '../SkillCard/SkillCard';
import styles from './SkillList.module.css';

interface Skill {
  icon: string;
  name: string;
  level: number;
}

interface SkillListProps {
  skills: Skill[];
}

const SkillList: React.FC<SkillListProps> = ({ skills }) => {
  return (
    <div className={styles.list}>
      {skills.map((skill, index) => (
        <SkillCard key={index} icon={skill.icon} name={skill.name} level={skill.level} />
      ))}
    </div>
  );
};

export default SkillList;
