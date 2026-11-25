import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface FloatingModalProps {
  onClose?: () => void;
  maxWidth?: number | string;
  backdropStyle?: React.CSSProperties;
  cardStyle?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * Renders any modal inside document.body via React Portal so ancestor CSS
 * transforms/animations can never shift `position: fixed` above the viewport.
 */
export const FloatingModal: React.FC<FloatingModalProps> = ({
  onClose,
  maxWidth = 640,
  backdropStyle,
  cardStyle,
  children
}) => {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="modal-backdrop-floating"
      style={backdropStyle}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="modal-card-floating"
        style={{ maxWidth, ...cardStyle }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};
