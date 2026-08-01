import { useState, useCallback } from "react";
import { ReferralWidgetProps } from "../components/ReferralWidget/types";
import { devLog } from "../../../shared/utils/devLog";

/**
 * Widget state hook.
 */
export function useReferralWidget(props: ReferralWidgetProps & { projectId: string; referralCode: string; referralLink: string; }) {
  const [isOpen, setIsOpen] = useState(!!props.defaultOpen || !!props.visible);
  const [linkCopied, setLinkCopied] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
    devLog("Action", "Referral widget opened");
    props.onOpen?.();
  }, [props.onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    devLog("Action", "Referral widget closed");
    props.onClose?.();
  }, [props.onClose]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(props.referralLink);
      setLinkCopied(true);
      devLog("Action", "Referral link copied", { referralLink: props.referralLink });
      props.onLinkCopied?.(props.referralLink, props.projectId!, props.referrerIdentity);
      setTimeout(() => setLinkCopied(false), props.copySuccessDuration || 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  }, [props.referralLink, props.projectId, props.onLinkCopied, props.copySuccessDuration]);

  const share = useCallback(async () => {
    devLog("Action", "Referral share triggered", { referralLink: props.referralLink });
    props.onShare?.(props.projectId!, props.referrerIdentity);

    const text = props.shareMessage || `Join me on ${props.appName || 'this app'}!`;
    const shareData = {
      title: `${props.appName || 'App'} Referral`,
      text,
      url: props.referralLink
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Failed to share", err);
      }
    } else {
      // Fallback
      copyLink();
    }
  }, [props, copyLink]);

  return {
    isOpen: props.visible !== undefined ? props.visible : isOpen,
    linkCopied,
    open,
    close,
    copyLink,
    share
  };
}
