import { getMasto } from "../configs/mastodonclient.js";
import * as cron from "node-cron";

async function send(message) {
    const status = await getMasto().v1.statuses.create({
        status: message,
    });
    console.log(status.url);
}

async function sendReply(message, status) {
    const s = await getMasto().v1.statuses.create({
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
    humanReadableParts.push(parseMinute(minute));
    humanReadableParts.push(parseHour(hour));
    humanReadableParts.push(parseDayOfMonth(dayOfMonth));
    humanReadableParts.push(parseMonth(month));
    humanReadableParts.push(parseDayOfWeek(dayOfWeek));

    // Join all the human-readable parts into a single string
    return humanReadableParts.join(' ');
}

function parsePart(part, unit, names) {
    if (part === '*') {
        return `every ${unit}`;
    } else if (part.includes('/')) {
        return parseStep(part, unit);
    } else if (part.includes('-')) {
        return parseRange(part, unit);
    } else if (part.includes(',')) {
        return parseList(part, unit, names);
    } else {
        return parseSingleValue(part, unit, names);
    }
}

function parseStep(part, unit) {
    const [range, step] = part.split('/');
    if (range === '*') {
        return `every ${step} ${unit}`;
    } else {
        const [start, end] = range.split('-');
        return `every ${step} ${unit} from ${start} to ${end}`;
    }
}

function parseRange(part, unit) {
    const [start, end] = part.split('-');
    return `from ${start} to ${end} ${unit}`;
}

function parseList(part, unit, names) {
    const list = part.split(',');
    if (names) {
        return `on ${list.map(val => names[parseInt(val, 10)]).join(', ')}`;
    } else {
        return `at ${list.join(', ')} ${unit}`;
    }
}

function parseSingleValue(part, unit, names) {
    if (names) {
        return `on ${names[parseInt(part, 10)]}`;
    } else {
        return `at ${unit} ${part}`;
    }
}

function parseMinute(minute) {
    return parsePart(minute, 'minute');
}

function parseHour(hour) {
    return parsePart(hour, 'hour');
}

function parseDayOfMonth(dayOfMonth) {
    return parsePart(dayOfMonth, 'day');
}

function parseMonth(month) {
    const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return parsePart(month, 'month', monthNames);
}

function parseDayOfWeek(dayOfWeek) {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return parsePart(dayOfWeek, 'weekday', dayNames);
}

export { send, sendReply, cronToHumanReadable };
