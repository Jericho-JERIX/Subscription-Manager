import { Client } from "discord.js";
import { createPaymentThread } from "./actions/CreatePaymentThread";
import { getNextRenewalCountdown, getNextRenewalDate } from "./utils/schedule"
import { remindUnpaidSubscriber } from "./actions/RemindUnpaidSubscriber";

function monthly(func: () => any,targetDate: Date) {
    const countdown = getNextRenewalCountdown(targetDate);
    setTimeout(() => {
        const newCountdown = getNextRenewalDate(targetDate, 1);
        func()
        monthly(func, newCountdown);
    }, countdown);
}

export function startCreatePaymentThreadTimer(client: Client) {

    const targetDate = new Date();
    targetDate.setDate(17)
    targetDate.setHours(12,0,0)

    monthly(() => createPaymentThread(client), targetDate);

}

export function startRemindUnpaidSubscriberTimer(client: Client) {

    // Get tomorrow's date
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    targetDate.setHours(12,0,0)

    const countdown = targetDate.getTime() - Date.now();
    setTimeout(() => {
        remindUnpaidSubscriber(client)
        setInterval(() => remindUnpaidSubscriber(client), 24 * 60 * 60 * 1000)
    }, countdown);

}