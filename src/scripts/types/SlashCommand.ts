import {
	AutocompleteInteraction,
	ButtonInteraction,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
	StringSelectMenuInteraction,
} from "discord.js";
export interface SlashCommandBase {
	onCommandExecuted: (
		interaction: ChatInputCommandInteraction
	) => Promise<void>;
	onButtonPressed?: (interaction: ButtonInteraction) => Promise<void>;
	onMenuSelected?: (
		interaction: StringSelectMenuInteraction
	) => Promise<void>;
	onAutoCompleteInputed?: (
		interaction: AutocompleteInteraction
	) => Promise<void>;
}
export interface SlashCommand extends SlashCommandBase {
	slashCommandBuilder:
		| SlashCommandBuilder
		| SlashCommandSubcommandsOnlyBuilder
        | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
}
export interface SlashCommandSubcommand extends SlashCommandBase {
	slashCommandBuilder: SlashCommandSubcommandBuilder;
}
