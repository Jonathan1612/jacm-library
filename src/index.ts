import './styles/theme.css';
import './styles.module';

// Atomic Design Architecture
// Atoms - Basic building blocks
export * from './atoms';

// Molecules - Simple combinations of atoms
export * from './molecules';

// Organisms - Complex UI components
export * from './organisms';

// Types
export * from './types/common';

// Utils
export * from './utils/classNames';

// Assets - Images
export { default as defaultAvatar } from './assets/images/perfil.jpg';
export { default as defaultIcon } from './assets/images/facebook.png';
export { default as defaultFontPage } from './assets/images/portada.jpg';
