import { CLASS_NAMES } from '../../../utils/classNames';
import useFeedbackContext from "./useFeedbackContext";

export function useFeedback() {
    const { active, toggleActive, setTriggerButtonVisibility } = useFeedbackContext();

    return {
        isFeedbackOpen: active,
        toggleFeedback: toggleActive,
        avoidElementClassName: CLASS_NAMES.global.avoidElement,
        setTriggerButtonVisibility,
    };
}
