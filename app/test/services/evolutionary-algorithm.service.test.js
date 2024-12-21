import { assert } from 'chai';
import { EvolutionaryAlgorithm } from "../../src/services/evolutionary-algorithm.service.js";
import { StaticRuleSystem } from "../../src/model/StaticRuleSystem.js";
import { StaticRule } from "../../src/model/StaticRule.js";
import { FungiHistory } from "../../src/model/FungiHistory.js";
import { MycelialFungiHistory } from "../../src/model/MycelialFungiHistory.js";
import { FungiState } from "../../src/model/FungiState.js";

describe('EvolutionaryAlgorithm', () => {
    let algorithm, fungiHistory, currentSystem;

    beforeEach(() => {
        algorithm = EvolutionaryAlgorithm.evolutionaryAlgorithm;
        fungiHistory = new FungiHistory([
            new FungiState(new StaticRuleSystem([
                new StaticRule("hello", "Hi there!"),
                new StaticRule("goodbye", "See you later!"),
                new StaticRule("thanks", "You're welcome!")
            ]), 0.9),
            new FungiState(new StaticRuleSystem([
                new StaticRule("pricing", "Check our pricing."),
                new StaticRule("features", "Explore our features."),
                new StaticRule("contact", "Contact support for help.")
            ]), 0.8)
        ]);
        currentSystem = new StaticRuleSystem([
            new StaticRule("support", "Support is available."),
            new StaticRule("faq", "Check our FAQ page for common questions."),
            new StaticRule("login", "Log in to access your account.")
        ]);
    });

    it('should create a weighted pool from history', () => {
        console.log("Creating weighted pool from history...");
        const pool = algorithm.createPool(fungiHistory, new MycelialFungiHistory([]), currentSystem);

        console.log("Weighted pool created:", pool);
        assert.include(pool.getRuleSystems(), currentSystem);
        assert.isAbove(pool.getRuleSystems().length, fungiHistory.getFungiStates().length);
    });

    it('should mutate a rule system correctly', () => {
        console.log("Mutating rule system:", currentSystem);
        const pool = algorithm.createPool(fungiHistory, new MycelialFungiHistory([]), currentSystem);
        const mutatedSystem = algorithm.mutate(currentSystem, pool);

        console.log("Mutated rule system:", mutatedSystem);
        assert.instanceOf(mutatedSystem, StaticRuleSystem);
        assert.isNotEmpty(mutatedSystem.getRules());
    });

    it('should mutate individual rules', () => {
        const rule = new StaticRule("hello", "Hi there!");
        console.log("Mutating rule:", rule);
        const mutatedRule = algorithm.mutateRule(rule);

        console.log("Mutated rule:", mutatedRule);
        assert.instanceOf(mutatedRule, StaticRule);
        assert.notEqual(mutatedRule.trigger, rule.trigger);
    });

    it('should generate random rules', () => {
        console.log("Generating random rule...");
        const randomRule = algorithm.generateRandomRule();

        console.log("Randomly generated rule:", randomRule);
        assert.instanceOf(randomRule, StaticRule);
        assert.isString(randomRule.trigger);
        assert.isString(randomRule.response);
    });

    it('should perform crossover between two rule systems', () => {
        const parent1 = new StaticRuleSystem([new StaticRule("hello", "Hi there!")]);
        const parent2 = new StaticRuleSystem([new StaticRule("pricing", "Check our pricing.")]);

        console.log("Performing crossover between:", parent1, "and", parent2);
        const offspring = algorithm.crossover(parent1, parent2);

        console.log("Crossover offspring:", offspring);
        assert.instanceOf(offspring, StaticRuleSystem);
        assert.isNotEmpty(offspring.getRules());
    });

    it('should evolve a new rule system', () => {
        console.log("Evolving a new rule system...");
        const newSystem = algorithm.evolve(fungiHistory, new MycelialFungiHistory([]), currentSystem);

        console.log("Evolved rule system:", newSystem);
        assert.instanceOf(newSystem, StaticRuleSystem);
        assert.isNotEmpty(newSystem.getRules());
    });
});
