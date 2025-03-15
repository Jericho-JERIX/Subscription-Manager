import { readFileSync } from "fs";

interface Config {
    owner_id: string;
    channel_id: string;
    subscriber_ids: string[];
}

export const config: Config = JSON.parse(readFileSync("config.json", "utf-8"));