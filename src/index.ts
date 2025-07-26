import './styles/theme.css';
import './styles.module';

// Atomic Design Architecture
// Atoms - Basic building blocks
export * from './atoms';

// Types
export * from './types/common';

// Utils
export * from './utils/classNames';

// Legacy Components (to be migrated)
export { default as Card } from './components/Card/Card';
export { default as ColorTest } from './components/ColorTest/ColorTest';
export { default as DraggableList } from './components/DraggableList/DraggableList';
export { default as IconMediaLink } from './components/IconMediaLink/IconMediaLink';
export { default as IconCounter } from './components/IconCounter/IconCounter';
export { default as InputSearch } from './components/InputSearch/InputSearch';
export { default as NavBar } from './components/NavBar/NavBar';
export { default as NestedMenu } from './components/NestedMenu/NestedMenu';
export { default as NestedMenuItem } from './components/NestedMenuItem/NestedMenuItem';
export { default as ProfileCard } from './components/ProfileCard/ProfileCard';
export { default as Select } from './components/Select/Select';
export { default as Sidebar } from './components/Sidebar/Sidebar';
export { default as SkillCard } from './components/SkillCard/SkillCard';
export { default as SkillList } from './components/SkillList/SkillList';
export { Tabs, Tab } from './components/Tabs/Tabs';
export { default as Tooltip } from './components/Tooltip/Tooltip';
export { default as WorkExperienceList } from './components/WorkExperienceList/WorkExperienceList';

//Images
export { default as defaultAvatar } from './assets/images/perfil.jpg';

export { default as defaultIcon } from './assets/images/facebook.png';
export { default as defaultFontPage } from './assets/images/portada.jpg';
