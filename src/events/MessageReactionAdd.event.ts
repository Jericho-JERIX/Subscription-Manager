import { ApplicationCommandPermissionType, MessageReaction, PartialMessageReaction } from "discord.js";
import PaymentThreadService from "../services/PaymentThread.service";
import { config } from "../config";
import SubscriberService from "../services/Subscriber.service";
import { createMentionTag } from "../utils/discord";
import { constrainedMemory } from "process";

const ownerId = config.owner_id;
const paidMessage = config.on_paid_message;

export default class MessageReactionAddEvent {
    static async manuallyValidatePayment(message: MessageReaction | PartialMessageReaction) {

        const thread = PaymentThreadService.get()
        const threadId = message.message.channelId
        const emojiName = message.emoji.name
        

        if (!message.message.author) {
            console.log("Message author not found")
            return
        }

        
        const reactioneeId = message.message.author?.id
        const reactionerId = message.users.cache.last()?.id
        const reactioneeMember = await message.message.guild?.members.fetch(reactioneeId)

        if (!reactioneeMember) {
            console.log("Reactionee member not found")
            return
        }

        if (!reactionerId) {
            console.log("Reactioner not found")
            return
        }

        if (emojiName !== "✅") {
            console.log("Emoji is not ✅")
            return
        }

        if (thread.threadId !== threadId || !thread.channel) {
            console.log("Thread not found")
            return
        }
        
        if (ownerId !== reactionerId) {
            console.log("Reactioner is not owner")
            return
        }

        const unpaidIds = SubscriberService.getUnpaidSubscriberIdList()
        if (!unpaidIds.includes(reactioneeMember.user.id)) {
            console.log("Reactionee is not in unpaid list")
            return
        }

        const pendingMessage = SubscriberService.getSubscriberPendingMessage(reactioneeMember.user.id)

        if (!pendingMessage) {
            console.log("Pending message not found")
            return
        }

        const success = await SubscriberService.addPaidSubscriber(reactioneeMember)
        if (!success) {
            console.log("Failed to add paid subscriber")
            return
        }
        pendingMessage.reactions.resolve("⚠️")?.users.remove();
        pendingMessage.react("✅");
        await thread.channel.send(
            `✅ ${createMentionTag(
                reactioneeId
            )} ${paidMessage} ||${createMentionTag(ownerId)}||`
        );
        
    }
}