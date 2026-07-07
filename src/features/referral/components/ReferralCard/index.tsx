import React from 'react';
import './styles.css';
import { StyleMap } from '../ReferralWidget/styles';
import { ReferralWidgetProps } from '../ReferralWidget/types';

interface ReferralCardProps extends ReferralWidgetProps {
  styles: StyleMap;
  codeCopied: boolean;
  linkCopied: boolean;
  onCopyCode: () => void;
  onCopyLink: () => void;
  onShare: () => void;
}

const ReferralCard: React.FC<ReferralCardProps> = ({
  appName,
  appIcon,
  referrerName,
  rewardAmount,
  rewardDescription,
  referralCode,
  referralLink,
  expiryHours,
  styles,
  codeCopied,
  linkCopied,
  onCopyCode,
  onCopyLink,
  onShare,
  showRewardCode,
  rewardCodeLabel,
  showReferralLink,
  referralLinkLabel,
  copySuccessLabel,
  showShareButton,
  shareButtonLabel,
  copyLinkButtonLabel,
  showExpiry
}) => {
  const name = referrerName || 'A friend';
  
  return (
    <div className="rrn-referral-card">
      <div className="rrn-referral-header">
        {appIcon && (
          <div className="rrn-app-icon">
            {appIcon}
          </div>
        )}
        <h2 className="rrn-app-name" style={styles.mutedText}>{appName}</h2>
      </div>

      <p className="rrn-referral-message" style={styles.mutedText}>
        <span className="rrn-referrer-name" style={styles.link}>{name}</span> invited you to {appName}!
      </p>
      
      <p className="rrn-referral-submessage" style={styles.mutedText}>
        {rewardDescription || `Share your link below and both of you will get a ${rewardAmount} reward. Your friends just need to sign up using your link/code.`}
      </p>

      {showRewardCode && (
        <div className="rrn-copy-block">
          <div className="rrn-copy-label">{rewardCodeLabel}</div>
          <div className="rrn-copy-content" style={styles.codeBox}>
            <span className="rrn-mono-text">{referralCode}</span>
            <button 
              className={`rrn-action-btn ${codeCopied ? 'rrn-copied' : ''}`}
              style={codeCopied ? styles.copyBtnSuccess : styles.outlineBtn}
              onClick={onCopyCode}
            >
              {codeCopied ? copySuccessLabel : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {showReferralLink && (
        <div className="rrn-copy-block">
          <div className="rrn-copy-label">{referralLinkLabel}</div>
          <div className="rrn-copy-content" style={styles.codeBox}>
            <span className="rrn-link-text">{referralLink}</span>
            <button 
              className={`rrn-action-btn ${linkCopied ? 'rrn-copied' : ''}`}
              style={linkCopied ? styles.copyBtnSuccess : styles.outlineBtn}
              onClick={onCopyLink}
            >
              {linkCopied ? copySuccessLabel : 'Copy'}
            </button>
          </div>
        </div>
      )}

      <div className="rrn-actions-row">
        <button className="rrn-secondary-btn" style={styles.outlineBtn} onClick={onCopyLink}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          {copyLinkButtonLabel}
        </button>
        {showShareButton && (
          <button className="rrn-primary-btn" style={styles.primaryBtn} onClick={onShare}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            {shareButtonLabel}
          </button>
        )}
      </div>

      {showExpiry && expiryHours && (
        <div className="rrn-expiry-note" style={styles.mutedText}>
          Reward code expires in {expiryHours} hours.
        </div>
      )}
    </div>
  );
};

export default ReferralCard;
