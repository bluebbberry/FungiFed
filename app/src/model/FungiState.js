export class FungiState {
    constructor(ruleSystem, fitness = 0) {
        this.ruleSystem = ruleSystem;
        this.fitness = fitness;
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
