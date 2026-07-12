# @roastnest/react

The official React SDK for [Roastnest](https://roastnest.com). A unified, lightweight, and customizable client-side package that includes an interactive **Feedback/Bug Reporting Widget**, a **Referral Program Widget**, and **Conversion Tracking APIs**.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Modes](#modes)
  - [Self-Hosted Mode](#self-hosted-mode)
  - [Cloud Mode](#cloud-mode)
- [Feedback Widget](#feedback-widget)
  - [Basic Setup](#basic-setup)
  - [useFeedback Hook](#usefeedback-hook)
  - [Feedback Customization Props](#feedback-customization-props)
- [Referral Widget](#referral-widget)
  - [Basic Setup](#basic-setup-1)
  - [Auto-generated Referral Links & Validation](#auto-generated-referral-links--validation)
  - [useReferral Hook & Conversion Tracking](#usereferral-hook--conversion-tracking)
  - [Referral Lifecycle Visualizer](#referral-lifecycle-visualizer)
- [License](#license)

---

## Features

- 🖱️ **Visual Element Selector**: Highlight and select any DOM element to provide contextual feedback.
- 📸 **Auto Screenshots**: Capture selected element or full-page screenshots using `html2canvas-pro`.
- 🤝 **Referral & Rewards Widget**: Modern invite cards with clipboard-copying and Web Share API integration.
- 🔗 **Auto-Generated Referrals**: Client-side referral code generation and persistence via `localStorage`.
- 🛡️ **Hostname Validation**: Automatically validates `referralLink` domain matching to avoid broken referral loops.
- 🔌 **Graceful Degradation**: Catches configuration issues internally and degrades safely without crashing your React tree.
- ⚙️ **Dual Modes**: Support for complete control under **Self-Hosted** (callbacks) or **Cloud** (remote Roastnest server).

---

## Installation

```sh
npm install @roastnest/react
```

or

```sh
yarn add @roastnest/react
```

---

## Getting Started

To initialize the SDK, wrap your application inside the `RoastnestProvider` component.

```tsx
import React from "react";
import { RoastnestProvider } from "@roastnest/react";

export default function App() {
  return (
    <RoastnestProvider mode="self-hosted" projectId="your_project_id">
      <YourMainApp />
    </RoastnestProvider>
  );
}
```

---

## Modes

`@roastnest/react` operates in two modes:

### Self-Hosted Mode
Provides full offline capabilities, allowing you to completely handle submit and event tracking callbacks in your own codebase without sending any data to Roastnest servers.
- **Provider setup**: `<RoastnestProvider mode="self-hosted" />`

### Cloud Mode
Hooks directly into Roastnest servers, automatically syncing feedback, uploads, screenshots, and referral conversions to your dashboard.
- **Provider setup**: `<RoastnestProvider mode="cloud" projectId="your_project_id" />`

---

## Feedback Widget

The feedback widget adds a floating action button on your page that triggers element selection, email collection, and feedback reporting.

### Basic Setup

Simply place the `<FeedbackWidget />` anywhere under the provider:

```tsx
import { FeedbackWidget } from "@roastnest/react";

function Layout() {
  return (
    <div>
      <FeedbackWidget />
    </div>
  );
}
```

### useFeedback Hook
Control the feedback overlay programmatically from any component.

```tsx
import { useFeedback } from "@roastnest/react";

function CustomButton() {
  const { isFeedbackOpen, toggleFeedback, avoidElementClassName } = useFeedback();

  return (
    <button onClick={toggleFeedback} className={avoidElementClassName}>
      {isFeedbackOpen ? "Close Feedback" : "Submit Bug / Feedback"}
    </button>
  );
}
```

### Feedback Customization Props
Pass the `customize` object to customize the feedback form and notification bubbles.

| Property | Type | Description |
|---|---|---|
| `form.messageInput.placeholder` | `string` | Placeholder for the text area |
| `form.submitButton.label` | `string` | Submit button label |
| `notifications.enable` | `boolean` | Enable or disable periodic bottom notifications |
| `notifications.messages` | `Array` | List of notification messages and types |

---

## Referral Widget

The referral widget renders a sleek dashboard to refer friends and invite others using clipboard copy options or native share actions.

### Basic Setup

```tsx
import { ReferralWidget } from "@roastnest/react";

function InvitePage() {
  return (
    <ReferralWidget
      referralLink="https://myapp.com/invite"
      appName="My Awesome App"
      rewardAmount="$20"
      onEvent={(payload) => console.log("Referral Event:", payload)}
    />
  );
}
```

### Auto-generated Referral Links & Validation

> [!IMPORTANT]
> The SDK automatically generates a secure unique referral code for each user and stores it persistently in the browser's `localStorage` (e.g. `roastnest_my_referral_code`).

- **Auto-Appending Parameter**: When you provide `referralLink="https://myapp.com/invite"`, the SDK will automatically append the generated referral code as a query param (e.g., `https://myapp.com/invite?ref=AYUSH123`).
- **Domain Matching**: For safety, the domain of the `referralLink` must match `window.location.hostname`. If they do not match, the widget will log a `console.error` and degrade gracefully by returning `null` to avoid breaking the user's webpage.

### useReferral Hook & Conversion Tracking
To track successful referral conversions (e.g., a friend signed up, subscribed, or performed an action), use the headless hook `useReferral`:

```tsx
import React, { useEffect } from "react";
import { useReferral } from "@roastnest/react";

export function SignupSuccessPage() {
  const { trackConversion, referralCode, hasReferral } = useReferral();

  useEffect(() => {
    if (hasReferral) {
      // Trigger a conversion event
      trackConversion({ event: "signup" });
    }
  }, [hasReferral]);

  return <h1>Thank you for signing up! (Referral Code Detected: {referralCode})</h1>;
}
```

### Referral Lifecycle Visualizer
The SDK contains a built-in visualizer to simulate and test your referral lifecycle stages (Shared -> Clicked -> Saved -> Action -> Attributed -> Reward Approved).

```tsx
import { ReferralLifecycle } from "@roastnest/react";

function DebugPanel() {
  return (
    <div style={{ padding: 20, border: "1px dashed gray" }}>
      <h3>Test Referral Stages Simulator</h3>
      <ReferralLifecycle />
    </div>
  );
}
```

---

## License

MIT © [RoastNest](https://roastnest.com)
