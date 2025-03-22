import { MessageReaction, PartialMessageReaction } from "discord.js";
import PaymentThreadService from "../services/PaymentThread.service";
import { config } from "../config";

const ownerId = config.owner_id;

export default class MessageReactionAddEvent {
    static async manuallyValidatePayment(message: MessageReaction | PartialMessageReaction) {

        const thread = PaymentThreadService.get()
        const threadId = message.message.channelId
        const emojiName = message.emoji.name
        const reactioneeId = message.message.author?.id
        const reactionerId = message.users.cache.first()?.id

        if (emojiName !== "✅") {
            return
        }

        if (thread.threadId !== threadId) {
            return
        }

        if (ownerId !== reactionerId) {
            return
        }

        console.log(message)
    }
}