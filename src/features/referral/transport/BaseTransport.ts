import { ReferralEventPayload } from "../components/ReferralWidget/types";

export interface ITransport {
  send(payload: ReferralEventPayload): Promise<void>;
}

export function collectMetadata(): Record<string, string> {
  if (typeof window === "undefined") return {};
  
  return {
    currentPage: window.location.href,
    referrerUrl: document.referrer,
    browser: navigator.userAgent,
    os: navigator.platform, // basic detection
    device: navigator.userAgent.includes("Mobile") ? "Mobile" : "Desktop",
  };
}
