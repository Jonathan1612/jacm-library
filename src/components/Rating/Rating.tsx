import { useState, CSSProperties } from "react";
import styles from "./Rating.module.css";

type RatingProps = {
  maxRating?: number;
  initialRating?: number;
  variant?: "primary" | "secondary" | "normal";
  size?: "small" | "medium" | "large";
  className?: string;
  style?: CSSProperties;
  onRatingChange?: (rating: number) => void;
};

const Rating: React.FC<RatingProps> = ({
  maxRating = 5,
  initialRating = 0,
  variant = "primary",
  size = "small",
  className = "",
  style,
  onRatingChange,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleRating = (index: number) => {
    setRating(index + 1);
    if (onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  const handleMouseEnter = (index: number) => {
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  return (
    <div className={`${styles.ratingContainer} ${className}`} style={style}>
      {Array.from({ length: maxRating }, (_, index) => (
        <span
          key={index}
          className={`${styles.star} ${styles[size]} ${
            (hoverRating !== null ? index < hoverRating : index < rating)
              ? styles[variant]
              : ""
          }`}
          onClick={() => handleRating(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default Rating;
