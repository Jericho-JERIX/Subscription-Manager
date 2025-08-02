import { CronJob } from "cron";
import { Client } from "discord.js";
import { createPaymentThread } from "./actions/CreatePaymentThread";
import { remindUnpaidSubscriber } from "./actions/RemindUnpaidSubscriber";
import { config } from "./config";

const paymentDate = config.payment_date;

export function initScheduling(client: Client) {


	const remindUnpaidSubscriberJob = CronJob.from({
		cronTime: "0 0 * * *",
		onTick: () => remindUnpaidSubscriber(client),
		start: true,
		timeZone: "Asia/Bangkok",
	});
	console.log(
		`🕒 First scheduled of all tasks will be triggered in ${remindUnpaidSubscriberJob
			.nextDate()
			.toLocaleString({ timeZone: "Asia/Bangkok" })}`
	);

	const createPaymentThreadJob = CronJob.from({
		cronTime: `0 0 ${paymentDate} * *`,
		onTick: () => createPaymentThread(client),
		start: true,
		timeZone: "Asia/Bangkok",
	});
	console.log(
		`🕒 First scheduled payment thread will be triggered at date ${createPaymentThreadJob
			.nextDate()
			.toLocaleString({ timeZone: "Asia/Bangkok" })}`
	);
}
