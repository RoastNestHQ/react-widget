import { CLASS_NAMES } from '../../../utils/classNames';
import { autoPlacement, autoUpdate, offset, shift, useFloating, Placement } from "@floating-ui/react";
import defaultFeedbackConfig from "../../../core/config/defaultFeedbackConfig";
import { useState, useEffect, useCallback, useRef } from "react";
import { NotificationMessage } from "../../../features/feedback/types";
import useFeedbackContext from "../../../features/feedback/hooks/useFeedbackContext";
import clsx from "clsx";
import "./styles.css";

// Icons
import BulbIcon from "../../icons/bulb";
import GiftIcon from "../../icons/gift";
import SirenIcon from "../../icons/siren";
import MessageIcon from "../../icons/message";
import PercentIcon from "../../icons/percent";
import InfoIcon from "../../icons/info-outline";

const placementPadding = 5;
const nofiticationOffset = 8;
const dismissalExpiryDays = 7;
const storageKey = "rrn_notification_dismissed";
const storageTimestampKey = "rrn_notification_dismissed_timestamp";
const allowedPlacements: Placement[] = ["left", "right", "top-start", "top-end"];

const Notification: React.FC = () => {
    const [currentMessage, setCurrentMessage] = useState<NotificationMessage | null>(null);
    const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Roast widget context
    const { customize, active, triggerButtonHidden } = useFeedbackContext();

    // Do not render if triggerButton is hidden
    if (triggerButtonHidden) return null;

    // Use customized messages or default ones
    const messages = customize?.notifications?.messages ?? defaultFeedbackConfig.notifications?.messages;
    const repeatDelay = customize?.notifications?.repeatDelay ?? defaultFeedbackConfig?.notifications?.repeatDelay ?? 15;
    const displayDuration =
        customize?.notifications?.displayDuration ?? defaultFeedbackConfig.notifications?.displayDuration ?? 5;

    const parmanentDismissalExpiryDays =
        customize?.notifications?.paramanentDismissalExpiryDays ??
        defaultFeedbackConfig?.notifications?.paramanentDismissalExpiryDays ??
        dismissalExpiryDays;

    // Set reference element for floating UI
    useEffect(() => {
        const element = document.querySelector(`.${CLASS_NAMES.feedback.triggerButton}`) as HTMLElement | null;
        setReferenceElement(element);
    }, []);

    // Floating UI for notification positioning
    const { refs, floatingStyles, placement } = useFloating({
        elements: { reference: referenceElement },
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(nofiticationOffset),
            shift(),
            autoPlacement({
                padding: placementPadding,
                allowedPlacements,
            }),
        ],
    });

    // Get a random message from the list
    const getRandomMessage = useCallback((): NotificationMessage | undefined => {
        if (!messages?.length) return undefined;
        return messages[Math.floor(Math.random() * messages.length)];
    }, []);

    // Show notification at intervals
    useEffect(() => {
        let isDismissed = localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey);

        // Check if dismissal expired (7 days)
        const dismissedTimestamp = localStorage.getItem(storageTimestampKey);
        if (dismissedTimestamp) {
            const dismissedDate = new Date(dismissedTimestamp);
            const now = new Date();
            const diffInDays = (now.getTime() - dismissedDate.getTime()) / (1000 * 3600 * 24);
            if (diffInDays >= parmanentDismissalExpiryDays) {
                localStorage.removeItem(storageKey);
                localStorage.removeItem(storageTimestampKey);

                isDismissed = null;
            }
        }

        // Do not show if active or notifications disabled or dismissed
        if (active || !customize?.notifications?.enable || isDismissed === "true") {
            setIsVisible(false);
            return;
        }

        // Set interval to show notifications
        const interval = setInterval(() => {
            // Get a random message
            const message = getRandomMessage();

            if (!message) {
                setCurrentMessage(null);
                setIsVisible(false);
                return;
            }
            setCurrentMessage(message);
            setIsVisible(true);

            // Hide after display duration
            const timeout = setTimeout(() => setIsVisible(false), displayDuration * 1000);

            return () => clearTimeout(timeout);
        }, repeatDelay * 1000);

        intervalRef.current = interval;

        return () => clearInterval(interval);
    }, [getRandomMessage, active, customize?.notifications?.enable]);

    // Handle hiding the notification
    const handleHideNotification = () => {
        setIsVisible(false);
        setCurrentMessage(null);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (customize?.notifications?.allowParmanentDismissal) {
            localStorage.setItem(storageKey, "true");
            localStorage.setItem(storageTimestampKey, new Date().toISOString());
        } else {
            sessionStorage.setItem(storageKey, "true");
        }
    };

    // Do not render if not visible or no message
    if (!isVisible || !currentMessage) return null;

    return (
        <div
            ref={refs.setFloating}
            data-placement={placement}
            style={{ ...floatingStyles, zIndex: 1000000 }}
            className={clsx(CLASS_NAMES.global.notification, CLASS_NAMES.global.avoidElement)}
        >
            <div className="message" data-type={currentMessage?.type}>
                {!customize?.notifications?.allowDismissal && (
                    <button
                        type="button"
                        className="close-btn"
                        title="hide notification"
                        onClick={handleHideNotification}
                    >
                        &#10006;
                    </button>
                )}
                <span className="icon">{renderIcon(currentMessage?.type)}</span>
                <p className="text">{currentMessage?.message?.substring(0, 50)}</p>
            </div>
        </div>
    );
};

export default Notification;

const renderIcon = (type: NotificationMessage["type"]) => {
    switch (type) {
        case "info":
            return <InfoIcon />;
        case "hint":
            return <BulbIcon />;
        case "offer":
            return <PercentIcon />;
        case "reward":
            return <GiftIcon />;
        case "social":
            return <MessageIcon />;
        case "urgent":
            return <SirenIcon />;
        default:
            return <InfoIcon />;
    }
};
