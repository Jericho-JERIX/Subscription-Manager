import { SlashCommandBuilder, TextChannel, ThreadChannel } from "discord.js";
import { SlashCommand } from "../scripts/types/SlashCommand";
import { paymentThreadStore } from "../stores/PaymentThreadStore";
import { config } from "../config";

const channelId = config.channel_id;

export const LoadPaymentThread: SlashCommand = {
	slashCommandBuilder: new SlashCommandBuilder()
		.setName("load-payment-thread")
		.setDescription("Load payment thread from thread ID.")
		.addStringOption((option) =>
			option
				.setName("thread-id")
				.setDescription("Enter thread ID")
				.setRequired(true)
		),

	async onCommandExecuted(interaction) {
		const threadId = interaction.options.getString("thread-id");

		if (!threadId) {
			await interaction.reply({
				content: "Thread ID is required!",
				ephemeral: true,
			});
			return;
		}

		const thread = await interaction.client.channels.fetch(threadId);

		if (!thread) {
			await interaction.reply({
				content: "Thread not found!",
				ephemeral: true,
			});
			return;
		}

		if (!(thread instanceof ThreadChannel)) {
			await interaction.reply({
				content: "Invalid thread!",
				ephemeral: true,
			});
			return;
		}

		const channel = await interaction.client.channels.fetch(channelId);

		if (!channel) {
			await interaction.reply({
				content: "Channel not found!",
				ephemeral: true,
			});
			return;
		}

		paymentThreadStore.createNewThread(thread, channel as TextChannel);

		await interaction.reply({
			content: `Payment thread has been loaded! >> ${paymentThreadStore.getThreadUrl()}`,
			ephemeral: true,
		});
	},
};
