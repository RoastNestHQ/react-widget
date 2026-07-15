import React from 'react';
import clsx from 'clsx';
import { CLASS_NAMES } from '../../../../utils/classNames';
import './styles.css';

interface ReferralButtonProps {
  onClick: () => void;
  position: 'left-center' | 'left-bottom' | 'right-center' | 'right-bottom' | 'bottom-left' | 'bottom-right' | 'bottom-center';
  label?: string;
  icon?: React.ReactNode;
  mode?: 'icon' | 'text' | 'both';
  style?: React.CSSProperties;
}

const ReferralButton: React.FC<ReferralButtonProps> = ({ 
  onClick, 
  position, 
  label,
  icon,
  mode = 'both',
  style
}) => {
  const isIconOnly = mode === 'icon';
  const isTextOnly = mode === 'text';

  const defaultIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
      <path d="M16 11h6"></path>
      <path d="M19 8v6"></path>
    </svg>
  );


  return (
    <div
      className={clsx(CLASS_NAMES.feedback.triggerButton, CLASS_NAMES.global.avoidElement, CLASS_NAMES.referral.btn)}
      data-placement={position}
      data-mode={isIconOnly ? 'icon' : undefined}
      onClick={onClick}
      style={style}
      aria-label={label || "Open referral popup"}
      data-html2canvas-ignore="true"
    >
      {!isTextOnly && (icon ? icon : defaultIcon)}
      {!isIconOnly && label && (
        <p>{label}</p>
      )}
    </div>
  );
};

export default ReferralButton;
