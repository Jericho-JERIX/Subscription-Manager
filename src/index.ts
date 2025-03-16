import { BaseInteraction, Client, Events, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { createPaymentThread } from "./actions/CreatePaymentThread";
import { slashCommandList } from "./commands";
import { SlashCommandObject } from "./scripts/types/SlashCommandObject";
import { getSlashCommandObject } from "./utils/slash-command";
import { addPaidSubscriber } from "./actions/AddPaidSubscriber";
import { startCreatePaymentThreadTimer, startRemindUnpaidSubscriberTimer } from "./timer";

dotenv.config();
let commands: SlashCommandObject;

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildMembers,
	],
});

client.once(Events.ClientReady, async (client) => {
	console.log(`✅ Ready! Logged in as ${client.user?.tag}`);
	commands = getSlashCommandObject(slashCommandList);
	// createPaymentThread(client);
	startCreatePaymentThreadTimer(client);
	startRemindUnpaidSubscriberTimer(client);
});

client.on("interactionCreate", async (interaction: BaseInteraction) => {
	if (interaction.isChatInputCommand()) {
		await commands[interaction.commandName].onCommandExecuted(interaction);
	} else if (interaction.isButton()) {
		await commands[
			String(interaction.message.interaction?.commandName)
		].onButtonPressed?.(interaction);
	} else if (interaction.isStringSelectMenu()) {
		await commands[
			String(interaction.message.interaction?.commandName)
		].onMenuSelected?.(interaction);
	} else if (interaction.isAutocomplete()) {
		await commands[String(interaction.commandName)].onAutoCompleteInputed?.(
			interaction
		);
	}
});

client.on("threadMembersUpdate", async (message) =>
	addPaidSubscriber(message)
);

client.login(process.env.TOKEN);
