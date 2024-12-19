export class FungiState {
    constructor(ruleSystem, health = 0) {
        this.ruleSystem = ruleSystem;
        this.fitness = health;
    }

    getRuleSystem() {
        return this.ruleSystem;
    }

    setRuleSystem(commands) {
        this.ruleSystem = commands;
    }

    getFitness() {
        return this.fitness;
    }

    setFitness(health) {
        this.fitness = health;
    }
}
