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

			// Two calls instead of one: /v1/config (customization + theme -
			// shared with FeedbackWidget and deduped in ApiInstance if both are
			// mounted) and /v1/referrals/link (identity-verified, just the
			// personalized code/link). Merged back into the same shape the
			// rest of this component already expects, so nothing downstream
			// needs to change.
			Promise.all([
				apiInstance.getConfig(),
				apiInstance.getReferralLink({
					visitorId,
					identity: identityForRequest,
					identityHash: finalReferrerIdentity?.hash,
				}),
			])
				.then(([configData, linkData]: [any, any]) => {
					setCloudData({
						...(configData?.referral || {}),
						...(configData?.theme && { theme: configData.theme }),
						...linkData,
					});
				})
				.catch((err) => {
					console.error("Roastnest Referral SDK: Error fetching cloud referral setup:", err);
				})
				.finally(() => {
					setIsLoadingCloud(false);
				});
		}
	}, [mode, effectiveProjectId, finalReferrerIdentity]);

	// Every hook in this component must run unconditionally on every render
	// (Rules of Hooks) - this used to branch into early `return null`s before
	// reaching `useReferralWidget`/the mount effect further down, so the
	// "loading" render called fewer hooks than the "loaded" render. Cloud
	// mode is the only path with that async loading transition, which is
	// why this only ever crashed there ("Rendered more hooks than during
	// the previous render") - self-hosted mode has no loading state and
	// never surfaced it. Errors are now tracked as a flag that only affects
	// what's *rendered*, never which hooks run.
	let finalCode = "";
	let finalLink = "";
	let hasError = (mode === "cloud" && !effectiveProjectId) || isLoadingCloud;

	if (mode === "cloud" && !effectiveProjectId) {
		console.error("Roastnest Referral SDK: projectId is required via RoastnestProvider in cloud mode");
	}

	if (hasError) {
		// skip the branch below entirely - loading or missing projectId
	} else if (mode === "cloud") {
		if (!cloudData) {
			console.error("Roastnest Referral SDK: Cloud referral setup could not be loaded.");
			hasError = true;
		} else {
			finalCode = cloudData.referralCode;
			finalLink = cloudData.referralLink;
		}
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

			// These query params are owned exclusively by this widget - it sets
			// them below on every render. If a caller pre-includes one in their
			// referralLink, whatever value they set gets silently clobbered, so
			// that's treated as a config error instead of a confusing runtime
			// surprise. Any other path/query the caller adds (/invite, /register,
			// ?utm_source=..., etc.) is untouched and fully supported.
			const RESERVED_PARAMS = ["ref", "refId", "refName", "refEmail", "refPhone"];

			try {
				// `URL` is a global in both Node and the browser, so this check
				// - referralLink must be an absolute URL with a real base
				// (protocol + host), not a bare path like "/invite" - runs
				// unconditionally, including during SSR, not just client-side.
				const url = new URL(finalLink);
				if (!url.protocol.startsWith("http") || !url.hostname) {
					throw new Error("Invalid URL");
				}

				const conflictingParams = RESERVED_PARAMS.filter((param) => url.searchParams.has(param));
				if (conflictingParams.length > 0) {
					console.error(
						`Roastnest Referral SDK: referralLink must not include the reserved param(s) (${conflictingParams.join(", ")}) - these are added automatically and cannot be set by the caller.`,
					);
					hasError = true;
				} else if (typeof window !== "undefined") {
					// The hostname-match check needs an actual browser location,
					// so it (and appending the tracking params) stays client-only.
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
				}
			} catch (err: any) {
				console.error(
					"Roastnest Referral SDK: referralLink must be an absolute URL with a base URL/domain (e.g., https://example.com/invite, https://example.com/register).",
				);
				hasError = true;
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

	// These two hooks used to sit after the `hasError` early return removed
	// above - they must run on every render regardless of error/loading
	// state (see the Rules of Hooks note above `hasError`'s declaration).
	const themeVars = buildThemeVars(mergeDeep(context?.theme || {}, props.theme));
	const widgetState = useReferralWidget(props as ReferralWidgetProps & { projectId: string; referralCode: string; referralLink: string; });

	useEffect(() => {
		if (!hasError) props.onMount?.(props.projectId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.projectId, hasError]);

	if (hasError) {
		return null;
	}

	initializeReferralAPI({
		projectId: effectiveProjectId,
		mode: mode,
		enabled: true,
		onEvent: props.onEvent,
	});

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
