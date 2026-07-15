import { CLASS_NAMES } from '../../../../utils/classNames';
import { DEFAULT_FEEDBACK_CONFIG } from "../../defaults";
import useFeedbackContext from "../../hooks/useFeedbackContext";
import clsx from "clsx";
import "./styles.css";
import SquareSolidPointerIcon from "../../../../shared/icons/SquareSolidPointer";
import SquareDashPointerIcon from "../../../../shared/icons/SquareDashPointer";

function WidgetTriggerButton() {
    const { active, customize, toggleActive, triggerButtonHidden } = useFeedbackContext();

    if (triggerButtonHidden) return null;

    const triggerButtonMode = customize?.triggerButton?.mode ?? DEFAULT_FEEDBACK_CONFIG?.triggerButton?.mode;

    if (triggerButtonMode === "icon") {
        return (
            <div
                data-placement={customize?.triggerButton?.placement || DEFAULT_FEEDBACK_CONFIG.triggerButton?.placement}
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
            data-placement={customize?.triggerButton?.placement || DEFAULT_FEEDBACK_CONFIG.triggerButton?.placement}
            className={clsx(CLASS_NAMES.feedback.triggerButton, CLASS_NAMES.global.avoidElement, customize?.triggerButton?.className)}
            onClick={toggleActive}
        >
            <p>{customize?.triggerButton?.label || DEFAULT_FEEDBACK_CONFIG.triggerButton?.label}</p>
            <div className={clsx("switch-btn", customize?.triggerButton?.switchButton?.className)} data-active={active}>
                <span className={clsx("circle", customize?.triggerButton?.switchButton?.thumb?.className)} />
            </div>
        </div>
    );
}

export default WidgetTriggerButton;
