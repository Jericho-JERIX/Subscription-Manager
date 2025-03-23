import { Collection, GuildMember, ThreadMember } from "discord.js";
import { paymentThreadStore } from "../stores/PaymentThreadStore";
import { createMentionTag } from "../utils/discord";
import { config } from "../config";

const subscriberIds = config.subscriber_ids;

export default class SubscriberService {
    static async addPaidSubscriber(member: GuildMember) {
        const channel = paymentThreadStore.getChannel();
        const { owner_id } = config;
        if (!channel) {
            return;
        }

        if (
            member.id !== owner_id &&
            !paymentThreadStore.getUnpaidSubscriberIdList().includes(member.id) &&
            subscriberIds.includes(member.id)
        ) {
            paymentThreadStore.setSubscriberStatus(member.id, true);
        }
    }

    static getUnpaidSubscriberIdList() {
        return paymentThreadStore.getUnpaidSubscriberIdList()
    }

    static getSubscriberPendingMessage(subscriberId: string) {
        return paymentThreadStore.getSubscriberPendingMessage(subscriberId)
    }
}

// export async function addPaidSubscriber(member: GuildMember) {
//     const channel = paymentThreadStore.getChannel();
//     const { owner_id } = config;
//     if (!channel) {
//         return;
//     }

//     if (
//         member.id !== owner_id &&
//         paymentThreadStore.getUnpaidSubscriberIdList().includes(member.id)
//     ) {
//         paymentThreadStore.addPaidSubscriberId(member.id);
//         await channel.send(
//             `✅ ${createMentionTag(
//                 member.id
//             )} ${paidMessage} ||${createMentionTag(owner_id)}||`
//         );
//     }
// }
