import { WidgetCustomizeProps } from "./types";

const defaultCustomize: WidgetCustomizeProps = {
    form: {
        messageInput: {
            placeholder: "Don't be nice, Just Roast!",
        },
        submitButton: { label: "Roast it" },
        cancelButton: { label: "Cancel" },
        errorMessage: "Failed to submit message",
        successMessage: "Message Submitted",
        output: {
            excludeFullPageScreenshot: false,
            excludeSelectedElementScreenshot: false,
        },
    },
    island: {
        mode: "default",
        label: "Roast Mode",
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

export default defaultCustomize;
