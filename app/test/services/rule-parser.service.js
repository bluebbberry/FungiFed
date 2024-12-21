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
        assert.equal(response, 'Sorry, no match');
    });
});

describe('toRawString', () => {
    it('should handle multiple rules with templates and conditions', () => {
        const testRuleSystem = {
            getRules: () => [
                {
                    trigger: "hello",
                    response: "Hi there!",
                    condition: "timeOfDay==morning",
                    template: { city: "New York", temperature: "25C" }
                },
                {
                    trigger: "pricing",
                    response: "Our pricing plans are available here: https://example.com/pricing"
                }
            ]
        };

        const parser = new RuleParserService();
        const result = parser.toRawString(testRuleSystem);
        const expected = "FUNGISTART|RULE:hello|RESPONSE:Hi there!|CONDITION:timeOfDay==morning|TEMPLATE:city=New York,temperature=25C|RULE:pricing|RESPONSE:Our pricing plans are available here: https://example.com/pricing|FUNGIEND";
        assert.strictEqual(result, expected);
    });

    it('should handle an empty rule system', () => {
        const emptyRuleSystem = {
            getRules: () => []
        };

        const parser = new RuleParserService();
        const result = parser.toRawString(emptyRuleSystem);
        const expected = "FUNGISTART||FUNGIEND";
        assert.strictEqual(result, expected);
    });

    it('should handle a single rule with a condition', () => {
        const singleRuleSystem = {
            getRules: () => [
                {
                    trigger: "support",
                    response: "Contact support@example.com",
                    condition: "userLoggedIn==true"
                }
            ]
        };

        const parser = new RuleParserService();
        const result = parser.toRawString(singleRuleSystem);
        const expected = "FUNGISTART|RULE:support|RESPONSE:Contact support@example.com|CONDITION:userLoggedIn==true|FUNGIEND";
        assert.strictEqual(result, expected);
    });

    it('should handle multiple rules with mixed templates and conditions', () => {
        const complexRuleSystem = {
            getRules: () => [
                {
                    trigger: "weather",
                    response: "Today's weather in {city} is {condition}",
                    template: { city: "London", condition: "Sunny" }
                },
                {
                    trigger: "news",
                    response: "Latest headlines: {headline}",
                    condition: "region==UK",
                    template: { headline: "Breaking News" }
                }
            ]
        };

        const parser = new RuleParserService();
        const result = parser.toRawString(complexRuleSystem);
        const expected = "FUNGISTART|RULE:weather|RESPONSE:Today's weather in {city} is {condition}|TEMPLATE:city=London,condition=Sunny|RULE:news|RESPONSE:Latest headlines: {headline}|CONDITION:region==UK|TEMPLATE:headline=Breaking News|FUNGIEND";
        assert.strictEqual(result, expected);
    });
});
