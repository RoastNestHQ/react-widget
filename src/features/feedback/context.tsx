import { createContext } from "react";
import { Size, SelectedElement, ScreenshotBlobs } from "../../shared/types";
import { FeedbackCustomizeProps, FormSubmitHandler } from "./types";

export interface FeedbackContextType {
    active: boolean;
    windowSize: Size;
    triggerButtonHidden: boolean;
    selected: SelectedElement;
    screenshotBlobs: ScreenshotBlobs;
    customize?: FeedbackCustomizeProps;
    onFormSubmit?: FormSubmitHandler;
    toggleActive: () => void;
    unSelectElement: () => void;
    setTriggerButtonVisibility: (visible: boolean) => void;
}

export const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);
