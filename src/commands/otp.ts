import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../scripts/types/SlashCommand";
import N8N from "../n8n/n8n";

export const OTP: SlashCommand = {
	slashCommandBuilder: new SlashCommandBuilder()
		.setName("otp")
		.setDescription("Get URL for Netflix OTP"),

	async onCommandExecuted(interaction) {
		const response = await N8N.getNetflixOtpUrl();
        if (!response.otp_url) {
            await interaction.reply({
                content: "ไม่พบรหัส OTP ของ Netflix โปรดลองกดขอรหัส OTP ใหม่อีกครั้งบน App และลองใหม่อีกครั้ง",
                ephemeral: true,
            });
            return;
        }
        await interaction.reply({
            content: `รับรหัส OTP ของ Netflix ได้[ที่นี่](${response.otp_url})`,
            ephemeral: true,
        });
	},
};
