import { GuildMember } from "discord.js";
import { config } from "../config";
import { paymentThreadStore } from "../stores/PaymentThreadStore";

export async function addPaidSubscriber(member: GuildMember) {
	const { owner_id } = config;

	if (
		member.id !== owner_id &&
		paymentThreadStore.getUnpaidSubscriberIdList().includes(member.id)
	) {
		paymentThreadStore.setSubscriberStatus(member.id, true);
	}
}
