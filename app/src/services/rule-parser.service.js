/**
 * Simple and safe parser for the FUNGI rules language (single-line version).
 * Parses FUNGI code into a structured object and executes it in a controlled environment.
 *
 * FUNGI rule systems are based on the following format:
 * ```
 * RULE:trigger|RESPONSE:response[|CONDITION:condition][|TEMPLATE:key1:value1,key2:value2,...]
 * ```
 *
 * For example:
 * ```
 * RULE:hello|RESPONSE:Hi there! How can I assist you today?|
 * RULE:pricing|RESPONSE:Our pricing plans are available here: https://example.com/pricing|
 * RULE:weather|RESPONSE:Today's weather in {city} is {condition}|
 * RULE:support|CONDITION:timeOfDay==morning|RESPONSE:Good morning! For support, email support@example.com.|
 * ```
 */
import {StaticRuleSystem} from "../model/StaticRuleSystem.js";
import {StaticRule} from "../model/StaticRule.js";

export class RuleParserService {
    static parser = new RuleParserService();

    constructor() {
        this.variables = {}; // Store variables for execution
        this.programEnd = "FUNGIEND";
        this.programStart = "FUNGISTART";
    }

    /**
     * Parses the input code into individual commands.
     * @param {string} rawString - The FUNGI code as a string, potentially containing trailing non-parsable chars.
     * @returns StaticRuleSystem
     */
    parse(rawString) {
        const resultRules = [];

        // cut out valid code section (between start and end of program)
        let startIndex = rawString.indexOf(this.programStart);
        let endIndex = rawString.indexOf(this.programEnd);

        if (startIndex === -1 || endIndex === -1) {
            throw new Error("Did not find program start or end");
        }

        const validCode = rawString
            .substring(startIndex + this.programStart.length, endIndex)
            .replace(/[\r\n]+/gm, "");

        const lines = validCode
            .split("|RULE:")
            .filter(s => s.length > 0);

        lines.forEach(line => {
            if (!line.trim()) return;

            const parts = line.trim().split("|");
            const rule = {};

            // line start
            rule.trigger = parts[0];

            // rest of line
            parts.slice(1).forEach(part => {
                const [key, ...valueParts] = part.split(":");
                const value = valueParts.join(":").trim();
                if (key === "RESPONSE") {
                    rule.response = value;
                } else if (key === "CONDITION") {
                    rule.condition = value;
                } else if (key === "TEMPLATE") {
                    rule.template = value.split(",").reduce((acc, pair) => {
                        const [k, v] = pair.split("=").map(p => p.trim());
                        acc[k] = v;
                        return acc;
                    }, {});
                }
            });

            resultRules.push(rule);
        });

        return new StaticRuleSystem(resultRules.map(rule => {
            return new StaticRule(rule.trigger, rule.response);
        }));
    }

    /**
     * Execute the parsed commands.
     * @param {StaticRuleSystem} staticRuleSystem - Parsed FUNGI commands.
     * @param {string} input - The input that should be processed.
     */
    calculateResponse(staticRuleSystem, input) {
        let response = 'Sorry, no match';
        staticRuleSystem.getRules().forEach(staticRule => {
            if (staticRule.trigger.toLowerCase().includes(input.toLowerCase())) {
                response = staticRule.response;
            }
        });
        return response;
    }

    containsValidFUNGI(content) {
        if (!content.includes(this.programStart) && !content.includes(this.programEnd)) {
            return false;
        }

        try {
            this.parse(content);
            return true;
        } catch (error) {
            return false;
        }
    }
}
