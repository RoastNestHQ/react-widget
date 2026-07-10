import { FormDataProps } from "../../shared/types";

export interface NotificationMessage {
    message: string; // max length 22 characters
    type: "info" | "hint" | "offer" | "reward" | "social" | "urgent";
}

export type TriggerButtonPlacement =
    | "left-center"
    | "left-bottom"
    | "right-center"
    | "right-bottom"
    | "bottom-left"
    | "bottom-right";

export type TriggerButtonMode = "default" | "icon";

export type FormSubmitHandler = (data: FormDataProps) => Promise<boolean>;

export interface FeedbackCustomizeProps {
    form?: {
        className?: string;
        errorMessage?: string;
        successMessage?: string;
        submitButton?: { label?: string; className?: string };
        cancelButton?: { label?: string; className?: string };
        messageInput?: { placeholder?: string; className?: string };
        output?: {
            excludeFullPageScreenshot?: boolean;
            excludeSelectedElementScreenshot?: boolean;
        };
    };
    triggerButton?: {
        mode?: TriggerButtonMode;
        placement?: TriggerButtonPlacement;
        className?: string;
        label?: string;
        switchButton?: {
            className?: string;
            thumb?: {
                className?: string;
            };
        };
    };
    notifications?: {
        enable?: boolean;
        repeatDelay?: number;
        displayDuration?: number;
        repeatAllowed?: boolean;
        allowDismissal?: boolean;
        allowParmanentDismissal?: boolean;
        paramanentDismissalExpiryDays?: number;
        messages?: NotificationMessage[];
    };
}
