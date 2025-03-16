import { Client } from "discord.js";
import { config } from "../config";
import { paymentThreadStore } from "../stores/PaymentThreadStore";

export async function remindUnpaidSubscriber(client: Client) {
  const alreadyPaidList = paymentThreadStore.getPaidSubscriberIdList();
  const threadUrl = paymentThreadStore.getThreadUrl();
  const unpaidList = [];

  for (const id of config.subscriber_ids) {
    if (!alreadyPaidList.includes(id)) {
      unpaidList.push(id);
    }
  }

  for (const userId of unpaidList) {
    const user = await client.users.fetch(userId);
    await user.send(`จ่ายตังด้วย ${threadUrl}`);
  }
}
