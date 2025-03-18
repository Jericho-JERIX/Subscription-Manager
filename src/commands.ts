import { Ping } from "./commands/ping";
import { Status } from "./commands/status";
import { SlashCommand } from "./scripts/types/SlashCommand";

export const slashCommandList: SlashCommand[] = [Status];
