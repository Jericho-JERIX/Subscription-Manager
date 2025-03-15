import { getNextRenewalCountdown } from "./utils/schedule"

function startTimer() {

    const targetDate = new Date().setDate(17);

    const countdown = getNextRenewalCountdown(targetDate);

    setTimeout(() => {

    }, [countdown])
}