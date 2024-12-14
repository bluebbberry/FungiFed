import { FungiParser } from "./fungi-parser.service.js";
import masto from "../configs/mastodonclient.js";
import * as cron from "node-cron";
import {send, sendReply} from "./post.util.service.js";
import { getMentionsNotifications } from "./notifications.service.js";

/**
 * A fungi has the following five life cycle (based on https://github.com/bluebbberry/FediFungiHost/wiki/A-Fungi's-Lifecycle):
 *
 * 1. INITIAL SEARCH: Search under seed hashtag for FUNGI code (FUNGI is a custom DSL) - if success: procee, if not: sleep and try again.
 * 2. NEW CODE EXECUTION: The code is executed and feedback from user interactions is collected
 * 3. CALCULATE CODE HEALTH: After a while, the results are evaluated and a code health number is calculated
 * 4. SCRAPE & SHARE CODE HEALTH: The result with the related code is posted under the nutrition hashtag for other bots to process; at the same time, new code, potentially with evaulation results is scraped from the hashtag (of course, this may also come from human users).
 * 5. CALCULATE MUTATION: Based on one's own results, one's code history and the results from the other bots, a mutation from the current code is calculated and the life cycle start again from 3, this time with the picked code
 */
export function startFungiLifecycle() {
    runInitialSearch().then(() => {
        runFungiLifecycle().then(() => {
            const cronSchedule = '0 * * * *';
            cron.schedule(cronSchedule, () => {
                runFungiLifecycle();
            });
            console.log("Scheduled fungi lifecycle " + cronToHumanReadable(cronSchedule));
        });
    });
}

export function startAnsweringMentions() {
    const answerSchedule = '0 * * * *';
    cron.schedule(answerSchedule, () => {
        checkForMentionsAndLetFungiAnswer();
    });
    console.log("Scheduled fungi answering " + cronToHumanReadable(answerSchedule));
}

let fungiCode;
let fungiCommands;
let codeHealth = 0;

async function runInitialSearch() {
    // 1. initial search
    console.log("runInitialSearch");
    const status = await getStatusWithValidFUNGICodeFromFungiTag();
    if (status) fungiCode = status.content;
}

async function runFungiLifecycle() {
    console.log("runFungiLifecycle");

    if (!fungiCode) {
        console.warn("No initial code found");
        await runInitialSearch();
        return;
    }

    // 2. new code execution
    parseAndSetCommandsFromFungiCode(fungiCode);

    // 3. calculate code health
    // TODO

    // 4. scrape and share code health
    postStatusUnderFungiTag(fungiCode + " CodeHealth: " + codeHealth);

    // 5. calculate mutation
    fungiCode = getStatusWithValidFUNGICodeFromFungiTag(fungiCode);
}

// Example usage:
const exampleCode = `
ONREPLY "Hello" DORESPOND "Hello, Fediverse user!";
`;

const fungiParser = new FungiParser();

export function parseAndSetCommandsFromFungiCode(code) {
    const SUCCESS = true;
    const FAIL = false;
    console.log("Received fungi code: " + code);
    const tokens = fungiParser.tokenize(code);
    fungiCommands = fungiParser.parse(tokens);
    console.log("Sucessfully parsed and set as commands");
    return SUCCESS;
}

export async function getStatusesFromFungiTag() {
    const statuses = await masto.v1.timelines.tag.$select("fungi").list({
        limit: 30,
    });
    return statuses;
}

export function postStatusUnderFungiTag(message) {
    send(message + "#fungi");
}

export async function getStatusWithValidFUNGICodeFromFungiTag() {
    const statuses = await getStatusesFromFungiTag();
    for (let i = 0; i < statuses.length; i++) {
        const status = statuses[i];
        if (fungiParser.containsValidFUNGI(status.content)) {
            console.log("found status with FUNGI code");
            return status;
        }
    }
}

async function checkForMentionsAndLetFungiAnswer() {
    const mentions = await getMentionsNotifications();
    mentions.forEach(mention => {
        const answer = generateAnswerToStatus(mention.status);
        sendReply(mention.status, answer);
    });
}

async function generateAnswerToStatus(status) {
    console.log("generateAnswerToStatus", status);
    return fungiParser.execute(fungiCommands, status.content);
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
