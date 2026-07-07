import React from "react";
import WidgetPopper from "../../../../shared/components/WidgetPopper";
import FeedbackForm from "../FeedbackForm";

const FeedbackPopper: React.FC = () => {
    return (
        <WidgetPopper>
            <FeedbackForm />
        </WidgetPopper>
    );
};

export default FeedbackPopper;
