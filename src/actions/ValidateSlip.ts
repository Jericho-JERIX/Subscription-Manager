import { Collection, Message, MessageType, ThreadMember } from "discord.js";
import { config } from "../config";
import { paymentThreadStore } from "../stores/PaymentThreadStore";
import axios from "axios";
import { writeFileSync } from "fs";
import { containWord } from "../image-processing/extract-number";
import { addPaidSubscriber } from "./AddPaidSubscriber";
import PaymentThreadService from "../services/PaymentThread.service";

const subscriberIds = config.subscriber_ids;
const SIZE_LIMIT = 2.5 * 1024 * 1024;

export async function validateSlip(message: Message<boolean>) {
	const threadId = paymentThreadStore.getThreadId();

    console.log("This is the threadId: ", threadId);
    console.log("This is the message.channelId: ", message.channelId);

    const thread = PaymentThreadService.get();


	if (message.channelId !== threadId) {
		return;
	}

	const member = message.member;
	if (
		!member ||
		paymentThreadStore
			.getUnpaidSubscriberIdList()
			.includes(member.user.id) ||
		!subscriberIds.includes(member.user.id)
	) {
		return;
	}

	const attachment = message.attachments.first();

	if (
		!attachment ||
		!attachment.contentType?.includes("image") ||
		attachment.size > SIZE_LIMIT
	) {
		return;
	}
	const fileType = attachment.contentType.split("/")[1];
	const response = await axios.get(attachment.url, {
		responseType: "arraybuffer",
	});

	const filename = `dumps/${attachment.id}.${fileType}`;

	const buffer = Buffer.from(response.data, "binary");
	writeFileSync(filename, buffer);

	const isValidSlip = await containWord(filename, "84.00");

	if (isValidSlip) {
		message.react("✅");
		addPaidSubscriber(message.member);
	} else {
		message.react("❌");
		// Remove reaction
		// message.reactions.resolve("❌")?.users.remove();
	}

	// console.log()
}
