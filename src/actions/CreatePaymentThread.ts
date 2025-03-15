import { Client, TextChannel, ThreadAutoArchiveDuration } from "discord.js";
import { config } from "../config";
import { paymentThreadStore } from "../stores/PaymentThreadStore";

export async function createPaymentThread(client: Client) {

    const channel = client.channels.cache.get(config.channel_id);

    if (!channel) {
        throw new Error("Channel not found");
    }

    if (!(channel instanceof TextChannel)) {
        throw new Error("Channel is not text-based");
    }

    const thread = await channel.threads.create({
		name: "Payment",
		reason: "Payment thread",
		autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
	});

    const task = setInterval(async () => {

        const alreadyPaidList = paymentThreadStore.getPaidSubscriberIdList();
        const threadUrl = paymentThreadStore.getThreadUrl();
        const unpaidList = [];

        for (const id of config.subscriber_ids) {
            if (!alreadyPaidList.includes(id)) {
                unpaidList.push(id);
            }
        }

        for (const userId of unpaidList) {
            const user = await client.users.fetch(userId);
            await user.send(`จ่ายตังด้วย ${threadUrl}`);
        }

    }, 10 * 1000)
    
    paymentThreadStore.createNewThread(thread, channel, task);

}