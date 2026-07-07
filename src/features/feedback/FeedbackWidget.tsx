import React, { useContext } from "react";
import WidgetTriggerButton from "../../shared/components/WidgetTriggerButton";
import WidgetOverlay from "../../shared/components/WidgetOverlay";
import FeedbackPopper from "./components/FeedbackPopper";
import Notification from "../../shared/components/Notification";
import { RoastnestContext } from "../../core/context";
import { RoastnestCustomizeProps } from "../../shared/types";

export interface FeedbackWidgetProps {
    customize?: RoastnestCustomizeProps;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ customize }) => {
    const parentContext = useContext(RoastnestContext);
    
    if (!parentContext) {
        throw new Error("FeedbackWidget must be used within a RoastnestProvider");
    }

    const mergedContext = React.useMemo(() => {
        if (!customize) return parentContext;
        return {
            ...parentContext,
            customize: {
                ...parentContext.customize,
                ...customize,
                form: {
                    ...parentContext.customize?.form,
                    ...customize.form,
                },
                island: {
                    ...parentContext.customize?.island,
                    ...customize.island,
                },
                notifications: {
                    ...parentContext.customize?.notifications,
                    ...customize.notifications,
                },
            },
        };
    }, [parentContext, customize]);

    return (
        <RoastnestContext.Provider value={mergedContext}>
            <WidgetTriggerButton />
            <WidgetOverlay />
            <FeedbackPopper />
            <Notification />
        </RoastnestContext.Provider>
    );
};

export default FeedbackWidget;
