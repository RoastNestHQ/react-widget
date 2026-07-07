import { useState, useCallback } from "react";
import { ReferralWidgetProps } from "../components/ReferralWidget/types";

/**
 * Widget state hook.
 */
export function useReferralWidget(props: ReferralWidgetProps) {
  const [isOpen, setIsOpen] = useState(!!props.defaultOpen || !!props.visible);
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
    props.onOpen?.();
  }, [props.onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    props.onClose?.();
  }, [props.onClose]);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(props.referralCode);
      setCodeCopied(true);
      props.onCodeCopied?.(props.referralCode, props.projectId);
      setTimeout(() => setCodeCopied(false), props.copySuccessDuration || 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  }, [props.referralCode, props.projectId, props.onCodeCopied, props.copySuccessDuration]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(props.referralLink);
      setLinkCopied(true);
      props.onLinkCopied?.(props.referralLink, props.projectId);
      setTimeout(() => setLinkCopied(false), props.copySuccessDuration || 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  }, [props.referralLink, props.projectId, props.onLinkCopied, props.copySuccessDuration]);

  const share = useCallback(async () => {
    props.onShare?.(props.projectId);
    
    const text = props.shareMessage || `Join me on ${props.appName || 'this app'}! Use my code: ${props.referralCode}`;
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
    codeCopied,
    linkCopied,
    open,
    close,
    copyCode,
    copyLink,
    share
  };
}
