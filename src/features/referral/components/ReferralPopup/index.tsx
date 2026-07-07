import React, { useEffect, useState } from 'react';
import './styles.css';

interface ReferralPopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  backdropStyle?: React.CSSProperties;
  popupStyle?: React.CSSProperties;
  closeOnBackdropClick?: boolean;
}

const ReferralPopup: React.FC<ReferralPopupProps> = ({ 
  isOpen, 
  onClose, 
  children,
  backdropStyle,
  popupStyle,
  closeOnBackdropClick = true
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`rrn-referral-backdrop ${isOpen ? 'rrn-open' : 'rrn-closed'}`} 
      style={backdropStyle}
      onClick={closeOnBackdropClick ? onClose : undefined}
    >
      <div 
        className={`rrn-referral-modal ${isOpen ? 'rrn-open' : 'rrn-closed'}`} 
        style={popupStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="rrn-referral-close" onClick={onClose} aria-label="Close popup">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default ReferralPopup;
