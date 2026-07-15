import { useState, useEffect, useCallback, ReactNode } from "react";

import getBackgroundColor from "../../utils/getBackgroundColor";
import { ScreenshotBlobs, SelectedElement, Size } from "../../shared/types";
import { FormSubmitHandler, FeedbackCustomizeProps } from "./types";
import { FeedbackContext } from "./context";
import { ToastProvider } from "../../shared/components/Toaster";

import { CLASS_NAMES } from '../../utils/classNames';
import { DEFAULT_FEEDBACK_CONFIG } from "./defaults";

const initialSelectedValue: SelectedElement = {
    position: { x: 0, y: 0 },
    size: { width: 0, height: 0 },
    isSelected: false,
};

interface FeedbackProviderProps {
    children: ReactNode;
    customize?: FeedbackCustomizeProps;
    hideTriggerButton?: boolean;
    onFormSubmit?: FormSubmitHandler;
}

export function FeedbackProvider({
    children,
    customize,
    onFormSubmit,
    hideTriggerButton = false,
}: FeedbackProviderProps) {
    const [windowSize, setWindowSize] = useState<Size>({
        width: typeof window !== "undefined" ? window.innerWidth : 0,
        height: typeof window !== "undefined" ? window.innerHeight : 0,
    });
    const [selected, setSelected] = useState<SelectedElement>(initialSelectedValue);
    const [screenshotBlobs, setScreenshotBlobs] = useState<ScreenshotBlobs>([]);
    const [triggerButtonHidden, settriggerButtonHidden] = useState<boolean>(false);
    const [active, setActive] = useState<boolean>(false);

    const toggleActive = useCallback(
        () =>
            setActive((prev) => {
                if (prev) unSelectElement();
                setElementHoverable(!prev);
                return !prev;
            }),
        []
    );

    const setTriggerButtonVisibility = useCallback((v: boolean) => settriggerButtonHidden(!v), []);

    useEffect(() => {
        if (hideTriggerButton) settriggerButtonHidden(true);
        return () => settriggerButtonHidden(false);
    }, [hideTriggerButton]);

    const setElementHoverable = (isHoverable: boolean) => {
        if (isHoverable) {
            document.body.dataset.feedbackActive = "true";
            document.body.style.cursor = "crosshair";
        } else {
            delete document.body.dataset.feedbackActive;
            document.body.style.cursor = "default";
        }
    };

    const unSelectElement = useCallback(() => {
        setScreenshotBlobs([]);
        setElementHoverable(true);
        setSelected(initialSelectedValue);
    }, []);

    const takeScreenshot = async (element: HTMLElement) => {
        const html2canvas = (await import('html2canvas-pro')).default;
        const backgroundColor = getBackgroundColor(element);
        const ignoreElementClassNames = [CLASS_NAMES.feedback.popover, CLASS_NAMES.feedback.triggerButton, CLASS_NAMES.feedback.overlay];

        const excludeFullPageScreenshot =
            customize?.form?.output?.excludeFullPageScreenshot ||
            DEFAULT_FEEDBACK_CONFIG?.form?.output?.excludeFullPageScreenshot ||
            false;
        const excludeSelectedElementScreenshot =
            customize?.form?.output?.excludeSelectedElementScreenshot ||
            DEFAULT_FEEDBACK_CONFIG?.form?.output?.excludeSelectedElementScreenshot ||
            false;

        const targetAttr = "data-screenshot-target";
        element.setAttribute(targetAttr, "true");

        setScreenshotBlobs([]);

        if (!excludeSelectedElementScreenshot) {
            await html2canvas(element, { backgroundColor }).then((canvas) => {
                canvas.toBlob(
                    (blob) => blob && setScreenshotBlobs((prev: ScreenshotBlobs) => [...prev, { type: "selected-screenshot", blob }]),
                    "image/png"
                );
            });
        }

        if (!excludeFullPageScreenshot) {
            await html2canvas(document.body, {
                useCORS: true,
                foreignObjectRendering: true,
                ignoreElements: (el: Element): boolean => {
                    return ignoreElementClassNames.some((cn: string) => el.classList.contains(cn));
                },
                onclone: (clonedDocument) => {
                    const clonedElement = clonedDocument.querySelector(`[${targetAttr}="true"]`) as HTMLElement;

                    if (clonedElement) {
                        clonedElement.style.outline = "4px dashed red";
                        clonedElement.style.outlineOffset = "2px";
                    }
                },
            }).then((canvas) => {
                canvas.toBlob(
                    (blob) => blob && setScreenshotBlobs((prev: ScreenshotBlobs) => [...prev, { type: "full-screenshot", blob }]),
                    "image/png"
                );
            });
        }

        element.removeAttribute(targetAttr);
    };

    useEffect(() => {
        if (!active) {
            document.body.classList.remove(CLASS_NAMES.feedback.active);
            return;
        }
        
        document.body.classList.add(CLASS_NAMES.feedback.active);

        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
            updateSelectedElement();
        };

        const handleScroll = () => updateSelectedElement();

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);
        return () => {
            document.body.classList.remove(CLASS_NAMES.feedback.active);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [active]);

    useEffect(() => {
        if (!active) return;

        const ignoredClassNames = [CLASS_NAMES.global.avoidElement];

        const isInsideIgnored = (el: HTMLElement | null) => {
            if (!el) return false;
            return ignoredClassNames.some((cn) => !!el.closest(`.${cn}`));
        };

        const handleClick = async (e: MouseEvent) => {
            const currentElement = e.target as HTMLElement | null;
            if (!currentElement) return;

            if (isInsideIgnored(currentElement)) return;

            e.preventDefault();
            e.stopPropagation();

            if (document.querySelector(`.${CLASS_NAMES.feedback.overlay}`)?.contains(currentElement)) {
                unSelectElement();
                return;
            }

            const rect = currentElement.getBoundingClientRect();
            setSelected({
                position: { x: rect.left, y: rect.top },
                size: { width: rect.width, height: rect.height },
                isSelected: true,
            });

            setElementHoverable(false);

            document.querySelector(`.${CLASS_NAMES.feedback.selectedElement}`)?.classList.remove(CLASS_NAMES.feedback.selectedElement);
            currentElement.classList.add(CLASS_NAMES.feedback.selectedElement);

            await takeScreenshot(currentElement);
        };

        window.addEventListener("pointerdown", handleClick, true);
        return () => window.removeEventListener("pointerdown", handleClick, true);
    }, [active, unSelectElement]);

    const updateSelectedElement = () => {
        const element = document.querySelector(`.${CLASS_NAMES.feedback.selectedElement}`) as HTMLElement | null;
        if (!element) return;

        const rect = element.getBoundingClientRect();
        setSelected((prevSelected: SelectedElement) => ({
            ...prevSelected,
            position: { x: rect.left, y: rect.top },
            size: { width: rect.width, height: rect.height },
        }));
    };

    return (
        <FeedbackContext.Provider
            value={{
                active,
                selected,
                customize,
                windowSize,
                triggerButtonHidden,
                onFormSubmit,
                toggleActive,
                unSelectElement,
                screenshotBlobs,
                setTriggerButtonVisibility,
            }}
        >
            <ToastProvider
                position={customize?.triggerButton?.placement === "bottom-right" ? "top-right" : "bottom-right"}
                max={10}
            >
                {children}
            </ToastProvider>
        </FeedbackContext.Provider>
    );
}
