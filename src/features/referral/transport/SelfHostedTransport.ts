import { ReferralEventPayload } from "../components/ReferralWidget/types";
import { ITransport } from "./BaseTransport";

export class SelfHostedTransport implements ITransport {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async send(payload: ReferralEventPayload): Promise<void> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Self-hosted transport failed: ${response.statusText}`);
    }
  }
}
