import { RoastnestProviderProps, RoastnestWidgetProviderProps, FormDataProps } from "./shared/types";
import RoastnestProvider from "./core/RoastnestProvider";
import FeedbackWidget from "./features/feedback/FeedbackWidget";
import useRoastnest from "./core/hooks/useRoastnest";
import "./global.css";

// Export everything from features/referral
export { ReferralWidget, ReferralLifecycle, useReferral, useReferralWidget, useReferralLifecycle, ReferralAPI } from "./features/referral";
export type { ReferralConfig, ReferralData, ConversionEvent, QueuedEvent, LifecycleStage, ReferralEventPayload, ReferralWidgetProps, ReferralTheme } from "./features/referral";

export { RoastnestProvider, RoastnestProvider as RoastnestWidgetProvider, FeedbackWidget, useRoastnest, useRoastnest as useReactRoast };
export default RoastnestProvider;
export type { RoastnestProviderProps, RoastnestWidgetProviderProps as WidgetProviderProps, RoastnestWidgetProviderProps, FormDataProps };
