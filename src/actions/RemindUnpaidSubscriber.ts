import { Client } from "discord.js";
import { config } from "../config";
import { paymentThreadStore } from "../stores/PaymentThreadStore";

const reminderMessage = config.reminder_message;

export async function remindUnpaidSubscriber(client: Client) {
	if (paymentThreadStore.getThreadId() === null) {
		return;
	}

	const unpaidList = paymentThreadStore.getUnpaidSubscriberIdList();
	const threadUrl = paymentThreadStore.getThreadUrl();

	for (const userId of unpaidList) {
		const user = await client.users.fetch(userId);
		await user.send(`${reminderMessage} ${threadUrl}`);
	}
}
