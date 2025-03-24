import axios from "axios";
import { Message } from "discord.js";
import { writeFileSync } from "fs";
import { config } from "../config";
import { containWord } from "../image-processing/extract-number";
import { paymentThreadStore } from "../stores/PaymentThreadStore";
import { addPaidSubscriber } from "./AddPaidSubscriber";

const subscriberIds = config.subscriber_ids;
const SIZE_LIMIT = 2.5 * 1024 * 1024;

export async function validateSlip(message: Message<boolean>) {
	const threadId = paymentThreadStore.getThreadId();

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
	}

}
