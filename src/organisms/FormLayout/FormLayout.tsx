import React, { forwardRef, useState } from 'react';
import { BaseComponentProps } from '../../types/common';
import { Button } from '../../atoms/Button/Button';
import { cn } from '../../utils/classNames';
import styles from './FormLayout.module.css';

export interface FormLayoutField {
  /** ID único del campo */
  id: string;
  /** Elemento del campo */
  field: React.ReactNode;
  /** Ancho del campo */
  width?: 'full' | 'half' | 'third' | 'quarter' | 'auto';
  /** Si el campo es requerido */
  required?: boolean;
  /** Si el campo está oculto */
  hidden?: boolean;
}

export interface FormSection {
  /** ID única de la sección */
  id: string;
  /** Título de la sección */
  title?: string;
  /** Descripción de la sección */
  description?: string;
  /** Campos de la sección */
  fields: FormLayoutField[];
  /** Si la sección está colapsada */
  collapsible?: boolean;
  /** Si la sección está colapsada por defecto */
  defaultCollapsed?: boolean;
}

export interface FormLayoutProps extends BaseComponentProps {
  /** Título del formulario */
  title?: React.ReactNode;
  /** Descripción del formulario */
  description?: React.ReactNode;
  /** Secciones del formulario */
  sections?: FormSection[];
  /** Campos sueltos (sin sección) */
  fields?: FormLayoutField[];
  /** Acciones del formulario */
  actions?: React.ReactNode;
  /** Si está cargando */
  loading?: boolean;
  /** Si está deshabilitado */
  disabled?: boolean;
  /** Callback al enviar */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  /** Callback al cancelar */
  onCancel?: () => void;
  /** Callback al resetear */
  onReset?: () => void;
  /** Variante del layout */
  variant?: 'default' | 'card' | 'steps';
  /** Tamaño del formulario */
  size?: 'small' | 'medium' | 'large';
  /** Número de columnas */
  columns?: 1 | 2 | 3 | 4;
  /** Espaciado entre campos */
  spacing?: 'compact' | 'normal' | 'relaxed';
  /** Si muestra los campos requeridos */
  showRequiredIndicator?: boolean;
  /** Texto del indicador requerido */
  requiredIndicator?: string;
  /** Si el formulario es de solo lectura */
  readOnly?: boolean;
}

export const FormLayout = forwardRef<HTMLFormElement, FormLayoutProps>(({
  title,
  description,
  sections = [],
  fields = [],
  actions,
  loading = false,
  disabled = false,
  onSubmit,
  onCancel,
  onReset,
  variant = 'default',
  size = 'medium',
  columns = 1,
  spacing = 'normal',
  showRequiredIndicator = true,
  requiredIndicator = '*',
  readOnly = false,
  className,
  style,
  ...props
}, ref) => {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(
      sections
        .filter(section => section.collapsible && section.defaultCollapsed)
        .map(section => section.id)
    )
  );

  const toggleSection = (sectionId: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(sectionId)) {
      newCollapsed.delete(sectionId);
    } else {
      newCollapsed.add(sectionId);
    }
    setCollapsedSections(newCollapsed);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!loading && !disabled && !readOnly) {
      onSubmit?.(event);
    }
  };

  const renderField = (field: FormLayoutField) => {
    if (field.hidden) return null;

    const fieldClasses = cn(
      styles.field,
      styles[`width${field.width?.charAt(0).toUpperCase()}${field.width?.slice(1)}` as keyof typeof styles] || styles.widthFull,
      field.required && showRequiredIndicator && styles.required
    );

    return (
      <div key={field.id} className={fieldClasses}>
        {field.field}
        {field.required && showRequiredIndicator && (
          <span className={styles.requiredIndicator} aria-label="requerido">
            {requiredIndicator}
          </span>
        )}
      </div>
    );
  };

  const renderFields = (fieldsToRender: FormLayoutField[]) => {
    return (
      <div className={cn(styles.fieldsGrid, styles[`columns${columns}`])}>
        {fieldsToRender.map(renderField)}
      </div>
    );
  };

  const renderSection = (section: FormSection) => {
    const isCollapsed = collapsedSections.has(section.id);
    const visibleFields = section.fields.filter(field => !field.hidden);

    if (visibleFields.length === 0) return null;

    return (
      <div key={section.id} className={styles.section}>
        {(section.title || section.description) && (
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleArea}>
              {section.title && (
                <h3 className={styles.sectionTitle}>
                  {section.title}
                </h3>
              )}
              {section.description && (
                <p className={styles.sectionDescription}>
                  {section.description}
                </p>
              )}
            </div>
            {section.collapsible && (
              <Button
                variant="secondary"
                size="small"
                onClick={() => toggleSection(section.id)}
                className={styles.collapseButton}
                aria-expanded={!isCollapsed}
                aria-label={isCollapsed ? 'Expandir sección' : 'Colapsar sección'}
              >
                {isCollapsed ? '▼' : '▲'}
              </Button>
            )}
          </div>
        )}
        {(!section.collapsible || !isCollapsed) && renderFields(visibleFields)}
      </div>
    );
  };

  const formClasses = cn(
    styles.form,
    styles[variant],
    styles[size],
    styles[spacing],
    loading && styles.loading,
    disabled && styles.disabled,
    readOnly && styles.readOnly,
    className
  );

  return (
    <form
      ref={ref}
      className={formClasses}
      style={style}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className={styles.container}>
        {/* Header */}
        {(title || description) && (
          <div className={styles.header}>
            {title && (
              <div className={styles.title}>
                {typeof title === 'string' ? (
                  <h2 className={styles.titleText}>{title}</h2>
                ) : title}
              </div>
            )}
            {description && (
              <div className={styles.description}>
                {typeof description === 'string' ? (
                  <p className={styles.descriptionText}>{description}</p>
                ) : description}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className={styles.content}>
          {/* Sections */}
          {sections.map(renderSection)}

          {/* Loose fields */}
          {fields.length > 0 && renderFields(fields)}
        </div>

        {/* Actions */}
        {actions && (
          <div className={styles.actions}>
            {actions}
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner} />
            <span className={styles.loadingText}>Cargando...</span>
          </div>
        )}
      </div>
    </form>
  );
});

FormLayout.displayName = 'FormLayout';
