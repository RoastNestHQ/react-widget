import React, { useContext } from "react";
import WidgetTriggerButton from "./components/WidgetTriggerButton";
import WidgetOverlay from "./components/WidgetOverlay";
import FeedbackPopper from "./components/FeedbackPopper";
import Notification from "../../shared/components/Notification";
import { RoastnestContext } from "../../core/context";
import { FeedbackCustomizeProps, FormSubmitHandler } from "./types";
import { FeedbackProvider } from "./FeedbackProvider";

export interface FeedbackWidgetProps {
    customize?: FeedbackCustomizeProps;
    hideTriggerButton?: boolean;
    onFormSubmit?: FormSubmitHandler;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ customize, hideTriggerButton, onFormSubmit }) => {
    const parentContext = useContext(RoastnestContext);
    
    if (!parentContext) {
        throw new Error("FeedbackWidget must be used within a RoastnestProvider");
    }

    return (
        <FeedbackProvider customize={customize} hideTriggerButton={hideTriggerButton} onFormSubmit={onFormSubmit}>
            <WidgetTriggerButton />
            <WidgetOverlay />
            <FeedbackPopper />
            <Notification />
        </FeedbackProvider>
    );
};

export default FeedbackWidget;
