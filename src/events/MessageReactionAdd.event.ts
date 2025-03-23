import { MessageReaction, PartialMessageReaction } from "discord.js";
import PaymentThreadService from "../services/PaymentThread.service";
import { config } from "../config";
import SubscriberService from "../services/Subscriber.service";
import { createMentionTag } from "../utils/discord";

const ownerId = config.owner_id;
const paidMessage = config.on_paid_message;

export default class MessageReactionAddEvent {
    static async manuallyValidatePayment(message: MessageReaction | PartialMessageReaction) {

        const thread = PaymentThreadService.get()
        const threadId = message.message.channelId
        const emojiName = message.emoji.name
        

        if (!message.message.author) {
            return
        }

        const reactioneeId = message.message.author?.id
        const reactionerId = message.users.cache.first()?.id
        const reactioneeMember = await message.message.guild?.members.fetch(reactioneeId)

        if (!reactioneeMember) {
            return
        }

        if (emojiName !== "✅") {
            return
        }

        if (thread.threadId !== threadId || !thread.channel) {
            return
        }

        if (ownerId !== reactionerId) {
            return
        }

        const unpaidIds = SubscriberService.getUnpaidSubscriberIdList()
        if (!unpaidIds.includes(reactioneeMember.user.id)) {
            return
        }

        const pendingMessage = SubscriberService.getSubscriberPendingMessage(reactioneeMember.user.id)

        if (!pendingMessage) {
            return
        }

        await SubscriberService.addPaidSubscriber(reactioneeMember)
        pendingMessage.react("✅");
        await thread.channel.send(
            `✅ ${createMentionTag(
                reactioneeId
            )} ${paidMessage} ||${createMentionTag(ownerId)}||`
        );
    }
}