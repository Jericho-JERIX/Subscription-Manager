import { Client, Message } from "discord.js";
import SubscriberService from "../services/Subscriber.service";
import PaymentThreadService from "../services/PaymentThread.service";
import axios from "axios";
import { config } from "../config";
import { writeFileSync } from "fs";
import ImageProcessingService from "../services/ImageProcessing.service";
import { createMentionTag } from "../utils/discord";

const SIZE_LIMIT = 2.5 * 1024 * 1024;
const subscriberIds = config.subscriber_ids;
const paidMessage = config.on_paid_message;
const ownerId = config.owner_id;

export default class MessageCreateEvent {
	static async validateSlip(message: Message<boolean>) {
		const thread = PaymentThreadService.get();

		if (
			thread.channel === null ||
			thread.threadId === null ||
			thread.threadUrl === null
		) {
			return;
		}

		const member = message.member;

		if (
			!member ||
			thread.paidSubscriberIdList.includes(member.user.id) ||
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

		const isValidSlip = await ImageProcessingService.containWord(
			filename,
			"84.00"
		);

		if (isValidSlip) {
			SubscriberService.addPaidSubscriber(message.member);
			message.react("✅");
			await thread.channel.send(
				`✅ ${createMentionTag(
					member.id
				)} ${paidMessage} ||${createMentionTag(ownerId)}||`
			);
		} else {
			message.react("⚠️");
            // message.reply("Slip is invalid. Please upload a valid slip.");
			// Remove reaction
			// message.reactions.resolve("❌")?.users.remove();
		}
	}
}
