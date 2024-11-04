import React from "react";
import { useState, CSSProperties } from "react";
import styles from "./DraggableList.module.css";

type DraggableListProps = {
  items: { id: number; content: string }[]; // Lista de elementos a mostrar
  onItemsChange?: (items: { id: number; content: string }[]) => void; // Callback para manejar cambios en el orden de los ítems
  className?: string;
  style?: CSSProperties;
};

const DraggableList: React.FC<DraggableListProps> = ({
  items: initialItems,
  onItemsChange,
  className = "",
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
    <ul className={`${styles.draggableList} ${className}`} style={style}>
      {items.map((item, index) => (
        <li
          key={item.id}
          draggable
          onDragStart={() => onDragStart(index)}
          onDragOver={() => onDragOver(index)}
          onDragEnd={onDragEnd}
          className={draggedItemIndex === index ? styles.dragging : ""}
        >
          {item.content}
        </li>
      ))}
    </ul>
  );
};

export default DraggableList;
