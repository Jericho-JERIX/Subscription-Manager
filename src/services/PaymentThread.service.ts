import { threadId } from "worker_threads";
import { paymentThreadStore } from "../stores/PaymentThreadStore";

export default class PaymentThreadService {
	static get() {
		return {
			threadId: paymentThreadStore.getThreadId(),
			threadUrl: paymentThreadStore.getThreadUrl(),
			subscriberList: paymentThreadStore.getSubscriberList(),
			channel: paymentThreadStore.getChannel(),
		};
	}
}
