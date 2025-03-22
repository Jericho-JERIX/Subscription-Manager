import { TextChannel, ThreadChannel } from "discord.js";
import { config } from "../config";

const paidSubscriberIds = config.subscriber_ids;

type PaidSubscriberStatus = "PAID" | "UNPAID" | "PENDING";
interface PaidSubscriber {
    userId: string;
    status: PaidSubscriberStatus;
}

class PaymentThreadStore {
	private threadId: string | null;
	private threadUrl: string | null;
    private channel: TextChannel | null;
	private subscriberList: PaidSubscriber[];

	constructor() {
		this.threadId = null;
		this.threadUrl = null;
        this.channel = null;
		this.subscriberList = [];
	}

	getThreadId() {
		return this.threadId;
	}

	getPaidSubscriberIdList() {
		return this.subscriberList.map((ps) => ps.userId);
	}

	getThreadUrl() {
		return this.threadUrl;
	}

    getChannel() {
        return this.channel;
    }

	createNewThread(
		thread: ThreadChannel<boolean>,
        channel: TextChannel,
	) {
		this.threadId = thread.id;
        this.threadUrl = `https://discord.com/channels/${thread.guildId}/${thread.id}`;
		this.channel = channel;
		this.subscriberList = paidSubscriberIds.map((id) => ({ userId: id, status: "UNPAID" }));
	}

	setSubscriberStatus(subscriberId: string, status: PaidSubscriberStatus) {
		for (const sub of this.subscriberList) {
            if (sub.userId === subscriberId) {
                sub.status = status;
            }
        }
	}
}

export const paymentThreadStore = new PaymentThreadStore();
