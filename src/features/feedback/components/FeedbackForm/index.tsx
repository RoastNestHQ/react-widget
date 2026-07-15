import { CLASS_NAMES } from '../../../../utils/classNames';
import { DEFAULT_FEEDBACK_CONFIG } from "../../defaults";
import useRoastnestContext from "../../../../core/hooks/useRoastnestContext";
import useFeedbackContext from "../../hooks/useFeedbackContext";
import PersonManager from "../../../../core/PersonManager";
import ApiInstance from "../../../../shared/utils/api";
import CheckIcon from "../../../../shared/icons/check";
import Textarea from "../../../../shared/components/Textarea";
import { toast } from "../../../../shared/components/Toaster";

import { useState, FormEvent, Fragment, useEffect } from "react";
import clsx from "clsx";

import "./styles.css";

const FeedbackForm: React.FC = () => {
    const { mode, projectId, userData } = useRoastnestContext();
    const { customize, screenshotBlobs, onFormSubmit, unSelectElement } = useFeedbackContext();

    const [trackingUrl, setTrackingUrl] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");

    const [showEmail, setShowEmail] = useState(true);

    useEffect(() => {
        const personManager = new PersonManager();
        const person = personManager.getDetails();

        if (person?.id && person.hasEmail) {
            setShowEmail(false);
        } else if (userData?.email) {
            setShowEmail(false);
        }

        return () => setShowEmail(true);
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (mode === "self-hosted" && onFormSubmit instanceof Function) {
            setLoading(true);
            const isSubmitted = await onFormSubmit({ message, screenshotBlobs });
            if (isSubmitted) {
                setMessage("");
                unSelectElement();
            }
            setLoading(false);
            return;
        }

        if (!projectId) {
            console.error("projectId is required");
            return;
        }

        let user = { email, ...userData };

        setLoading(true);
        const api = new ApiInstance({ siteId: projectId });
        const response = await api.sendFeedback({ message, user, screenshotBlobs });

        if (response.success) {
            setMessage("");
            setTrackingUrl(response.trackingUrl);
            const successMsg = customize?.form?.successMessage || DEFAULT_FEEDBACK_CONFIG?.form?.successMessage;
            if (successMsg) toast.success(successMsg);
        } else {
            const errorMsg = customize?.form?.errorMessage || DEFAULT_FEEDBACK_CONFIG?.form?.errorMessage;
            if (errorMsg) toast.error(errorMsg, { duration: 5000 });
        }

        setLoading(false);
    };

    const onCancel = () => {
        setMessage("");
        setLoading(false);
        unSelectElement();
        setTrackingUrl(null);
    };

    const openTrackingUrl = () => trackingUrl && window.open(trackingUrl, "_blank");

    const messageInputPlaceholder =
        customize?.form?.messageInput?.placeholder || DEFAULT_FEEDBACK_CONFIG.form?.messageInput?.placeholder;

    const submitButtonLabel = customize?.form?.submitButton?.label || DEFAULT_FEEDBACK_CONFIG?.form?.submitButton?.label;
    const cancelButtonLabel = customize?.form?.cancelButton?.label || DEFAULT_FEEDBACK_CONFIG?.form?.cancelButton?.label;

    return trackingUrl ? (
        <div className={clsx(CLASS_NAMES.feedback.formSuccess)}>
            <div className="content-group">
                <CheckIcon />
                <p>Thanks for the feedback!</p>
            </div>
            <div className="btns-group">
                <button type="button" onClick={onCancel} disabled={isLoading}>
                    Close
                </button>
                <button type="button" onClick={openTrackingUrl}>
                    Track Progress
                </button>
            </div>
        </div>
    ) : (
        <form className={clsx(CLASS_NAMES.feedback.form, customize?.form?.className)} onSubmit={handleSubmit}>
            <div className="form-inputs">
                <Textarea
                    className={customize?.form?.messageInput?.className}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={messageInputPlaceholder}
                    minRows={userData?.email ? 3 : 2}
                    disabled={isLoading}
                    value={message}
                    required={true}
                    maxHeight={300}
                    name="message"
                />
                {showEmail && (
                    <Fragment>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            className="email-input"
                            placeholder="Email Address — Optional"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <p className="note">Note: Enter email address to receive rewards or track feedback.</p>
                    </Fragment>
                )}
            </div>
            <div className="form-btns">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className={clsx(customize?.form?.cancelButton?.className)}
                >
                    {cancelButtonLabel}
                </button>
                <button type="submit" disabled={isLoading} className={clsx(customize?.form?.submitButton?.className)}>
                    {isLoading ? "Submitting..." : submitButtonLabel}
                </button>
            </div>
        </form>
    );
};

export default FeedbackForm;
