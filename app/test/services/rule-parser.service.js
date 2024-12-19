import { assert } from 'chai';
import { RuleParserService } from "../../src/services/rule-parser.service.js";

const ruleParser = RuleParserService.parser;
const testCode1 = `
FUNGISTART
|RULE:hello world|RESPONSE:Hi there! How can I assist you today?
|RULE:weather|RESPONSE:Today's weather in {city} is {condition}
|RULE:support|CONDITION:timeOfDay==morning|RESPONSE:Good morning! For support, message someone important|
FUNGIEND
`;
const input = 'hello world';
const input2 = 'weather';
const input3 = 'support';
const input4 = 'hello';

describe('Test parser', function(){
    it('process code 1 correctly', function(){
        const staticRuleSystem = ruleParser.parse(testCode1);
        const response = ruleParser.calculateResponse(staticRuleSystem, input);
        assert.equal(response, 'Hi there! How can I assist you today?');
    });

    it('process code 2 correctly', function(){
        const staticRuleSystem = ruleParser.parse(testCode1);
        const response = ruleParser.calculateResponse(staticRuleSystem, input2);
        assert.equal(response, 'Today\'s weather in {city} is {condition}');
    });

    it('process code 3 correctly', function(){
        const staticRuleSystem = ruleParser.parse(testCode1);
        const response = ruleParser.calculateResponse(staticRuleSystem, input3);
        assert.equal(response, 'Good morning! For support, message someone important');
    });

    it('process code 4 correctly', function(){
        const staticRuleSystem = ruleParser.parse(testCode1);
        const response = ruleParser.calculateResponse(staticRuleSystem, input4);
        assert.equal(response, 'Hi there! How can I assist you today?');
    });
});
