import { RoastnestProviderProps } from "./shared/types";
import RoastnestProvider from "./core/RoastnestProvider";

import "./global.css";

// Referral exports
export {
	ReferralWidget,
	ReferralLifecycle,
	useReferral,
	useReferralWidget,
	useReferralLifecycle,
	ReferralAPI,
} from "./features/referral";
export type {
	ReferralConfig,
	ReferralData,
	ConversionEvent,
	QueuedEvent,
	LifecycleStage,
	ReferralEventPayload,
	ReferralWidgetProps,
	ReferralTheme,
} from "./features/referral";

// Feedback exports
export { FeedbackWidget, FeedbackProvider, useFeedback } from "./features/feedback";
export type {
	FeedbackCustomizeProps,
	NotificationMessage,
	TriggerButtonPlacement,
	TriggerButtonMode,
	FormSubmitHandler,
	FeedbackWidgetProps,
} from "./features/feedback";

// Roastnest exports
export { RoastnestProvider };
export type { RoastnestProviderProps };
