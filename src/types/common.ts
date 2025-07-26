import { CSSProperties, ReactNode } from 'react';

/**
 * Props comunes que todos los componentes deben soportar
 */
export interface BaseComponentProps {
  /** Clase CSS personalizada */
  className?: string;
  /** Estilos inline personalizados */
  style?: CSSProperties;
  /** ID único del elemento */
  id?: string;
  /** Datos de test para pruebas */
  'data-testid'?: string;
}

/**
 * Props para componentes que pueden tener hijos
 */
export interface ComponentWithChildren extends BaseComponentProps {
  children?: ReactNode;
}

/**
 * Tamaños estándar para componentes
 */
export type ComponentSize = 'small' | 'medium' | 'large';

/**
 * Variantes de color estándar
 */
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

/**
 * Estados de los componentes interactivos
 */
export interface InteractiveState {
  disabled?: boolean;
  loading?: boolean;
  readOnly?: boolean;
}

/**
 * Props para componentes clickeables
 */
export interface ClickableProps extends BaseComponentProps {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  disabled?: boolean;
  tabIndex?: number;
  'aria-label'?: string;
}

/**
 * Props para inputs de formulario
 */
export interface FormInputProps extends BaseComponentProps, InteractiveState {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, event?: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  required?: boolean;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
}

/**
 * Tema de colores
 */
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    text: string;
    textSecondary: string;
    background: string;
    surface: string;
    border: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
}
