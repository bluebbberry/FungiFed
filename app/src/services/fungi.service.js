import { FungiParser } from "./fungi-parser.service.js";
import masto from "../configs/mastodonclient.js";
import * as cron from "node-cron";
import { send } from "./post.util.service.js";

/**
 * A fungi has the following five life cycle (based on https://github.com/bluebbberry/FediFungiHost/wiki/A-Fungi's-Lifecycle):
 *
 * 1. INITIAL SEARCH: Search under seed hashtag for FUNGI code (FUNGI is a custom DSL) - if success: procee, if not: sleep and try again.
 * 2. NEW CODE EXECUTION: The code is executed and feedback from user interactions is collected
 * 3. CALCULATE CODE HEALTH: After a while, the results are evaluated and a code health number is calculated
 * 4. SCRAPE & SHARE CODE HEALTH: The result with the related code is posted under the nutrition hashtag for other bots to process; at the same time, new code, potentially with evaulation results is scraped from the hashtag (of course, this may also come from human users).
 * 5. CALCULATE MUTATION: Based on one's own results, one's code history and the results from the other bots, a mutation from the current code is calculated and the life cycle start again from 3, this time with the picked code
 */
runInitialSearch().then(() => {
    runFungiLifecycle().then(() => {
        const schedule = '0 * * * *';
        cron.schedule(schedule, () => {
            runFungiLifecycle();
        });
        console.log("Scheduled new lifecycles for " + schedule);
    });
});

async function runInitialSearch() {
    // 1. initial search
    // TODO
    console.log("runInitialSearch");
}

async function runFungiLifecycle() {
    console.log("runFungiLifecycle");

    // 2. new code execution
    // TODO

    // 3. calculate code health
    // TODO

    // 4. scrape and share code health
    // TODO

    // 5. calculate mutation
    // TODO
}

// Example usage:
const exampleCode = `
ONREPLY "Hello" DORESPOND "Hello, Fediverse user!";
`;

const fungiParser = new FungiParser();

export function parseAndExecuteFungiCode(c) {
    const SUCCESS = true;
    const FAIL = false;
    console.log("Received fungi code: " + exampleCode);
    const tokens = fungiParser.tokenize(exampleCode);
    const commands = fungiParser.parse(tokens);
    fungiParser.execute(commands);
    console.log("Sucessfully parsed");
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
