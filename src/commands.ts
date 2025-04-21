import { InvokePayment } from "./commands/invoke-payment";
import { InvokeReminder } from "./commands/invoke-reminder";
import { LoadPaymentThread } from "./commands/load-payment-thread";
import { Ping } from "./commands/ping";
import { Status } from "./commands/status";
import { ViewStore } from "./commands/view-store-data";
import { SlashCommand } from "./scripts/types/SlashCommand";

export const slashCommandList: SlashCommand[] = [
	Status,
	InvokePayment,
	LoadPaymentThread,
    InvokeReminder,
    ViewStore
];
