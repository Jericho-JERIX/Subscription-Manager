import { Client, TextChannel, ThreadAutoArchiveDuration } from "discord.js";
import { config } from "../config";
import { paymentThreadStore } from "../stores/PaymentThreadStore";

const threadDetail = config.thread

export async function createPaymentThread(client: Client) {

    const channel = client.channels.cache.get(config.channel_id);

    if (!channel) {
        throw new Error("Channel not found");
    }

    if (!(channel instanceof TextChannel)) {
        throw new Error("Channel is not text-based");
    }

    const now = new Date();
    const dmString = `${now.getMonth()}/${now.getFullYear()}`

    const thread = await channel.threads.create({
		name: threadDetail.name + ' ' + dmString,
		reason: threadDetail.reason + ' ' + dmString,
		autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
	});
    
    paymentThreadStore.createNewThread(thread, channel);

}