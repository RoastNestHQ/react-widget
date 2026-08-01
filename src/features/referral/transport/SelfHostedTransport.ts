import { ReferralEventPayload } from "../components/ReferralWidget/types";
import { ITransport } from "./BaseTransport";
import { devLog } from "../../../shared/utils/devLog";

export class SelfHostedTransport implements ITransport {
  private onEvent?: (payload: ReferralEventPayload) => Promise<void> | void;

  constructor(onEvent?: (payload: ReferralEventPayload) => Promise<void> | void) {
    this.onEvent = onEvent;
  }

  async send(payload: ReferralEventPayload): Promise<void> {
    if (this.onEvent) {
      await this.onEvent(payload);
      devLog("Action", "Self-hosted referral event dispatched", payload);
    } else {
      console.warn("Self-hosted transport is missing an onEvent handler.");
    }
  }
}
