import { TextChannel, ThreadChannel } from "discord.js";

class PaymentThreadStore {
	threadId: string | null;
	threadUrl: string | null;
    channel: TextChannel | null;
	intervalTask: NodeJS.Timeout | null;
	paidSubscriberIdList: string[];

	constructor() {
		this.threadId = null;
		this.threadUrl = null;
        this.channel = null;
		this.intervalTask = null;
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
		intervalTask: NodeJS.Timeout
	) {
		this.threadId = thread.id;
        this.threadUrl = `https://discord.com/channels/${thread.guildId}/${thread.id}`;
		this.channel = channel;
        if (this.intervalTask) {
			clearInterval(this.intervalTask);
		}
		this.intervalTask = intervalTask;
		this.paidSubscriberIdList = [];
	}

	addPaidSubscriberId(subscriberId: string) {
		if (!this.paidSubscriberIdList.includes(subscriberId)) {
			this.paidSubscriberIdList.push(subscriberId);
		}
	}
}

export const paymentThreadStore = new PaymentThreadStore();
