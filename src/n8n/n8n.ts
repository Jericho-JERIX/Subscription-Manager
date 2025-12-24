import axios from "axios";
import { config } from "../config";
import { NetflixOtpResponse } from "./response";

export default class N8N {
    static async getNetflixOtpUrl(): Promise<NetflixOtpResponse> {
        const response = await axios.get<NetflixOtpResponse>(config.n8n.otp_webhook_url);
        return response.data;
    }
}