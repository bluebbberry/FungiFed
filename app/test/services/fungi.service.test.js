import { assert } from 'chai';
import { RuleParserService } from "../../src/services/rule-parser.service.js";

const ruleParser = RuleParserService.parser;
const testCode1 = `
FUNGISTART ONREPLY "Hello" DORESPOND "Hello, Fediverse user!"; FUNGIEND
`;

describe('Test parser', function(){
    it('validate for FUNGI static rule system', function(){
        assert.isFalse(ruleParser.containsValidFUNGI(testCode1));
    });
});
