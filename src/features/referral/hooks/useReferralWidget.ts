import { useState, useCallback } from "react";
import { ReferralWidgetProps } from "../components/ReferralWidget/types";

/**
 * Widget state hook.
 */
export function useReferralWidget(props: ReferralWidgetProps & { projectId: string; referralCode: string; referralLink: string; }) {
  const [isOpen, setIsOpen] = useState(!!props.defaultOpen || !!props.visible);
  const [linkCopied, setLinkCopied] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
    props.onOpen?.();
  }, [props.onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    props.onClose?.();
  }, [props.onClose]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(props.referralLink);
      setLinkCopied(true);
      props.onLinkCopied?.(props.referralLink, props.projectId!, props.referrerIdentity);
      setTimeout(() => setLinkCopied(false), props.copySuccessDuration || 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  }, [props.referralLink, props.projectId, props.onLinkCopied, props.copySuccessDuration]);

  const share = useCallback(async () => {
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
