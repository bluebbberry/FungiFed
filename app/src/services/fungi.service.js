import { FungiParser } from "./fungi-parser.service.js";
import { send } from "./post.util.service.js";
import masto from "../configs/mastodonclient.js";

// Example usage:
const code = `
ONREPLY "Hello" DORESPOND "Hello, Fediverse user!";
`;

const fungiParser = new FungiParser();

export function test() {
    return "test";
}

export function parseFungiCode(c) {
    const SUCCESS = true;
    const FAIL = false;
    console.log("Received fungi code: " + code);
    const tokens = fungiParser.tokenize(code);
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
    send(message + "#fungi")
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
