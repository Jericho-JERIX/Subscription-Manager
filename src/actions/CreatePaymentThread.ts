import { Client, TextChannel, ThreadAutoArchiveDuration } from "discord.js";
import { config } from "../config";
import { paymentThreadStore } from "../stores/PaymentThreadStore";
import { createMentionTag } from "../utils/discord";

const threadDetail = config.thread
const paymentMessage = config.payment_message
const subscriberIds = config.subscriber_ids

export async function createPaymentThread(client: Client) {

    const channel = client.channels.cache.get(config.channel_id);

    if (!channel) {
        throw new Error("Channel not found");
    }

    if (!(channel instanceof TextChannel)) {
        throw new Error("Channel is not text-based");
    }

    const now = new Date();
    const dmString = `${now.getMonth()+1}/${now.getFullYear()}`

    channel.send(`${subscriberIds.map(createMentionTag).join(' ')} ${paymentMessage}`);
    const thread = await channel.threads.create({
		name: threadDetail.name + ' ' + dmString,
		reason: threadDetail.reason + ' ' + dmString,
		autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
	});
    
    paymentThreadStore.createNewThread(thread, channel);

}