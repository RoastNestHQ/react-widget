import { QueuedEvent } from "../components/ReferralWidget/types";
import { ITransport } from "../transport/BaseTransport";

export class EventQueue {
  private readonly KEY = "rrn_event_queue";
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAYS = [1000, 3000, 10000];

  enqueue(payload: any): void {
    if (typeof window === "undefined") return;
    try {
      const queue = this.getAll();
      const event: QueuedEvent = {
        id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        payload,
        retryCount: 0,
        createdAt: new Date().toISOString()
      };
      queue.push(event);
      localStorage.setItem(this.KEY, JSON.stringify(queue));
    } catch (e) {}
  }

  dequeue(id: string): void {
    if (typeof window === "undefined") return;
    try {
      const queue = this.getAll();
      const newQueue = queue.filter(e => e.id !== id);
      localStorage.setItem(this.KEY, JSON.stringify(newQueue));
    } catch (e) {}
  }

  getAll(): QueuedEvent[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  clear(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(this.KEY);
    } catch (e) {}
  }

  async processQueue(transport: ITransport): Promise<void> {
    if (typeof window === "undefined") return;
    const queue = this.getAll();
    if (queue.length === 0) return;

    const remaining: QueuedEvent[] = [];

    for (const event of queue) {
      try {
        await transport.send(event.payload);
      } catch (err) {
        event.retryCount += 1;
        if (event.retryCount <= this.MAX_RETRIES) {
          remaining.push(event);
        }
      }
    }

    try {
      localStorage.setItem(this.KEY, JSON.stringify(remaining));
    } catch (e) {}
  }

  scheduleRetry(transport: ITransport): void {
    const queue = this.getAll();
    if (queue.length === 0) return;
    
    // Pick the smallest delay based on retry counts
    const delays = queue.map(e => this.RETRY_DELAYS[Math.min(e.retryCount, this.RETRY_DELAYS.length - 1)] || 10000);
    const minDelay = Math.min(...delays);

    setTimeout(() => {
      this.processQueue(transport).catch(() => {});
    }, minDelay);
  }
}
