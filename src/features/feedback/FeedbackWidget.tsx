import React, { useContext, useEffect, useState } from "react";
import { WidgetTheme } from "../../shared/types";
import { buildThemeVars } from "../referral/components/ReferralWidget/styles";
import WidgetTriggerButton from "./components/WidgetTriggerButton";
import WidgetOverlay from "./components/WidgetOverlay";
import FeedbackPopper from "./components/FeedbackPopper";
import Notification from "../../shared/components/Notification";
import RoastnestErrorBoundary from "../../shared/components/ErrorBoundary";
import { RoastnestContext } from "../../core/context";
import { FeedbackCustomizeProps, FormSubmitHandler } from "./types";
import { FeedbackProvider } from "./FeedbackProvider";
import { mergeDeep } from "../../utils/mergeDeep";

import ApiInstance from "../../shared/utils/api";

export interface BaseFeedbackWidgetProps {
	hideTriggerButton?: boolean;
	children?: React.ReactNode;
}

export type FeedbackWidgetProps = BaseFeedbackWidgetProps &
	(
		| { mode?: "cloud"; customize?: FeedbackCustomizeProps; onFormSubmit?: never }
		| {
				mode: "self-hosted";
				customize?: FeedbackCustomizeProps;
				onFormSubmit: FormSubmitHandler;
		  }
	);

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = (props) => {
	const parentContext = useContext(RoastnestContext);
	const effectiveProjectId = parentContext?.projectId;
	const mode = props.mode || parentContext?.mode || "cloud";

	const [cloudCustomize, setCloudCustomize] = useState<FeedbackCustomizeProps | undefined>(
		undefined,
	);
	const [cloudTheme, setCloudTheme] = useState<WidgetTheme | undefined>(undefined);
	const [isLoadingCloud, setIsLoadingCloud] = useState(mode === "cloud");

	useEffect(() => {
		if (mode === "cloud" && effectiveProjectId) {
			setIsLoadingCloud(true);
			const api = new ApiInstance({ siteId: effectiveProjectId });
			api.getConfig()
				.then((data) => {
					setCloudCustomize(data.feedback as FeedbackCustomizeProps | undefined);
					if (data.theme) setCloudTheme(data.theme as WidgetTheme);
				})
				.catch((err) => {
					console.error(
						"Roastnest Feedback SDK: Error fetching cloud widget config:",
						err,
					);
				})
				.finally(() => {
					setIsLoadingCloud(false);
				});
		}
	}, [mode, effectiveProjectId]);

	if (!parentContext) {
		throw new Error("FeedbackWidget must be used within a RoastnestProvider");
	}

	// `children` (the host's actual page) must render unconditionally - only
	// the widget's own UI is gated on these checks. A missing projectId,
	// missing onFormSubmit, or an in-flight cloud config fetch used to
	// `return null` here before children ever rendered, which - since
	// FeedbackWidget wraps `children` - blanked out the host's entire page
	// during that window, not just the widget's own trigger button.
	const missingProjectId = mode === "cloud" && !effectiveProjectId;
	if (missingProjectId) {
		console.error(
			"Roastnest Feedback SDK: projectId is required via RoastnestProvider in cloud mode",
		);
	}

	const onFormSubmit = mode === "self-hosted" ? props.onFormSubmit : undefined;
	const missingOnFormSubmit = mode === "self-hosted" && !onFormSubmit;
	if (missingOnFormSubmit) {
		console.error("Roastnest Feedback SDK: onFormSubmit is required in self-hosted mode.");
	}

	const showWidgetUI = !missingProjectId && !missingOnFormSubmit && !isLoadingCloud;

	// Deep merge, not a shallow spread - cloud config setting only e.g.
	// `form.errorMessage` must not wipe out a locally-configured
	// `form.submitButton.label` that the server never touched.
	const customize =
		mode === "cloud"
			? mergeDeep<FeedbackCustomizeProps>(props.customize || {}, cloudCustomize)
			: props.customize;

	const themeVars = buildThemeVars({ ...parentContext?.theme, ...cloudTheme });

	return (
		<div style={themeVars} className="rrn-feedback-root">
			<FeedbackProvider
				customize={customize}
				hideTriggerButton={props.hideTriggerButton}
				onFormSubmit={onFormSubmit}
			>
				{props.children}
				{/* Only the widget's own UI is inside the boundary - if it throws,
				    `children` (the host's actual page) above is unaffected. */}
				{showWidgetUI && (
					<RoastnestErrorBoundary>
						<WidgetTriggerButton />
						<WidgetOverlay />
						<FeedbackPopper />
						<Notification />
					</RoastnestErrorBoundary>
				)}
			</FeedbackProvider>
		</div>
	);
};

export default FeedbackWidget;
