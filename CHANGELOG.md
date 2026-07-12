# Changelog

All notable changes to `@roastnest/react` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-12

### Added
- **Unified Provider**: Introduced `<RoastnestProvider>` which wraps the React application and allows switching between `self-hosted` and `cloud` modes.
- **Feedback & Bug Reporting**: Added `<FeedbackWidget />`, `<FeedbackProvider>`, and the `useFeedback` hook. Includes element selection, auto screenshots (full page and selected element), email input/validation, and custom form submission handler.
- **Client-Side Notifications**: Integrated customizable hint/offer/info periodic notice bubble cycles with support for permanent user dismissals.
- **Referral Widget & Cards**: Added `<ReferralWidget />` containing a fully responsive referral program board with clipboard copy hooks and native sharing integrations.
- **Auto-Generated Referrals**: Built client-side referral code generation and persistent storage via `localStorage`.
- **Validation**: Enforced hostname verification checks comparing the website owner's `referralLink` to `window.location.hostname` to guarantee referral loop sanity.
- **Graceful Error Handling**: Configured widget components to gracefully fall back and return `null` instead of throwing fatal errors on setup discrepancies.
- **Headless Tracking APIs**: Exposed `useReferral` hook and the `ReferralAPI` singleton to allow programmatically firing conversion tracking events (`trackConversion`) and queuing offline-first conversion events.
- **Lifecycle Simulator**: Exported `<ReferralLifecycle />` and the `useReferralLifecycle` hook to visually trace the stages of a referral conversion.
