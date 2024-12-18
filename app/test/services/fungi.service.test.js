import { assert } from 'chai';
import { RuleParser } from "../../src/services/rule-parser.service.js";

const ruleParser = RuleParser.parser();
const testCode1 = `
FUNGISTART ONREPLY "Hello" DORESPOND "Hello, Fediverse user!"; FUNGIEND
`;

describe('Test parser', function(){
    it('process code 1 correctly', function(){
        const tokens = ruleParser.tokenize(testCode1);
        const commands = ruleParser.parse(tokens);
        const reply = ruleParser.calculateResponse(commands, "Hello");

        assert.equal(reply, "Hello, Fediverse user!");
    });
});
