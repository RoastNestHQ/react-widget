# Changelog

All notable changes to `@roastnest/react` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.5] - 2026-08-01

### Fixed
- **ReferralWidget (cloud mode) - critical**: fixed a Rules of Hooks violation that made the widget silently disappear in cloud mode. `useReferralWidget()` and a mount `useEffect` were called after early returns for the missing-projectId/loading/error states; since cloud mode is the only path with an async loading transition, the first render (loading) called fewer hooks than the loaded render, and React's hook-count-mismatch error caused the widget to be silently hidden by the error boundary. Self-hosted mode never had this problem, since it has no loading state. All hooks now run unconditionally on every render.

## [1.1.4] - 2026-08-01

### Fixed
- **ReferralWidget (self-hosted mode)**: `referralLink`'s absolute-URL validation only ran when `window` existed, so a bare path like `/invite` silently passed through unvalidated during SSR instead of failing loudly. It now runs unconditionally.
- **ReferralWidget (self-hosted mode)**: `referralLink` values that already included a reserved query param (`ref`, `refId`, `refName`, `refEmail`, `refPhone`) were silently overwritten with no warning. Now rejected with a clear error, since those params are exclusively managed by the widget.

## [1.1.3] - 2026-08-01

### Added
- **Fault isolation**: `FeedbackWidget` and `ReferralWidget` are now wrapped in an internal error boundary. A crash inside the widget's own UI is contained and renders nothing instead of taking down the host page. For `FeedbackWidget`, the boundary wraps only the widget's own UI - `children` (the host site's actual content) is unaffected even if the widget fails entirely.

### Fixed
- **Cloud mode customization**: server-provided config (`customize` for `FeedbackWidget`, `theme` for `ReferralWidget`) was merged with a shallow spread, so a partial server config (e.g. only `form.errorMessage` set) would silently wipe out sibling fields configured locally in code (e.g. `form.submitButton.label`). Now deep-merged so local and server config combine instead of one replacing the other wholesale.

## [1.1.2] - 2026-08-01

### Added
- **ReferrerIdentity.hash**: `ReferralWidget`'s cloud mode now accepts a signed `hash` on `referrerIdentity`, verified server-side before a referral link is created or fetched. Prevents a visitor from claiming someone else's email to hijack their referral link.

### Fixed
- **ReferralWidget (cloud mode)**: `hash` was being sent both inside `identity` and as `identityHash`, and the backend's `identity` schema rejects unknown fields - this caused every cloud-mode referral setup request to fail with a 400. `hash` is now only sent via `identityHash`.

## [1.1.1] - 2026-07-31

### Fixed
- **FeedbackWidget**: Added support for `children` prop to correctly wrap the application and expose the `useFeedback` context.

## [1.1.0] - 2026-07-31

### Added
- **WidgetTriggerButton**: Added styles for WidgetTriggerButton component with multi-placement support.
- **Configurable Rewards**: Implemented referral and feedback widgets with configurable reward splits and UI components.

## [1.0.0] - 2026-07-12

### Added
- **Unified Provider**: Introduced `<RoastnestProvider>` which wraps the React application and allows switching between `self-hosted` and `cloud` modes.
- **Feedback & Bug Reporting**: Added `<FeedbackWidget />`, `<FeedbackProvider>`, and the `useFeedback` hook. Includes element selection, auto screenshots (full page and selected element), email input/validation, and custom form submission handler.
- **Client-Side Notifications**: Integrated customizable hint/offer/info periodic notice bubble cycles with support for permanent user dismissals.
- **Referral Widget & Cards**: Added `<ReferralWidget />` containing a fully responsive referral program board with clipboard copy hooks and native sharing integrations.
- **Auto-Generated Referrals**: Built client-side referral code generation and persistent storage via `localStorage` for `self-hosted` mode, and direct fetch from Roastnest cloud API for `cloud` mode.
- **Validation**: Enforced hostname verification checks comparing the website owner's `referralLink` to `window.location.hostname` to guarantee referral loop sanity (active for `self-hosted` mode only).
- **Cloud Restriction Types**: Restricted widget properties so that passing layout customizations, themes, content, and submission callbacks in `cloud` mode is strictly forbidden at compile-time (typed as `never`), guaranteeing configurations are managed exclusively on the Roastnest dashboard.
- **Graceful Error Handling**: Configured widget components to gracefully fall back and return `null` instead of throwing fatal errors on setup discrepancies.
- **Headless Tracking APIs**: Exposed `useReferral` hook and the `ReferralAPI` singleton to allow programmatically firing conversion tracking events (`trackConversion`) and queuing offline-first conversion events.
- **Lifecycle Simulator**: Exported `<ReferralLifecycle />` and the `useReferralLifecycle` hook to visually trace the stages of a referral conversion.
