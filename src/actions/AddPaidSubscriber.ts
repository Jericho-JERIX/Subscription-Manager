import { Collection, ThreadMember } from "discord.js";
import { paymentThreadStore } from "../stores/PaymentThreadStore";
import { createMentionTag } from "../utils/discord";
import { config } from "../config";

const paidMessage = config.on_paid_message;

export async function addPaidSubscriber(
  collection: Collection<string, ThreadMember<boolean>>
) {
  const channel = paymentThreadStore.getChannel();
  const { owner_id } = config;
  if (!channel) {
    return;
  }
  const threadId = paymentThreadStore.getThreadId();
  for (const member of collection.values()) {
    if (
      member.joinedAt &&
      member.id !== owner_id &&
      member.thread.id === threadId &&
      paymentThreadStore.getPaidSubscriberIdList().includes(member.id)
    ) {
      paymentThreadStore.addPaidSubscriberId(member.id);
      await channel.send(
        `✅ ${createMentionTag(member.id)} ${paidMessage} ||${createMentionTag(
          owner_id
        )}||`
      );
    }
  }
}
