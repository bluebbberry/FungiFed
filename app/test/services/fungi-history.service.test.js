import { expect } from 'chai';
import sinon from 'sinon';
import {FungiHistory} from "../../src/model/FungiHistory.js";
import {StatusesService} from "../../src/services/statuses.service.js";
import {FungiHistoryService} from "../../src/services/fungi-history.service.js";
import cron from "node-cron";

describe('FungiHistoryService', () => {
    let fungiHistoryService;
    let cronScheduleStub;
    let statusServiceMock;
    let fungiHistoryMock;

    beforeEach(() => {
        // Create a mock for FungiHistory and StatusesService
        fungiHistoryMock = sinon.createStubInstance(FungiHistory);
        statusServiceMock = sinon.createStubInstance(StatusesService);

        // Mock the FungiHistoryService instance
        fungiHistoryService = new FungiHistoryService();
        fungiHistoryService.fungiHistory = fungiHistoryMock;

        // Stub the cron.schedule method to prevent actual scheduling
        cronScheduleStub = sinon.stub(cron, 'schedule');
    });

    afterEach(() => {
        sinon.restore();  // Restore all stubs and mocks
    });

    /*describe('startUpdatingUserFeedback', () => {
        it('should schedule the feedback check with correct cron schedule', () => {
            // Call the method to test
            fungiHistoryService.startUpdatingUserFeedback();

            // Check if cron.schedule was called with the correct arguments
            expect(cronScheduleStub.calledOnce).to.be.true;
            expect(cronScheduleStub.firstCall.args[0]).to.equal('* * * * *'); // Example cron schedule
        });
    });*/

    /*describe('updateFungiHistoryBasedOnUserFeedback', () => {
        it('should call getStatusById for each status in fungiHistory', async () => {
            // Mock the fungiHistory.getFungiStates() to return an array of mock fungiState
            const mockFungiStates = [
                {
                    getStatuses: () => [{ id: 1 }, { id: 2 }],
                    setStatuses: sinon.stub(),
                },
                {
                    getStatuses: () => [{ id: 3 }],
                    setStatuses: sinon.stub(),
                }
            ];

            fungiHistoryMock.getFungiStates.returns(mockFungiStates);

            // Mock StatusesService to return a status when calling getStatusById
            statusServiceMock.getStatusById.withArgs(1).resolves({ id: 1, name: 'status1' });
            statusServiceMock.getStatusById.withArgs(2).resolves({ id: 2, name: 'status2' });
            statusServiceMock.getStatusById.withArgs(3).resolves({ id: 3, name: 'status3' });

            // Call the method to test
            await fungiHistoryService.updateFungiHistoryBasedOnUserFeedback();

            // Verify if setStatuses was called with the expected result
            expect(mockFungiStates[0].setStatuses.calledOnce).to.be.true;
            expect(mockFungiStates[1].setStatuses.calledOnce).to.be.true;

            // Ensure that getStatusById was called for each status ID
            expect(statusServiceMock.getStatusById.calledWith(1)).to.be.true;
            expect(statusServiceMock.getStatusById.calledWith(2)).to.be.true;
            expect(statusServiceMock.getStatusById.calledWith(3)).to.be.true;
        });
    });*/

    describe('getFungiHistory', () => {
        it('should return the fungiHistory instance', () => {
            const fungiHistory = fungiHistoryService.getFungiHistory();
            expect(fungiHistory).to.equal(fungiHistoryMock);
        });
    });
});
