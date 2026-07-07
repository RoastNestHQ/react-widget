import { useState, useCallback, useRef } from "react";
import { LifecycleStage } from "../components/ReferralWidget/types";

const INITIAL_STAGES: LifecycleStage[] = [
  {
    id: 1,
    title: "Referral Link Created",
    description: "Referrer shares a unique link",
    status: "pending",
    payload: { snippet: "https://myapp.com/invite?ref=AYUSH123" }
  },
  {
    id: 2,
    title: "Link Clicked",
    description: "Friend opens the referral link. SDK detects ?ref= param.",
    status: "pending",
    payload: { snippet: "SDK: ReferralDetector.detect() → 'AYUSH123'" }
  },
  {
    id: 3,
    title: "Referral Stored",
    description: "Code saved to cookie + localStorage for 30 days",
    status: "pending",
    payload: { code: "AYUSH123", source: "query", createdAt: "2025-01-15T10:20:00Z" }
  },
  {
    id: 4,
    title: "Qualifying Action",
    description: "Friend signs up. SDK fires trackConversion()",
    status: "pending",
    payload: { snippet: "Roastnest.referral.trackConversion({ event: 'signup' })" }
  },
  {
    id: 5,
    title: "Event Sent to Backend",
    description: "SDK sends POST request with full payload",
    status: "pending",
    payload: {
      projectId: "proj_abc123",
      referralCode: "AYUSH123",
      event: "signup",
      visitorId: "vis_xk29ma",
      sessionId: "ses_7f3nqp",
      currentPage: "https://myapp.com/signup",
      timestamp: "2025-01-15T10:23:45Z"
    }
  },
  {
    id: 6,
    title: "Backend Validates",
    description: "Backend validates referral, checks fraud, attributes user",
    status: "pending",
  },
  {
    id: 7,
    title: "Reward Approved",
    description: "Both referrer and referee receive their rewards",
    status: "pending",
  }
];

export function useReferralLifecycle() {
  const [stages, setStages] = useState<LifecycleStage[]>(INITIAL_STAGES);
  const [currentStage, setCurrentStage] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateStageStatus = (index: number, status: LifecycleStage['status']) => {
    setStages(prev => {
      const newStages = [...prev];
      newStages[index] = { ...newStages[index], status };
      return newStages;
    });
  };

  const runSimulation = useCallback(() => {
    if (isRunning) return;
    
    // Reset all to pending first
    setStages(INITIAL_STAGES);
    setIsRunning(true);
    setIsComplete(false);
    setCurrentStage(0);

    let step = 0;
    
    const animateNext = () => {
      if (step >= INITIAL_STAGES.length) {
        setIsRunning(false);
        setIsComplete(true);
        setCurrentStage(null);
        return;
      }

      // Mark current as active
      updateStageStatus(step, "active");
      setCurrentStage(step);

      // Wait 1.2s, then mark as complete and move to next
      timeoutRef.current = setTimeout(() => {
        updateStageStatus(step, "complete");
        step++;
        animateNext();
      }, 1200);
    };

    animateNext();
  }, [isRunning]);

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setStages(INITIAL_STAGES);
    setIsRunning(false);
    setIsComplete(false);
    setCurrentStage(null);
  }, []);

  const goToStage = useCallback((index: number) => {
    reset();
    setStages(prev => prev.map((s, i) => {
      if (i < index) return { ...s, status: "complete" };
      if (i === index) return { ...s, status: "active" };
      return { ...s, status: "pending" };
    }));
    setCurrentStage(index);
  }, [reset]);

  return {
    stages,
    currentStage,
    isRunning,
    isComplete,
    runSimulation,
    reset,
    goToStage
  };
}
