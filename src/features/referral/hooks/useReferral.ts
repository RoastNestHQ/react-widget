import { useState, useEffect } from "react";
import { ReferralConfig, ReferralData, ConversionEvent, QueuedEvent } from "../components/ReferralWidget/types";
import { ReferralAPI } from "../ReferralAPI";

let apiInstance: ReferralAPI | null = null;

/**
 * Main headless hook for open-source users to manage referral state and tracking.
 */
export function useReferral(config: ReferralConfig) {
  // Ensure singleton API instance
  if (!apiInstance || apiInstance.getConfig().projectId !== config.projectId) {
    apiInstance = new ReferralAPI(config);
    apiInstance.initialize();
  }

  const [referralData, setReferralData] = useState<ReferralData | null>(apiInstance.get());
  const [isTracking, setIsTracking] = useState(false);
  const [queuedEvents, setQueuedEvents] = useState<QueuedEvent[]>(apiInstance.getQueuedEvents());

  // Subscribe to changes if we had an event emitter, but for now we'll sync on mount
  useEffect(() => {
    if (apiInstance) {
      setReferralData(apiInstance.get());
      setQueuedEvents(apiInstance.getQueuedEvents());
    }
  }, [config.projectId]);

  const trackConversion = async (event: ConversionEvent) => {
    if (!apiInstance) return;
    setIsTracking(true);
    try {
      await apiInstance.trackConversion(event);
    } finally {
      setIsTracking(false);
      setQueuedEvents(apiInstance.getQueuedEvents());
    }
  };

  const clearReferral = () => {
    if (apiInstance) {
      apiInstance.clear();
      setReferralData(null);
    }
  };

  const retryQueue = async () => {
    if (apiInstance) {
      await apiInstance.retryQueue();
      setQueuedEvents(apiInstance.getQueuedEvents());
    }
  };

  return {
    referralCode: referralData?.code || null,
    referralData,
    hasReferral: !!referralData,
    visitorId: apiInstance.getVisitorId(),
    sessionId: apiInstance.getSessionId(),
    projectId: config.projectId,
    isTracking,
    queuedEvents,
    trackConversion,
    clearReferral,
    retryQueue,
    getConfig: () => apiInstance!.getConfig(),
  };
}
