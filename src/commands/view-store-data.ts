import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../scripts/types/SlashCommand";
import { paymentThreadStore } from "../stores/PaymentThreadStore";

export const ViewStore: SlashCommand = {
    slashCommandBuilder: new SlashCommandBuilder()
        .setName("view-store")
        .setDescription("View the store data"),

    async onCommandExecuted(interaction) {
        const storeData = paymentThreadStore.getStoreData();
        await interaction.reply({
            content: `Store data:\n\`\`\`${JSON.stringify(storeData)}\`\`\``,
            ephemeral: true,
        });
    }
}