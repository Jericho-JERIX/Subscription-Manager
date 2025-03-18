import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../scripts/types/SlashCommand";
import { config } from "../config";

const ownerId = config.owner_id

export const Status: SlashCommand = {
    slashCommandBuilder: new SlashCommandBuilder()
        .setName("status")
        .setDescription("Check current status."),

    async onCommandExecuted(interaction) {
        if (interaction.user.id !== ownerId) {
            interaction.reply({
                content: "You are not allowed to use this command!",
                ephemeral: true,
            });
            return;
        }

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12,0,0)

        const delta = (tomorrow.getTime() - Date.now()) % 86400000;
        
        interaction.reply({
            content: `The next task will be triggered in \`${Math.floor(delta/1000)}s\` (\`${tomorrow}\`)`,
            ephemeral: true,
        });
        return;
    },
}