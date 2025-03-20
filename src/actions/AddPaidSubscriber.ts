import { Collection, GuildMember, ThreadMember } from "discord.js";
import { paymentThreadStore } from "../stores/PaymentThreadStore";
import { createMentionTag } from "../utils/discord";
import { config } from "../config";

const paidMessage = config.on_paid_message;

export async function addPaidSubscriber(member: GuildMember) {
	const channel = paymentThreadStore.getChannel();
	const { owner_id } = config;
	if (!channel) {
		return;
	}

	if (
		member.id !== owner_id &&
		paymentThreadStore.getPaidSubscriberIdList().includes(member.id)
	) {
		paymentThreadStore.addPaidSubscriberId(member.id);
		await channel.send(
			`✅ ${createMentionTag(
				member.id
			)} ${paidMessage} ||${createMentionTag(owner_id)}||`
		);
	}
}
