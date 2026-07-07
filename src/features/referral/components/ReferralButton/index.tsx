import React from 'react';
import './styles.css';

interface ReferralButtonProps {
  onClick: () => void;
  position: 'bottom-right' | 'bottom-left' | 'bottom-center';
  label?: string;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  themeStyles: any;
}

const ReferralButton: React.FC<ReferralButtonProps> = ({ 
  onClick, 
  position, 
  label, 
  icon,
  style,
  themeStyles 
}) => {
  return (
    <button
      className={`rrn-referral-btn rrn-referral-btn-${position}`}
      onClick={onClick}
      style={{ ...themeStyles.primaryBtn, ...style }}
      aria-label={label || "Open referral popup"}
    >
      {icon ? icon : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
          <path d="M16 11h6"></path>
          <path d="M19 8v6"></path>
        </svg>
      )}
      {label && <span className="rrn-btn-label" style={{ marginLeft: icon ? '8px' : '0' }}>{label}</span>}
    </button>
  );
};

export default ReferralButton;
