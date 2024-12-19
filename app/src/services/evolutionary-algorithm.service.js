// Evolutionary Algorithm for FUNGI Rule System Optimization
import {StaticRuleSystem} from "../model/StaticRuleSystem.js";
import {StaticRule} from "../model/StaticRule.js";
import {FungiHistory} from "../model/FungiHistory.js";

export class EvolutionaryAlgorithm {
    static evolutionaryAlgorithm = new EvolutionaryAlgorithm();

    constructor() {
        this.mutationRate = 0.1; // Probability of mutation
        this.crossoverRate = 0.7; // Probability of crossover
    }

    /**
     * Evolves a new rule system based on historical data and the current system.
     * @param {FungiHistory} history - Array of objects with `ruleSystem` and `fitness`.
     * @param {StaticRuleSystem} currentSystem - The currently selected rule system.
     * @returns {StaticRuleSystem} - A new mutated rule system.
     */
    evolve(history, currentSystem) {
        const pool = this.createPool(history, currentSystem);

        // Perform mutation and crossover to generate a new rule system
        let newRuleSystem = this.mutate(this.selectParent(pool));

        // Optionally, add crossover for diversity
        if (Math.random() < this.crossoverRate) {
            const parent2 = this.selectParent(pool);
            newRuleSystem = this.crossover(newRuleSystem, parent2);
        }

        return newRuleSystem;
    }

    /**
     * Creates a selection pool based on fitness values.
     * @param {FungiHistory} history - Array of {ruleSystem, fitness}.
     * @param {StaticRuleSystem} currentSystem - The current rule system.
     * @returns {Array} - A pool of rule systems weighted by fitness.
     */
    createPool(history, currentSystem) {
        const pool = [];

        // Add entries to the pool proportional to their fitness
        history.getFungiStates().forEach(entry => {
            const weight = Math.ceil(entry.fitness * 10); // Scale fitness for pool weighting
            for (let i = 0; i < weight; i++) {
                pool.push(entry.ruleSystem);
            }
        });

        // Ensure current system is in the pool
        pool.push(currentSystem);
        return pool;
    }

    /**
     * Selects a parent from the pool using random selection.
     * @param {Array} pool - The selection pool of rule systems.
     * @returns {StaticRuleSystem} - A selected parent rule system.
     */
    selectParent(pool) {
        return pool[Math.floor(Math.random() * pool.length)];
    }

    /**
     * Mutates a rule system by modifying, adding, or removing rules.
     * @param {StaticRuleSystem} ruleSystem - The rule system to mutate.
     * @returns {StaticRuleSystem} - A mutated rule system.
     */
    mutate(ruleSystem) {
        const mutatedRules = ruleSystem.getRules().map(rule => {
            if (Math.random() < this.mutationRate) {
                return this.mutateRule(rule);
            }
            return rule;
        });

        // Optionally add a new random rule
        if (Math.random() < this.mutationRate) {
            mutatedRules.push(this.generateRandomRule());
        }

        // Optionally remove a random rule
        if (mutatedRules.length > 1 && Math.random() < this.mutationRate) {
            mutatedRules.splice(Math.floor(Math.random() * mutatedRules.length), 1);
        }

        return new StaticRuleSystem(mutatedRules);
    }

    /**
     * Mutates an individual rule by altering its fields.
     * @param {StaticRule} rule - The rule to mutate.
     * @returns {StaticRule} - A mutated rule.
     */
    mutateRule(rule) {
        const trigger = Math.random() < 0.5 ? rule.trigger + "_mut" : rule.trigger;
        const response = Math.random() < 0.5 ? rule.response + " Mutated!" : rule.response;
        return new StaticRule(trigger, response);
    }

    /**
     * Generates a new random rule.
     * @returns {StaticRule} - A randomly generated rule.
     */
    generateRandomRule() {
        const triggers = ["hello", "pricing", "weather", "support"];
        const responses = [
            "Hi there! How can I assist?",
            "Check our pricing at example.com/pricing",
            "Weather today is sunny!",
            "Support is available at support@example.com"
        ];

        const trigger = triggers[Math.floor(Math.random() * triggers.length)];
        const response = responses[Math.floor(Math.random() * responses.length)];

        return new StaticRule(trigger, response);
    }

    /**
     * Performs crossover between two rule systems.
     * @param {StaticRuleSystem} parent1 - The first parent.
     * @param {StaticRuleSystem} parent2 - The second parent.
     * @returns {StaticRuleSystem} - A new rule system after crossover.
     */
    crossover(parent1, parent2) {
        const rules1 = parent1.getRules();
        const rules2 = parent2.getRules();

        const crossoverPoint = Math.floor(Math.random() * Math.min(rules1.length, rules2.length));

        const newRules = [
            ...rules1.slice(0, crossoverPoint),
            ...rules2.slice(crossoverPoint)
        ];

        return new StaticRuleSystem(newRules);
    }
}

// Example Usage
// const history = new FungiHistory([
//     new FungiState(new StaticRuleSystem([new StaticRule("hello", "Hi there!")]), 0.9),
//     new FungiState(new StaticRuleSystem([new StaticRule("pricing", "Check our pricing.")]), 0.8)
// ]);
// const currentSystem = new StaticRuleSystem([new StaticRule("support", "Support is available.")]);
//
// const evolutionaryAlgorithm = new EvolutionaryAlgorithm();
// const newRuleSystem = evolutionaryAlgorithm.evolve(history, currentSystem);
// console.log(newRuleSystem);
