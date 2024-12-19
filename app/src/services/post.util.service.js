import masto from "../configs/mastodonclient.js";

async function send(message) {
    const status = await masto.v1.statuses.create({
        status: message,
    });
    console.log(status.url);
}

async function sendReply(message, status) {
    const s = await masto.v1.statuses.create({
        status: message,
        inReplyToId: status.id,
    });
    console.log(s.url);
}

/**
 * Converts a cron schedule expression into a human-readable string.
 * @param {string} cronExpression - The cron expression to convert.
 * @returns {string} - A human-readable description of the cron schedule.
 */
function cronToHumanReadable(cronExpression) {
    // Validate the cron expression
    if (!cron.validate(cronExpression)) {
        throw new Error("Invalid cron expression.");
    }

    // Split the cron expression into parts
    const [minute, hour, dayOfMonth, month, dayOfWeek] = cronExpression.split(' ');

    const humanReadableParts = [];

    // Process each part of the cron expression
    if (minute === '*') {
        humanReadableParts.push("every minute");
    } else {
        humanReadableParts.push(`at minute ${minute}`);
    }

    if (hour === '*') {
        humanReadableParts.push("every hour");
    } else {
        humanReadableParts.push(`at hour ${hour}`);
    }

    if (dayOfMonth === '*') {
        humanReadableParts.push("every day");
    } else {
        humanReadableParts.push(`on day ${dayOfMonth} of the month`);
    }

    if (month === '*') {
        humanReadableParts.push("every month");
    } else {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthList = month.split(',').map(m => months[parseInt(m, 10) - 1]);
        humanReadableParts.push(`in ${monthList.join(', ')}`);
    }

    if (dayOfWeek === '*') {
        humanReadableParts.push("on every weekday");
    } else {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayList = dayOfWeek.split(',').map(d => days[parseInt(d, 10)]);
        humanReadableParts.push(`on ${dayList.join(', ')}`);
    }

    // Join all the human-readable parts into a single string
    return humanReadableParts.join(' ');
}

export { send, sendReply, cronToHumanReadable };
