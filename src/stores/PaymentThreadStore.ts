import { Message, TextChannel, ThreadChannel } from "discord.js";
import { config } from "../config";

const paidSubscriberIds = config.subscriber_ids;

interface PaidSubscriber {
    userId: string;
    isPaid: boolean;
	currentPendingMessage: Message | null;
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

	getThreadUrl() {
		return this.threadUrl;
	}

    getChannel() {
        return this.channel;
    }

	getUnpaidSubscriberIdList() {
		return this.subscriberList.filter((sub) => !sub.isPaid).map((sub) => sub.userId);
	}

	createNewThread(
		thread: ThreadChannel<boolean>,
        channel: TextChannel,
	) {
		this.threadId = thread.id;
        this.threadUrl = `https://discord.com/channels/${thread.guildId}/${thread.id}`;
		this.channel = channel;
		this.subscriberList = paidSubscriberIds.map((id) => ({
			userId: id,
			isPaid: false,
			currentPendingMessage: null,
		}));
	}

	setSubscriberStatus(subscriberId: string, status: boolean) {
		for (const sub of this.subscriberList) {
            if (sub.userId === subscriberId) {
				sub.isPaid = status;
            }
        }
	}

	setSubscriberPendingMessage(subscriberId: string, message: Message | null) {
		for (const sub of this.subscriberList) {
			if (sub.userId === subscriberId) {
				sub.currentPendingMessage = message;
			}
		}
	}

	getSubscriberPendingMessage(subscriberId: string) {
		const sub = this.subscriberList.find((sub) => sub.userId === subscriberId);
		return sub?.currentPendingMessage;
	}
}

export const paymentThreadStore = new PaymentThreadStore();
