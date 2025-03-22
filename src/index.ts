import { BaseInteraction, Client, Events, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { addPaidSubscriber } from "./actions/AddPaidSubscriber";
import { slashCommandList } from "./commands";
import { SlashCommandObject } from "./scripts/types/SlashCommandObject";
import { initScheduling } from "./timer";
import { getSlashCommandObject } from "./utils/slash-command";
import { validateSlip } from "./actions/ValidateSlip";
import MessageCreateEvent from "./events/MessageCreate.event";
import { paymentThreadStore } from "./stores/PaymentThreadStore";
import MessageReactionAddEvent from "./events/MessageReactionAdd.event";

dotenv.config();
let commands: SlashCommandObject;

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.MessageContent,
	],
});

client.once(Events.ClientReady, async (client) => {
	console.log(`✅ Ready! Logged in as ${client.user?.tag}`);
	commands = getSlashCommandObject(slashCommandList);
	initScheduling(client);
});

client.on("interactionCreate", async (interaction: BaseInteraction) => {
    console.log(paymentThreadStore)
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

client.on("messageCreate", async (message) =>
	MessageCreateEvent.validateSlip(message)
);

client.on("messageReactionAdd", async (message) => {
    MessageReactionAddEvent.manuallyValidatePayment(message)
})

client.login(process.env.TOKEN);
