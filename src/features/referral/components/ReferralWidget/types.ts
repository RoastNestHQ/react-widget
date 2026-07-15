import React from "react";
import { WidgetTheme } from "../../../../shared/types";

export type ReferrerIdentity = {
	id: string;
	name: string;
	email?: string;
	phone?: string;
};

export interface ReferralConfig {
	projectId?: string;
	enabled: boolean;
	mode: "cloud" | "self-hosted";
	onEvent?: (payload: ReferralEventPayload) => Promise<void> | void;
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



export interface BaseReferralWidgetProps {
	// CONTENT
	appName?: string;
	referrerIdentity?: ReferrerIdentity;
	appIcon?: React.ReactNode;
	rewardDescription?: string;
	referrerRewardType?: "monetary" | "coupon" | "in-app" | "other";
	referrerRewardAmount?: string;
	refereeRewardType?: "monetary" | "coupon" | "in-app" | "other";
	refereeRewardAmount?: string;
	expiryHours?: number;

	// BUTTON
	buttonLabel?: string;
	buttonIcon?: React.ReactNode;
	buttonPosition?:
		| "left-center"
		| "left-bottom"
		| "right-center"
		| "right-bottom"
		| "bottom-left"
		| "bottom-right"
		| "bottom-center";
	buttonMode?: "icon" | "text" | "both";
	buttonStyle?: React.CSSProperties;

	// POPUP
	popupTitle?: string;
	popupWidth?: number;
	backdropColor?: string;

	// BOXES
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
	theme?: WidgetTheme;

	// CALLBACKS
	onOpen?: () => void;
	onClose?: () => void;
	onReferralCreated?: (code: string, identity?: ReferrerIdentity) => void;
	onLinkCopied?: (link: string, projectId: string, identity?: ReferrerIdentity) => void;
	onShare?: (projectId: string, identity?: ReferrerIdentity) => void;
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
		onCopyLink: () => void;
		onShare: () => void;
	}) => React.ReactNode;
}

export type ReferralWidgetProps = BaseReferralWidgetProps &
	(
		| {
				mode?: "cloud";
				referralLink?: never;
				rewardAmount?: never;
				onEvent?: (payload: ReferralEventPayload) => Promise<void> | void;
		  }
		| {
				mode: "self-hosted";
				referrerRewardAmount?: string;
				refereeRewardAmount?: string;
				referralLink: `http://${string}` | `https://${string}`;
				onEvent: (payload: ReferralEventPayload) => Promise<void> | void;
		  }
	);
