import { Collection, ThreadMember } from "discord.js";
import { paymentThreadStore } from "../stores/PaymentThreadStore";
import { createMentionTag } from "../utils/discord";
import { config } from "../config";

export async function addPaidSubscriber(collection: Collection<string, ThreadMember<boolean>>) {
    const channel = paymentThreadStore.getChannel();
    const { owner_id } = config;
    if (!channel) {
        return
    }
    for (const member of collection.values()) {
        if (member.joinedAt && member.id !== owner_id) {
            paymentThreadStore.addPaidSubscriberId(member.id);
            await channel.send(`✅ ยอดเงินของ ${createMentionTag(member.id)} ได้รับการยืนยันแล้ว ||${createMentionTag(owner_id)}||`)
        }
    }
} 