import { CLASS_NAMES } from '../../../../utils/classNames';
import defaultFeedbackConfig from "../../../../core/config/defaultFeedbackConfig";
import useFeedbackContext from "../../hooks/useFeedbackContext";
import clsx from "clsx";
import "./styles.css";
import SquareSolidPointerIcon from "../../../../shared/icons/SquareSolidPointer";
import SquareDashPointerIcon from "../../../../shared/icons/SquareDashPointer";

function WidgetTriggerButton() {
    const { active, customize, toggleActive, triggerButtonHidden } = useFeedbackContext();

    if (triggerButtonHidden) return null;

    const triggerButtonMode = customize?.triggerButton?.mode ?? defaultFeedbackConfig?.triggerButton?.mode;

    if (triggerButtonMode === "icon") {
        return (
            <div
                data-placement={customize?.triggerButton?.placement || defaultFeedbackConfig.triggerButton?.placement}
                className={clsx(CLASS_NAMES.feedback.triggerButton, CLASS_NAMES.global.avoidElement, customize?.triggerButton?.className)}
                onClick={toggleActive}
                data-active={active}
                data-mode="icon"
            >
                {active ? <SquareSolidPointerIcon /> : <SquareDashPointerIcon />}
            </div>
        );
    }

    return (
        <div
            data-placement={customize?.triggerButton?.placement || defaultFeedbackConfig.triggerButton?.placement}
            className={clsx(CLASS_NAMES.feedback.triggerButton, CLASS_NAMES.global.avoidElement, customize?.triggerButton?.className)}
            onClick={toggleActive}
        >
            <p>{customize?.triggerButton?.label || defaultFeedbackConfig.triggerButton?.label}</p>
            <div className={clsx("switch-btn", customize?.triggerButton?.switchButton?.className)} data-active={active}>
                <span className={clsx("circle", customize?.triggerButton?.switchButton?.thumb?.className)} />
            </div>
        </div>
    );
}

export default WidgetTriggerButton;
