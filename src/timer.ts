import { Client } from "discord.js";
import { createPaymentThread } from "./actions/CreatePaymentThread";
import { getNextRenewalCountdown, getNextRenewalDate } from "./utils/schedule"
import { remindUnpaidSubscriber } from "./actions/RemindUnpaidSubscriber";
import { config } from "./config";

const paymentDate = config.payment_date;

// function monthly(func: () => any,targetDate: Date) {
//     const countdown = getNextRenewalCountdown(targetDate);
//     console.log("startCreatePaymentThreadTimer Will countdown in", countdown)
//     setTimeout(() => {
//         const newCountdown = getNextRenewalDate(targetDate, 1);
//         func()
//         monthly(func, newCountdown);
//     }, countdown);
// }

export function initScheduling(client: Client) {

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12,0,0)

    const delta = (tomorrow.getTime() - Date.now()) % 86400000;
    
    const task = () => {
        const now = new Date();
        remindUnpaidSubscriber(client);
        if (now.getDate() === paymentDate) {
            createPaymentThread(client);
        }
    }

    console.log(`🕒 First scheduled of all tasks will be triggered in ${delta}ms (${tomorrow})`)
    console.log(`🕒 First scheduled payment thread will be triggered at date ${paymentDate}`)
    setTimeout(() => {
        task()
        setInterval(task,24 * 60 * 60 * 1000)
    }, delta);

}