import { FeedbackCustomizeProps } from "./types";

export const DEFAULT_FEEDBACK_CONFIG: FeedbackCustomizeProps = {
    form: {
        messageInput: {
            placeholder: "Leave your Feedback!",
        },
        submitButton: { label: "Send Feedback" },
        cancelButton: { label: "Cancel" },
        errorMessage: "Failed to submit message",
        successMessage: "Message Submitted",
        output: {
            excludeFullPageScreenshot: false,
            excludeSelectedElementScreenshot: false,
        },
    },
    triggerButton: {
        mode: "default",
        label: "Feedback Mode",
        placement: "left-center",
    },
    notifications: {
        enable: true,
        repeatDelay: 15,
        displayDuration: 5,
        allowDismissal: true,
        allowParmanentDismissal: false,
        paramanentDismissalExpiryDays: 7,
        messages: [
            {
                message: "Feedback help us improve! Share your thoughts.",
                type: "info",
            },
            {
                message: "Click here to share feedback with us.",
                type: "hint",
            },
            {
                message: "Give feedback and get discounts!",
                type: "offer",
            },
            {
                message: "You’ve earned discount! Redeem them now.",
                type: "reward",
            },
            {
                message: "20+ Users love our product! Join them now.",
                type: "social",
            },
            {
                message: "Last chance! discount ends in 2 days. Hurry up!",
                type: "urgent",
            },
        ],
    },
};
