import { Collection, GuildMember, Message, ThreadMember } from "discord.js";
import { paymentThreadStore } from "../stores/PaymentThreadStore";
import { createMentionTag } from "../utils/discord";
import { config } from "../config";
import PaymentThreadService from "./PaymentThread.service";

const subscriberIds = config.subscriber_ids;

export default class SubscriberService {
	static async addPaidSubscriber(member: GuildMember) {
		const channel = paymentThreadStore.getChannel();
		const thread = PaymentThreadService.get();
		const { owner_id } = config;
		if (!channel) {
			return false;
		}

		if (
			member.id !== owner_id &&
			!thread.subscriberList.find((sub) => sub.userId === member.id)
				?.isPaid
		) {
			paymentThreadStore.setSubscriberStatus(member.id, true);
			paymentThreadStore.setSubscriberPendingMessage(member.id, null);
			return true;
		}
		return false;
	}

	static async setSubscriberPendingMessage(
		subscriberId: string,
		message: Message
	) {
		paymentThreadStore.setSubscriberPendingMessage(subscriberId, message);
	}

	static getUnpaidSubscriberIdList() {
		return paymentThreadStore.getUnpaidSubscriberIdList();
	}

	static getSubscriberPendingMessage(subscriberId: string) {
		return paymentThreadStore.getSubscriberPendingMessage(subscriberId);
	}
}
