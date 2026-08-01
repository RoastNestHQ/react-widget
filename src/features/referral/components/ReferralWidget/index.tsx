import React, { useEffect, useContext } from "react";
import config from "../../../../core/config/config";
import { RoastnestContext } from "../../../../core/context";
import { ReferrerIdentity, ReferralWidgetProps } from "./types";
import { DEFAULT_WIDGET_PROPS } from "./defaults";
import { buildThemeVars } from "./styles";
import { useReferralWidget } from "../../hooks/useReferralWidget";
import { initializeReferralAPI } from "../../hooks/useReferral";
import { ReferralAPI } from "../../ReferralAPI";
import ReferralButton from "../ReferralButton";
import ReferralPopup from "../ReferralPopup";
import ReferralCard from "../ReferralCard";
import ApiInstance from "../../../../shared/utils/api";
import RoastnestErrorBoundary from "../../../../shared/components/ErrorBoundary";
import { mergeDeep } from "../../../../utils/mergeDeep";

const ReferralWidgetInner: React.FC<ReferralWidgetProps> = (userProps) => {
	const context = useContext(RoastnestContext);
	const effectiveProjectId = context?.projectId;
	const mode = userProps.mode || context?.mode || "cloud";

	const [cloudData, setCloudData] = React.useState<any>(null);
	const [isLoadingCloud, setIsLoadingCloud] = React.useState(mode === "cloud");
	const [hookIdentity, setHookIdentity] = React.useState<ReferrerIdentity | undefined>(undefined);

	useEffect(() => {
		const handleIdentityUpdate = (e: CustomEvent<ReferrerIdentity | undefined>) => {
			setHookIdentity(e.detail);
		};
		if (typeof window !== "undefined") {
			window.addEventListener('roastnest-identity-updated', handleIdentityUpdate as EventListener);
		}
		return () => {
			if (typeof window !== "undefined") {
				window.removeEventListener('roastnest-identity-updated', handleIdentityUpdate as EventListener);
			}
		};
	}, []);

	const finalReferrerIdentity = userProps.referrerIdentity || hookIdentity;

	useEffect(() => {
		if (mode === "cloud" && effectiveProjectId) {
			const api = ReferralAPI.create({
				projectId: effectiveProjectId,
				mode: "cloud",
				enabled: true,
			});
			const visitorId = api.getVisitorId();

			setIsLoadingCloud(true);
			
			const apiInstance = new ApiInstance({ siteId: effectiveProjectId });
			// Send `hash` only via `identityHash` - the backend's identity schema
			// doesn't (and shouldn't) accept unknown fields nested inside
			// `identity`, so leaving `hash` in there fails validation.
			const { hash: _hash, ...identityForRequest } = finalReferrerIdentity || {};
			apiInstance.getReferralSetup({
				visitorId,
				identity: identityForRequest,
				identityHash: finalReferrerIdentity?.hash,
			})
				.then((data) => {
					setCloudData(data);
				})
				.catch((err) => {
					console.error("Roastnest Referral SDK: Error fetching cloud referral setup:", err);
				})
				.finally(() => {
					setIsLoadingCloud(false);
				});
		}
	}, [mode, effectiveProjectId, finalReferrerIdentity]);

	if (mode === "cloud" && !effectiveProjectId) {
		console.error("Roastnest Referral SDK: projectId is required via RoastnestProvider in cloud mode");
		return null;
	}

	if (isLoadingCloud) {
		return null;
	}

	let finalCode = "";
	let finalLink = "";
	let hasError = false;

	if (mode === "cloud") {
		if (!cloudData) {
			console.error("Roastnest Referral SDK: Cloud referral setup could not be loaded.");
			return null;
		}
		finalCode = cloudData.referralCode;
		finalLink = cloudData.referralLink;
	} else {
		finalCode = localStorage.getItem("roastnest_my_referral_code") || "";
		if (!finalCode) {
			finalCode = Math.random().toString(36).substring(2, 10).toUpperCase();
			localStorage.setItem("roastnest_my_referral_code", finalCode);
			userProps.onReferralCreated?.(finalCode, finalReferrerIdentity);
		}

		if (!userProps.referralLink) {
			console.error("Roastnest Referral SDK: referralLink is required in self-hosted mode");
			hasError = true;
		} else {
			finalLink = userProps.referralLink;
			if (typeof window !== "undefined") {
				try {
					const url = new URL(finalLink);
					if (!url.hostname) throw new Error("Invalid URL");

					if (url.hostname !== window.location.hostname) {
						console.error(
							`Roastnest Referral SDK: referralLink domain (${url.hostname}) must match the current website domain (${window.location.hostname}).`,
						);
						hasError = true;
					} else {
						url.searchParams.set("ref", finalCode);
						if (finalReferrerIdentity) {
							url.searchParams.set("refId", finalReferrerIdentity.id);
							url.searchParams.set("refName", finalReferrerIdentity.name);
							if (finalReferrerIdentity.email) url.searchParams.set("refEmail", finalReferrerIdentity.email);
							if (finalReferrerIdentity.phone) url.searchParams.set("refPhone", finalReferrerIdentity.phone);
						}
						finalLink = url.toString() as `http://${string}` | `https://${string}`;
					}
				} catch (err: any) {
					console.error(
						"Roastnest Referral SDK: referralLink must be an absolute URL containing a domain (e.g., https://example.com/invite).",
					);
					hasError = true;
				}
			}
		}

		if (!userProps.onEvent) {
			console.error("Roastnest Referral SDK: onEvent callback is required in self-hosted mode to track conversions.");
			hasError = true;
		}

		if (!userProps.referrerRewardAmount && !userProps.refereeRewardAmount) {
			console.error("Roastnest Referral SDK: Reward amounts must be defined in self-hosted mode (provide at least one of referrerRewardAmount or refereeRewardAmount).");
			hasError = true;
		}
	}

	if (hasError) {
		return null;
	}

	// `theme` is a nested object - a flat spread of cloudData over userProps
	// would silently drop theme sub-fields set locally but not touched on the
	// server (same shallow-merge bug as FeedbackWidget's `customize`), so it's
	// deep-merged separately and applied after the flat spread below.
	const mergedTheme = mergeDeep(
		mergeDeep(DEFAULT_WIDGET_PROPS.theme || {}, userProps.theme),
		mode === "cloud" ? cloudData?.theme : undefined,
	);

	const props = {
		...DEFAULT_WIDGET_PROPS,
		...userProps,
		...(mode === "cloud" ? cloudData : {}),
		theme: mergedTheme,
		projectId: effectiveProjectId,
		referrerIdentity: finalReferrerIdentity,
		referralCode: finalCode,
		referralLink: finalLink,
	} as ReferralWidgetProps & { projectId: string; referralCode: string; referralLink: string; onEvent?: any };

	initializeReferralAPI({
		projectId: effectiveProjectId,
		mode: mode,
		enabled: true,
		onEvent: props.onEvent,
	});

	const themeVars = buildThemeVars(mergeDeep(context?.theme || {}, props.theme));
	const widgetState = useReferralWidget(props as ReferralWidgetProps & { projectId: string; referralCode: string; referralLink: string; });

	useEffect(() => {
		props.onMount?.(props.projectId);
	}, [props.projectId]);

	if (props.renderTrigger) {
		return (
			<>
				{props.customCSS && <style>{props.customCSS}</style>}
				{props.renderTrigger({
					open: widgetState.open,
					isOpen: widgetState.isOpen,
					projectId: props.projectId,
				})}
				{widgetState.isOpen && (
					<ReferralPopup
						isOpen={widgetState.isOpen}
						onClose={widgetState.close}
						style={themeVars}
						closeOnBackdropClick={props.closeOnBackdropClick}
					>
						{props.renderCard ? (
							props.renderCard({
								code: props.referralCode,
								link: props.referralLink,
								projectId: props.projectId,
								onCopyLink: widgetState.copyLink,
								onShare: widgetState.share,
							})
						) : (
							<ReferralCard
								{...props}
								linkCopied={widgetState.linkCopied}
								onCopyLink={widgetState.copyLink}
								onShare={widgetState.share}
							/>
						)}
					</ReferralPopup>
				)}
			</>
		);
	}

	return (
		<>
			{props.customCSS && <style>{props.customCSS}</style>}
			<ReferralButton
				position={props.buttonPosition!}
				onClick={widgetState.open}
				label={props.buttonLabel}
				icon={props.buttonIcon}
				mode={props.buttonMode}
				style={{...props.buttonStyle, ...themeVars}}
			/>

			<ReferralPopup
				isOpen={widgetState.isOpen}
				onClose={widgetState.close}
				style={themeVars}
				closeOnBackdropClick={props.closeOnBackdropClick}
			>
				{props.renderCard ? (
					props.renderCard({
						code: props.referralCode,
						link: props.referralLink,
						projectId: props.projectId,
						onCopyLink: widgetState.copyLink,
						onShare: widgetState.share,
					})
				) : (
					<ReferralCard
						{...props}
						linkCopied={widgetState.linkCopied}
						onCopyLink={widgetState.copyLink}
						onShare={widgetState.share}
					/>
				)}
			</ReferralPopup>
		</>
	);
};

// ReferralWidget renders no host content of its own (unlike FeedbackWidget,
// it never wraps `children`), so it's safe to wrap the whole thing - a crash
// anywhere inside just means the referral widget disappears, nothing else.
export const ReferralWidget: React.FC<ReferralWidgetProps> = (props) => (
	<RoastnestErrorBoundary>
		<ReferralWidgetInner {...props} />
	</RoastnestErrorBoundary>
);
