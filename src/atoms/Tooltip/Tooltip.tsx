import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { BaseComponentProps } from '../../types/common';
import { cn } from '../../utils/classNames';
import styles from './Tooltip.module.css';

export interface TooltipProps extends BaseComponentProps {
  /** Contenido del tooltip */
  content: React.ReactNode;
  /** Elemento que activa el tooltip */
  children: React.ReactNode;
  /** Posición del tooltip */
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
  /** Trigger del tooltip */
  trigger?: 'hover' | 'click' | 'focus' | 'manual';
  /** Si el tooltip está visible (modo controlado) */
  open?: boolean;
  /** Delay antes de mostrar (ms) */
  showDelay?: number;
  /** Delay antes de ocultar (ms) */
  hideDelay?: number;
  /** Si el tooltip está deshabilitado */
  disabled?: boolean;
  /** Si permite HTML en el contenido */
  allowHTML?: boolean;
  /** Offset desde el elemento trigger */
  offset?: number;
  /** Si tiene flecha */
  arrow?: boolean;
  /** Tema del tooltip */
  theme?: 'dark' | 'light';
  /** Tamaño del tooltip */
  size?: 'small' | 'medium' | 'large';
  /** Callback al abrir */
  onOpen?: () => void;
  /** Callback al cerrar */
  onClose?: () => void;
  /** Si el contenido puede ser interactivo */
  interactive?: boolean;
  /** Máximo ancho del tooltip */
  maxWidth?: number | string;
  /** Si debe seguir el cursor */
  followCursor?: boolean;
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(({
  content,
  children,
  placement = 'top',
  trigger = 'hover',
  open: controlledOpen,
  showDelay = 100,
  hideDelay = 100,
  disabled = false,
  allowHTML = false,
  offset = 8,
  arrow = true,
  theme = 'dark',
  size = 'medium',
  onOpen,
  onClose,
  interactive = false,
  maxWidth = 200,
  followCursor = false,
  className,
  style,
  ...props
}, ref) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  const isOpen = controlledOpen ?? internalOpen;
  const isControlled = controlledOpen !== undefined;

  // Calcular posición del tooltip
  const calculatePosition = (triggerRect: DOMRect, tooltipRect: DOMRect) => {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY
    };

    let x = 0;
    let y = 0;

    switch (placement) {
      case 'top':
      case 'top-start':
      case 'top-end':
        y = triggerRect.top - tooltipRect.height - offset;
        break;
      case 'bottom':
      case 'bottom-start':
      case 'bottom-end':
        y = triggerRect.bottom + offset;
        break;
      case 'left':
      case 'left-start':
      case 'left-end':
        x = triggerRect.left - tooltipRect.width - offset;
        break;
      case 'right':
      case 'right-start':
      case 'right-end':
        x = triggerRect.right + offset;
        break;
    }

    // Ajustar posición horizontal
    if (placement.includes('top') || placement.includes('bottom')) {
      if (placement.endsWith('-start')) {
        x = triggerRect.left;
      } else if (placement.endsWith('-end')) {
        x = triggerRect.right - tooltipRect.width;
      } else {
        x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
      }
    }

    // Ajustar posición vertical
    if (placement.includes('left') || placement.includes('right')) {
      if (placement.endsWith('-start')) {
        y = triggerRect.top;
      } else if (placement.endsWith('-end')) {
        y = triggerRect.bottom - tooltipRect.height;
      } else {
        y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
      }
    }

    // Prevenir overflow
    x = Math.max(8, Math.min(x, viewport.width - tooltipRect.width - 8));
    y = Math.max(8, Math.min(y, viewport.height - tooltipRect.height - 8));

    return { x: x + viewport.scrollX, y: y + viewport.scrollY };
  };

  // Actualizar posición
  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const newPosition = calculatePosition(triggerRect, tooltipRect);
    
    setPosition(newPosition);
  };

  // Mostrar tooltip
  const show = () => {
    if (disabled) return;

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = undefined;
    }

    showTimeoutRef.current = setTimeout(() => {
      if (!isControlled) {
        setInternalOpen(true);
      }
      onOpen?.();
    }, showDelay);
  };

  // Ocultar tooltip
  const hide = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = undefined;
    }

    hideTimeoutRef.current = setTimeout(() => {
      if (!isControlled) {
        setInternalOpen(false);
      }
      onClose?.();
    }, hideDelay);
  };

  // Event handlers
  const handleMouseEnter = () => {
    if (trigger === 'hover') show();
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover' && !interactive) hide();
  };

  const handleClick = () => {
    if (trigger === 'click') {
      if (isOpen) {
        hide();
      } else {
        show();
      }
    }
  };

  const handleFocus = () => {
    if (trigger === 'focus') show();
  };

  const handleBlur = () => {
    if (trigger === 'focus') hide();
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (followCursor && isOpen) {
      setPosition({ x: event.clientX + 10, y: event.clientY - 10 });
    }
  };

  // Effects
  useEffect(() => {
    if (isOpen) {
      updatePosition();
      
      const handleResize = () => updatePosition();
      const handleScroll = () => updatePosition();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
    
    return undefined;
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const tooltipClasses = cn(
    styles.tooltip,
    styles[theme],
    styles[size],
    styles[placement.split('-')[0]],
    interactive && styles.interactive,
    arrow && styles.withArrow,
    className
  );

  const tooltipStyle = {
    ...style,
    left: position.x,
    top: position.y,
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    zIndex: 9999
  };

  return (
    <>
      <div
        ref={ref || triggerRef}
        className={styles.trigger}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      >
        {children}
      </div>

      {isOpen && (
        <>
          {/* Portal overlay para tooltips interactivos */}
          {interactive && (
            <div
              className={styles.overlay}
              onMouseEnter={() => {
                if (hideTimeoutRef.current) {
                  clearTimeout(hideTimeoutRef.current);
                  hideTimeoutRef.current = undefined;
                }
              }}
              onMouseLeave={hide}
            />
          )}
          
          <div
            ref={tooltipRef}
            className={tooltipClasses}
            style={tooltipStyle}
            role="tooltip"
            onMouseEnter={() => {
              if (interactive && hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
                hideTimeoutRef.current = undefined;
              }
            }}
            onMouseLeave={() => {
              if (interactive) hide();
            }}
          >
            {allowHTML && typeof content === 'string' ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              content
            )}
            
            {arrow && (
              <div className={cn(styles.arrow, styles[`arrow${placement.split('-')[0].charAt(0).toUpperCase() + placement.split('-')[0].slice(1)}`])} />
            )}
          </div>
        </>
      )}
    </>
  );
});

Tooltip.displayName = 'Tooltip';
