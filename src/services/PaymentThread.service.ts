import { threadId } from "worker_threads";
import { paymentThreadStore } from "../stores/PaymentThreadStore";

export default class PaymentThreadService {
	static get() {
		return {
			threadId: paymentThreadStore.getThreadId(),
			threadUrl: paymentThreadStore.getThreadUrl(),
			paidSubscriberIdList: paymentThreadStore.getUnpaidSubscriberIdList(),
			channel: paymentThreadStore.getChannel(),
		};
	}
}
