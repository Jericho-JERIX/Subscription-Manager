import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../scripts/types/SlashCommand";
import { remindUnpaidSubscriber } from "../actions/RemindUnpaidSubscriber";

export const InvokeReminder: SlashCommand = {
    slashCommandBuilder: new SlashCommandBuilder()
        .setName("invoke-reminder")
        .setDescription("Immediately DM to unpaid subscribers."),

    async onCommandExecuted(interaction) {
        await remindUnpaidSubscriber(interaction.client);
        await interaction.reply({
            content: "Reminder has been invoked!",
            ephemeral: true,
        });
    }
}