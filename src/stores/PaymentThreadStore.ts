import { TextChannel, ThreadChannel } from "discord.js";

class PaymentThreadStore {
	private threadId: string | null;
	private threadUrl: string | null;
    private channel: TextChannel | null;
	private paidSubscriberIdList: string[];

	constructor() {
		this.threadId = null;
		this.threadUrl = null;
        this.channel = null;
		this.paidSubscriberIdList = [];
	}

	getThreadId() {
		return this.threadId;
	}

	getPaidSubscriberIdList() {
		return this.paidSubscriberIdList;
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
		this.paidSubscriberIdList = []
	}

	addPaidSubscriberId(subscriberId: string) {
		if (!this.paidSubscriberIdList.includes(subscriberId)) {
			this.paidSubscriberIdList.push(subscriberId);
		}
	}
}

export const paymentThreadStore = new PaymentThreadStore();
