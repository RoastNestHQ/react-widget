import { CLASS_NAMES } from "../../../../utils/classNames";
import React from "react";
import "./styles.css";
import { StyleMap } from "../ReferralWidget/styles";
import { BaseReferralWidgetProps } from "../ReferralWidget/types";

interface ReferralCardProps extends BaseReferralWidgetProps {
	styles: StyleMap;
	linkCopied: boolean;
	onCopyLink: () => void;
	onShare: () => void;
	referralLink?: string;
	rewardAmount?: string;
}

const ReferralCard: React.FC<ReferralCardProps> = ({
	appName,
	appIcon,
	referrerIdentity,
	rewardAmount,
	rewardDescription,
	referralLink,
	expiryHours,
	styles,
	linkCopied,
	onCopyLink,
	onShare,
	showReferralLink,
	referralLinkLabel,
	copySuccessLabel,
	showShareButton,
	shareButtonLabel,
	copyLinkButtonLabel,
	showExpiry,
}) => {
	return (
		<div className={CLASS_NAMES.referral.card}>
			<div className={CLASS_NAMES.referral.header}>
				{appIcon && <div className={CLASS_NAMES.referral.appIcon}>{appIcon}</div>}
				<h2 className={CLASS_NAMES.referral.appName} style={styles.mutedText}>
					{appName}
				</h2>
			</div>

			<p className={CLASS_NAMES.referral.message} style={styles.mutedText}>
				{referrerIdentity?.name ? (
					<>
						Hi <span style={styles.link}>{referrerIdentity.name}</span>, invite your friends to
						earn!
					</>
				) : (
					<>
						Invite your friends to <span style={styles.link}>earn</span>!
					</>
				)}
			</p>

			<p className={CLASS_NAMES.referral.submessage} style={styles.mutedText}>
				{rewardDescription ||
					`Share your link below. When a friend signs up, ${
						rewardAmount
							? `both of you get a ${rewardAmount} reward!`
							: "you both get rewarded!"
					}`}
			</p>

			{showReferralLink && (
				<div className={CLASS_NAMES.referral.copyBlock}>
					<div className={CLASS_NAMES.referral.copyLabel}>{referralLinkLabel}</div>
					<div 
						className={CLASS_NAMES.referral.copyContent} 
						style={{ ...styles.codeBox, cursor: "pointer" }}
						onClick={onCopyLink}
						title="Click to copy link"
					>
						<span className={CLASS_NAMES.referral.linkText}>
							{linkCopied ? (
								<span style={{ color: "#10b981", fontWeight: 600 }}>{copySuccessLabel}</span>
							) : (
								referralLink
							)}
						</span>
					</div>
				</div>
			)}

			<div className={CLASS_NAMES.referral.actionsRow}>
				<button
					className={CLASS_NAMES.referral.secondaryBtn}
					style={styles.outlineBtn}
					onClick={onCopyLink}
				>
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
						<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
					</svg>
					{copyLinkButtonLabel}
				</button>
				{showShareButton && (
					<button
						className={CLASS_NAMES.referral.primaryBtn}
						style={styles.primaryBtn}
						onClick={onShare}
					>
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
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
				<div className={CLASS_NAMES.referral.expiryNote} style={styles.mutedText}>
					Reward link expires in {expiryHours} hours.
				</div>
			)}
		</div>
	);
};

export default ReferralCard;
