import { ReferralConfig, ReferralData, ConversionEvent, QueuedEvent, ReferralEventPayload, ReferrerIdentity } from "./components/ReferralWidget/types";
import { ReferralDetector } from "./core/ReferralDetector";
import { ReferralStorage } from "./core/ReferralStorage";
import { VisitorManager } from "./core/VisitorManager";
import { SessionManager } from "./core/SessionManager";
import { EventQueue } from "./core/EventQueue";
import { ITransport, collectMetadata } from "./transport/BaseTransport";
import { CloudTransport } from "./transport/CloudTransport";
import { SelfHostedTransport } from "./transport/SelfHostedTransport";

export interface ReferralAPIDependencies {
  detector: ReferralDetector;
  storage: ReferralStorage;
  visitorMgr: VisitorManager;
  sessionMgr: SessionManager;
  queue: EventQueue;
  transport: ITransport;
}

export class ReferralAPI {
  private config: ReferralConfig;
  private detector: ReferralDetector;
  private storage: ReferralStorage;
  private visitorMgr: VisitorManager;
  private sessionMgr: SessionManager;
  private queue: EventQueue;
  private transport: ITransport;
  private referrerIdentity: ReferrerIdentity | undefined;

  constructor(config: ReferralConfig, deps: ReferralAPIDependencies) {
    if (config.mode === "cloud" && !config.projectId) {
      throw new Error("Roastnest Referral SDK: projectId is required in cloud mode");
    }
    this.config = config;
    this.detector = deps.detector;
    this.storage = deps.storage;
    this.visitorMgr = deps.visitorMgr;
    this.sessionMgr = deps.sessionMgr;
    this.queue = deps.queue;
    this.transport = deps.transport;
  }

  /**
   * Factory method to create an instance with all its dependencies.
   */
  static create(config: ReferralConfig): ReferralAPI {
    if (config.mode === "cloud" && !config.projectId) {
      throw new Error("Roastnest Referral SDK: projectId is required in cloud mode");
    }

    const transport = config.mode === "self-hosted"
      ? new SelfHostedTransport(config.onEvent)
      : new CloudTransport();

    return new ReferralAPI(config, {
      detector: new ReferralDetector(config.queryParam),
      storage: new ReferralStorage(config.cookieDurationDays),
      visitorMgr: new VisitorManager(),
      sessionMgr: new SessionManager(),
      queue: new EventQueue(),
      transport,
    });
  }

  /**
   * Initializes the SDK, auto-detects referral code from URL, and saves it.
   */
  initialize(): void {
    if (!this.config.enabled) return;

    // Detect from URL
    const detectedCode = this.detector.detect();
    if (detectedCode) {
      this.storage.save({
        code: detectedCode,
        source: "query",
        createdAt: new Date(),
      });
      // Fire page_view or detect event instantly
      this.trackConversion({ event: "referral_detected" }).catch(() => {});
    }

    // Try processing any pending queue events on load
    this.retryQueue().catch(() => {});
  }

  /**
   * Retrieves the currently stored referral data.
   */
  get(): ReferralData | null {
    return this.storage.read();
  }

  /**
   * Returns true if a referral code exists in storage.
   */
  has(): boolean {
    return this.get() !== null;
  }

  /**
   * Clears the referral code from cookie and localStorage.
   */
  clear(): void {
    this.storage.clear();
  }

  /**
   * Retrieves the persistent anonymous visitor ID.
   */
  getVisitorId(): string {
    return this.visitorMgr.getOrCreate();
  }

  /**
   * Retrieves the per-session ID.
   */
  getSessionId(): string {
    return this.sessionMgr.getOrCreate();
  }

  /**
   * Retrieves the current list of queued events.
   */
  getQueuedEvents(): QueuedEvent[] {
    return this.queue.getAll();
  }

  /**
   * Clears the queue completely.
   */
  clearQueue(): void {
    this.queue.clear();
  }

  /**
   * Manually triggers a retry of all queued events.
   */
  async retryQueue(): Promise<void> {
    await this.queue.processQueue(this.transport);
  }

  /**
   * Returns the configuration.
   */
  getConfig(): ReferralConfig {
    return this.config;
  }

  getReferrerIdentity(): ReferrerIdentity | undefined {
    return this.referrerIdentity;
  }

  setReferrerIdentity(identity: ReferrerIdentity | undefined): void {
    this.referrerIdentity = identity;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('roastnest-identity-updated', { detail: identity }));
    }
  }

  /**
   * Returns the configured project ID.
   */
  getProjectId(): string {
    return this.config.projectId || "";
  }

  /**
   * Tracks a conversion event, appending referral and metadata.
   */
  async trackConversion(event: ConversionEvent): Promise<void> {
    if (!this.config.enabled) return;

    const refData = this.get();
    if (!refData || !refData.code) return;

    const payload: ReferralEventPayload = {
      projectId: this.config.projectId || "",
      referralCode: refData?.code || "",
      event: event.event,
      value: event.value,
      currency: event.currency,
      metadata: event.metadata,
      visitorId: this.getVisitorId(),
      sessionId: this.getSessionId(),
      timestamp: new Date().toISOString(),
      ...collectMetadata()
    };

    try {
      await this.transport.send(payload);
    } catch (err) {
      // If it fails, enqueue it for later retry
      this.queue.enqueue(payload);
      this.queue.scheduleRetry(this.transport);
    }
  }
}
