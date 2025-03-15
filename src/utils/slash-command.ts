import { REST, Routes } from "discord.js";
import * as dotenv from "dotenv";
import { SlashCommand } from "../scripts/types/SlashCommand";
import { SlashCommandObject } from "../scripts/types/SlashCommandObject";

dotenv.config();

const { TOKEN, CLIENT_ID }: any = process.env;

const rest = new REST({
	version: "10",
}).setToken(TOKEN);

export function getSlashCommandObject(
	slashCommandList: SlashCommand[]
): SlashCommandObject {
	let commandsObject: SlashCommandObject = {};
	for (const command of slashCommandList) {
		commandsObject[command.slashCommandBuilder.name] = command;
	}
	return commandsObject;
}

export async function registerCommands(
	slashCommandList: SlashCommand[]
): Promise<void> {
	console.log("🚀 Start registering commands to Discord server...");
	const commands = slashCommandList.map((sc) =>
		sc.slashCommandBuilder.toJSON()
	);

	try {
		await rest.put(Routes.applicationCommands(CLIENT_ID), {
			body: commands,
		});
		console.log(`✅ Successfully registered ${commands.length} commands.`);
	} catch (error) {
		console.error(error);
		return;
	}
}
