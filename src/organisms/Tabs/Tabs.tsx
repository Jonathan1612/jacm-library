import React, { forwardRef, useState, useEffect, Children, isValidElement } from 'react';
import { BaseComponentProps, ComponentVariant, ComponentSize } from '../../types/common';
import { cn } from '../../utils/classNames';
import styles from './Tabs.module.css';

export interface TabItemProps {
  /** Etiqueta del tab */
  label: string;
  /** Valor único del tab */
  value: string;
  /** Si el tab está deshabilitado */
  disabled?: boolean;
  /** Icono del tab */
  icon?: React.ReactNode;
  /** Badge o contador */
  badge?: string | number;
  /** Contenido del tab */
  children: React.ReactNode;
}

export interface TabsProps extends BaseComponentProps {
  /** Tabs a mostrar */
  children: React.ReactElement<TabItemProps>[];
  /** Valor del tab activo */
  value?: string;
  /** Valor por defecto */
  defaultValue?: string;
  /** Callback al cambiar tab */
  onChange?: (value: string) => void;
  /** Variante visual */
  variant?: ComponentVariant;
  /** Tamaño de los tabs */
  size?: ComponentSize;
  /** Orientación */
  orientation?: 'horizontal' | 'vertical';
  /** Si los tabs son scrolleables */
  scrollable?: boolean;
  /** Posición de los tabs */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Si muestra indicador */
  indicator?: boolean;
  /** Si permite cerrar tabs */
  closable?: boolean;
  /** Callback al cerrar tab */
  onClose?: (value: string) => void;
  /** Densidad del contenido */
  density?: 'comfortable' | 'compact' | 'spacious';
  /** Si los tabs ocupan todo el ancho */
  fullWidth?: boolean;
}

export const TabItem = forwardRef<HTMLDivElement, TabItemProps>(({ 
  children, 
  ...props 
}, ref) => {
  return (
    <div ref={ref} role="tabpanel" {...props}>
      {children}
    </div>
  );
});

TabItem.displayName = 'TabItem';

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(({
  children,
  value,
  defaultValue,
  onChange,
  variant = 'primary',
  size = 'medium',
  orientation = 'horizontal',
  scrollable = false,
  position = 'top',
  indicator = true,
  closable = false,
  onClose,
  density = 'comfortable',
  fullWidth = false,
  className,
  style,
  ...props
}, ref) => {
  // Filtrar y validar children
  const validChildren = Children.toArray(children).filter(
    (child): child is React.ReactElement<TabItemProps> =>
      isValidElement(child) && child.type === TabItem
  );

  const [internalValue, setInternalValue] = useState(() => {
    if (defaultValue) return defaultValue;
    if (validChildren.length > 0) return validChildren[0].props.value;
    return '';
  });

  const currentValue = value ?? internalValue;
  const activeTab = validChildren.find(child => child.props.value === currentValue);
  const activeIndex = validChildren.findIndex(child => child.props.value === currentValue);

  useEffect(() => {
    if (value !== undefined && value !== currentValue) {
      setInternalValue(value);
    }
  }, [value, currentValue]);

  const handleTabClick = (tabValue: string, disabled?: boolean) => {
    if (disabled) return;
    
    if (value === undefined) {
      setInternalValue(tabValue);
    }
    onChange?.(tabValue);
  };

  const handleCloseTab = (tabValue: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onClose?.(tabValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent, tabValue: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTabClick(tabValue);
    }
  };

  const isVertical = orientation === 'vertical';
  const isPositionEnd = position === 'bottom' || position === 'right';

  const containerClasses = cn(
    styles.container,
    styles[orientation],
    styles[`position${position.charAt(0).toUpperCase() + position.slice(1)}`],
    styles[density],
    className
  );

  const tabListClasses = cn(
    styles.tabList,
    styles[variant],
    styles[size],
    scrollable && styles.scrollable,
    fullWidth && styles.fullWidth,
    isVertical && styles.vertical
  );

  const contentClasses = cn(
    styles.content,
    styles[density]
  );

  const renderTabList = () => (
    <div className={tabListClasses} role="tablist">
      {scrollable && <div className={styles.scrollButton} />}
      <div className={styles.tabsWrapper}>
        {validChildren.map((child) => {
          const isActive = child.props.value === currentValue;
          const tabClasses = cn(
            styles.tab,
            isActive && styles.active,
            child.props.disabled && styles.disabled
          );

          return (
            <button
              key={child.props.value}
              className={tabClasses}
              onClick={() => handleTabClick(child.props.value, child.props.disabled)}
              onKeyDown={(e) => handleKeyDown(e, child.props.value)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${child.props.value}`}
              id={`tab-${child.props.value}`}
              disabled={child.props.disabled}
              tabIndex={isActive ? 0 : -1}
            >
              {child.props.icon && (
                <span className={styles.tabIcon}>
                  {child.props.icon}
                </span>
              )}
              <span className={styles.tabLabel}>
                {child.props.label}
              </span>
              {child.props.badge && (
                <span className={styles.badge}>
                  {child.props.badge}
                </span>
              )}
              {closable && !child.props.disabled && (
                <button
                  className={styles.closeButton}
                  onClick={(e) => handleCloseTab(child.props.value, e)}
                  aria-label={`Cerrar ${child.props.label}`}
                  tabIndex={-1}
                >
                  ×
                </button>
              )}
            </button>
          );
        })}
        {indicator && activeIndex >= 0 && (
          <div
            className={styles.indicator}
            style={{
              [isVertical ? 'top' : 'left']: `${(activeIndex * 100) / validChildren.length}%`,
              [isVertical ? 'height' : 'width']: `${100 / validChildren.length}%`
            }}
          />
        )}
      </div>
      {scrollable && <div className={styles.scrollButton} />}
    </div>
  );

  const renderContent = () => (
    <div className={contentClasses}>
      {activeTab && (
        <div
          role="tabpanel"
          id={`tabpanel-${activeTab.props.value}`}
          aria-labelledby={`tab-${activeTab.props.value}`}
          className={styles.tabPanel}
        >
          {activeTab.props.children}
        </div>
      )}
    </div>
  );

  return (
    <div
      ref={ref}
      className={containerClasses}
      style={style}
      {...props}
    >
      {!isPositionEnd && renderTabList()}
      {renderContent()}
      {isPositionEnd && renderTabList()}
    </div>
  );
});

Tabs.displayName = 'Tabs';
