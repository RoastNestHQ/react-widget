import { ReferralEventPayload } from "../components/ReferralWidget/types";
import { ITransport } from "./BaseTransport";
import ApiInstance from "../../../shared/utils/api";

export class CloudTransport implements ITransport {
	async send(payload: ReferralEventPayload): Promise<void> {
		const api = new ApiInstance({ siteId: payload.projectId });
		
		try {
			await api.postReferralEvent(payload);
		} catch (error: any) {
			throw new Error(`Cloud transport failed: ${error.message}`);
		}
	}
}
