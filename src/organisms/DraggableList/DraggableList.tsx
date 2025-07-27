import React, { useState, forwardRef, useCallback } from 'react';
import styles from './DraggableList.module.css';

export interface DraggableItem {
  id: string | number;
  content: React.ReactNode;
  data?: any;
  disabled?: boolean;
}

export interface DraggableListProps {
  /** Título de la lista */
  title?: string;
  /** Items de la lista */
  items: DraggableItem[];
  /** Función ejecutada cuando cambian los items */
  onItemsChange?: (items: DraggableItem[]) => void;
  /** Función ejecutada cuando se inicia el arrastre */
  onDragStart?: (item: DraggableItem, index: number) => void;
  /** Función ejecutada cuando termina el arrastre */
  onDragEnd?: (item: DraggableItem, fromIndex: number, toIndex: number) => void;
  /** Si permite reordenar */
  allowReorder?: boolean;
  /** Si la lista está deshabilitada */
  disabled?: boolean;
  /** Orientación de la lista */
  orientation?: 'vertical' | 'horizontal';
  /** Espaciado entre items */
  spacing?: 'none' | 'small' | 'medium' | 'large';
  /** Variante del estilo */
  variant?: 'default' | 'bordered' | 'elevated';
  /** Indicador visual de drop zone */
  showDropIndicator?: boolean;
  /** Texto cuando está vacía */
  emptyText?: string;
  /** Clases CSS adicionales */
  className?: string;
  /** ID del elemento */
  id?: string;
  /** Estilos inline */
  style?: React.CSSProperties;
}

export const DraggableList = forwardRef<HTMLDivElement, DraggableListProps>(({
  title,
  items,
  onItemsChange,
  onDragStart,
  onDragEnd,
  allowReorder = true,
  disabled = false,
  orientation = 'vertical',
  spacing = 'medium',
  variant = 'default',
  showDropIndicator = true,
  emptyText = 'No hay elementos en la lista',
  className = '',
  id,
  style,
  ...props
}, ref) => {
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [localItems, setLocalItems] = useState(items);

  // Sincronizar items externos
  React.useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    if (disabled || !allowReorder || localItems[index].disabled) {
      e.preventDefault();
      return;
    }

    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    
    onDragStart?.(localItems[index], index);
  }, [disabled, allowReorder, localItems, onDragStart]);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (disabled || !allowReorder || draggedItemIndex === null || draggedItemIndex === index) {
      return;
    }

    setDragOverIndex(index);
    e.dataTransfer.dropEffect = 'move';
  }, [disabled, allowReorder, draggedItemIndex]);

  const handleDragEnter = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (disabled || !allowReorder || draggedItemIndex === null) {
      return;
    }

    setDragOverIndex(index);
  }, [disabled, allowReorder, draggedItemIndex]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    // Solo limpiar si realmente salimos del elemento
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverIndex(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (disabled || !allowReorder || draggedItemIndex === null || draggedItemIndex === dropIndex) {
      setDraggedItemIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newItems = [...localItems];
    const [draggedItem] = newItems.splice(draggedItemIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);

    setLocalItems(newItems);
    onItemsChange?.(newItems);
    onDragEnd?.(draggedItem, draggedItemIndex, dropIndex);
    
    setDraggedItemIndex(null);
    setDragOverIndex(null);
  }, [disabled, allowReorder, draggedItemIndex, localItems, onItemsChange, onDragEnd]);

  const handleDragEnd = useCallback(() => {
    setDraggedItemIndex(null);
    setDragOverIndex(null);
  }, []);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    const newItems = [...localItems];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);

    setLocalItems(newItems);
    onItemsChange?.(newItems);
    onDragEnd?.(movedItem, fromIndex, toIndex);

    // Focus en el nuevo elemento
    setTimeout(() => {
      const newElement = document.querySelector(`[data-draggable-index="${toIndex}"]`) as HTMLElement;
      newElement?.focus();
    }, 0);
  }, [localItems, onItemsChange, onDragEnd]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (disabled || !allowReorder || localItems[index].disabled) return;

    let newIndex: number | null = null;

    if (e.key === 'ArrowUp' && orientation === 'vertical' && index > 0) {
      newIndex = index - 1;
    } else if (e.key === 'ArrowDown' && orientation === 'vertical' && index < localItems.length - 1) {
      newIndex = index + 1;
    } else if (e.key === 'ArrowLeft' && orientation === 'horizontal' && index > 0) {
      newIndex = index - 1;
    } else if (e.key === 'ArrowRight' && orientation === 'horizontal' && index < localItems.length - 1) {
      newIndex = index + 1;
    } else if (e.key === 'Home') {
      newIndex = 0;
    } else if (e.key === 'End') {
      newIndex = localItems.length - 1;
    }

    if (newIndex !== null && newIndex !== index) {
      e.preventDefault();
      moveItem(index, newIndex);
    }
  }, [disabled, allowReorder, localItems, orientation, moveItem]);

  if (localItems.length === 0) {
    return (
      <div 
        ref={ref}
        className={`${styles.draggableList} ${styles.empty} ${className}`}
        id={id}
        style={style}
        {...props}
      >
        {title && (
          <div className={styles.header}>
            <h3 className={styles.title}>{title}</h3>
          </div>
        )}
        <div className={styles.emptyState}>
          <p>{emptyText}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={ref}
      className={`
        ${styles.draggableList} 
        ${styles[orientation]} 
        ${styles[spacing]} 
        ${styles[variant]}
        ${disabled ? styles.disabled : ''}
        ${className}
      `}
      id={id}
      style={style}
      {...props}
    >
      {title && (
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
        </div>
      )}
      
      <div 
        className={styles.list}
        aria-label={title || 'Lista reorganizable'}
      >
        {localItems.map((item, index) => (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <div
            key={item.id}
            className={`
              ${styles.item}
              ${draggedItemIndex === index ? styles.dragging : ''}
              ${dragOverIndex === index ? styles.dragOver : ''}
              ${item.disabled ? styles.itemDisabled : ''}
            `}
            draggable={!disabled && allowReorder && !item.disabled}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onClick={() => {}} // Para que ESLint reconozca como interactivo
            tabIndex={disabled || item.disabled ? -1 : 0}
            aria-describedby={`${id}-instructions`}
            aria-label={`Elemento ${index + 1}`}
            data-draggable-index={index}
          >
            {allowReorder && !disabled && !item.disabled && (
              <div className={styles.dragHandle} aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                </svg>
              </div>
            )}
            
            <div className={styles.itemContent}>
              {item.content}
            </div>

            {showDropIndicator && dragOverIndex === index && draggedItemIndex !== null && (
              <div className={styles.dropIndicator} />
            )}
          </div>
        ))}
      </div>

      {/* Instrucciones para screen readers */}
      <div id={`${id}-instructions`} className={styles.srOnly}>
        Use las teclas de flecha para reordenar los elementos. 
        Presione Inicio para ir al primer elemento, Fin para ir al último.
      </div>
    </div>
  );
});

DraggableList.displayName = 'DraggableList';
