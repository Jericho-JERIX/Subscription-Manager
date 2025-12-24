import { Client, Message } from "discord.js";
import SubscriberService from "../services/Subscriber.service";
import PaymentThreadService from "../services/PaymentThread.service";
import axios from "axios";
import { config } from "../config";
import { writeFileSync } from "fs";
import ImageProcessingService from "../services/ImageProcessing.service";
import { createMentionTag } from "../utils/discord";
import { createLogMessage } from "../utils/log";

const SIZE_LIMIT = 2.5 * 1024 * 1024;
const subscriberIds = config.subscriber_ids;
const paidMessage = config.on_paid_message;
const ownerId = config.owner_id;

export default class MessageCreateEvent {
	static async validateSlip(message: Message<boolean>) {
		const thread = PaymentThreadService.get();
		const unpaidIds = SubscriberService.getUnpaidSubscriberIdList();

		if (message.author.bot) {
			createLogMessage({
				title: "MessageCreateEvent.validateSlip",
				message: "Message from bot",
			});
			return;
		}

		if (
			thread.channel === null ||
			thread.threadId === null ||
			thread.threadUrl === null
		) {
			createLogMessage({
				title: "MessageCreateEvent.validateSlip",
				message: "Thread not found",
			});
			return;
		}

		const member = message.member;

		if (!member || !unpaidIds.includes(member.user.id)) {
			createLogMessage({
				title: "MessageCreateEvent.validateSlip",
				message: "Member not found",
			});
			return;
		}

		const attachment = message.attachments.first();

		if (
			!attachment ||
			!attachment.contentType?.includes("image") ||
			attachment.size > SIZE_LIMIT
		) {
			createLogMessage({
				title: "MessageCreateEvent.validateSlip",
				message: "Attachment not found",
			});
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
			const success = await SubscriberService.addPaidSubscriber(
				message.member
			);
			if (!success) {
				createLogMessage({
					title: "MessageCreateEvent.validateSlip",
					message: "Failed to add paid subscriber",
				});
				return;
			}
			await message.react("✅");
			await thread.channel.send(
				`✅ ${createMentionTag(
					member.id
				)} ${paidMessage} ||${createMentionTag(ownerId)}||`
			);
		} else {
			await SubscriberService.setSubscriberPendingMessage(
				member.id,
				message
			);
			await message.react("⚠️");
			const ownerAccount = await message.guild?.members.fetch(ownerId);
			if (!ownerAccount) {
				createLogMessage({
					title: "MessageCreateEvent.validateSlip",
					message: "Owner not found",
				});
				return;
			}
			await ownerAccount.send(`⚠️ เช็คสลิป ${message.url}`);
		}
	}
}
