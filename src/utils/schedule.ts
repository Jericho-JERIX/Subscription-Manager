export function getNextRenewalDate(date: Date | number, offset?: number) {

    if (typeof date === "number") {
        date = new Date(date);
    }

    const targetDate = new Date();
    if (offset) {
        targetDate.setMonth(date.getMonth() + offset);
    }

    while (date.getTime() < targetDate.getTime()) {
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

export function getTotalDaysInMonth(month: number, year: a) {
    return new Date(year, month, 0).getDate();
}