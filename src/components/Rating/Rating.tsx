import { useState, CSSProperties } from 'react';
import styles from './Rating.module.css';

type RatingProps = {
  maxRating?: number; // Número máximo de estrellas
  initialRating?: number; // Puntuación inicial seleccionada
  variant?: 'primary' | 'secondary' | 'normal'; // Variantes de estilo
  size?: 'small' | 'medium' | 'large'; // Tamaños de las estrellas
  className?: string;
  style?: CSSProperties;
  onRatingChange?: (rating: number) => void; // Callback para manejar cambios en la puntuación
};

const Rating: React.FC<RatingProps> = ({
  maxRating = 8,
  initialRating = 0,
  variant = 'primary',
  size = 'medium',
  className = '',
  style,
  onRatingChange,
}) => {
  const [rating, setRating] = useState(initialRating);

  const handleRating = (index: number) => {
    setRating(index + 1);
    if (onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className={`${styles.ratingContainer} ${className}`} style={style}>
      {Array.from({ length: maxRating }, (_, index) => (
        <span
          key={index}
          className={`${styles.star} ${styles[size]} ${
            index < rating ? styles[variant] : ''
          }`}
          onClick={() => handleRating(index)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default Rating;
