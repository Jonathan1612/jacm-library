import React, { forwardRef, useEffect } from 'react';
import { BaseComponentProps } from '../../types/common';
import { Button } from '../../atoms/Button/Button';
import { cn } from '../../utils/classNames';
import styles from './Modal.module.css';

export interface ModalProps extends BaseComponentProps {
  /** Si el modal está abierto */
  open: boolean;
  /** Callback al cerrar el modal */
  onClose?: () => void;
  /** Título del modal */
  title?: React.ReactNode;
  /** Contenido del modal */
  children: React.ReactNode;
  /** Acciones del footer */
  actions?: React.ReactNode;
  /** Si se puede cerrar con Escape */
  closeOnEscape?: boolean;
  /** Si se puede cerrar haciendo clic en el backdrop */
  closeOnBackdrop?: boolean;
  /** Si muestra el botón de cerrar */
  showCloseButton?: boolean;
  /** Tamaño del modal */
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'fullscreen';
  /** Variante del modal */
  variant?: 'default' | 'centered' | 'sidebar';
  /** Si tiene scroll en el contenido */
  scrollable?: boolean;
  /** Si previene el scroll del body */
  preventBodyScroll?: boolean;
  /** Posición inicial (para animaciones) */
  initialFocus?: React.RefObject<HTMLElement>;
  /** Callback después de abrir */
  onAfterOpen?: () => void;
  /** Callback después de cerrar */
  onAfterClose?: () => void;
  /** ID para accesibilidad */
  ariaLabelledBy?: string;
  /** Descripción para accesibilidad */
  ariaDescribedBy?: string;
}

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(({
  open,
  onClose,
  title,
  children,
  actions,
  closeOnEscape = true,
  closeOnBackdrop = true,
  showCloseButton = true,
  size = 'medium',
  variant = 'default',
  scrollable = false,
  preventBodyScroll = true,
  initialFocus,
  onAfterOpen,
  onAfterClose,
  ariaLabelledBy,
  ariaDescribedBy,
  className,
  style,
  ...props
}, ref) => {
  // Efecto para manejar el scroll del body
  useEffect(() => {
    if (!preventBodyScroll) return undefined;

    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
    
    document.body.style.overflow = '';
    return undefined;
  }, [open, preventBodyScroll]);

  // Efecto para manejar la tecla Escape
  useEffect(() => {
    if (!open || !closeOnEscape || !onClose) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, closeOnEscape, onClose]);

  // Efecto para el foco inicial
  useEffect(() => {
    if (open && initialFocus?.current) {
      initialFocus.current.focus();
    }
  }, [open, initialFocus]);

  // Callbacks de ciclo de vida
  useEffect(() => {
    if (open && onAfterOpen) {
      onAfterOpen();
    } else if (!open && onAfterClose) {
      onAfterClose();
    }
  }, [open, onAfterOpen, onAfterClose]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnBackdrop && onClose && event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleCloseClick = () => {
    onClose?.();
  };

  if (!open) return null;

  const modalClasses = cn(
    styles.modal,
    styles[variant],
    styles[size],
    scrollable && styles.scrollable,
    className
  );

  const backdropClasses = cn(
    styles.backdrop,
    open && styles.open
  );

  return (
    <div className={backdropClasses}>
      {/* Backdrop */}
      <div 
        className={styles.overlay}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <dialog
        ref={ref}
        className={modalClasses}
        style={style}
        open={open}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        {...props}
      >
        <div className={styles.container}>
          {/* Header */}
          {(title || showCloseButton) && (
            <div className={styles.header}>
              {title && (
                <div className={styles.title}>
                  {typeof title === 'string' ? (
                    <h2 className={styles.titleText} id={ariaLabelledBy}>
                      {title}
                    </h2>
                  ) : (
                    <div id={ariaLabelledBy}>{title}</div>
                  )}
                </div>
              )}
              {showCloseButton && (
                <Button
                  variant="secondary"
                  size="small"
                  onClick={handleCloseClick}
                  className={styles.closeButton}
                  aria-label="Cerrar modal"
                >
                  ✕
                </Button>
              )}
            </div>
          )}

          {/* Content */}
          <div 
            className={cn(
              styles.content,
              scrollable && styles.scrollableContent
            )}
            id={ariaDescribedBy}
          >
            {children}
          </div>

          {/* Footer */}
          {actions && (
            <div className={styles.footer}>
              {actions}
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
});

Modal.displayName = 'Modal';
