export function getNextRenewalDate(date: Date | number) {

    if (typeof date === "number") {
        date = new Date(date);
    }

    while (date.getTime() < Date.now()) {
        const nextMonth = date.getMonth() + 1;
        date.setMonth(nextMonth);
    }

    return date;
}

export function getNextRenewalCountdown(date: Date | number) {
    const nextMonth = getNextRenewalDate(date);

    // Find difference between next month and current date
    const difference = nextMonth.getTime() - Date.now();
    return difference;

}
