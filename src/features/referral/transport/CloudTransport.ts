import { ReferralEventPayload } from "../components/ReferralWidget/types";
import { ITransport } from "./BaseTransport";

export class CloudTransport implements ITransport {
  async send(payload: ReferralEventPayload): Promise<void> {
    const response = await fetch("https://api.roastnest.com/referrals/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Cloud transport failed: ${response.statusText}`);
    }
  }
}
