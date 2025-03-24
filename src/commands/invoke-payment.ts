import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../scripts/types/SlashCommand";
import { createPaymentThread } from "../actions/CreatePaymentThread";

export const InvokePayment: SlashCommand = {
	slashCommandBuilder: new SlashCommandBuilder()
		.setName("invoke-payment")
		.setDescription("Invoke payment thread"),

	async onCommandExecuted(interaction) {
		await createPaymentThread(interaction.client);
        await interaction.reply({
            content: "Payment thread has been invoked!",
            ephemeral: true,
        });
	},
};
