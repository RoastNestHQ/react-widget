// Components
export { ReferralWidget } from "./components/ReferralWidget/index";
export { ReferralLifecycle } from "./components/ReferralLifecycle/index";

// Hooks — for open source users
export { useReferral } from "./hooks/useReferral";
export { useReferralWidget } from "./hooks/useReferralWidget";
export { useReferralLifecycle } from "./hooks/useReferralLifecycle";

// Core API
export { ReferralAPI } from "./ReferralAPI";

// Types — so open source users can import them
export type {
  ReferralConfig,
  ReferralData,
  ReferralWidgetProps,
  ReferralTheme,
  ConversionEvent,
  QueuedEvent,
  LifecycleStage,
  ReferralEventPayload,
} from "./components/ReferralWidget/types";
