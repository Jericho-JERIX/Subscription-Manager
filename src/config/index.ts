import { readFileSync } from "fs";

export interface Config {
    owner_id: string;
    channel_id: string;
    subscriber_ids: string[];
    payment_date: number;
    on_paid_message: string;
    reminder_message: string;
    payment_message: string;
    thread: {
        name: string;
        reason: string;
    }
    gemini: {
        apiKey: string;
        model: string;
    }
}

export const config: Config = JSON.parse(readFileSync("config.json", "utf-8"));