export class StaticRuleSystem {
    constructor(rules) {
        this.rules = rules;
    }

    setRules(rules) {
        this.rules = rules;
    }

    getRules() {
        return this.rules;
    }
}
