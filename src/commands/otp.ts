import { SlashCommandBuilder } from "discord.js";
import N8N from "../n8n/N8n";
import { SlashCommand } from "../scripts/types/SlashCommand";

export const OTP: SlashCommand = {
	slashCommandBuilder: new SlashCommandBuilder()
		.setName("otp")
		.setDescription("Get URL for Netflix OTP"),

	async onCommandExecuted(interaction) {
		const response = await N8N.getNetflixOtpUrl();
        await interaction.reply({
            content: `รับรหัส OTP ของ Netflix ได้[ที่นี่](${response.otp_url})`,
            ephemeral: true,
        });
	},
};
