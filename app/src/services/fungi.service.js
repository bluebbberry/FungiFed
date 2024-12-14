import { FungiParser } from "./fungi-parser.service.js";

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
