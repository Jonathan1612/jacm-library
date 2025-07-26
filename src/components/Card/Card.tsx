import React, { useState, useEffect, useRef } from 'react';
import styles from './Card.module.css';

interface CardProps {
  title?: string;
  imageUrl?: string | string[];
  content?: string;
  price?: string;
  footer?: React.ReactNode;
}

const Card = ({ title, imageUrl, content, price, footer }: CardProps) => {
  const images = Array.isArray(imageUrl)
    ? imageUrl
    : imageUrl
    ? [imageUrl]
    : [];
  const [current, setCurrent] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrent(prev => (prev + 1) % images.length);
      }, 10000);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
    return undefined;
  }, [images.length]);

  // Navegación en modal
  const nextImg = (e?: React.MouseEvent) => {
    e && e.stopPropagation();
    setCurrent((current + 1) % images.length);
  };
  const prevImg = (e?: React.MouseEvent) => {
    e && e.stopPropagation();
    setCurrent((current - 1 + images.length) % images.length);
  };

  const ExpandIcon = (
    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4 4h7V2H2v9h2V4zm16 0v7h2V2h-9v2h7zm0 16h-7v2h9v-9h-2v7zM4 20v-7H2v9h9v-2H4z" />
    </svg>
  );
  const CloseIcon = (
    <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.89 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z" />
    </svg>
  );
  const LeftIcon = (
    <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
      <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
  );
  const RightIcon = (
    <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
    </svg>
  );

  return (
    <div className={styles.conatinerCard}>
      <div className={styles.containerImage}>
        {images.length > 0 && (
          <>
            <img src={images[current]} alt="Card Image" />
            <button
              className={styles.expandBtn}
              onClick={() => setModalOpen(true)}
              aria-label="Expandir imagen"
            >
              {ExpandIcon}
            </button>
          </>
        )}
      </div>
      <div className={styles.containerText}>
        <h2>{title}</h2>
        <p>{content}</p>
        <span className={styles.price}>{price}</span>
      </div>
      {<div className={styles.cardFooter}>{footer}</div>}

      {/* Modal */}
      {modalOpen && (
        <div
          className={styles.modalOverlay}
          role="button"
          tabIndex={0}
          onClick={() => setModalOpen(false)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              setModalOpen(false);
            }
          }}
        >
          <div
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
          >
            <button
              className={styles.closeBtn}
              onClick={() => setModalOpen(false)}
              aria-label="Cerrar modal"
            >
              {CloseIcon}
            </button>
            {images.length > 1 && (
              <button
                className={styles.leftBtn}
                onClick={prevImg}
                aria-label="Anterior"
              >
                {LeftIcon}
              </button>
            )}
            <img
              src={images[current]}
              alt="Expanded Card"
              className={styles.expandedImg}
            />
            {images.length > 1 && (
              <button
                className={styles.rightBtn}
                onClick={nextImg}
                aria-label="Siguiente"
              >
                {RightIcon}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
