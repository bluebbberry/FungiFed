import { assert } from 'chai';
import { RuleParser } from "../../src/services/rule-parser.service.js";
import {StaticRuleSystem} from "../../src/model/StaticRuleSystem.js";

const ruleParser = RuleParser.parser();
const testCode1 = `
FUNGISTART
|RULE:hello|RESPONSE:Hi there! How can I assist you today?
|RULE:pricing|RESPONSE:Our pricing plans are available here: https://example.com/pricing
|RULE:weather|RESPONSE:Today's weather in {city} is {condition}
|RULE:support|CONDITION:timeOfDay==morning|RESPONSE:Good morning! For support, email support@example.com.|
FUNGIEND
`;

describe('Test parser', function(){
    it('process code 1 correctly', function(){
        const tokens = ruleParser.parse(testCode1);
        console.log(tokens);
    });
});
