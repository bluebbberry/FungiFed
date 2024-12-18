export class FungiState {
    constructor(ruleSystem, health = 0) {
        this.ruleSystem = ruleSystem;
        this.health = health;
    }

    getRuleSystem() {
        return this.ruleSystem;
    }

    setRuleSystem(commands) {
        this.ruleSystem = commands;
    }

    getHealth() {
        return this.health;
    }

    setHealth(health) {
        this.health = health;
    }
}
