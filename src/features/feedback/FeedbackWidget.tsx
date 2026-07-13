import React, { useContext, useEffect, useState } from "react";
import WidgetTriggerButton from "./components/WidgetTriggerButton";
import WidgetOverlay from "./components/WidgetOverlay";
import FeedbackPopper from "./components/FeedbackPopper";
import Notification from "../../shared/components/Notification";
import { RoastnestContext } from "../../core/context";
import { FeedbackCustomizeProps, FormSubmitHandler } from "./types";
import { FeedbackProvider } from "./FeedbackProvider";

import ApiInstance from "../../shared/utils/api";

export interface BaseFeedbackWidgetProps {
	hideTriggerButton?: boolean;
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
	const [isLoadingCloud, setIsLoadingCloud] = useState(mode === "cloud");

	useEffect(() => {
		if (mode === "cloud" && effectiveProjectId) {
			setIsLoadingCloud(true);
			const api = new ApiInstance({ siteId: effectiveProjectId });
			api.getWidgetConfig()
				.then((data) => {
					setCloudCustomize(data.customize);
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

	if (mode === "cloud" && !effectiveProjectId) {
		console.error(
			"Roastnest Feedback SDK: projectId is required via RoastnestProvider in cloud mode",
		);
		return null;
	}

	if (isLoadingCloud) {
		return null;
	}

	const customize =
		mode === "cloud" ? { ...props.customize, ...cloudCustomize } : props.customize;
	const onFormSubmit = mode === "self-hosted" ? props.onFormSubmit : undefined;

	if (mode === "self-hosted" && !onFormSubmit) {
		console.error("Roastnest Feedback SDK: onFormSubmit is required in self-hosted mode.");
		return null;
	}

	return (
		<FeedbackProvider
			customize={customize}
			hideTriggerButton={props.hideTriggerButton}
			onFormSubmit={onFormSubmit}
		>
			<WidgetTriggerButton />
			<WidgetOverlay />
			<FeedbackPopper />
			<Notification />
		</FeedbackProvider>
	);
};

export default FeedbackWidget;
