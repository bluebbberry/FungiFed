import { assert } from 'chai';
import {MycelialFungiHistoryService} from "../../src/services/mycelial-fungi-history.service.js";

describe('extractFitnessValue', () => {
    it('should extract the fitness value when it is present', () => {
        const post = "FUNGISTART|RULE:Elk|RESPONSE:asdfasdf|FUNGIEND Fitness: 0.9 #funlkklkgi";
        const fitness = MycelialFungiHistoryService.mycelialFungiHistoryService.parseFitnessFromStatus(post);
        assert.strictEqual(fitness, 0.9);
    });

    it('should handle integer fitness values', () => {
        const post = "FUNGISTART|RULE:Elk|RESPONSE:asdfasdf|FUNGIEND Fitness: 42 #funlkklkgi";
        const fitness = MycelialFungiHistoryService.mycelialFungiHistoryService.parseFitnessFromStatus(post);
        assert.strictEqual(fitness, 42);
    });

    it('should throw an error if no fitness value is found', () => {
        const post = "FUNGISTART|RULE:Elk|RESPONSE:asdfasdf|FUNGIEND #funlkklkgi";
        assert.throws(() => MycelialFungiHistoryService.mycelialFungiHistoryService.parseFitnessFromStatus(post), Error, "No fitness value found in the post.");
    });

    it('should throw an error for an empty string', () => {
        assert.throws(() => MycelialFungiHistoryService.mycelialFungiHistoryService.parseFitnessFromStatus(""), Error, "No fitness value found in the post.");
    });
});
