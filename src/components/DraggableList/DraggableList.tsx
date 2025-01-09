'use client';
import React from 'react';
import { useState, CSSProperties } from 'react';
import styles from './DraggableList.module.css';

type DraggableListProps = {
  title?: string;
  items: { id: number; content: string }[];
  onItemsChange?: (items: { id: number; content: string }[]) => void;
  className?: string;
  style?: CSSProperties;
};

const DraggableList: React.FC<DraggableListProps> = ({
  title,
  items: initialItems,
  onItemsChange,
  className = '',
  style,
}) => {
  const [items, setItems] = useState(initialItems);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const onDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const onDragOver = (index: number) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const updatedItems = [...items];
    const [draggedItem] = updatedItems.splice(draggedItemIndex, 1);
    updatedItems.splice(index, 0, draggedItem);

    setDraggedItemIndex(index);
    setItems(updatedItems);
    if (onItemsChange) {
      onItemsChange(updatedItems);
    }
  };

  const onDragEnd = () => {
    setDraggedItemIndex(null);
  };

  return (
    <div className={styles.containerList}>
      {title && (
        <div className={styles.containerTitle}>
          <span className={styles.title}>{title}</span>
        </div>
      )}
      <ul className={`${styles.draggableList} ${className}`} style={style}>
        {items.map((item, index) => (
          <li
            key={item.id}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={() => onDragOver(index)}
            onDragEnd={onDragEnd}
            className={draggedItemIndex === index ? styles.dragging : ''}
          >
            {item.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DraggableList;
