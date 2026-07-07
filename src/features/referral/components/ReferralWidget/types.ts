import React from "react";

export interface ReferralConfig {
  projectId: string;
  enabled: boolean;
  mode: "cloud" | "self-hosted";
  endpoint?: string;
  queryParam?: string;
  cookieDurationDays?: number;
}

export interface ReferralData {
  code: string;
  source: "query" | "cookie" | "localStorage";
  createdAt: Date;
}

export interface ConversionEvent {
  event: string;
  value?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface ReferralEventPayload {
  projectId: string;
  referralCode: string;
  event: string;
  value?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
  visitorId: string;
  sessionId: string;
  currentPage: string;
  referrerUrl: string;
  browser: string;
  os: string;
  device: string;
  timestamp: string;
}

export interface QueuedEvent {
  id: string;
  payload: ReferralEventPayload;
  retryCount: number;
  createdAt: string;
}

export interface LifecycleStage {
  id: number;
  title: string;
  description: string;
  status: "pending" | "active" | "complete" | "failed";
  payload?: Record<string, unknown>;
}

export interface ReferralTheme {
  primaryColor?: string;
  accentColor?: string;
  successColor?: string;
  backgroundColor?: string;
  textColor?: string;
  mutedTextColor?: string;
  borderColor?: string;
  codeBoxColor?: string;
  borderRadius?: string;
  fontFamily?: string;
}

export interface ReferralWidgetProps {
  // REQUIRED
  referralCode: string;
  referralLink: string;
  projectId: string;

  // CONTENT
  appName?: string;
  appIcon?: React.ReactNode;
  referrerName?: string;
  rewardAmount?: string;
  rewardDescription?: string;
  expiryHours?: number;

  // BUTTON
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
  buttonPosition?: "bottom-right" | "bottom-left" | "bottom-center";
  buttonStyle?: React.CSSProperties;

  // POPUP
  popupTitle?: string;
  popupWidth?: number;
  backdropColor?: string;

  // BOXES
  showRewardCode?: boolean;
  rewardCodeLabel?: string;
  rewardCodeStyle?: React.CSSProperties;
  showReferralLink?: boolean;
  referralLinkLabel?: string;

  // COPY
  copySuccessLabel?: string;
  copySuccessDuration?: number;

  // SHARE
  showShareButton?: boolean;
  shareButtonLabel?: string;
  copyLinkButtonLabel?: string;
  shareMessage?: string;

  // THEME
  theme?: ReferralTheme;

  // CALLBACKS
  onOpen?: () => void;
  onClose?: () => void;
  onCodeCopied?: (code: string, projectId: string) => void;
  onLinkCopied?: (link: string, projectId: string) => void;
  onShare?: (projectId: string) => void;
  onMount?: (projectId: string) => void;
  onConversionTracked?: (event: ConversionEvent) => void;

  // ADVANCED
  visible?: boolean;
  defaultOpen?: boolean;
  closeOnBackdropClick?: boolean;
  showExpiry?: boolean;
  customCSS?: string;
  renderTrigger?: (props: {
    open: () => void;
    isOpen: boolean;
    projectId: string;
  }) => React.ReactNode;
  renderCard?: (props: {
    code: string;
    link: string;
    projectId: string;
    onCopyCode: () => void;
    onCopyLink: () => void;
    onShare: () => void;
  }) => React.ReactNode;
}
