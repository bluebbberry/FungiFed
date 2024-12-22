import { assert } from 'chai';
import {FungiStateFitnessService} from "../../src/services/fungi-state-fitness.service.js";
import sinon from "sinon";

describe('FungiStateFitnessService', function () {
    let fungiStateFitnessService;
    let fungiStateMock;

    beforeEach(function () {
        fungiStateFitnessService = FungiStateFitnessService.fungiStateFitnessService;
        fungiStateMock = {
            getStatuses: sinon.stub(),
            setFitness: sinon.spy()
        };
    });

    describe('calculateFitnessForFungiState', function () {
        it('should calculate fitness correctly when statuses are available', function () {
            // Mocking the statuses with favouritesCount
            const statuses = [
                { favouritesCount: 100 },
                { favouritesCount: 200 },
                { favouritesCount: 300 }
            ];

            fungiStateMock.getStatuses.returns(statuses);

            // Calculate the average favourites count
            const favouriteCountsPerStatus = (100 + 200 + 300) / 3; // 200

            // Call the method
            fungiStateFitnessService.calculateFitnessForFungiState(fungiStateMock);

            // Check if setFitness was called with the correct normalized value
            const expectedFitness = fungiStateFitnessService.calculateFitnessThroughNormalization(favouriteCountsPerStatus);
            assert(fungiStateMock.setFitness.calledWith(expectedFitness));
        });

        it('should log a message and not call setFitness if there are no statuses', function () {
            // Mocking no statuses
            fungiStateMock.getStatuses.returns([]);

            const consoleInfoSpy = sinon.spy(console, 'info');

            // Call the method
            fungiStateFitnessService.calculateFitnessForFungiState(fungiStateMock);

            // Check if console.info was called with the expected message
            assert(consoleInfoSpy.calledWith('Unable to calculate fitness - no send statuses yet'));

            // Ensure setFitness was not called
            assert(fungiStateMock.setFitness.notCalled);

            // Restore the console spy
            consoleInfoSpy.restore();
        });
    });

    describe('calculateFitnessThroughNormalization', function () {
        it('should normalize the fitness count correctly', function () {
            // Test the normalization for a given favourites count
            const normalizedFitness = fungiStateFitnessService.calculateFitnessThroughNormalization(500);
            const expectedFitness = 0.5; // 0.5
            assert.strictEqual(normalizedFitness, expectedFitness);
        });

        it('should clamp the favourites count to the min and max range', function () {
            // Test when favourites count is below the min
            let normalizedFitness = fungiStateFitnessService.calculateFitnessThroughNormalization(-100);
            assert.strictEqual(normalizedFitness, 0); // Below the min value, should clamp to 0

            // Test when favourites count is above the max
            normalizedFitness = fungiStateFitnessService.calculateFitnessThroughNormalization(1200);
            assert.strictEqual(normalizedFitness, 1); // Above the max value, should clamp to 1
        });
    });
});
