import axios from "axios";
import { Message } from "discord.js";
import { writeFileSync } from "fs";
import { config } from "../config";
import { containWord } from "../image-processing/extract-number";
import { paymentThreadStore } from "../stores/PaymentThreadStore";
import { addPaidSubscriber } from "./AddPaidSubscriber";
import Gemini from "../gemini/gemini";
import { Type } from "@google/genai";

const subscriberIds = config.subscriber_ids;
const SIZE_LIMIT = 2.5 * 1024 * 1024;
const gemini = new Gemini(config);

export async function validateSlipByGemini(base64: string, mimeType: string) {
	const struct = {
		type: Type.OBJECT,
		properties: {
			amount: {
				type: Type.NUMBER
			},
			date: {
				type: Type.STRING
			},
			confidence: {
				type: Type.NUMBER
			}
		},
		required: ["amount", "date", "confidence"]
	}
	const result = await gemini.generateStructuredOutput<{ isValid: boolean }>([
		{
			text: `
			Extract the amount and date from the slip image.
			- Date usually on top-left of the image.
			- Amount usually on bottom-left of the image.
			- Return only the amount and date, no other text.
			- Return the confidence of the answer between 0 and 1.
			`,
		},
		{
			inlineData: {
				mimeType: mimeType,
				data: base64
			}
		}
	], struct);
	return result;
}

export async function validateSlip(message: Message<boolean>) {

	const threadId = paymentThreadStore.getThreadId();

	if (message.channelId !== threadId) {
		return;
	}

	const member = message.member;
	if (
		!member ||
		!paymentThreadStore
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
	writeFileSync(filename, buffer.toString("base64"));

	const isValidSlip = await containWord(filename, "84.00");

	if (isValidSlip) {
		message.react("✅");
		addPaidSubscriber(message.member);
	} else {
		message.react("❌");
	}
}
