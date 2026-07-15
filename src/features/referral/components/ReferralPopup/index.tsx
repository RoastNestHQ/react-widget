import { CLASS_NAMES } from '../../../../utils/classNames';
import React, { useEffect, useState } from 'react';
import './styles.css';

interface ReferralPopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  closeOnBackdropClick?: boolean;
}

const ReferralPopup: React.FC<ReferralPopupProps> = ({ 
  isOpen, 
  onClose, 
  children,
  style,
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
      className={`${CLASS_NAMES.referral.backdrop} ${isOpen ? CLASS_NAMES.global.open : CLASS_NAMES.global.closed}`} 
      style={style}
      onClick={closeOnBackdropClick ? onClose : undefined}
      data-html2canvas-ignore="true"
    >
      <div 
        className={`${CLASS_NAMES.referral.modal} ${isOpen ? CLASS_NAMES.global.open : CLASS_NAMES.global.closed}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className={CLASS_NAMES.referral.close} onClick={onClose} aria-label="Close popup">
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
