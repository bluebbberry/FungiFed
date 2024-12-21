export class RuleSystemPool {
    /**
     *
     * @param {StaticRuleSystem[]} ruleSystems
     */
    constructor(ruleSystems) {
        this.ruleSystems = ruleSystems;
    }

    getRuleSystems() {
        return this.ruleSystems;
    }

    setRuleSystems(ruleSystems) {
        this.ruleSystems = ruleSystems;
    }
}
